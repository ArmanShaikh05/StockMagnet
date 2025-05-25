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
