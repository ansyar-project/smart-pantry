import { PrismaClient, FoodCategory, StorageLocation } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
    },
  });

  console.log("Created test user:", testUser);

  // Create a default pantry for the test user
  const defaultPantry = await prisma.pantry.upsert({
    where: { id: "default-pantry" },
    update: {},
    create: {
      id: "default-pantry",
      name: "Test User's Pantry",
      description: "Default pantry for testing",
      members: {
        create: {
          userId: testUser.id,
          role: "OWNER",
        },
      },
    },
  });

  console.log("Created default pantry:", defaultPantry);

  // Sample pantry items
  const sampleItems = [
    {
      name: "Whole Milk",
      brand: "Organic Valley",
      category: FoodCategory.DAIRY,
      location: StorageLocation.REFRIGERATOR,
      quantity: 1,
      unit: "gallon",
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      purchaseDate: new Date(),
      price: 4.99,
      notes: "Organic whole milk",
    },
    {
      name: "Bananas",
      category: FoodCategory.PRODUCE,
      location: StorageLocation.PANTRY,
      quantity: 6,
      unit: "pieces",
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      purchaseDate: new Date(),
      price: 2.99,
    },
    {
      name: "Chicken Breast",
      category: FoodCategory.MEAT,
      location: StorageLocation.FREEZER,
      quantity: 2,
      unit: "lbs",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      purchaseDate: new Date(),
      price: 8.99,
    },
    {
      name: "Bread",
      brand: "Wonder Bread",
      category: FoodCategory.GRAINS,
      location: StorageLocation.PANTRY,
      quantity: 1,
      unit: "loaf",
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now - expires soon
      purchaseDate: new Date(),
      price: 2.49,
    },
    {
      name: "Olive Oil",
      brand: "Bertolli",
      category: FoodCategory.CONDIMENTS,
      location: StorageLocation.PANTRY,
      quantity: 1,
      unit: "bottle",
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      purchaseDate: new Date(),
      price: 5.99,
    },
    {
      name: "Expired Yogurt",
      brand: "Dannon",
      category: FoodCategory.DAIRY,
      location: StorageLocation.REFRIGERATOR,
      quantity: 1,
      unit: "container",
      expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago - expired
      purchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      price: 1.99,
    },
  ];

  // Create sample pantry items
  for (const item of sampleItems) {
    await prisma.pantryItem.create({
      data: {
        ...item,
        userId: testUser.id,
        pantryId: defaultPantry.id,
      },
    });
  }

  console.log("Created sample pantry items");

  // Create some alerts for expired and expiring items
  const expiredItem = await prisma.pantryItem.findFirst({
    where: { name: "Expired Yogurt" },
  });

  const expiringSoonItem = await prisma.pantryItem.findFirst({
    where: { name: "Bread" },
  });

  if (expiredItem) {
    await prisma.alert.create({
      data: {
        type: "EXPIRY_URGENT",
        title: "Item Expired",
        message: `${expiredItem.name} has expired and should be removed from your pantry.`,
        priority: "HIGH",
        userId: testUser.id,
        pantryItemId: expiredItem.id,
      },
    });
  }

  if (expiringSoonItem) {
    await prisma.alert.create({
      data: {
        type: "EXPIRY_WARNING",
        title: "Item Expiring Soon",
        message: `${expiringSoonItem.name} will expire in 3 days. Consider using it soon.`,
        priority: "MEDIUM",
        userId: testUser.id,
        pantryItemId: expiringSoonItem.id,
      },
    });
  }

  console.log("Created sample alerts");

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
