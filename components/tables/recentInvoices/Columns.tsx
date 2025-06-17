"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SerializedInvoiceType } from "@/types/serializedTypes";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<SerializedInvoiceType>[] = [

  {
    accessorKey: "invoiceNumber",
    header: "Invoice ID",
    cell: ({ row }) => {
      return <div className="pl-2">#{row.getValue("invoiceNumber")}</div>;
    },
  },

  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "customerMobile",
    header: () => <div className="text-center">Mobile No</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.customerMobile}</div>
    ),
  },
  {
    accessorKey: "invoiceDate",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Invoice Date
          {sortDirection === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sortDirection === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {new Date(row.getValue("invoiceDate")).toISOString().split("T")[0]}
      </div>
    ),
  },
  {
    accessorKey: "totalQuantity",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Items
          {sortDirection === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sortDirection === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("totalQuantity")}</div>
    ),
  },
  {
    accessorKey: "grandTotal",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Grand Total
          {sortDirection === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sortDirection === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("grandTotal"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "paymentMode",
    header: () => <div className="text-center">Payment</div>,
    cell: ({ row }) => {
      const payment = row.getValue("paymentMode") as string;

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
    accessorKey: "isGstBill",
    header: () => <div className="text-center">GST Bill</div>,
    cell: ({ row }) => {
      const isGstBill = row.getValue("isGstBill") as boolean;

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
            status === "FullPaid"
              ? "bg-green-600"
              : status === "Credited"
              ? "bg-orange-400"
              : "bg-red-500",
            "w-full"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
];
