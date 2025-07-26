"use client";

import { getAllInvoicesOfBranch } from "@/actions/invoiceActions";
import { useBranchStore } from "@/store/branchStore";
import { SerializedInvoiceType } from "@/types/serializedTypes";
import { useEffect, useMemo, useState } from "react";
import EmptyInvoices from "../empty/EmptyInvoices";
import TableLoading from "../loading/InventoryLoading";
import { columns } from "../tables/invoices/Column";
import FullInvoiceTable from "../tables/invoices/FullInvoiceTable";
import { Card, CardContent, CardHeader } from "../ui/card";
import InvoicesTableHeader from "./InvoicesTableHeader";

const InventoryTable = () => {
  const { selectedBranch } = useBranchStore();

  const [invoicesData, setInvoicesData] = useState<SerializedInvoiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchString, setSearchString] = useState<string>("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<string[]>([]);
  const [gstFilter, setGstFilter] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        setLoading(true);
        const response: {
          success: boolean;
          message: string;
          data?: SerializedInvoiceType[];
        } = await getAllInvoicesOfBranch(selectedBranch.id);

        setInvoicesData(response.data || []);
        setLoading(false);
      }
    })();
  }, [selectedBranch]);

  const filteredData = useMemo(() => {
    return invoicesData.filter((invoice) => {
      const matchesSearch = searchString
        ? invoice.customerName
            .toLowerCase()
            .includes(searchString.toLowerCase()) ||
          invoice.customerMobile.includes(searchString.toLowerCase()) ||
          invoice.invoiceNumber
            .toLowerCase()
            .includes(searchString.toLowerCase()) ||
          invoice.products.some((product) =>
            product.productSno
              .toLowerCase()
              .includes(searchString.toLowerCase())
          )
        : true;

      const matchesStatus =
        statusFilters.length > 0
          ? statusFilters.includes(invoice.status.trim().toLowerCase())
          : true;

      const matchesGstFilter =
        gstFilter.length > 0
          ? gstFilter.includes(invoice.isGstBill.toString().toLowerCase())
          : true;

      const matchesPaymentMode =
        paymentFilter.length > 0
          ? paymentFilter.includes(invoice.paymentMode.trim().toLowerCase())
          : true;

      return (
        matchesSearch && matchesStatus && matchesGstFilter && matchesPaymentMode
      );
    });
  }, [gstFilter, invoicesData, paymentFilter, searchString, statusFilters]);

  return (
    <Card className="shadow-lg">
      {loading ? (
        <CardContent>
          <TableLoading />
        </CardContent>
      ) : (
        <>
          <CardHeader className="-mb-4">
            {invoicesData.length > 0 && (
              <InvoicesTableHeader
                setSearchString={setSearchString}
                setStatusFilters={setStatusFilters}
                statusFilters={statusFilters}
                gstFilter={gstFilter}
                setGstFilter={setGstFilter}
                paymentFilter={paymentFilter}
                setPaymentFilter={setPaymentFilter}
              />
            )}
          </CardHeader>
          <CardContent>
            {invoicesData.length > 0 ? (
              <FullInvoiceTable columns={columns} data={filteredData} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <EmptyInvoices />
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default InventoryTable;
