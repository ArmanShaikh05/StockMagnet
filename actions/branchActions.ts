"use server";

import db from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

type BranchType = {
  branchName: string;
  branchAddress: string;
  branchImage?: string;
  firstName: string;
  lastName: string;
  gstNumber?: string;
  userId: string;
  isPrimary?: boolean;
};

export const completeOnboarding = async (data: BranchType) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    await db.user.update({
      where: {
        id: data.userId,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        onBoarded: true,
      },
    });

    await db.branches.create({
      data: {
        branchName: data.branchName,
        branchAddress: data.branchAddress,
        branchImage: data.branchImage || "",
        userId: data.userId,
        GstNumber: data.gstNumber || "",
        isPrimary: data.isPrimary,
      },
    });
    return { success: true, message: "Branch created successfully" };
  } catch (error) {
    console.error("Error fetching current user details:", error);
    return { success: false, message: "Error creating branch" };
  }
};
