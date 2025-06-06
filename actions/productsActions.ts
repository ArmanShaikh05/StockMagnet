"use server";

import db from "@/lib/prisma";
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
