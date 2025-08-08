"use client";

import DeletePurchaseOrderDialog from "@/components/purchaseOrders/DeletePurchaseOrderDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SerializedPurchaseOrderDataType } from "@/types/serializedTypes";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PurchaseOrderProductTable from "./PurchaseOrderProductTable";

const ExpandedRows = ({
  rowData,
}: {
  rowData: SerializedPurchaseOrderDataType;
}) => {
  const [showDeleteInvoiceDialog, setShowDeleteInvoiceDialog] =
    useState<boolean>(false);
  const [deletInvoiceId, setDeleteInvoiceId] = useState<string>("");

  const handleDeleteInvoice = () => {
    setDeleteInvoiceId(rowData.id);
    setShowDeleteInvoiceDialog(true);
  };

  return (
    <div>
      <div className="w-full flex justify-between pb-4 border-b-2 items-center border-black/20 mb-4">
        <div className="flex w-full items-center gap-2 justify-end">
          <div
            className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer"
            onClick={() => handleDeleteInvoice()}
          >
            <Trash2 size={16} />
          </div>
          {rowData.invoiceImageUrl && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer">
                  <Eye size={16} />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-max">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="w-full flex items-center justify-center">
                  <Image
                    src={rowData.invoiceImageUrl}
                    alt="invoice"
                    height={500}
                    width={600}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <PurchaseOrderProductTable data={rowData.products} />

      {showDeleteInvoiceDialog && (
        <DeletePurchaseOrderDialog
          open={showDeleteInvoiceDialog}
          setOpen={setShowDeleteInvoiceDialog}
          invoiceId={deletInvoiceId}
        />
      )}
    </div>
  );
};

export default ExpandedRows;
