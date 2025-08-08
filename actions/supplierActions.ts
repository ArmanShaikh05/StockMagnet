"use server";

import db from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const createNewSupplier = async (brandData: {
  supplierName: string;
  supplierAddress: string;
  state: string;
  supplierPhone: string;
  supplierEmail: string;
  gstNumber: string;
}) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    const isSupplierExist = await db.suppliers.findFirst({
      where: {
        name: brandData.supplierName,
        state: brandData.state,
        phone: brandData.supplierPhone,
        userClerkId: user.id,
      },
    });

    if (isSupplierExist) {
      return { success: false, message: "Supplier already exists" };
    }

    await db.suppliers.create({
      data: {
        name: brandData.supplierName,
        address: brandData.supplierAddress,
        state: brandData.state,
        phone: brandData.supplierPhone,
        gstNumber: brandData.gstNumber,
        email: brandData.supplierEmail,
        userClerkId: user.id,
      },
    });

    return {
      success: true,
      message: "Supplier created successfully ",
    };
  } catch (error) {
    console.error("Error creating supplier:", error);
    return { success: false, message: "Error creating supplier" };
  }
};

export const getAllSuppliers = async () => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user", data: [] };

    const allSuppliers = await db.suppliers.findMany({
      where: {
        userClerkId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Supplier fetched successfully ",
      data: allSuppliers || [],
    };
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return { success: false, message: "Error fetching suppliers", data: [] };
  }
};

export const deleteSupplier = async (supplierId: string) => {
  try {
    await db.suppliers.delete({
      where: {
        id: supplierId,
      },
    });

    return {
      success: true,
      message: "Supplier deleted successfully ",
    };
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return { success: false, message: "Error deleting supplier" };
  }
};
