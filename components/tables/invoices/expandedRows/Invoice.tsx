import { FullInvoiceTableType } from "@/types/types";
import React from "react";
import InvoiceProductsTable from "./InvoiceProductsTable";
import { formatToINRCurrency } from "@/utils/helper";

const Invoice = ({ data }: { data: FullInvoiceTableType }) => {
  return (
    <div className="px-24">
      <div className="flex w-full justify-between items-start pb-6 border-b border-black/50">
        <div className="flex gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-sm capitalize">Billing Details</h1>
            <div className="flex flex-col gap-1 text-xs">
              <p>{data.customer.name}</p>
              <p>{data.customer.address}</p>
              <p>{data.customer.mobile}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-sm capitalize">Paymemt Details</h1>
            <div className="flex flex-col gap-1 text-xs">
              <p>Mode: {data.payment}</p>
              <p>Amount: {formatToINRCurrency(data.amount)}</p>
              <p>Data: {data.date}</p>
              <p>Status: {data.status}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold">Invoice ID</span>
            <p>#{data.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Date</span>
            <p>{data.date}</p>
          </div>
        </div>
      </div>
      <div className="py-6 border-b border-black/50">
        <InvoiceProductsTable data={data.products} />
      </div>
      <div className="flex flex-col items-end">
        <div className="grid grid-cols-2 w-55 pb-4 pt-8 border-b-2 border-black/40">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold">Subtotal</span>
            <span className="text-xs font-semibold">Discount</span>
            <span className="text-xs font-semibold">Old Battery</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-end">
              {formatToINRCurrency(data.amount)}
            </span>
            <span className="text-xs font-semibold text-end">
              {formatToINRCurrency(data?.discount || 0)}
            </span>
            <span className="text-xs font-semibold text-end">
              {formatToINRCurrency(140)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 w-55 mt-2 ">
          <div className="w-full">
            <span className="text-sm font-bold">Grand Total</span>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm font-bold  text-end">
              {formatToINRCurrency(45000)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
