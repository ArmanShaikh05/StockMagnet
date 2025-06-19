import { Prisma } from "@/lib/generated/prisma";

export type CardDataType = {
  icon: React.ElementType;
  title: string;
  value: string;
  percentChange: string;
  positiveChange: boolean;
  theme: "green" | "blue" | "orange" | "red";
  showPercent?: boolean;
};

export type PricingDataType = {
  name: string;
  description: string;
  price: number;
  isMostPopular: boolean;
  features: string[];
  paymentLink: string;
  priceId: string;
};

export type TaxesType = {
  label: string;
  value: number;
};

export type CurrentUserType = Prisma.UserGetPayload<{
  include: {
    branches: {
      include: {
        products: {
          select: {
            id: true;
          };
        };
      };
    };
    payment: true;
  };
}>;

export type InvoiceProductFormType = {
  id?: string;
  productId: string;
  quantity: number;
  sellingPrice: number;
  productSno: string;
  taxRate: string;
  taxIncludedWithMrp: boolean;
  productName: string;
  productMrp: number;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  units: string;
  rate: number;
  profitGain: number;
  purchasePrice: number;
  totalStock: number;
  Brand: string;
  Category: string;
  productImage: string;
  BrandColorCode: string;
  CategoryColorCode: string;
};

export type ProductFieldErrorsTypes = {
  productId?: string;
  quantity?: string;
  sellingPrice?: string;
  productSno?: string;
};

export type InvoiceDataType = {
  invoiceNumber: string;
  invoiceDate: Date;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  subTotal: number;
  totalTaxAmount: number;
  totalDiscount: number;
  grandTotal: number;
  isGstBill: boolean;
  gstNumber?: string;
  status: string;
  paymentMode: string;
  totalQuantity: number;
  amountPaid: number;
  creditedAmount: number;
  profitGain: number;

  branchId: string;
  products: InvoiceProductFormType[];
};

export type RevenueChartDataType = {
  weekly: {
    day: string;
    revenue: number;
  }[];
  monthly: {
    week: string;
    revenue: number;
  }[];
  yearly: {
    month: string;
    revenue: number;
  }[];
};

export type MonthlyStockSummaryChartType = {
  month: string;
  year: string;
  total: number;
  sold: number;
  remaining: number;
}[];

export type BranchesForRevenueComparisonType = {
  branchName: string;
  id: string;
  isPrimary: boolean;
  stock?: number;
}[];

export type RevenueChartData = {
  date: string;
  [branchLabel: string]: string | number;
};

export type StockComparisonChartData = {
  name: string;
  stock: number;
  isPrimary: boolean;
};

export type ProfitGainChartType = {
  month: string;
  profitGain: number;
}[];

export type BranchMetrics = {
  stockAvailabilityRate: number; // % e.g., 95
  profitGenerated: number; // e.g., ₹40,000
  revenueGenerated: number; // e.g., ₹2,00,000
  numberOfSales: number; // e.g., 800
};
