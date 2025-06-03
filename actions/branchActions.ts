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

export const getAllBranchesOfUser = async () => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return {
        success: false,
        message: "Unauthorized user",
      };

    const branches = await db.branches.findMany({
      where: {
        User: {
          is: {
            clerkUserId: user.id,
          },
        },
      },
    });

    return {
      success: true,
      message: "branches fetched successfully",
      data: branches,
    };
  } catch (error) {
    console.error("Error fetching branch details from user:", error);
    return {
      success: false,
      message: "Error fetching branch details from user",
    };
  }
};

export const getSingleBranchData = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return {
        success: false,
        message: "Unauthorized user",
      };

    const branch = await db.branches.findUnique({
      where: {
        id: branchId,
      },
    });

    return {
      success: true,
      message: "branches fetched successfully",
      data: branch,
    };
  } catch (error) {
    console.error("Error fetching single branch data:", error);
    return {
      success: false,
      message: "Error fetching single branch data",
    };
  }
};
