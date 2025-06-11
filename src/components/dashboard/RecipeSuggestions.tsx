import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanButton } from "@/components/ui/scan-button";
import { ChefHat, Clock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { RecipeMatch } from "@/types";

interface RecipeSuggestionsProps {
  recipeMatches: RecipeMatch[];
}

export function RecipeSuggestions({ recipeMatches }: RecipeSuggestionsProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-white">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <span>Recipe Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recipeMatches.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-8 w-8 text-primary" />
            </div>{" "}
            <p className="text-gray-700 dark:text-gray-200 mb-4 font-semibold">
              No recipe matches found. Add more ingredients to your pantry to
              get personalized suggestions!
            </p>
            <ScanButton />
          </div>
        ) : (
          <div className="space-y-4">
            {recipeMatches.map((match, index) => (
              <div
                key={match.recipe.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {match.recipe.imageUrl && (
                  <div className="relative overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={match.recipe.imageUrl}
                      alt={match.recipe.name}
                      width={72}
                      height={72}
                      className="w-18 h-18 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}{" "}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {match.recipe.name}
                    </h3>
                    <Badge
                      variant={
                        match.matchPercentage >= 70 ? "default" : "secondary"
                      }
                      className={`shadow-sm ${
                        match.matchPercentage >= 70
                          ? "bg-gradient-to-r from-primary to-success text-white"
                          : ""
                      }`}
                    >
                      {Math.round(match.matchPercentage)}% match
                    </Badge>
                  </div>{" "}
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-3 line-clamp-2 leading-relaxed font-medium">
                    {match.recipe.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300 mb-2 font-medium">
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
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/20"
                    >
                      {match.recipe.difficulty}
                    </Badge>
                  </div>
                  {match.missingIngredients.length > 0 && (
                    <div className="bg-warning/10 rounded-lg p-2 mt-2">
                      <p className="text-xs text-orange-800 dark:text-orange-200">
                        <span className="font-medium">Missing:</span>{" "}
                        {match.missingIngredients
                          .slice(0, 3)
                          .map((ing) => ing.name)
                          .join(", ")}
                        {match.missingIngredients.length > 3 &&
                          ` +${match.missingIngredients.length - 3} more`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}{" "}
            <div className="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button
                variant="outline"
                asChild
                className="shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Link href="/recipes" className="flex items-center gap-2">
                  View All Recipes
                  <ChefHat className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
