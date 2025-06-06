

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

export type FullInvoiceTableType = {
  id: string;
  date: string;
  customer: {
    name: string;
    mobile: string;
    address: string;
  };
  quantity: number;
  amount: number;
  payment: "UPI" | "Cash" | "Bank";
  gstBill: boolean;
  status: "Full-Paid" | "Credited" | "Not-Paid";
  products: Array<{
    id: string;
    image: string;
    name: string;
    category: string;
    brand: string;
    price: number;
    quantity: number;
    sellingPrice: number;
    totalValue: number;
  }>;
  discount?: number;
  oldItemDiscount?: number;
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


