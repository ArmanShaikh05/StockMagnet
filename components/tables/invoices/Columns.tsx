"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { MoreHorizontal } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { InvoiceTableType } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
  // {
  //   id: "actions",
  //   cell: () => {
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem>Copy payment ID</DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
