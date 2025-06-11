"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getOrCreateDefaultPantry() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  try {
    // First, check if user is a member of any pantry
    const pantryMember = await prisma.pantryMember.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        pantry: true,
      },
    });

    if (pantryMember) {
      return pantryMember.pantry;
    }

    // If no pantry membership found, create a default pantry and add user as owner
    const defaultPantry = await prisma.pantry.create({
      data: {
        name: `${session.user.name || session.user.email}'s Pantry`,
        description: "My default pantry",
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
    });

    return defaultPantry;
  } catch (error) {
    console.error("Error getting or creating default pantry:", error);
    throw new Error("Failed to setup pantry");
  }
}

export async function getUserPantry(userId: string) {
  try {
    // First, check if user is a member of any pantry
    const pantryMember = await prisma.pantryMember.findFirst({
      where: {
        userId: userId,
      },
      include: {
        pantry: true,
      },
    });

    if (pantryMember) {
      return pantryMember.pantry;
    }

    // If no pantry membership found, return null
    return null;
  } catch (error) {
    console.error("Error getting user pantry:", error);
    return null;
  }
}

export async function getUserPantries() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const pantryMemberships = await prisma.pantryMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        pantry: {
          include: {
            _count: {
              select: {
                items: true,
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    return pantryMemberships.map((membership) => ({
      ...membership.pantry,
      role: membership.role,
      itemCount: membership.pantry._count.items,
      memberCount: membership.pantry._count.members,
    }));
  } catch (error) {
    console.error("Error fetching user pantries:", error);
    return [];
  }
}
