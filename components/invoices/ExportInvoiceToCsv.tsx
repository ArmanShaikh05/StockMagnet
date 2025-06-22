"use client";

import { getInvoicesDataofBranch } from "@/actions/invoiceActions";
import { useBranchStore } from "@/store/branchStore";
import { SerializedInvoiceType } from "@/types/serializedTypes";
import { format } from "date-fns";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Button } from "../ui/button";
import { formatToINRCurrency } from "@/utils/helper";

const ExportInvoiceToCsv = () => {
  const { selectedBranch } = useBranchStore();
  const [hasInvoiceToExport, setHasInvoiceToExport] = useState<boolean>(false);
  const [invoiceData, setInvoicedata] = useState<SerializedInvoiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        const response = await getInvoicesDataofBranch(selectedBranch.id);
        if (response.data) {
          setInvoicedata(response.data);

          setHasInvoiceToExport(response.data.length > 0);
        }
      }
    })();
  }, [selectedBranch]);

  const exportData = async () => {
    try {
      if (selectedBranch?.id) {
        setLoading(true);

        const exportData = invoiceData.map(
          ({
            invoiceNumber,
            invoiceDate,
            customerName,
            customerMobile,
            customerAddress,
            totalQuantity,
            subTotal,
            totalDiscount,
            totalTaxAmount,
            grandTotal,
            isGstBill,
            status,
            paymentMode,
            amountPaid,
            creditedAmount,
            profitGain,
          }) => ({
            "Invoice No": invoiceNumber,
            Date: format(invoiceDate, "dd/MM/yyyy"),
            "Customer Name": customerName,
            "Customer Mobile": customerMobile,
            "Customer Address": customerAddress,
            Quantity: totalQuantity,
            "Sub Total": formatToINRCurrency(parseFloat(subTotal)),
            "Tax Amount)": formatToINRCurrency(parseFloat(totalTaxAmount)),
            "Grand Total": formatToINRCurrency(parseFloat(grandTotal)),
            Discount: formatToINRCurrency(parseFloat(totalDiscount)),
            "GST Bill": isGstBill,
            Status: status,
            "Payment Mode": paymentMode,
            "Amount Paid": amountPaid,
            "Credited Amount": formatToINRCurrency(parseFloat(creditedAmount)),
            Profit: formatToINRCurrency(parseFloat(profitGain)),
          })
        );

        if (exportData) {
          if (exportData.length === 0) {
            toast.error("No invoice data to export");
            return;
          }

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

          XLSX.writeFile(workbook, "Invoices_Data.xlsx");
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

export default ExportInvoiceToCsv;
