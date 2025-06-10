import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecipeWithIngredients } from "@/types";

interface RecipeGridProps {
  recipes: RecipeWithIngredients[];
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{recipe.description}</p>
              <div className="flex gap-2 mt-2">
                {recipe.cuisine && (
                  <Badge variant="outline">{recipe.cuisine}</Badge>
                )}
                <Badge variant="outline">{recipe.difficulty}</Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No recipes found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
