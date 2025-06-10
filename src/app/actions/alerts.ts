"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sendExpiryAlert } from "@/lib/notifications";

export async function processExpiryAlerts() {
  try {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    // Find items expiring soon (3 days)
    const expiringItems = await prisma.pantryItem.findMany({
      where: {
        expiryDate: {
          lte: threeDaysFromNow,
          gte: now,
        },
      },
      include: {
        user: true,
        alerts: {
          where: {
            type: "EXPIRY_WARNING",
            createdAt: {
              gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Don't duplicate alerts within 24h
            },
          },
        },
      },
    });

    // Find items expiring urgently (1 day)
    const urgentItems = await prisma.pantryItem.findMany({
      where: {
        expiryDate: {
          lte: oneDayFromNow,
          gte: now,
        },
      },
      include: {
        user: true,
        alerts: {
          where: {
            type: "EXPIRY_URGENT",
            createdAt: {
              gte: new Date(now.getTime() - 12 * 60 * 60 * 1000), // Don't duplicate alerts within 12h
            },
          },
        },
      },
    });

    // Create alerts for items without recent alerts
    for (const item of expiringItems) {
      if (item.alerts.length === 0) {
        await createExpiryAlert(item, "EXPIRY_WARNING");
      }
    }

    for (const item of urgentItems) {
      if (item.alerts.length === 0) {
        await createExpiryAlert(item, "EXPIRY_URGENT");
      }
    }

    return {
      success: true,
      processed: expiringItems.length + urgentItems.length,
    };
  } catch (error) {
    console.error("Error processing expiry alerts:", error);
    return { success: false, error: "Failed to process alerts" };
  }
}

async function createExpiryAlert(
  item: {
    id: string;
    name: string;
    brand?: string | null;
    quantity: number;
    unit: string;
    location?: string | null;
    expiryDate: Date | null;
    userId: string;
    user: {
      email: string;
    };
  },
  type: "EXPIRY_WARNING" | "EXPIRY_URGENT"
) {
  const daysUntilExpiry = Math.ceil(
    (new Date(item.expiryDate!).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const title =
    type === "EXPIRY_URGENT"
      ? `⚠️ ${item.name} expires tomorrow!`
      : `📅 ${item.name} expires in ${daysUntilExpiry} days`;

  const message =
    type === "EXPIRY_URGENT"
      ? `Your ${item.name} expires tomorrow. Use it soon or consider adding it to a recipe!`
      : `Your ${item.name} expires in ${daysUntilExpiry} days. Plan to use it soon.`;
  const alert = await prisma.alert.create({
    data: {
      userId: item.userId,
      pantryItemId: item.id,
      type,
      title,
      message,
      priority: type === "EXPIRY_URGENT" ? "HIGH" : "MEDIUM",
    },
  });

  // Send notification
  try {
    await sendExpiryAlert(item.user.email, {
      name: item.name,
      expiryDate: item.expiryDate,
      brand: item.brand || undefined,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location || undefined,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }

  return alert;
}

export async function dismissAlert(alertId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    await prisma.alert.update({
      where: {
        id: alertId,
        userId: session.user.id,
      },
      data: {
        isDismissed: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/alerts");

    return { success: true };
  } catch (error) {
    console.error("Error dismissing alert:", error);
    return { success: false, error: "Failed to dismiss alert" };
  }
}

export async function markAlertAsRead(alertId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    await prisma.alert.update({
      where: {
        id: alertId,
        userId: session.user.id,
      },
      data: {
        isRead: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/alerts");

    return { success: true };
  } catch (error) {
    console.error("Error marking alert as read:", error);
    return { success: false, error: "Failed to mark alert as read" };
  }
}

export async function getUserAlerts(limit?: number) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const alerts = await prisma.alert.findMany({
      where: {
        userId: session.user.id,
        isDismissed: false,
      },
      include: {
        pantryItem: true,
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    return alerts;
  } catch (error) {
    console.error("Error fetching user alerts:", error);
    return [];
  }
}

export async function createLowStockAlert(
  itemId: string,
  threshold: number = 1
) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const item = await prisma.pantryItem.findUnique({
      where: { id: itemId, userId: session.user.id },
    });

    if (!item || item.quantity > threshold) {
      return { success: false, error: "Item not found or not low stock" };
    }

    const alert = await prisma.alert.create({
      data: {
        userId: session.user.id,
        pantryItemId: itemId,
        type: "LOW_STOCK",
        title: `🛒 Low stock: ${item.name}`,
        message: `You're running low on ${item.name}. Consider adding it to your shopping list.`,
        priority: "MEDIUM",
      },
    });

    revalidatePath("/dashboard");

    return { success: true, data: alert };
  } catch (error) {
    console.error("Error creating low stock alert:", error);
    return { success: false, error: "Failed to create alert" };
  }
}
