"use server";

import db from "@/lib/prisma";
import { SerializedSingleProduct } from "@/types/serializedTypes";
import { deleteImageFromImagekit } from "@/utils/deleteImage";
import { currentUser } from "@clerk/nextjs/server";

type ProductData = {
  productImageUrl: string;
  productImageId: string;
  productName: string;
  productSno: string;
  productBrandId: string;
  productMrp: number;
  purchasePrice: number;
  hsnCode: string;
  taxRate: string;
  taxInclusion: boolean;
  warranty: number;
  stockInHand: number;
  minStockQty: number;
  branch: string;
  unitId: string;
  reorderQty: number;
  categoryId: string;
  tags: string[];
  isImageEdited?: boolean;
};

export const createNewProduct = async (data: ProductData) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    await db.products.create({
      data: {
        productName: data.productName,
        productImage: data.productImageUrl,
        imageId: data.productImageId,
        productSno: data.productSno,
        MRP: data.productMrp,
        purchasePrice: data.purchasePrice,
        HSNCode: data.hsnCode,
        taxRate: data.taxRate,
        warrantyMonths: data.warranty,
        stockInHand: data.stockInHand,
        minStockQty: data.minStockQty,
        tags: data.tags,
        taxIncludedWithMrp: data.taxInclusion,
        reorderQty: data.reorderQty,
        branchId: data.branch,
        categoryId: data.categoryId,
        brandId: data.productBrandId,
        unitId: data.unitId,
        status:
          data.stockInHand > data.minStockQty
            ? "AVAILABLE"
            : data.stockInHand > 0
            ? "LOWSTOCK"
            : "UNAVAILABLE",
      },
    });

    await db.category.update({
      where: {
        id: data.categoryId,
      },
      data: {
        totalProducts: await db.products.count({
          where: {
            categoryId: data.categoryId,
          },
        }),
      },
    });

    await db.brand.update({
      where: {
        id: data.productBrandId,
      },
      data: {
        totalProduct: await db.products.count({
          where: {
            brandId: data.productBrandId,
          },
        }),
      },
    });

    return { success: true, message: "Product added successfully " };
  } catch (error) {
    console.error("Error adding prodcut to DB:", error);
    return { success: false, message: "Error creating product" };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const oldProductData = await db.products.findFirst({
      where: {
        id: productId,
      },
      select: {
        categoryId: true,
        brandId: true,
        imageId: true,
      },
    });

    if (!oldProductData || !oldProductData.imageId) {
      return { success: false, message: "Product not found" };
    }

    await db.products.delete({
      where: {
        id: productId,
      },
    });

    await deleteImageFromImagekit(oldProductData.imageId);

    await db.category.update({
      where: {
        id: oldProductData.categoryId,
      },
      data: {
        totalProducts: await db.products.count({
          where: {
            categoryId: oldProductData.categoryId,
          },
        }),
      },
    });

    await db.brand.update({
      where: {
        id: oldProductData.brandId,
      },
      data: {
        totalProduct: await db.products.count({
          where: {
            brandId: oldProductData.brandId,
          },
        }),
      },
    });

    return { success: true, message: "Product deleted successfully " };
  } catch (error) {
    console.error("Error deleting prodcut from DB:", error);
    return { success: false, message: "Error deleting product" };
  }
};

export const getSingleProductData = async (productId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const productsData = await db.products.findFirst({
      where: {
        id: productId,
      },
    });

    if (!productsData) {
      return { success: false, message: "No product found" };
    }

    const serializedProductsData: SerializedSingleProduct = {
      ...productsData,
      MRP: productsData.MRP.toString(),
      purchasePrice: productsData.purchasePrice.toString(),
    };

    return {
      success: true,
      message: "Product data fetched successfully ",
      data: serializedProductsData,
    };
  } catch (error) {
    console.error("Error deleting prodcut from DB:", error);
    return { success: false, message: "Error deleting product" };
  }
};

export const editProduct = async ({
  productId,
  data,
}: {
  data: ProductData;
  productId: string;
}) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const oldProduct = await db.products.findFirst({
      where: {
        id: productId,
      },
    });

    if (!oldProduct) {
      return { success: false, message: "No product found" };
    }

    // MANAGING OLD CATEGORY AND BRAND
    await db.category.update({
      where: {
        id: oldProduct.categoryId,
      },
      data: {
        totalProducts: await db.products.count({
          where: {
            categoryId: oldProduct.categoryId,
          },
        }),
      },
    });

    await db.brand.update({
      where: {
        id: oldProduct.brandId,
      },
      data: {
        totalProduct: await db.products.count({
          where: {
            brandId: oldProduct.brandId,
          },
        }),
      },
    });

    // MANAGING NEW CATEGORY AND BRAND
    await db.category.update({
      where: {
        id: data.categoryId,
      },
      data: {
        totalProducts: await db.products.count({
          where: {
            categoryId: data.categoryId,
          },
        }),
      },
    });

    await db.brand.update({
      where: {
        id: data.productBrandId,
      },
      data: {
        totalProduct: await db.products.count({
          where: {
            brandId: data.productBrandId,
          },
        }),
      },
    });

    if (data.isImageEdited && oldProduct.imageId) {
      await deleteImageFromImagekit(oldProduct.imageId);
      await db.products.update({
        where: {
          id: productId,
        },
        data: {
          productImage: data.productImageUrl,
          imageId: data.productImageId,
        },
      });
    }

    await db.products.update({
      where: {
        id: productId,
      },
      data: {
        productName: data.productName,
        productSno: data.productSno,
        MRP: data.productMrp,
        purchasePrice: data.purchasePrice,
        HSNCode: data.hsnCode,
        taxRate: data.taxRate,
        warrantyMonths: data.warranty,
        stockInHand: data.stockInHand,
        minStockQty: data.minStockQty,
        tags: data.tags,
        taxIncludedWithMrp: data.taxInclusion,
        reorderQty: data.reorderQty,
        branchId: data.branch,
        categoryId: data.categoryId,
        brandId: data.productBrandId,
        unitId: data.unitId,
        status:
          data.stockInHand > data.minStockQty
            ? "AVAILABLE"
            : data.stockInHand > 0
            ? "LOWSTOCK"
            : "UNAVAILABLE",
      },
    });

    return { success: true, message: "Product edited successfully " };
  } catch (error) {
    console.error("Error editing products in DB:", error);
    return { success: false, message: "Error editing product" };
  }
};
