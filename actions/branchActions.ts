"use server";

import { Branches } from "@/lib/generated/prisma";
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
      orderBy: {
        createdAt: "asc",
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

export const createNewBranch = async (data: {
  branchName: string;
  branchAddress: string;
  branchImage?: string;
  gstNumber?: string;
}) => {
  try {
    const user = await currentUser();
    let primaryBranch = false;
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const userData = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      select: {
        id: true,
        branches: true,
      },
    });

    if (userData) {
      primaryBranch = userData.branches.length === 0;
      await db.branches.create({
        data: {
          branchName: data.branchName,
          branchAddress: data.branchAddress,
          branchImage: data.branchImage || "",
          userId: userData.id,
          GstNumber: data.gstNumber || "",
          isPrimary: primaryBranch,
        },
      });

      return { success: true, message: "Branch created successfully" };
    }

    return { success: false, message: "User Data not fetched properly " };
  } catch (error) {
    console.error("Error fetching current user details:", error);
    return { success: false, message: "Error creating branch" };
  }
};

export const editBranchDetails = async ({
  data,
  branchId,
}: {
  branchId: string;
  data: {
    branchName: string;
    branchAddress: string;
    branchImage?: string;
    gstNumber?: string;
  };
}) => {
  try {
    const user = await currentUser();

    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    await db.branches.update({
      where: {
        id: branchId,
      },
      data: {
        branchName: data.branchName,
        branchAddress: data.branchAddress,
        branchImage: data.branchImage || "",
        GstNumber: data.gstNumber || "",
      },
    });

    return { success: true, message: "Branch details updated successfully" };
  } catch (error) {
    console.error("Error editing branch details:", error);
    return { success: false, message: "Error editing branch" };
  }
};

export const makeBranchPrimary = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return {
        success: false,
        message: "Unauthorized user",
      };

    const branchesId = await db.branches.findMany({
      where: {
        User: {
          is: {
            clerkUserId: user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    const nonPrimaryBranchesId: string[] = [];

    Object.values(branchesId).map((id) => {
      if (id.id !== branchId) {
        nonPrimaryBranchesId.push(id.id);
      }
    });

    const promisesArray: Promise<Branches>[] = [];

    nonPrimaryBranchesId.map((id) => {
      const promise = db.branches.update({
        where: {
          id: id,
        },
        data: {
          isPrimary: false,
        },
      });
      promisesArray.push(promise);
    });

    await Promise.all(promisesArray);

    const newPrimaryBranch = await db.branches.update({
      where: {
        id: branchId,
      },
      data: {
        isPrimary: true,
      },
    });

    return {
      success: true,
      message: `${newPrimaryBranch.branchName} has been made the new Primary branch`,
    };
  } catch (error) {
    console.error("Error making branch primary:", error);
    return {
      success: false,
      message: "Error making branch primary",
    };
  }
};
