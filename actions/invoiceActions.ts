"use server";

import { Prisma } from "@/lib/generated/prisma";
import db from "@/lib/prisma";
import { SerializedInvoiceType } from "@/types/serializedTypes";
import { InvoiceDataType } from "@/types/types";
import { getCurrentFinancialYear } from "@/utils/helper";
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

    const codedInvoiceNumber = getCurrentFinancialYear(
      invoiceData.invoiceNumber
    );

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
          invoiceNumber: codedInvoiceNumber,
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

    const actualInvoiceNumber = lastInvoiceNo?.invoiceNumber.includes("-")
      ? lastInvoiceNo.invoiceNumber.split("-")[1]
      : lastInvoiceNo?.invoiceNumber;

    return {
      success: true,
      message: "Last Invoice number fetched successfully",
      data: {
        invoiceNumber: actualInvoiceNumber,
      },
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
          invoiceNumber: invoice.invoiceNumber.includes("-")
            ? invoice.invoiceNumber.split("-")[1]
            : invoice.invoiceNumber,
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

export const getSingleInvoiceData = async (invoiceId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (!invoiceId) {
      return { success: false, message: "Invoice ID is required" };
    }

    const invoiceData = await db.invoices.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        products: true,
      },
    });

    if (!invoiceData) {
      return { success: false, message: "No Invoice found" };
    }

    const additionalProductData = [];

    for (const product of invoiceData.products) {
      const productData = await db.products.findUnique({
        where: {
          id: product.productId,
        },
        select: {
          stockInHand: true,
          purchasePrice: true,
        },
      });

      if (!productData) continue;

      const serializedAdditionalProductData = {
        stockInHand: productData.stockInHand,

        purchasePrice: Number(productData.purchasePrice),
      };

      additionalProductData.push(serializedAdditionalProductData);
    }

    const seriealizedInvoiceData: SerializedInvoiceType = {
      ...invoiceData,
      invoiceNumber: invoiceData.invoiceNumber.includes("-")
        ? invoiceData.invoiceNumber.split("-")[1]
        : invoiceData.invoiceNumber,
      subTotal: invoiceData.subTotal.toString(),
      totalTaxAmount: invoiceData.totalTaxAmount.toString(),
      totalDiscount: invoiceData.totalDiscount.toString(),
      grandTotal: invoiceData.grandTotal.toString(),
      amountPaid: invoiceData.amountPaid.toString(),
      creditedAmount: invoiceData.creditedAmount.toString(),
      profitGain: invoiceData.profitGain.toString(),
      products: invoiceData.products.map((product) => {
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

    return {
      success: true,
      message: "Invoice data fetched successfully",
      data: seriealizedInvoiceData,
      additionalProductData,
    };
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    return { success: false, message: "Error fetching invoice data" };
  }
};

export const editInvoiceData = async (
  invoiceData: InvoiceDataType,
  invoiceId: string
) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    if (!invoiceId) {
      return { success: false, message: "Invoice ID is required" };
    }

    if (!invoiceData.branchId) {
      return { success: false, message: "Branch ID is required" };
    }

    if (invoiceData.products.length === 0) {
      return { success: false, message: "At least one product is required" };
    }

    await db.$transaction(
      async (tx) => {
        // Fetch old invoice and its products
        const oldInvoice = await tx.invoices.findUnique({
          where: { id: invoiceId },
          include: { products: true },
        });

        if (!oldInvoice) {
          throw new Error("Invoice not found");
        }

        // Get all involved product IDs (old + new)
        const allProductIds = Array.from(
          new Set([
            ...oldInvoice.products.map((p) => p.productId),
            ...invoiceData.products.map((p) => p.productId),
          ])
        );

        // Fetch all product details once
        const productsInfo = await tx.products.findMany({
          where: { id: { in: allProductIds } },
        });

        const productMap = new Map(productsInfo.map((p) => [p.id, p]));

        const encodedInvoiceNumber = getCurrentFinancialYear(
          invoiceData.invoiceNumber
        );

        // Update invoice info
        await tx.invoices.update({
          where: { id: invoiceId },
          data: {
            amountPaid: new Prisma.Decimal(invoiceData.amountPaid),
            creditedAmount: new Prisma.Decimal(invoiceData.creditedAmount),
            branchId: invoiceData.branchId,
            customerAddress: invoiceData.customerAddress,
            customerName: invoiceData.customerName,
            customerMobile: invoiceData.customerMobile,
            grandTotal: new Prisma.Decimal(invoiceData.grandTotal),
            invoiceDate: invoiceData.invoiceDate,
            invoiceNumber: encodedInvoiceNumber,
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

        // Update old branch revenue (decrement)
        await tx.branches.update({
          where: { id: oldInvoice.branchId },
          data: {
            grossRevenue: {
              decrement: Number(oldInvoice.grandTotal),
            },
            netRevenue: {
              decrement:
                Number(oldInvoice.grandTotal) -
                Number(oldInvoice.totalTaxAmount),
            },
          },
        });

        // Restore stock and update brand/category for old products
        for (const oldProd of oldInvoice.products) {
          const prodInfo = productMap.get(oldProd.productId);
          if (!prodInfo) continue;

          await tx.products.update({
            where: { id: oldProd.productId },
            data: {
              stockInHand: prodInfo.stockInHand + oldProd.quantity,
            },
          });

          await tx.brand.update({
            where: { id: prodInfo.brandId },
            data: {
              totalRevenue: {
                decrement: new Prisma.Decimal(oldProd.subTotal),
              },
              totalProfit: {
                decrement: new Prisma.Decimal(oldProd.profitGain),
              },
            },
          });

          await tx.category.update({
            where: { id: prodInfo.categoryId },
            data: {
              totalProfit: {
                decrement: new Prisma.Decimal(oldProd.profitGain),
              },
            },
          });
        }

        // Delete old invoice products
        await tx.invoiceProduct.deleteMany({
          where: { invoicesId: invoiceId },
        });

        // Update new branch revenue (increment)
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

        // Create new invoice products and update stock, brand, category
        for (const newProd of invoiceData.products) {
          await tx.invoiceProduct.create({
            data: {
              productId: newProd.productId,
              productMrp: new Prisma.Decimal(newProd.productMrp),
              productName: newProd.productName,
              productSno: newProd.productSno,
              quantity: newProd.quantity,
              Brand: newProd.Brand,
              Category: newProd.Category,
              BrandColorCode: newProd.BrandColorCode,
              CategoryColorCode: newProd.CategoryColorCode,
              productImage: newProd.productImage,
              rate: new Prisma.Decimal(newProd.rate),
              profitGain: new Prisma.Decimal(newProd.profitGain),
              sellingPrice: new Prisma.Decimal(newProd.sellingPrice),
              taxRate: newProd.taxRate,
              subTotal: new Prisma.Decimal(newProd.subTotal),
              units: newProd.units,
              discountAmount: new Prisma.Decimal(newProd.discountAmount),
              taxIncludedWithMrp: newProd.taxIncludedWithMrp,
              taxAmount: new Prisma.Decimal(newProd.taxAmount),
              invoicesId: invoiceId,
            },
          });

          const prodInfo = productMap.get(newProd.productId);
          if (!prodInfo) continue;

          await tx.products.update({
            where: { id: newProd.productId },
            data: {
              stockInHand: prodInfo.stockInHand - newProd.quantity,
            },
          });

          await tx.brand.update({
            where: { id: prodInfo.brandId },
            data: {
              totalRevenue: {
                increment: new Prisma.Decimal(newProd.subTotal),
              },
              totalProfit: {
                increment: new Prisma.Decimal(newProd.profitGain),
              },
            },
          });

          await tx.category.update({
            where: { id: prodInfo.categoryId },
            data: {
              totalProfit: {
                increment: new Prisma.Decimal(newProd.profitGain),
              },
            },
          });
        }
      },
      { timeout: 20000 } // increase timeout to 20 seconds
    );

    return { success: true, message: "Invoice edited successfully" };
  } catch (error) {
    console.error("Error editing invoice:", error);
    return { success: false, message: "Error editing invoice" };
  }
};

export const getRecentInvoicesOfBranch = async (branchId: string) => {
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
      take: 10,
    });

    const seriealizedInvoicesData: SerializedInvoiceType[] =
      allInvoicesOfBranch.map((invoice) => {
        return {
          ...invoice,
          invoiceNumber: invoice.invoiceNumber.includes("-")
            ? invoice.invoiceNumber.split("-")[1]
            : invoice.invoiceNumber,
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

    await db.$transaction(
      async (tx) => {
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
      },
      { timeout: 20000 }
    );

    return { success: true, message: "Invoice deleted successfully" };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, message: "Error deleting invoice" };
  }
};

export const deleteMultipleInvoices = async (invoiceIDs: string[]) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return { success: false, message: "Unauthorized user" };

    // Step 1: Fetch all matching products in one DB call
    const allInvoiceData = await db.invoices.findMany({
      where: { id: { in: invoiceIDs } },
      include: {
        products: true,
      },
    });

    await db.$transaction(
      async (tx) => {
        for (const invoice of allInvoiceData) {
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
        }
      },
      { timeout: 20000 }
    );

    return {
      success: true,
      message: "All selected invoices deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting selected invoices from DB:", error);
    return { success: false, message: "Error deleting selected invoices" };
  }
};

export const getInvoicesCardData = async (branchId: string) => {
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

    const totalInvoiceData = await db.invoices.aggregate({
      _sum: { creditedAmount: true },
      where: {
        branchId: branchId,
      },
      _count: true,
    });

    const totalGstBillData = await db.invoices.aggregate({
      where: {
        branchId: branchId,
        isGstBill: true,
      },
      _count: true,
    });

    const totalCreditedBillData = await db.invoices.aggregate({
      where: {
        branchId: branchId,
        status: "Credited",
      },
      _count: true,
    });

    const totalInvoice = totalInvoiceData._count || 0;
    const totalGstBill = totalGstBillData._count || 0;
    const totalCreditedBill = totalCreditedBillData._count || 0;
    const totalCreditedAmount =
      Number(totalInvoiceData._sum.creditedAmount) || 0;

    const cardsData = {
      totalInvoice,
      totalGstBill,
      totalCreditedBill,
      totalCreditedAmount,
    };

    return {
      success: true,
      message: "Invoices cards fetched successfully",
      data: cardsData,
    };
  } catch (error) {
    console.error("Error fetching Invoices cards data:", error);
    return {
      success: false,
      message: "Error fetching Invoices cards data",
    };
  }
};

export const getInvoicesDataofBranch = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return {
        success: false,
        message: "Unauthorized user",
      };

    const invoiceData = await db.invoices.findMany({
      where: {
        branchId: branchId,
      },
      include: {
        products: true,
      },
    });

    if (!invoiceData) {
      return { success: false, message: "No Invoice found" };
    }

    const seriealizedInvoiceData: SerializedInvoiceType[] = invoiceData.map(
      (invoice) => {
        return {
          ...invoice,
          invoiceNumber: invoice.invoiceNumber.includes("-")
            ? invoice.invoiceNumber.split("-")[1]
            : invoice.invoiceNumber,
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
      }
    );

    return {
      success: true,
      message: "Invoice data fetched successfully",
      data: seriealizedInvoiceData,
    };
  } catch (error) {
    console.error("Error fetching branch products data:", error);
    return {
      success: false,
      message: "Error fetching branch products data",
    };
  }
};
