"use server";

import { Prisma } from "@/lib/generated/prisma";
import db from "@/lib/prisma";
import { SerializedInvoiceType } from "@/types/serializedTypes";
import { InvoiceDataType } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";

export const createNewInvoice = async (invoiceData: InvoiceDataType) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (!invoiceData.branchId) {
      return { success: false, message: "Branch ID is required" };
    }

    if (invoiceData.products.length === 0) {
      return { success: false, message: "At least one product is required" };
    }

    await db.$transaction(async (tx) => {
      const newInvoice = await tx.invoices.create({
        data: {
          amountPaid: new Prisma.Decimal(invoiceData.amountPaid),
          creditedAmount: new Prisma.Decimal(invoiceData.creditedAmount),
          branchId: invoiceData.branchId,
          customerAddress: invoiceData.customerAddress,
          customerName: invoiceData.customerName,
          customerMobile: invoiceData.customerMobile,
          grandTotal: new Prisma.Decimal(invoiceData.grandTotal),
          invoiceDate: invoiceData.invoiceDate,
          invoiceNumber: invoiceData.invoiceNumber,
          paymentMode:
            invoiceData.paymentMode === "UPI"
              ? "UPI"
              : invoiceData.paymentMode === "Cash"
              ? "Cash"
              : "Bank",
          profitGain: new Prisma.Decimal(invoiceData.profitGain),
          isGstBill: invoiceData.isGstBill,
          gstNumber: invoiceData.gstNumber,
          status:
            invoiceData.status === "FullPaid"
              ? "FullPaid"
              : invoiceData.status === "Credited"
              ? "Credited"
              : "NotPaid",
          subTotal: new Prisma.Decimal(invoiceData.subTotal),
          totalDiscount: new Prisma.Decimal(invoiceData.totalDiscount),
          totalQuantity: invoiceData.totalQuantity,
          totalTaxAmount: new Prisma.Decimal(invoiceData.totalTaxAmount),
        },
      });

      await tx.branches.update({
        where: { id: invoiceData.branchId },
        data: {
          grossRevenue: {
            increment: invoiceData.grandTotal,
          },
          netRevenue: {
            increment: invoiceData.grandTotal - invoiceData.totalTaxAmount,
          },
        },
      });

      for (const product of invoiceData.products) {
        await tx.invoiceProduct.create({
          data: {
            productId: product.productId,
            productMrp: new Prisma.Decimal(product.productMrp),
            productName: product.productName,
            productSno: product.productSno,
            quantity: product.quantity,
            Brand: product.Brand,
            Category: product.Category,
            BrandColorCode: product.BrandColorCode,
            CategoryColorCode: product.CategoryColorCode,
            productImage: product.productImage,
            rate: new Prisma.Decimal(product.rate),
            profitGain: new Prisma.Decimal(product.profitGain),
            sellingPrice: new Prisma.Decimal(product.sellingPrice),
            taxRate: product.taxRate,
            subTotal: new Prisma.Decimal(product.subTotal),
            units: product.units,
            discountAmount: new Prisma.Decimal(product.discountAmount),
            taxIncludedWithMrp: product.taxIncludedWithMrp,
            taxAmount: new Prisma.Decimal(product.taxAmount),
            invoicesId: newInvoice.id,
          },
        });

        const existingProduct = await tx.products.findUnique({
          where: {
            id: product.productId,
          },
        });

        if (!existingProduct) continue;

        await tx.products.update({
          where: { id: product.productId },
          data: {
            stockInHand: existingProduct.stockInHand - product.quantity,
          },
        });

        await tx.brand.update({
          where: { id: existingProduct.brandId },
          data: {
            totalRevenue: {
              increment: new Prisma.Decimal(product.subTotal),
            },
            totalProfit: {
              increment: new Prisma.Decimal(product.profitGain),
            },
          },
        });

        await tx.category.update({
          where: { id: existingProduct.categoryId },
          data: {
            totalProfit: {
              increment: new Prisma.Decimal(product.profitGain),
            },
          },
        });
      }
    });

    return { success: true, message: "Invoice created successfully" };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { success: false, message: "Error creating invoice" };
  }
};

export const getLastInvoiceNo = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (!branchId) {
      return { success: false, message: "Branch ID is required" };
    }

    const lastInvoiceNo = await db.invoices.findFirst({
      where: {
        branchId: branchId,
      },
      orderBy: {
        invoiceNumber: "desc",
      },
      select: {
        invoiceNumber: true,
      },
    });

    return {
      success: true,
      message: "Last Invoice number fetched successfully",
      data: lastInvoiceNo,
    };
  } catch (error) {
    console.error("Error fetching last invoice number:", error);
    return { success: false, message: "Error fetching last invoice number" };
  }
};

export const getAllInvoicesOfBranch = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (!branchId) {
      return { success: false, message: "Branch ID is required" };
    }

    const allInvoicesOfBranch = await db.invoices.findMany({
      where: {
        branchId: branchId,
      },
      orderBy: {
        invoiceNumber: "desc",
      },
      include: {
        products: true,
      },
    });

    const seriealizedInvoicesData: SerializedInvoiceType[] =
      allInvoicesOfBranch.map((invoice) => {
        return {
          ...invoice,
          subTotal: invoice.subTotal.toString(),
          totalTaxAmount: invoice.totalTaxAmount.toString(),
          totalDiscount: invoice.totalDiscount.toString(),
          grandTotal: invoice.grandTotal.toString(),
          amountPaid: invoice.amountPaid.toString(),
          creditedAmount: invoice.creditedAmount.toString(),
          profitGain: invoice.profitGain.toString(),
          products: invoice.products.map((product) => {
            return {
              ...product,
              productMrp: product.productMrp.toString(),
              rate: product.rate.toString(),
              sellingPrice: product.sellingPrice.toString(),
              profitGain: product.profitGain.toString(),
              taxAmount: product.taxAmount?.toString() || "0",
              subTotal: product.subTotal.toString(),
              discountAmount: product.discountAmount?.toString() || "0",
            };
          }),
        };
      });

    return {
      success: true,
      message: "Last Invoice number fetched successfully",
      data: seriealizedInvoicesData,
    };
  } catch (error) {
    console.error("Error fetching last invoice number:", error);
    return { success: false, message: "Error fetching last invoice number" };
  }
};

export const deleteInvoice = async (invoiceId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (!invoiceId) {
      return { success: false, message: "Invoice ID is required" };
    }

    const invoice = await db.invoices.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        products: true,
      },
    });

    if (!invoice) {
      return { success: false, message: "No Invoice found" };
    }

    await db.$transaction(async (tx) => {
      await tx.branches.update({
        where: { id: invoice.branchId },
        data: {
          grossRevenue: {
            decrement: Number(invoice.grandTotal),
          },
          netRevenue: {
            decrement:
              Number(invoice.grandTotal) - Number(invoice.totalTaxAmount),
          },
        },
      });

      for (const product of invoice.products) {
        const existingProduct = await tx.products.findUnique({
          where: {
            id: product.productId,
          },
        });

        if (!existingProduct) continue;

        await tx.products.update({
          where: { id: product.productId },
          data: {
            stockInHand: existingProduct.stockInHand + product.quantity,
          },
        });

        await tx.brand.update({
          where: { id: existingProduct.brandId },
          data: {
            totalRevenue: {
              decrement: new Prisma.Decimal(product.subTotal),
            },
            totalProfit: {
              decrement: new Prisma.Decimal(product.profitGain),
            },
          },
        });

        await tx.category.update({
          where: { id: existingProduct.categoryId },
          data: {
            totalProfit: {
              decrement: new Prisma.Decimal(product.profitGain),
            },
          },
        });
      }

      await tx.invoices.delete({
        where: {
          id: invoice.id,
        },
      });
    });

    return { success: true, message: "Invoice deleted successfully" };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, message: "Error deleting invoice" };
  }
};
