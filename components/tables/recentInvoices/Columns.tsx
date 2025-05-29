"use client";

import { ColumnDef } from "@tanstack/react-table";

import { InvoiceTableType } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


export const columns: ColumnDef<InvoiceTableType>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: ({ row }) => {
      return <div>#{row.getValue("id")}</div>;
    },
  },

  {
    accessorKey: "customer",
    header: "Customer Name",
  },
  {
    accessorKey: "mobile",
    header: "Mobile No",
  },
  {
    accessorKey: "date",
    header: "Invoice Date",
  },
  {
    accessorKey: "quantity",
    header: "Items",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => {
      const payment = row.getValue("payment") as string;

      return (
        <Badge
          className={cn(
            payment === "UPI"
              ? "bg-rose-400"
              : payment === "Cash"
              ? "bg-blue-400"
              : "bg-purple-500",
            "w-full"
          )}
        >
          {payment}
        </Badge>
      );
    },
  },
  {
    accessorKey: "gstBill",
    header: "GST Bill",
    cell: ({ row }) => {
      const isGstBill = row.getValue("gstBill") as boolean;

      return <div className="text-center">{isGstBill ? "Yes" : "No"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          className={cn(
            status === "Full-Paid"
              ? "bg-green-600"
              : status === "Credited"
              ? "bg-orange-400"
              : "bg-red-500"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
];
