"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Pagination } from "../Pagination";
import DeleteAllProductRows from "@/components/inventory/DeleteAllProductRows";
import { SerializedProductType } from "@/types/serializedTypes";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchString?: string;
  showPagination?: boolean;
}

const ProductsTable = <TData extends SerializedProductType, TValue>({
  columns,
  data,
  showPagination = true,
}: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showDeleteAllDialog, setShowDeleteAllDialog] =
    useState<boolean>(false);
  const [selectedRowsId, setSelectedRowsId] = useState<string[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      rowSelection,
      sorting,
    },
  });

  return (
    <div>
      <div className="w-full  mb-2 flex items-center">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex justify-between w-full items-end">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <Button
              variant={"destructive"}
              className="hover:bg-red-500 "
              onClick={() => {
                setSelectedRowsId(
                  table.getFilteredSelectedRowModel().rows.map((row) => {
                    return row.original.id;
                  })
                );
                setShowDeleteAllDialog(true);
              }}
            >
              <Trash2 size={16} />
              <span className="hidden md:block">Delete Selected</span>
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="data-[state=selected]:bg-main/10"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="w-full flex justify-end items-center mt-2">
          <Pagination table={table} />
        </div>
      )}

      {showDeleteAllDialog && (
        <DeleteAllProductRows
          open={showDeleteAllDialog}
          setOpen={setShowDeleteAllDialog}
          selectedRowsId={selectedRowsId}
        />
      )}
    </div>
  );
};

export default ProductsTable;
