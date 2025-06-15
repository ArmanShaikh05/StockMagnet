"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SerializedInvoiceType } from "@/types/serializedTypes";
import { Download, Pencil, Trash2 } from "lucide-react";
import Invoice from "./Invoice";
import InvoiceProductsTable from "./InvoiceProductsTable";
import { useState } from "react";
import DeleteInvoiceDialog from "@/components/invoices/DeleteInvoiceDialog";
import Link from "next/link";

const ExpandedRows = ({ rowData }: { rowData: SerializedInvoiceType }) => {
  const [showDeleteInvoiceDialog, setShowDeleteInvoiceDialog] =
    useState<boolean>(false);
  const [deletInvoiceId, setDeleteInvoiceId] = useState<string>("");

  const handleDeleteInvoice = () => {
    setDeleteInvoiceId(rowData.id);
    setShowDeleteInvoiceDialog(true);
  };
  return (
    <div>
      <Tabs defaultValue="product">
        <div className="w-full flex justify-between pb-4 border-b-2 items-center border-black/20 mb-4">
          <TabsList className="bg-main/30 gap-2">
            <TabsTrigger
              className="data-[state=active]:bg-main data-[state=active]:text-white cursor-pointer px-10"
              value="product"
            >
              Product
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-main data-[state=active]:text-white cursor-pointer px-10"
              value="invoice"
            >
              Invoice
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Link href={`/edit-invoice/${rowData.id}`}>
              <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer">
                <Pencil size={16} />
              </div>
            </Link>
            <div
              className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer"
              onClick={() => handleDeleteInvoice()}
            >
              <Trash2 size={16} />
            </div>
            <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer">
              <Download size={16} />
            </div>
          </div>
        </div>
        <TabsContent value="product">
          <InvoiceProductsTable data={rowData.products} />
        </TabsContent>
        <TabsContent value="invoice">
          <Invoice data={rowData} />
        </TabsContent>
      </Tabs>

      {showDeleteInvoiceDialog && (
        <DeleteInvoiceDialog
          open={showDeleteInvoiceDialog}
          setOpen={setShowDeleteInvoiceDialog}
          invoiceId={deletInvoiceId}
        />
      )}
    </div>
  );
};

export default ExpandedRows;
