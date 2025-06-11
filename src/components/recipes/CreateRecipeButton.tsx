"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Clock, ChefHat, Loader2 } from "lucide-react";
import { createRecipe } from "@/app/actions/recipes";
import type { CreateRecipeInput, RecipeIngredient } from "@/types";
import { RecipeCategory, Difficulty } from "@prisma/client";

export function CreateRecipeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState<
    Omit<RecipeIngredient, "id" | "recipeId">[]
  >([
    {
      name: "",
      quantity: 0,
      unit: "",
      category: null,
      isOptional: false,
      notes: null,
    },
  ]);
  const [instructions, setInstructions] = useState([""]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    cuisine: "",
  });
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        name: "",
        quantity: 0,
        unit: "",
        category: null,
        isOptional: false,
        notes: null,
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };
  const updateIngredient = (
    index: number,
    field: keyof Omit<RecipeIngredient, "id" | "recipeId">,
    value: string | number | boolean | null
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const recipeData: CreateRecipeInput = {
        userId: null, // Will be set by the server action
        name: formData.title,
        description: formData.description,
        category: formData.category as RecipeCategory,
        difficulty: formData.difficulty as Difficulty,
        prepTime: parseInt(formData.prepTime),
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
        cuisine: formData.cuisine,
        instructions: instructions
          .filter((instruction) => instruction.trim() !== "")
          .join("\n"),
        ingredients: ingredients.filter((ing) => ing.name.trim() !== ""),
        tags: [],
        imageUrl: null,
        videoUrl: null,
        isPublic: false,
        source: null,
      };

      const result = await createRecipe(recipeData);

      if (result.success) {
        setIsOpen(false);
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          difficulty: "",
          prepTime: "",
          cookTime: "",
          servings: "",
          cuisine: "",
        });
        setIngredients([
          {
            name: "",
            quantity: 0,
            unit: "",
            category: null,
            isOptional: false,
            notes: null,
          },
        ]);
        setInstructions([""]);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Create New Recipe
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Recipe Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter recipe title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  value={formData.servings}
                  onChange={(e) =>
                    setFormData({ ...formData, servings: e.target.value })
                  }
                  placeholder="Number of servings"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the recipe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>{" "}
                  <SelectContent>
                    <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                    <SelectItem value="APPETIZER">Appetizer</SelectItem>
                    <SelectItem value="SOUP">Soup</SelectItem>
                    <SelectItem value="SALAD">Salad</SelectItem>
                    <SelectItem value="MAIN_COURSE">Main Course</SelectItem>
                    <SelectItem value="SIDE_DISH">Side Dish</SelectItem>
                    <SelectItem value="DESSERT">Dessert</SelectItem>
                    <SelectItem value="BEVERAGE">Beverage</SelectItem>
                    <SelectItem value="SNACK">Snack</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>{" "}
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                    <SelectItem value="EXPERT">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prepTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Prep Time (min)
                </Label>
                <Input
                  id="prepTime"
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) =>
                    setFormData({ ...formData, prepTime: e.target.value })
                  }
                  placeholder="Prep time"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cookTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Cook Time (min)
                </Label>
                <Input
                  id="cookTime"
                  type="number"
                  value={formData.cookTime}
                  onChange={(e) =>
                    setFormData({ ...formData, cookTime: e.target.value })
                  }
                  placeholder="Cook time"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cuisine">Cuisine</Label>
                <Input
                  id="cuisine"
                  value={formData.cuisine}
                  onChange={(e) =>
                    setFormData({ ...formData, cuisine: e.target.value })
                  }
                  placeholder="e.g., Italian, Asian"
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ingredients</h3>
              <Button
                type="button"
                onClick={addIngredient}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>

            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor={`ingredient-name-${index}`}>Name</Label>
                  <Input
                    id={`ingredient-name-${index}`}
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(index, "name", e.target.value)
                    }
                    placeholder="Ingredient name"
                    required
                  />
                </div>{" "}
                <div className="w-24">
                  <Label htmlFor={`ingredient-quantity-${index}`}>
                    Quantity
                  </Label>
                  <Input
                    id={`ingredient-quantity-${index}`}
                    type="number"
                    step="0.1"
                    min="0"
                    value={ingredient.quantity || ""}
                    onChange={(e) =>
                      updateIngredient(
                        index,
                        "quantity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Amount"
                    required
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor={`ingredient-unit-${index}`}>Unit</Label>
                  <Input
                    id={`ingredient-unit-${index}`}
                    value={ingredient.unit}
                    onChange={(e) =>
                      updateIngredient(index, "unit", e.target.value)
                    }
                    placeholder="Unit"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Instructions</h3>
              <Button
                type="button"
                onClick={addInstruction}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>

            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <Input
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Step ${index + 1} instructions`}
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 mt-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Recipe"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
