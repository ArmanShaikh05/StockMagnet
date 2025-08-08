"use client";

import { getAllPurchaseOrderDataOfBranch } from "@/actions/purchaseOrderActions";
import { useBranchStore } from "@/store/branchStore";
import { SerializedPurchaseOrderDataType } from "@/types/serializedTypes";
import { formatToINRCurrency } from "@/utils/helper";
import { format } from "date-fns";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Button } from "../ui/button";

const ExportPurchaseOrderToCsv = () => {
  const { selectedBranch } = useBranchStore();
  const [hasInvoiceToExport, setHasInvoiceToExport] = useState<boolean>(false);
  const [purchaseOrderData, setPurchaseOrderData] = useState<
    SerializedPurchaseOrderDataType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        const response: {
          success: boolean;
          message: string;
          data?: SerializedPurchaseOrderDataType[];
        } = await getAllPurchaseOrderDataOfBranch(selectedBranch.id);

        if (response.data) {
          setPurchaseOrderData(response.data || []);

          setHasInvoiceToExport(response.data.length > 0);
        }
      }
    })();
  }, [selectedBranch]);

  const exportData = async () => {
    try {
      if (selectedBranch?.id) {
        setLoading(true);

        const exportData = purchaseOrderData.map(
          ({
            supplierInvoiceNumber,
            purchaseDate,
            supplier,
            totalItems,
            paymentStatus,
            paymentMode,
            creditedAmount,
            branch,
          }) => ({
            "Invoice No": supplierInvoiceNumber,
            Date: format(purchaseDate, "dd/MM/yyyy"),
            "Supplier Name": supplier.name,
            "Supplier Mobile": supplier.phone,
            "Supplier Address": supplier.address,
            "Total Itens": totalItems,
            Branch: branch.branchName,
            Status: paymentStatus,
            "Payment Mode": paymentMode,
            "Credited Amount": formatToINRCurrency(creditedAmount || 0),
          })
        );

        if (exportData) {
          if (exportData.length === 0) {
            toast.error("No purchase order data to export");
            return;
          }

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Purchases");

          XLSX.writeFile(workbook, "Purchase_Order_Data.xlsx");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return hasInvoiceToExport ? (
    <Button variant="outline" onClick={() => exportData()} disabled={loading}>
      {loading ? (
        <div className="flex w-full items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Exporting</span>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center gap-2">
          <FileSpreadsheet size={16} />
          <span className="hidden xs:block">Export CSV</span>
          <span className="xs:hidden">Export</span>
        </div>
      )}
    </Button>
  ) : null;
};

export default ExportPurchaseOrderToCsv;
