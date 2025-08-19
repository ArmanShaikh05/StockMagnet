"use server";

import { InvoiceStatus, PaymentMode } from "@/lib/generated/prisma";
import db from "@/lib/prisma";
import { SerializedPurchaseOrderDataType } from "@/types/serializedTypes";
import { PurchaseOrderData } from "@/types/types";
import { deleteImageFromImagekit } from "@/utils/deleteImage";
import { currentUser } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth } from "date-fns";

export const createNewPurchaseOrder = async (
  purchaseOrderData: PurchaseOrderData
) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (!purchaseOrderData.branchId) {
      return { success: false, message: "Branch ID is required" };
    }

    if (purchaseOrderData.products.length === 0) {
      return { success: false, message: "At least one product is required" };
    }

    await db.$transaction(async (tx) => {
      // 1. Create the Purchase Order
      const newPurchaseOrder = await tx.purchaseOrders.create({
        data: {
          paymentMode: purchaseOrderData.paymentMode as PaymentMode,
          paymentStatus: purchaseOrderData.status as InvoiceStatus,
          purchaseDate: purchaseOrderData.purchaseDate,
          branchId: purchaseOrderData.branchId,
          supplierId: purchaseOrderData.supplier,
          invoiceImageId: purchaseOrderData.invoiceImageId,
          invoiceImageUrl: purchaseOrderData.invoiceImageURL,
          supplierInvoiceNumber: purchaseOrderData.invoiceNumber,
          totalItems: purchaseOrderData.totalQuantity,
        },
      });

      // 2. Create PurchaseOrderProduct entries with quantity
      await Promise.all(
        purchaseOrderData.products.map((product) =>
          tx.purchaseOrderProduct.create({
            data: {
              purchaseOrderId: newPurchaseOrder.id,
              productId: product.productId,
              quantity: product.quantity,
            },
          })
        )
      );

      // 3. Update stock in Products
      for (const product of purchaseOrderData.products) {
        await tx.products.update({
          where: { id: product.productId },
          data: {
            stockInHand: {
              increment: product.quantity,
            },
          },
        });
      }
    });

    return { success: true, message: "Purchase order created successfully" };
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return { success: false, message: "Error creating purchase order" };
  }
};

export const getPurchaseOrderCardData = async (branchId: string) => {
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

    const today = new Date();

    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);

    const purchaseOrderData = await db.purchaseOrders.aggregate({
      _sum: { creditedAmount: true },
      where: {
        branchId: branchId,
      },
      _count: true,
    });

    const monthlyPurchaseOrderData = await db.purchaseOrders.aggregate({
      where: {
        branchId: branchId,
        purchaseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    });

    const totalPurchaseOrder = purchaseOrderData._count || 0;
    const totalmonthlyPurchaseOrderData = monthlyPurchaseOrderData._count || 0;
    const totalCreditedAmount =
      Number(purchaseOrderData._sum.creditedAmount) || 0;

    const cardsData = {
      totalPurchaseOrder,
      totalmonthlyPurchaseOrderData,
      totalCreditedAmount,
    };

    return {
      success: true,
      message: "Purchase Order cards fetched successfully",
      data: cardsData,
    };
  } catch (error) {
    console.error("Error fetching Purchase Order cards data:", error);
    return {
      success: false,
      message: "Error fetching Purchase Order cards data",
    };
  }
};

export const getAllPurchaseOrderDataOfBranch = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (!branchId) {
      return { success: false, message: "Branch ID is required" };
    }

    const allPurchaseOrderOfBranch = await db.purchaseOrders.findMany({
      where: {
        branchId: branchId,
      },
      orderBy: {
        purchaseDate: "desc",
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                category: { select: { categoryName: true, colorCode: true } },
                Brand: { select: { brandName: true, colorCode: true } },
              },
            },
          },
        },
        supplier: true,
        branch: true,
      },
    });

    const serializedPurchaseOrderData: SerializedPurchaseOrderDataType[] =
      allPurchaseOrderOfBranch.map((invoice) => {
        return {
          ...invoice,

          products: invoice.products.map((productRelation) => {
            const { product, quantity } = productRelation;

            return {
              ...product,
              quantity,
              purchasePrice: product.purchasePrice.toString(),
              MRP: product.MRP.toString(),
            };
          }),
        };
      });

    return {
      success: true,
      message: "Purchase order data fetched successfully",
      data: serializedPurchaseOrderData,
    };
  } catch (error) {
    console.error("Error fetching purchase order data:", error);
    return { success: false, message: "Error fetching purchase order data" };
  }
};

export const deletePurchaseOrder = async (orderId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (!orderId) {
      return { success: false, message: "Order ID is required" };
    }

    const order = await db.purchaseOrders.findUnique({
      where: {
        id: orderId,
      },
      include: {
        products: true,
      },
    });

    if (!order) {
      return { success: false, message: "No Purchase order found" };
    }

    await db.$transaction(
      async (tx) => {
        // If images are there then delete it from imagekit
        if (order.invoiceImageUrl && order.invoiceImageId) {
          await deleteImageFromImagekit(order.invoiceImageId);
        }

        // Reduce the added stocks
        await Promise.all(
          order.products.map(async (product) => {
            await tx.products.update({
              where: {
                id: product.productId,
              },
              data: {
                stockInHand: {
                  decrement: product.quantity,
                },
              },
            });
          })
        );

        // Deleting the purchase order
        await tx.purchaseOrders.delete({
          where: {
            id: order.id,
          },
        });
      },
      { timeout: 20000 }
    );

    return { success: true, message: "Purchase order deleted successfully" };
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return { success: false, message: "Error deleting purchase order" };
  }
};

export const deleteMultiplePurchaseOrders = async (invoiceIDs: string[]) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    // Step 1: Fetch all matching products in one DB call
    const allInvoiceData = await db.purchaseOrders.findMany({
      where: { id: { in: invoiceIDs } },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    await db.$transaction(
      async (tx) => {
        for (const invoice of allInvoiceData) {
          // Check if images are there then delete images

          if (invoice.invoiceImageId) {
            await deleteImageFromImagekit(invoice.invoiceImageId);
          }

          // Reduce the producut count
          for (const product of invoice.products) {
            await tx.products.update({
              where: {
                id: product.productId,
              },
              data: {
                stockInHand: {
                  decrement: product.quantity,
                },
              },
            });
          }

          await tx.purchaseOrders.delete({
            where: {
              id: invoice.id,
            },
          });
        }
      },
      { timeout: 20000 }
    );

    return {
      success: true,
      message: "All selected purchase orders deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting selected purchase orders from DB:", error);
    return {
      success: false,
      message: "Error deleting selected purchase orders",
    };
  }
};
