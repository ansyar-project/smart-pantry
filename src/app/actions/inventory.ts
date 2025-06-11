"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, FoodCategory, StorageLocation } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrCreateDefaultPantry } from "@/lib/pantry";
import type {
  CreatePantryItemInput,
  UpdatePantryItemInput,
  BarcodeProduct,
} from "@/types";

export async function scanBarcode(
  barcode: string
): Promise<BarcodeProduct | null> {
  try {
    // Query OpenFoodFacts API
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const data = await response.json();

    if (data.status === 1 && data.product) {
      const product = data.product;
      return {
        barcode,
        name: product.product_name || "Unknown Product",
        brand: product.brands || undefined,
        category: product.categories || undefined,
        imageUrl: product.image_url || undefined,
        nutritionData: {
          nutrients: product.nutriments,
          ingredients: product.ingredients_text,
          allergens: product.allergens,
        },
      };
    }

    return null;
  } catch (error) {
    console.error("Error scanning barcode:", error);
    return null;
  }
}

export async function addPantryItem(data: CreatePantryItemInput) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  try {
    const { nutritionData, ...restData } = data;
    const pantryItem = await prisma.pantryItem.create({
      data: {
        ...restData,
        userId: session.user.id,
        nutritionData: nutritionData as Prisma.InputJsonValue, // Type assertion for JsonValue compatibility
      },
      include: {
        user: true,
        pantry: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/inventory");

    return { success: true, data: pantryItem };
  } catch (error) {
    console.error("Error adding pantry item:", error);
    return { success: false, error: "Failed to add item" };
  }
}

export async function updatePantryItem(
  id: string,
  data: UpdatePantryItemInput
) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  try {
    const { nutritionData, ...restData } = data;
    const pantryItem = await prisma.pantryItem.update({
      where: {
        id,
        userId: session.user.id, // Ensure user owns the item
      },
      data: {
        ...restData,
        ...(nutritionData !== undefined && {
          nutritionData: nutritionData as Prisma.InputJsonValue,
        }),
      },
      include: {
        user: true,
        pantry: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/inventory");

    return { success: true, data: pantryItem };
  } catch (error) {
    console.error("Error updating pantry item:", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function deletePantryItem(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    await prisma.pantryItem.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/inventory");

    return { success: true };
  } catch (error) {
    console.error("Error deleting pantry item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

export async function consumeItem(
  id: string,
  quantity: number,
  usedFor?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const item = await prisma.pantryItem.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!item) {
      return { success: false, error: "Item not found" };
    }

    const newQuantity = Math.max(0, item.quantity - quantity);

    // Update item quantity
    await prisma.pantryItem.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    // Log usage
    await prisma.itemUsage.create({
      data: {
        pantryItemId: id,
        quantityUsed: quantity,
        usedFor,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/inventory");

    return { success: true };
  } catch (error) {
    console.error("Error consuming item:", error);
    return { success: false, error: "Failed to consume item" };
  }
}

export async function getPantryItems(
  pantryId?: string,
  filters?: {
    category?: string;
    location?: string;
    search?: string;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  try {
    // If no pantryId specified, get the default pantry
    let targetPantryId = pantryId;
    if (!targetPantryId) {
      const defaultPantry = await getOrCreateDefaultPantry();
      targetPantryId = defaultPantry.id;
    }

    const where: Prisma.PantryItemWhereInput = {
      userId: session.user.id,
      pantryId: targetPantryId,
    };

    if (filters?.category) {
      where.category = filters.category as FoodCategory;
    }

    if (filters?.location) {
      where.location = filters.location as StorageLocation;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { brand: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    const items = await prisma.pantryItem.findMany({
      where,
      include: {
        user: true,
        pantry: true,
        alerts: true,
        usageHistory: true,
      },
      orderBy: {
        expiryDate: "asc",
      },
    });

    return items;
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    return [];
  }
}
