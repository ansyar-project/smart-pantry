import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Users } from "lucide-react";
import Link from "next/link";
import type { RecipeMatch } from "@/types";

interface RecipeSuggestionsProps {
  recipeMatches: RecipeMatch[];
}

export function RecipeSuggestions({ recipeMatches }: RecipeSuggestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Recipe Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recipeMatches.length === 0 ? (
          <div className="text-center py-8">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No recipe matches found. Add more ingredients to your pantry to
              get suggestions!
            </p>
            <Button asChild className="mt-4">
              <Link href="/scan">Add Items</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recipeMatches.map((match) => (
              <div
                key={match.recipe.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
              >
                {match.recipe.imageUrl && (
                  <img
                    src={match.recipe.imageUrl}
                    alt={match.recipe.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{match.recipe.name}</h3>
                    <Badge
                      variant={
                        match.matchPercentage >= 70 ? "default" : "secondary"
                      }
                    >
                      {Math.round(match.matchPercentage)}% match
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {match.recipe.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {match.recipe.prepTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {match.recipe.prepTime}m prep
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {match.recipe.servings} servings
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {match.recipe.difficulty}
                    </Badge>
                  </div>

                  {match.missingIngredients.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Missing:{" "}
                      {match.missingIngredients
                        .slice(0, 3)
                        .map((ing) => ing.name)
                        .join(", ")}
                      {match.missingIngredients.length > 3 &&
                        ` +${match.missingIngredients.length - 3} more`}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-4">
              <Button variant="outline" asChild>
                <Link href="/recipes">View All Recipes</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
