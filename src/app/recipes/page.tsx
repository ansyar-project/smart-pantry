import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { searchRecipes } from "@/app/actions/recipes";
import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { CreateRecipeButton } from "@/components/recipes/CreateRecipeButton";
import { PageHeader } from "@/components/ui/page-header";
import { ScanButton } from "@/components/ui/scan-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipe Discovery - Find Recipes Based on Your Ingredients",
  description:
    "Discover personalized recipes based on your available pantry ingredients. Reduce food waste and create delicious meals with what you already have.",
  robots: {
    index: false,
    follow: false,
  },
};

interface RecipesPageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    difficulty?: string;
    cuisine?: string;
    maxPrepTime?: string;
    maxCookTime?: string;
  }>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Await searchParams and convert to the query format
  const params = await searchParams;
  const query = {
    query: params.query,
    category: params.category,
    difficulty: params.difficulty,
    cuisine: params.cuisine,
    maxPrepTime: params.maxPrepTime ? parseInt(params.maxPrepTime) : undefined,
    maxCookTime: params.maxCookTime ? parseInt(params.maxCookTime) : undefined,
  };

  const recipes = await searchRecipes(query);
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Recipes"
        description="Discover recipes based on your available ingredients"
      >
        <ScanButton variant="outline" />
        <CreateRecipeButton />
      </PageHeader>

      <RecipeFilters />

      <RecipeGrid recipes={recipes} />
    </div>
  );
}
