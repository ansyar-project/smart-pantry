import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { searchRecipes } from "@/app/actions/recipes";
import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { CreateRecipeButton } from "@/components/recipes/CreateRecipeButton";

export default async function RecipesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const recipes = await searchRecipes({});

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <CreateRecipeButton />
      </div>

      <RecipeFilters />

      <RecipeGrid recipes={recipes} />
    </div>
  );
}
