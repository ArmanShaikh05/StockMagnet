import { Badge } from "@/components/ui/badge";
import { SerializedPurchaseOrderProductType } from "@/types/serializedTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import ProductsTable from "../../products/ProductsTable";

const column: ColumnDef<
  SerializedPurchaseOrderProductType & { quantity: number }
>[] = [
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
    id: "Category",
    accessorFn: (row) => row.category.categoryName || "",
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => {
      const category = row.original.category.categoryName as string;

      return (
        <Badge
          variant={"outline"}
          className={"w-full text-white"}
          style={{
            backgroundColor: `${row.original.category.colorCode}`,
          }}
        >
          {category}
        </Badge>
      );
    },
  },
  {
    id: "Brand",
    accessorFn: (row) => row.Brand.brandName || "",
    header: () => <div className="text-center">Brand</div>,
    cell: ({ row }) => {
      const brand = row.original.Brand.brandName as string;

      return (
        <Badge
          variant={"outline"}
          className={"w-full text-white"}
          style={{
            backgroundColor: `${row.original.Brand.colorCode}`,
          }}
        >
          {brand}
        </Badge>
      );
    },
  },

  {
    accessorKey: "MRP",
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
      const amount = parseFloat(row.getValue("MRP"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },

  {
    accessorKey: "quantity",
    header: () => <div className="text-center">Quantity</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("quantity")}</div>
    ),
  },
];

const PurchaseOrderProductTable = ({
  data,
}: {
  data: Array<SerializedPurchaseOrderProductType & { quantity: number }>;
}) => {
  return (
    <div>
      <ProductsTable showPagination={false} columns={column} data={data} />
    </div>
  );
};

export default PurchaseOrderProductTable;
