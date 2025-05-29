import { FullInvoiceTableType } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { Download, Pencil, Trash2 } from "lucide-react";
import InvoiceProductsTable from "./InvoiceProductsTable";
import Invoice from "./Invoice";

const ExpandedRows = ({ rowData }: { rowData: FullInvoiceTableType }) => {
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
            <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer">
              <Pencil size={16} />
            </div>
            <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer">
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
    </div>
  );
};

export default ExpandedRows;
