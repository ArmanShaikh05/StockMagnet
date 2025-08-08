/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Prisma } from "@/lib/generated/prisma";

// SERIALIZATION TYPE FOR PRODUCTS

type ProductWithDecimal = Prisma.ProductsGetPayload<{
  include: {
    Brand: true;
    category: true;
    unit: true;
  };
}>;

type BrandForProductType = Prisma.BrandGetPayload<{}>;
type CategoryForProductType = Prisma.CategoryGetPayload<{}>;

export type SerializedBrandForProductType = Omit<
  BrandForProductType,
  "totalRevenue" | "totalProfit"
> & {
  totalRevenue: string | null;
  totalProfit: string | null;
};

export type SerializedcategoryForProductType = Omit<
  CategoryForProductType,
  "totalProfit"
> & {
  totalProfit: string | null;
};

export type SerializedProductType = Omit<
  ProductWithDecimal,
  "MRP" | "purchasePrice" | "Brand" | "category"
> & {
  MRP: string;
  purchasePrice: string;
  Brand: SerializedBrandForProductType;
  category: SerializedcategoryForProductType;
};

// SERIALIZATION TYPE FOR BRANDS

type ProductsForBrandType = Prisma.ProductsGetPayload<{}>;

export type SerializedProductForBrandType = Omit<
  ProductsForBrandType,
  "MRP" | "purchasePrice"
> & {
  MRP: string;
  purchasePrice: string;
};

type BrandWithDecimal = Prisma.BrandGetPayload<{
  include: {
    products: true;
  };
}>;

export type SerializedBrandType = Omit<
  BrandWithDecimal,
  "totalRevenue" | "totalProfit" | "products"
> & {
  totalRevenue: string | null;
  totalProfit: string | null;
  products: SerializedProductForBrandType[];
};

// SERIALIZATION FOR CATEGORY

type CategoryWithDecimal = Prisma.CategoryGetPayload<{}>;

export type SerializedCategoryType = Omit<
  CategoryWithDecimal,
  "totalProfit"
> & {
  totalProfit: string | null;
};

// SERIALIZATION FOR UNITS

type UnitsWithDecimal = Prisma.UnitsGetPayload<{
  include: {
    products: true;
  };
}>;

type ProductsForUnit = Prisma.ProductsGetPayload<{}>;

type SerializedProductForUnitType = Omit<
  ProductsForUnit,
  "MRP" | "purchasePrice"
> & {
  MRP: string | null;
  purchasePrice: string | null;
};

export type SerializedUnitType = Omit<UnitsWithDecimal, "products"> & {
  products: SerializedProductForUnitType[];
};

// SINGLE SERIALIZED PRODUCT USE IN EDIT PRODUCT DIALOG

export type SerializedSingleProduct = Omit<
  Prisma.ProductsGetPayload<{}>,
  "MRP" | "purchasePrice"
> & {
  MRP: string;
  purchasePrice: string;
};

// SERIALIZED INVOICE PRODUCTS TYPE

export type SerializedInvoiceProductType = Omit<
  Prisma.InvoiceProductGetPayload<{}>,
  | "productMrp"
  | "sellingPrice"
  | "taxAmount"
  | "subTotal"
  | "discountAmount"
  | "rate"
  | "profitGain"
> & {
  productMrp: string;
  sellingPrice: string;
  taxAmount?: string;
  subTotal: string;
  discountAmount?: string;
  rate: string;
  profitGain: string;
};

export type SerializedInvoiceType = Omit<
  Prisma.InvoicesGetPayload<{ include: { products: true } }>,
  | "subTotal"
  | "totalTaxAmount"
  | "totalDiscount"
  | "grandTotal"
  | "amountPaid"
  | "creditedAmount"
  | "profitGain"
  | "products"
> & {
  subTotal: string;
  totalTaxAmount: string;
  totalDiscount: string;
  grandTotal: string;
  amountPaid: string;
  creditedAmount: string;
  profitGain: string;
  products: SerializedInvoiceProductType[];
};

// SERIALIZED LOW STOCK PRODUCT
export type SerializedLowStockProductType = {
  id: string;
  productImage: string;
  productName: string;
  stockInHand: number;
  minStockQty: number;
  MRP: string;
  Brand: {
    brandName: string;
    colorCode: string;
  };
};

// Serialized Purchase Order Types

export type SerializedPurchaseOrderProductType = {
  quantity: number;
  purchasePrice: string;
  MRP: string;
  discountAmount?: string;
} & Omit<
  Prisma.ProductsGetPayload<{
    include: {
      category: { select: { categoryName: true; colorCode: true } };
      Brand: { select: { brandName: true; colorCode: true } };
    };
  }>,
  "MRP" | "purchasePrice"
>;

export type SerializedPurchaseOrderDataType = Omit<
  Prisma.PurchaseOrdersGetPayload<{
    include: {
      products: {
        include: {
          product: {
            include: {
              category: { select: { categoryName: true; colorCode: true } };
              Brand: { select: { brandName: true; colorCode: true } };
            };
          };
        };
      };
      supplier: true;
      branch: true;
    };
  }>,
  "products"
> & {
  products: SerializedPurchaseOrderProductType[];
};
