import {
  PrismaClient,
  Difficulty,
  RecipeCategory,
  FoodCategory,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample recipes
  const recipes = [
    {
      name: "Classic Spaghetti Carbonara",
      description:
        "A traditional Italian pasta dish with eggs, cheese, and pancetta",
      instructions: `
        1. Cook spaghetti according to package directions
        2. Fry pancetta until crispy
        3. Beat eggs with parmesan cheese
        4. Toss hot pasta with egg mixture and pancetta
        5. Serve immediately with black pepper
      `,
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      cuisine: "Italian",
      category: RecipeCategory.MAIN_COURSE,
      tags: ["pasta", "italian", "quick"],
      isPublic: true,
      ingredients: {
        create: [
          {
            name: "spaghetti",
            quantity: 400,
            unit: "g",
            category: FoodCategory.GRAINS,
          },
          {
            name: "eggs",
            quantity: 4,
            unit: "pieces",
            category: FoodCategory.DAIRY,
          },
          {
            name: "parmesan cheese",
            quantity: 100,
            unit: "g",
            category: FoodCategory.DAIRY,
          },
          {
            name: "pancetta",
            quantity: 150,
            unit: "g",
            category: FoodCategory.MEAT,
          },
          {
            name: "black pepper",
            quantity: 1,
            unit: "tsp",
            category: FoodCategory.SPICES,
          },
        ],
      },
    },
    {
      name: "Fresh Garden Salad",
      description: "A healthy mix of fresh vegetables with olive oil dressing",
      instructions: `
        1. Wash and chop all vegetables
        2. Mix lettuce, tomatoes, cucumber, and onion
        3. Drizzle with olive oil and vinegar
        4. Season with salt and pepper
        5. Toss and serve fresh
      `,
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      difficulty: Difficulty.EASY,
      cuisine: "Mediterranean",
      category: RecipeCategory.SALAD,
      tags: ["healthy", "vegetarian", "quick", "fresh"],
      isPublic: true,
      ingredients: {
        create: [
          {
            name: "lettuce",
            quantity: 1,
            unit: "head",
            category: FoodCategory.PRODUCE,
          },
          {
            name: "tomatoes",
            quantity: 2,
            unit: "pieces",
            category: FoodCategory.PRODUCE,
          },
          {
            name: "cucumber",
            quantity: 1,
            unit: "pieces",
            category: FoodCategory.PRODUCE,
          },
          {
            name: "red onion",
            quantity: 0.5,
            unit: "pieces",
            category: FoodCategory.PRODUCE,
          },
          {
            name: "olive oil",
            quantity: 2,
            unit: "tbsp",
            category: FoodCategory.CONDIMENTS,
          },
          {
            name: "balsamic vinegar",
            quantity: 1,
            unit: "tbsp",
            category: FoodCategory.CONDIMENTS,
          },
        ],
      },
    },
    {
      name: "Chocolate Chip Cookies",
      description: "Classic homemade chocolate chip cookies",
      instructions: `
        1. Preheat oven to 375°F
        2. Cream butter and sugars
        3. Beat in eggs and vanilla
        4. Mix in flour, baking soda, and salt
        5. Fold in chocolate chips
        6. Drop spoonfuls on baking sheet
        7. Bake 9-11 minutes until golden
      `,
      prepTime: 15,
      cookTime: 11,
      servings: 24,
      difficulty: Difficulty.EASY,
      cuisine: "American",
      category: RecipeCategory.DESSERT,
      tags: ["dessert", "baking", "sweet", "family-friendly"],
      isPublic: true,
      ingredients: {
        create: [
          {
            name: "butter",
            quantity: 1,
            unit: "cup",
            category: FoodCategory.DAIRY,
          },
          {
            name: "brown sugar",
            quantity: 0.75,
            unit: "cup",
            category: FoodCategory.BAKING,
          },
          {
            name: "white sugar",
            quantity: 0.25,
            unit: "cup",
            category: FoodCategory.BAKING,
          },
          {
            name: "eggs",
            quantity: 1,
            unit: "pieces",
            category: FoodCategory.DAIRY,
          },
          {
            name: "vanilla extract",
            quantity: 1,
            unit: "tsp",
            category: FoodCategory.BAKING,
          },
          {
            name: "flour",
            quantity: 2.25,
            unit: "cups",
            category: FoodCategory.BAKING,
          },
          {
            name: "baking soda",
            quantity: 1,
            unit: "tsp",
            category: FoodCategory.BAKING,
          },
          {
            name: "salt",
            quantity: 1,
            unit: "tsp",
            category: FoodCategory.SPICES,
          },
          {
            name: "chocolate chips",
            quantity: 2,
            unit: "cups",
            category: FoodCategory.BAKING,
          },
        ],
      },
    },
    {
      name: "Chicken Stir Fry",
      description: "Quick and healthy chicken stir fry with vegetables",
      instructions: `
        1. Cut chicken into strips
        2. Heat oil in wok or large pan
        3. Cook chicken until done, remove
        4. Stir fry vegetables until crisp-tender
        5. Return chicken to pan
        6. Add sauce and toss
        7. Serve over rice
      `,
      prepTime: 15,
      cookTime: 12,
      servings: 4,
      difficulty: Difficulty.MEDIUM,
      cuisine: "Asian",
      category: RecipeCategory.MAIN_COURSE,
      tags: ["healthy", "quick", "protein", "vegetables"],
      isPublic: true,
      ingredients: {
        create: [
          {
            name: "chicken breast",
            quantity: 1,
            unit: "lb",
            category: FoodCategory.MEAT,
          },
          {
            name: "bell peppers",
            quantity: 2,
            unit: "pieces",
            category: FoodCategory.PRODUCE,
          },
          {
            name: "broccoli",
            quantity: 1,
            unit: "head",
            category: FoodCategory.PRODUCE,
          },
          {
            name: "carrots",
            quantity: 2,
            unit: "pieces",
            category: FoodCategory.PRODUCE,
          },
          {
            name: "soy sauce",
            quantity: 3,
            unit: "tbsp",
            category: FoodCategory.CONDIMENTS,
          },
          {
            name: "garlic",
            quantity: 3,
            unit: "cloves",
            category: FoodCategory.PRODUCE,
          },
          {
            name: "ginger",
            quantity: 1,
            unit: "tbsp",
            category: FoodCategory.SPICES,
          },
          {
            name: "vegetable oil",
            quantity: 2,
            unit: "tbsp",
            category: FoodCategory.CONDIMENTS,
          },
        ],
      },
    },
  ];

  for (const recipe of recipes) {
    await prisma.recipe.create({
      data: recipe,
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
