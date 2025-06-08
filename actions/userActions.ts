"use server";

import db from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getCurrentUserDetails = async () => {
  try {
    const user = await currentUser();
    if (!user || !user.id) return null;

    const userData = await db.user.findUnique({
      where: { clerkUserId: user.id },
      include: {
        branches: {
          include: {
            products: {
              select: {
                id: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    return userData;
  } catch (error) {
    console.error("Error fetching current user details:", error);
    return null;
  }
};
