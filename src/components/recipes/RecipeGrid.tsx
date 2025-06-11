import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecipeWithIngredients } from "@/types";
import { Clock, Users, ChefHat } from "lucide-react";

interface RecipeGridProps {
  recipes: RecipeWithIngredients[];
}

function formatTime(minutes: number | null | undefined): string {
  if (!minutes) return "N/A";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "HARD":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    case "EXPERT":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your filters or create a new recipe to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-2">
                {recipe.name}
              </CardTitle>
              {recipe.rating && recipe.rating > 0 && (
                <Badge variant="secondary" className="ml-2 shrink-0">
                  ⭐ {recipe.rating.toFixed(1)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recipe.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {recipe.description}
              </p>
            )}

            {/* Recipe details */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {(recipe.prepTime || recipe.cookTime) && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {recipe.prepTime && recipe.cookTime
                      ? `${formatTime(recipe.prepTime + recipe.cookTime)}`
                      : formatTime(recipe.prepTime || recipe.cookTime)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>
                  {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Tags and difficulty */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={getDifficultyColor(recipe.difficulty)}
              >
                {recipe.difficulty.toLowerCase().replace("_", " ")}
              </Badge>

              {recipe.cuisine && (
                <Badge variant="outline">{recipe.cuisine}</Badge>
              )}

              {recipe.category && (
                <Badge variant="outline">
                  {recipe.category.toLowerCase().replace("_", " ")}
                </Badge>
              )}
            </div>

            {/* Ingredients count */}
            <div className="text-xs text-muted-foreground">
              {recipe.ingredients.length} ingredient
              {recipe.ingredients.length !== 1 ? "s" : ""}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
