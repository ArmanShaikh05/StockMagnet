import { Badge } from "@/components/ui/badge";
import { SerializedInvoiceProductType } from "@/types/serializedTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import ProductsTable from "../../products/ProductsTable";

const column: ColumnDef<SerializedInvoiceProductType>[] = [
  {
    header: "S.no",
    cell: ({ row }) => {
      return <div className="pl-2">{row.index + 1}</div>; // row.index starts from 0
    },
  },

  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => {
      return (
        <div className="w-max flex items-center gap-2">
          <Image
            src={row.original.productImage}
            alt="product image"
            width={50}
            height={50}
          />
          <span>{row.getValue("productName")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "Category",
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => {
      const category = row.getValue("Category") as string;

      return (
        <Badge
          variant={"outline"}
          className={"w-full text-white"}
          style={{
            backgroundColor: `${row.original.CategoryColorCode}`,
          }}
        >
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "Brand",
    header: () => <div className="text-center">Brand</div>,
    cell: ({ row }) => {
      const brand = row.getValue("Brand") as string;

      return (
        <Badge
          variant={"outline"}
          className={"w-full text-white"}
          style={{
            backgroundColor: `${row.original.BrandColorCode}`,
          }}
        >
          {brand}
        </Badge>
      );
    },
  },

  {
    accessorKey: "quantity",
    header: () => <div className="text-center">Quantity</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("quantity")}</div>
    ),
  },

  {
    accessorKey: "productMrp",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          MRP
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
      const amount = parseFloat(row.getValue("productMrp"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },

  {
    accessorKey: "discountAmount",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Discount
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
      const amount = parseFloat(
        (
          parseFloat(row.getValue("discountAmount")) / row.original.quantity
        ).toString()
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },

  {
    accessorKey: "sellingPrice",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Selling Price
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
      const amount = parseFloat(row.getValue("sellingPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },

    {
    accessorKey: "taxRate",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Tax Rate
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
      const taxRate =  row.original.taxRate.split("@")[1]

      return <div className="text-center">{taxRate}</div>;
    },
  },

  {
    accessorKey: "rate",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Rate
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
      const amount = parseFloat(row.getValue("rate"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },

  {
    accessorKey: "subTotal",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <div
          onClick={() => column.toggleSorting(sortDirection === "asc")}
          className="flex items-center justify-center gap-0 cursor-pointer hover:bg-accent hover:text-accent-foreground h-[85%] my-auto pl-2 rounded-xs"
        >
          Sub Total
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
      const amount = parseFloat(row.getValue("subTotal"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },
];

const InvoiceProductsTable = ({
  data,
}: {
  data: SerializedInvoiceProductType[];
}) => {
  return (
    <div>
      <ProductsTable showPagination={false} columns={column} data={data} />
    </div>
  );
};

export default InvoiceProductsTable;
