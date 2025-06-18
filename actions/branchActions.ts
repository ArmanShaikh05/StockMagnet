"use server";

import { Branches } from "@/lib/generated/prisma";
import db from "@/lib/prisma";
import {
  SerializedLowStockProductType,
  SerializedProductType,
} from "@/types/serializedTypes";
import { deleteImageFromImagekit } from "@/utils/deleteImage";
import { currentUser } from "@clerk/nextjs/server";

export const completeOnboarding = async (data: {
  branchName: string;
  branchAddress: string;
  branchImage: string;
  firstName: string;
  lastName: string;
  gstNumber?: string;
  userId: string;
  isPrimary?: boolean;
  imageId: string;
}) => {
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
        branchImage: data.branchImage,
        userId: data.userId,
        GstNumber: data.gstNumber || "",
        isPrimary: data.isPrimary,
        imageId: data.imageId,
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
  branchImage: string;
  gstNumber?: string;
  imageId: string;
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
          branchImage: data.branchImage,
          userId: userData.id,
          GstNumber: data.gstNumber || "",
          isPrimary: primaryBranch,
          imageId: data.imageId,
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
  isImageEdited,
}: {
  branchId: string;
  isImageEdited: boolean;
  data: {
    branchName: string;
    branchAddress: string;
    branchImage: string;
    gstNumber?: string;
    imageId: string;
  };
}) => {
  try {
    const user = await currentUser();

    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (isImageEdited) {
      const branchImageId = await db.branches.findUnique({
        where: {
          id: branchId,
        },
        select: {
          imageId: true,
        },
      });

      if (branchImageId) {
        await deleteImageFromImagekit(branchImageId.imageId);

        await db.branches.update({
          where: {
            id: branchId,
          },
          data: {
            branchImage: data.branchImage,
            imageId: data.imageId,
          },
        });
      }
    }

    await db.branches.update({
      where: {
        id: branchId,
      },
      data: {
        branchName: data.branchName,
        branchAddress: data.branchAddress,
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

export const deleteBranch = async (branchId: string, branchName: string) => {
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

    if (!branch)
      return {
        success: false,
        message: `No branch found`,
      };

    if (branch.isPrimary) {
      return {
        success: false,
        message: `Cannot delete a Primary branch! Please make another branch primary and try again`,
      };
    }

    await db.branches.delete({
      where: {
        id: branchId,
      },
    });

    await deleteImageFromImagekit(branch.imageId);

    return {
      success: true,
      message: `${branchName} has been deleted successfully`,
    };
  } catch (error) {
    console.error("Error deleting the branch:", error);
    return {
      success: false,
      message: "Error deleting the branch",
    };
  }
};

export const getPrimaryBranchOfUser = async (clerkId: string) => {
  try {
    const branch = await db.branches.findFirst({
      where: {
        User: {
          is: {
            clerkUserId: clerkId,
          },
        },
        isPrimary: true,
      },
    });

    return branch;
  } catch (error) {
    console.error("Error fetching current user details:", error);
    return null;
  }
};

export const getProductsDataofBranch = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return {
        success: false,
        message: "Unauthorized user",
      };

    const branchProducts = await db.products.findMany({
      where: {
        branchId: branchId,
      },
      include: {
        Brand: true,
        category: true,
        unit: true,
      },
    });

    const serializedDecimalProducts: SerializedProductType[] =
      branchProducts.map((product) => {
        return {
          ...product,
          MRP: product.MRP.toString(),
          purchasePrice: product.purchasePrice.toString(),
          Brand: {
            ...product.Brand,
            totalProfit: product.Brand.totalProfit?.toString() || null,
            totalRevenue: product.Brand.totalRevenue?.toString() || null,
          },
          category: {
            ...product.category,
            totalProfit: product.category.totalProfit?.toString() || null,
          },
        };
      });

    return {
      success: true,
      message: "branch products fetched successfully",
      data: serializedDecimalProducts || [],
    };
  } catch (error) {
    console.error("Error fetching branch products data:", error);
    return {
      success: false,
      message: "Error fetching branch products data",
    };
  }
};

export const getLowStockProductsDataofBranch = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return {
        success: false,
        message: "Unauthorized user",
      };

    const allProduct = await db.products.findMany({
      where: {
        branchId: branchId,
      },
      select: {
        id: true,
        productImage: true,
        productName: true,
        stockInHand: true,
        minStockQty: true,
        MRP: true,
        Brand: {
          select: {
            brandName: true,
            colorCode: true,
          },
        },
      },
    });

    const lowStockProduct = allProduct.filter(
      (product) => product.stockInHand < product.minStockQty
    );

    const serializedLowStockProduct: SerializedLowStockProductType[] =
      lowStockProduct.map((product) => {
        return {
          ...product,
          MRP: product.MRP.toString(),
        };
      });

    return {
      success: true,
      message: "branch products fetched successfully",
      data: serializedLowStockProduct || [],
    };
  } catch (error) {
    console.error("Error fetching branch products data:", error);
    return {
      success: false,
      message: "Error fetching branch products data",
    };
  }
};

export const getBranchMetrics = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return {
        success: false,
        message: "Unauthorized user",
      };

    if (!branchId) {
      return {
        success: false,
        message: "Branch ID is required",
      };
    }

    const branchProductsStats = await db.products.aggregate({
      _sum: { stockInHand: true },
      where: {
        branchId: branchId,
      },
    });

    const branchInvoiceStats = await db.invoices.aggregate({
      _sum: { totalQuantity: true, profitGain: true, grandTotal: true },
      where: {
        branchId: branchId,
      },
      _count: true,
    });

    if (!branchProductsStats || !branchInvoiceStats) {
      return {
        success: false,
        message: "No data found for the branch",
      };
    }

    const remainingSold = branchProductsStats._sum.stockInHand || 0;
    const totalStockSold = branchInvoiceStats._sum.totalQuantity || 0;
    const totalProfit = branchInvoiceStats._sum.profitGain || 0;
    const totalRevenue = branchInvoiceStats._sum.grandTotal || 0;
    const totalSales = branchInvoiceStats._count || 0;

    const metricsData = {
      stockAvailabilityRate:
        (remainingSold / (totalStockSold + remainingSold)) * 100,
      profitGenerated: Number(totalProfit),
      revenueGenerated: Number(totalRevenue),
      numberOfSales: totalSales,
    };

    return {
      success: true,
      message: "branch metrics fetched successfully",
      data: metricsData,
    };
  } catch (error) {
    console.error("Error fetching branch metrics data:", error);
    return {
      success: false,
      message: "Error fetching branch metrics data",
    };
  }
};
