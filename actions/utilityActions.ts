"use server";

import db from "@/lib/prisma";
import {
  SerializedBrandType,
  SerializedCategoryType,
  SerializedUnitType,
} from "@/types/serializedTypes";
import { currentUser } from "@clerk/nextjs/server";

export const getAllBrands = async () => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const brands = await db.brand.findMany({
      where: {
        userClerkId: user.id,
      },
      include: {
        products: true,
      },
    });

    const serializeBrand: SerializedBrandType[] = brands.map((brand) => {
      return {
        ...brand,
        totalProfit: brand.totalProfit?.toString() || "0",
        totalRevenue: brand.totalRevenue?.toString() || "0",
        products: brand.products.map((product) => {
          return {
            ...product,
            MRP: product.MRP.toString(),
            purchasePrice: product.purchasePrice.toString(),
          };
        }),
      };
    });

    return {
      success: true,
      message: "Brands fetched successfully ",
      data: serializeBrand,
    };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { success: false, message: "Error fetching brands" };
  }
};

export const createNewBrand = async (brandData: {
  brandName: string;
  colorCode: string;
}) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const allBrands = await db.brand.findMany();

    const isBrandExists = allBrands.some(
      (brand) =>
        brand.brandName === brandData.brandName && brand.userClerkId === user.id
    );

    if (isBrandExists) {
      return { success: false, message: "Brand already exists" };
    }

    await db.brand.create({
      data: {
        brandName: brandData.brandName,
        colorCode: brandData.colorCode,
        userClerkId: user.id,
        totalProduct: 0,
      },
    });

    return {
      success: true,
      message: "Brand created successfully ",
    };
  } catch (error) {
    console.error("Error creating brand:", error);
    return { success: false, message: "Error creating brand" };
  }
};

export const deleteBrand = async (brandId: string) => {
  try {
    await db.brand.delete({
      where: {
        id: brandId,
      },
    });

    return {
      success: true,
      message: "Brand deleted successfully ",
    };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return { success: false, message: "Error deleting brand" };
  }
};

export const getAllUnits = async () => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const defaultUnits = await db.units.findMany({
      where: {
        canDelete: false,
      },
      include: {
        products: true,
      },
    });

    const userUnits = await db.units.findMany({
      where: {
        userClerkId: user.id,
      },
      include: {
        products: true,
      },
    });

    const units = [...defaultUnits, ...userUnits];

    const serializedUnitData: SerializedUnitType[] = units.map((unit) => {
      return {
        ...unit,
        products: unit.products.map((product) => {
          return {
            ...product,
            MRP: product.MRP.toString(),
            purchasePrice: product.purchasePrice.toString(),
          };
        }),
      };
    });

    return {
      success: true,
      message: "Units fetched successfully ",
      data: serializedUnitData,
    };
  } catch (error) {
    console.error("Error fetching units:", error);
    return { success: false, message: "Error fetching units" };
  }
};

export const deleteUnit = async (unitId: string) => {
  try {
    await db.units.delete({
      where: {
        id: unitId,
      },
    });

    return {
      success: true,
      message: "Unit deleted successfully ",
    };
  } catch (error) {
    console.error("Error deleting unit:", error);
    return { success: false, message: "Error deleting unit" };
  }
};

export const createNewUnit = async (unitData: {
  unitName: string;
  unitCode: string;
}) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const allUnits = await db.units.findMany();

    const isUnitNameExist = allUnits.some(
      (unit) =>
        unit.unitName === unitData.unitName && unit.userClerkId === user.id
    );
    if (isUnitNameExist) {
      return { success: false, message: "Unit name already exist" };
    }

    const isUnitCodeExist = allUnits.some(
      (unit) =>
        unit.unitCode === unitData.unitCode && unit.userClerkId === user.id
    );

    if (isUnitCodeExist) {
      return { success: false, message: "Unit code already exist" };
    }

    await db.units.create({
      data: {
        unitName: unitData.unitName,
        unitCode: unitData.unitCode,
        userClerkId: user.id,
        canDelete: true,
      },
    });

    return {
      success: true,
      message: "Unit created successfully ",
    };
  } catch (error) {
    console.error("Error creating unit:", error);
    return { success: false, message: "Error creating unit" };
  }
};

export const getAllCategory = async () => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const categories = await db.category.findMany({
      where: {
        userClerkId: user.id,
      },
    });

    const serializeCategory: SerializedCategoryType[] = categories.map(
      (category) => {
        return {
          ...category,
          totalProfit: category.totalProfit?.toString() || "0",
        };
      }
    );

    return {
      success: true,
      message: "Categories fetched successfully ",
      data: serializeCategory,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, message: "Error fetching categories" };
  }
};

export const createNewCategory = async (categoryData: {
  categoryName: string;
  colorCode: string;
}) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const allCategory = await db.category.findMany({
      where: {
        userClerkId: user.id,
      },
    });

    const isCategoryExist = allCategory.some(
      (brand) => brand.categoryName === categoryData.categoryName
    );

    if (isCategoryExist) {
      return { success: false, message: "Category already exists" };
    }

    await db.category.create({
      data: {
        categoryName: categoryData.categoryName,
        colorCode: categoryData.colorCode,
        userClerkId: user.id,
        totalProducts: 0,
      },
    });

    return {
      success: true,
      message: "Category created successfully ",
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, message: "Error creating category" };
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    await db.category.delete({
      where: {
        id: categoryId,
      },
    });

    return {
      success: true,
      message: "Category deleted successfully ",
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, message: "Error deleting category" };
  }
};
