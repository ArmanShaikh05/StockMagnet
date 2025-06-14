import { Prisma } from "@/lib/generated/prisma";

export type LowStockProductTypes = {
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};

export type InvoiceTableType = {
  id: number;
  customer: string;
  date: string;
  brand: string;
  quantity: number;
  amount: number;
  status: "Full-Paid" | "Credited" | "Not-Paid";
  product: {
    id: string;
    image: string;
    name: string;
    category: string;
  };
  mobile: string;
  payment: "UPI" | "Cash" | "Bank";
  gstBill: boolean;
};

export type CardDataType = {
  icon: React.ElementType;
  title: string;
  value: string;
  percentChange: string;
  positiveChange: boolean;
  theme: "green" | "blue" | "orange" | "red";
};

export type ProductsTableType = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  lastUpdated: string;
  brand: string;
  totalValue: number;
  status: "Available" | "LowStock" | "Unavailable";
};


export type InvoiceProductsTableType = {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  sellingPrice: number;
  totalValue: number;
};

export type BranchesType = {
  id: string;
  branchName: string;
  branchAddress: string;
  branchImage: string;
  createdAt: string;
  isPrimaryBranch: boolean;
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
