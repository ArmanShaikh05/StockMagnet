import { SerializedInvoiceType } from "@/types/serializedTypes";

export function formatInvoicesData(
  actualInvoices: SerializedInvoiceType[]
) {
  return actualInvoices.map((invoice) => ({
    id: invoice.invoiceNumber,
    date: new Date(invoice.invoiceDate).toISOString().split("T")[0],
    customer: {
      name: invoice.customerName,
      mobile: invoice.customerMobile,
      address: invoice.customerAddress,
    },
    quantity: invoice.totalQuantity,
    amount: Number(invoice.grandTotal),
    payment: invoice.paymentMode,
    gstBill: invoice.isGstBill,
    status:
      invoice.status === "FullPaid"
        ? "Full-Paid"
        : invoice.status === "NotPaid"
        ? "Not-Paid"
        : "Credited",
    products: invoice.products.map((p) => ({
      id: p.id,
      image: "/stock.png",
      name: p.productName,
      category: "Unknown", // Placeholder — replace if you can fetch category info
      brand: "Unknown", // Placeholder — replace if you can fetch brand info
      price: Number(p.productMrp),
      quantity: p.quantity,
      sellingPrice: Number(p.sellingPrice),
      totalValue: Number(p.subTotal),
    })),
    ...(invoice.totalDiscount && Number(invoice.totalDiscount) > 0
      ? { discount: Number(invoice.totalDiscount) }
      : {}),
  }));
}
