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
