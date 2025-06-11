"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPantry } from "@/lib/pantry";
import { FoodCategory } from "@prisma/client";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  completed: boolean;
  category?: string;
  estimatedPrice?: number;
  notes?: string;
}

export async function getShoppingList(): Promise<ShoppingItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    // Get or create the default shopping list
    let shoppingList = await prisma.shoppingList.findFirst({
      where: {
        userId: session.user.id,
        name: "Shopping List",
      },
      include: {
        items: true,
      },
    });

    if (!shoppingList) {
      shoppingList = await prisma.shoppingList.create({
        data: {
          userId: session.user.id,
          name: "Shopping List",
        },
        include: {
          items: true,
        },
      });
    }

    return shoppingList.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      priority: "MEDIUM" as const, // Default priority since it's not in schema
      completed: item.isCompleted,
      category: item.category || undefined,
      estimatedPrice: item.estimatedPrice || undefined,
      notes: item.notes || undefined,
    }));
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return [];
  }
}

export async function generateShoppingListFromLowStock() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const pantry = await getUserPantry(session.user.id);
    if (!pantry) {
      return { success: false, error: "No pantry found" };
    }

    // Get or create the default shopping list
    let shoppingList = await prisma.shoppingList.findFirst({
      where: {
        userId: session.user.id,
        name: "Shopping List",
      },
    });

    if (!shoppingList) {
      shoppingList = await prisma.shoppingList.create({
        data: {
          userId: session.user.id,
          name: "Shopping List",
        },
      });
    } // Get low stock items (quantity <= 1)
    const lowStockItems = await prisma.pantryItem.findMany({
      where: {
        pantryId: pantry.id,
        quantity: {
          lte: 1,
        },
      },
    });

    // Check which items don't already exist in shopping list
    const existingShoppingItems = await prisma.shoppingItem.findMany({
      where: {
        shoppingListId: shoppingList.id,
        isCompleted: false,
      },
    });

    const existingItemNames = new Set(
      existingShoppingItems.map((item) => item.name.toLowerCase())
    );
    const newShoppingItems = lowStockItems
      .filter((item) => !existingItemNames.has(item.name.toLowerCase()))
      .map((item) => ({
        name: item.name,
        quantity: 1, // Default quantity
        unit: item.unit,
        category: item.category,
        shoppingListId: shoppingList.id,
      }));

    if (newShoppingItems.length > 0) {
      await prisma.shoppingItem.createMany({
        data: newShoppingItems,
      });
    }

    revalidatePath("/shopping");
    return {
      success: true,
      message: `Added ${newShoppingItems.length} items to shopping list`,
    };
  } catch (error) {
    console.error("Error generating shopping list:", error);
    return { success: false, error: "Failed to generate shopping list" };
  }
}

export async function addShoppingItem(data: {
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  estimatedPrice?: number;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    // Get or create the default shopping list
    let shoppingList = await prisma.shoppingList.findFirst({
      where: {
        userId: session.user.id,
        name: "Shopping List",
      },
    });

    if (!shoppingList) {
      shoppingList = await prisma.shoppingList.create({
        data: {
          userId: session.user.id,
          name: "Shopping List",
        },
      });
    }

    await prisma.shoppingItem.create({
      data: {
        ...data,
        category: data.category as FoodCategory | null,
        shoppingListId: shoppingList.id,
      },
    });

    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    console.error("Error adding shopping item:", error);
    return { success: false, error: "Failed to add item" };
  }
}

export async function updateShoppingItem(
  id: string,
  data: Partial<ShoppingItem>
) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  try {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.category !== undefined)
      updateData.category = data.category as FoodCategory | null;
    if (data.estimatedPrice !== undefined)
      updateData.estimatedPrice = data.estimatedPrice;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.completed !== undefined) updateData.isCompleted = data.completed;

    await prisma.shoppingItem.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    console.error("Error updating shopping item:", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function deleteShoppingItem(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    await prisma.shoppingItem.delete({
      where: { id },
    });

    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    console.error("Error deleting shopping item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

export async function toggleShoppingItemComplete(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const item = await prisma.shoppingItem.findUnique({
      where: { id },
    });

    if (!item) {
      return { success: false, error: "Item not found" };
    }

    await prisma.shoppingItem.update({
      where: { id },
      data: {
        isCompleted: !item.isCompleted,
        completedAt: !item.isCompleted ? new Date() : null,
      },
    });

    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    console.error("Error toggling shopping item:", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function clearCompletedItems() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        userId: session.user.id,
        name: "Shopping List",
      },
    });

    if (!shoppingList) {
      return { success: false, error: "Shopping list not found" };
    }

    await prisma.shoppingItem.deleteMany({
      where: {
        shoppingListId: shoppingList.id,
        isCompleted: true,
      },
    });

    revalidatePath("/shopping");
    return { success: true };
  } catch (error) {
    console.error("Error clearing completed items:", error);
    return { success: false, error: "Failed to clear completed items" };
  }
}
