"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ProductsTableType } from "@/types/types";
import Image from "next/image";

export const columns: ColumnDef<ProductsTableType>[] = [
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <Image
          src={row.getValue("image")}
          alt="product image"
          width={50}
          height={50}
        />
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Last Updated
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
      <div className="pl-4">{row.getValue("lastUpdated")}</div>
    ),
  },
  {
    accessorKey: "brand",
    header: () => <div className="text-center">Brand</div>,
    cell: ({ row }) => {
      const brand = row.getValue("brand") as string;

      return (
        <Badge
          variant={"outline"}
          className={cn(
            brand === "Amaron"
              ? "bg-rose-400"
              : brand === "Cash"
              ? "bg-blue-400"
              : "bg-purple-500",
            "w-full text-white"
          )}
        >
          {brand}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Price
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
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Stock
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
    cell: ({ row }) => <div className="pl-6">{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "totalValue",
    header: () => <div className="text-center">Total Value</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalValue"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-4 rounded-xs"
        >
          Status
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
      const status = row.getValue("status") as string;

      return (
        <Badge
          className={cn(
            status === "Available"
              ? "bg-green-600"
              : status === "LowStock"
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
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <Eye size={14} />
                <span>View</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <Pencil size={14} />
                <span>Edit</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2">
                <Trash2 size={14} />
                <span>Delete</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
