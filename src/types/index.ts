import { Prisma } from "@prisma/client";

// User types
export type User = Prisma.UserGetPayload<Record<string, never>>;
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    pantryItems: true;
    shoppingLists: true;
    pantryMembers: true;
    alerts: true;
    recipes: true;
  };
}>;

// Pantry types
export type Pantry = Prisma.PantryGetPayload<Record<string, never>>;
export type PantryWithMembers = Prisma.PantryGetPayload<{
  include: {
    members: {
      include: {
        user: true;
      };
    };
    items: true;
  };
}>;

export type PantryItem = Prisma.PantryItemGetPayload<Record<string, never>>;
export type PantryItemWithRelations = Prisma.PantryItemGetPayload<{
  include: {
    user: true;
    pantry: true;
    alerts: true;
    usageHistory: true;
  };
}>;

// Recipe types
export type Recipe = Prisma.RecipeGetPayload<Record<string, never>>;
export type RecipeWithIngredients = Prisma.RecipeGetPayload<{
  include: {
    ingredients: true;
    ratings: true;
    user: true;
  };
}>;

export type RecipeIngredient = Prisma.RecipeIngredientGetPayload<
  Record<string, never>
>;

// Alert types
export type Alert = Prisma.AlertGetPayload<Record<string, never>>;
export type AlertWithItem = Prisma.AlertGetPayload<{
  include: {
    pantryItem: true;
  };
}>;

// Shopping types
export type ShoppingList = Prisma.ShoppingListGetPayload<Record<string, never>>;
export type ShoppingListWithItems = Prisma.ShoppingListGetPayload<{
  include: {
    items: true;
  };
}>;

export type ShoppingItem = Prisma.ShoppingItemGetPayload<Record<string, never>>;

// Meal Planning types
export type MealPlan = Prisma.MealPlanGetPayload<Record<string, never>>;
export type MealPlanWithRecipes = Prisma.MealPlanGetPayload<{
  include: {
    recipes: {
      include: {
        recipe: {
          include: {
            ingredients: true;
          };
        };
      };
    };
  };
}>;

// Analytics types
export type ItemUsage = Prisma.ItemUsageGetPayload<Record<string, never>>;
export type RecipeRating = Prisma.RecipeRatingGetPayload<Record<string, never>>;

// Input types for forms
export type CreatePantryItemInput = Omit<
  PantryItem,
  "id" | "createdAt" | "updatedAt" | "userId"
>;
export type UpdatePantryItemInput = Partial<
  Omit<CreatePantryItemInput, "pantryId">
>;

export type CreateRecipeInput = Omit<
  Recipe,
  "id" | "createdAt" | "updatedAt" | "rating" | "totalRatings"
> & {
  ingredients: Omit<RecipeIngredient, "id" | "recipeId">[];
};

export type CreateShoppingListInput = Omit<
  ShoppingList,
  "id" | "createdAt" | "updatedAt"
> & {
  items: Omit<ShoppingItem, "id" | "shoppingListId">[];
};

// Search and filter types
export interface RecipeSearchQuery {
  query?: string;
  category?: string;
  difficulty?: string;
  maxPrepTime?: number;
  maxCookTime?: number;
  cuisine?: string;
  tags?: string[];
  availableIngredients?: string[];
  minMatchPercentage?: number;
}

export interface PantryItemFilters {
  category?: string;
  location?: string;
  expiryStatus?: "expired" | "expiring-soon" | "fresh";
  search?: string;
}

// Recipe matching
export interface RecipeMatch {
  recipe: RecipeWithIngredients;
  matchPercentage: number;
  availableIngredients: RecipeIngredient[];
  missingIngredients: RecipeIngredient[];
  canMake: boolean;
}

// Meal plan suggestions
export interface MealPlanSuggestion {
  date: Date;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  recipe: RecipeWithIngredients;
  matchPercentage: number;
  missingIngredients: RecipeIngredient[];
}

// Analytics
export interface WasteData {
  category: string;
  wastedValue: number;
  consumedValue: number;
  wastedQuantity: number;
  consumedQuantity: number;
}

export interface ConsumptionPattern {
  month: string;
  totalSpent: number;
  totalWasted: number;
  wastePercentage: number;
}

// Notification types
export interface NotificationPayload {
  title: string;
  message: string;
  type: "expiry" | "low-stock" | "recipe-suggestion" | "system";
  data?: Record<string, unknown>;
}

// Barcode API response
export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  nutritionData?: Record<string, unknown>;
}
