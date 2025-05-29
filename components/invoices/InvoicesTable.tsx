/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { mockInvoices } from "@/utils/data";
import { useMemo, useState } from "react";
import { columns } from "../tables/invoices/Column";
import FullInvoiceTable from "../tables/invoices/FullInvoiceTable";
import { Card, CardContent, CardHeader } from "../ui/card";
import InvoicesTableHeader from "./InvoicesTableHeader";

const InventoryTable = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<string[]>([]);
  const [gstFilter, setGstFilter] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return mockInvoices.filter((invoice) => {
      const matchesSearch = searchString
        ? invoice.customer.name
            .toLowerCase()
            .includes(searchString.toLowerCase()) ||
          invoice.customer.mobile.includes(searchString.toLowerCase())
        : true;

      const matchesStatus =
        statusFilters.length > 0
          ? statusFilters.includes(invoice.status.trim().toLowerCase())
          : true;

      const matchesGstFilter =
        gstFilter.length > 0
          ? gstFilter.includes(invoice.gstBill.toString().toLowerCase())
          : true;

      const matchesPaymentMode =
        paymentFilter.length > 0
          ? paymentFilter.includes(invoice.payment.trim().toLowerCase())
          : true;

      return (
        matchesSearch && matchesStatus && matchesGstFilter && matchesPaymentMode
      );
    });
  }, [gstFilter, paymentFilter, searchString, statusFilters]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="-mb-4">
        <InvoicesTableHeader
          setSearchString={setSearchString}
          setStatusFilters={setStatusFilters}
          statusFilters={statusFilters}
          gstFilter={gstFilter}
          setGstFilter={setGstFilter}
          paymentFilter={paymentFilter}
          setPaymentFilter={setPaymentFilter}
        />
      </CardHeader>
      <CardContent>
        <FullInvoiceTable columns={columns} data={filteredData} />
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
