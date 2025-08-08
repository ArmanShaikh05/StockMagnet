"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { SerializedPurchaseOrderDataType } from "@/types/serializedTypes";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<SerializedPurchaseOrderDataType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="cursor-pointer"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "S.no",
    cell: ({ row }) => {
      return <div className="pl-2">{row.index + 1}</div>; // row.index starts from 0
    },
  },
  {
    accessorKey: "purchaseDate",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Purchase Date
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
        {new Date(row.getValue("purchaseDate")).toISOString().split("T")[0]}
      </div>
    ),
  },

  {
    id: "branchName",
    accessorFn: (row) => row.branch.branchName || "-",
    header: () => <div className="text-center">Branch</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 w-full justify-center">
        <Avatar>
          <AvatarImage src={row.original.branch.branchImage} />
          <AvatarFallback>
            {row.original.branch.branchName
              .split("")
              .map((word) => word[0].toUpperCase)
              .join("")}
          </AvatarFallback>
        </Avatar>
        <p>{row.original.branch.branchName}</p>
      </div>
    ),
  },

  {
    id: "supplierName",
    accessorFn: (row) => row.supplier.name || "-",
    header: () => <div className="text-center">Supplier</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.supplier.name}</div>
    ),
  },

  {
    id: "supplierPhone",
    accessorFn: (row) => row.supplier.phone || "-",
    header: () => <div className="text-center">Contact</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.supplier.phone}</div>
    ),
  },

  {
    accessorKey: "totalItems",
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
      <div className="text-center">{row.getValue("totalItems")}</div>
    ),
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
    accessorKey: "paymentStatus",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;

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
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="outline"
          size={"icon"}
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </Button>
      );
    },
  },
];
