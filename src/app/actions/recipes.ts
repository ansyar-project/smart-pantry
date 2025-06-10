"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, RecipeCategory, Difficulty } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type {
  CreateRecipeInput,
  RecipeSearchQuery,
  RecipeMatch,
  MealPlanSuggestion,
  PantryItem,
} from "@/types";

export async function createRecipe(data: CreateRecipeInput) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const recipe = await prisma.recipe.create({
      data: {
        ...data,
        userId: session.user.id,
        ingredients: {
          create: data.ingredients,
        },
      },
      include: {
        ingredients: true,
        user: true,
      },
    });

    revalidatePath("/recipes");
    revalidatePath("/dashboard");

    return { success: true, data: recipe };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { success: false, error: "Failed to create recipe" };
  }
}

export async function searchRecipes(query: RecipeSearchQuery) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  try {
    const where: Prisma.RecipeWhereInput = {
      OR: [{ isPublic: true }, { userId: session.user.id }],
    };

    if (query.query) {
      where.OR = [
        { name: { contains: query.query, mode: "insensitive" } },
        { description: { contains: query.query, mode: "insensitive" } },
        { cuisine: { contains: query.query, mode: "insensitive" } },
      ];
    }
    if (query.category) {
      where.category = query.category as RecipeCategory;
    }

    if (query.difficulty) {
      where.difficulty = query.difficulty as Difficulty;
    }

    if (query.maxPrepTime) {
      where.prepTime = { lte: query.maxPrepTime };
    }

    if (query.maxCookTime) {
      where.cookTime = { lte: query.maxCookTime };
    }

    if (query.cuisine) {
      where.cuisine = { contains: query.cuisine, mode: "insensitive" };
    }

    if (query.tags && query.tags.length > 0) {
      where.tags = { hasSome: query.tags };
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        ingredients: true,
        ratings: true,
        user: true,
      },
      orderBy: {
        rating: "desc",
      },
    });

    return recipes;
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
}

export async function findMatchingRecipes(
  pantryItems: PantryItem[]
): Promise<RecipeMatch[]> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const availableIngredients = pantryItems.map((item) => ({
      name: item.name.toLowerCase(),
      category: item.category,
      quantity: item.quantity,
    }));

    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [{ isPublic: true }, { userId: session.user.id }],
      },
      include: {
        ingredients: true,
        ratings: true,
        user: true,
      },
    });

    const recipeMatches = recipes
      .map((recipe) => {
        const matches = recipe.ingredients.filter((ingredient) =>
          availableIngredients.some(
            (available) =>
              available.name.includes(ingredient.name.toLowerCase()) ||
              ingredient.name.toLowerCase().includes(available.name)
          )
        );

        const matchPercentage =
          (matches.length / recipe.ingredients.length) * 100;
        const missingIngredients = recipe.ingredients.filter(
          (ingredient) => !matches.some((match) => match.id === ingredient.id)
        );

        return {
          recipe,
          matchPercentage,
          availableIngredients: matches,
          missingIngredients,
          canMake: matchPercentage >= 70, // Configurable threshold
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return recipeMatches;
  } catch (error) {
    console.error("Error finding matching recipes:", error);
    return [];
  }
}

export async function generateMealPlan(params: {
  pantryId: string;
  days: number;
  preferences: string[];
}): Promise<MealPlanSuggestion[]> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    // Fetch pantry items
    const pantryItems = await prisma.pantryItem.findMany({
      where: {
        pantryId: params.pantryId,
        userId: session.user.id,
      },
    });

    // Find matching recipes
    const recipeMatches = await findMatchingRecipes(pantryItems);

    // Generate meal plan suggestions
    const suggestions: MealPlanSuggestion[] = [];
    const startDate = new Date();

    for (let day = 0; day < params.days; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + day);

      const mealTypes: ("BREAKFAST" | "LUNCH" | "DINNER")[] = [
        "BREAKFAST",
        "LUNCH",
        "DINNER",
      ];

      for (const mealType of mealTypes) {
        // Filter recipes by meal category and preferences
        const suitableRecipes = recipeMatches.filter((match) => {
          if (match.matchPercentage < 30) return false;

          const categoryMap: Record<string, string[]> = {
            BREAKFAST: ["BREAKFAST"],
            LUNCH: ["MAIN_COURSE", "SALAD", "SOUP"],
            DINNER: ["MAIN_COURSE", "SOUP"],
          };

          return categoryMap[mealType]?.includes(match.recipe.category);
        });

        if (suitableRecipes.length > 0) {
          const randomRecipe =
            suitableRecipes[
              Math.floor(Math.random() * Math.min(3, suitableRecipes.length))
            ];

          suggestions.push({
            date,
            mealType,
            recipe: randomRecipe.recipe,
            matchPercentage: randomRecipe.matchPercentage,
            missingIngredients: randomRecipe.missingIngredients,
          });
        }
      }
    }

    return suggestions;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return [];
  }
}

export async function getRecipeById(id: string) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
        ratings: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });

    return recipe;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
}

export async function rateRecipe(
  recipeId: string,
  rating: number,
  review?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    // Upsert rating
    await prisma.recipeRating.upsert({
      where: {
        recipeId_userId: {
          recipeId,
          userId: session.user.id,
        },
      },
      update: {
        rating,
        review,
      },
      create: {
        recipeId,
        userId: session.user.id,
        rating,
        review,
      },
    });

    // Update recipe average rating
    const ratings = await prisma.recipeRating.findMany({
      where: { recipeId },
    });

    const averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        rating: averageRating,
        totalRatings: ratings.length,
      },
    });

    revalidatePath("/recipes");
    revalidatePath(`/recipes/${recipeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error rating recipe:", error);
    return { success: false, error: "Failed to rate recipe" };
  }
}
