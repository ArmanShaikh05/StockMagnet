import { SerializedInvoiceType } from "@/types/serializedTypes";
import { formatToINRCurrency } from "@/utils/helper";
import InvoiceProductsTable from "./InvoiceProductsTable";

const Invoice = ({ data }: { data: SerializedInvoiceType }) => {
  return (
    <div className="px-24">
      <div className="flex w-full justify-between items-start pb-6 border-b border-black/50">
        <div className="flex gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-sm capitalize">Billing Details</h1>
            <div className="flex flex-col gap-1 text-xs">
              <p>{data.customerName}</p>
              <p>{data.customerAddress}</p>
              <p>{data.customerMobile}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-sm capitalize">Paymemt Details</h1>
            <div className="flex flex-col gap-1 text-xs">
              <p>Mode: {data.paymentMode}</p>
              <p>Amount: {formatToINRCurrency(Number(data.amountPaid))}</p>
              <p>
                Data: {new Date(data.invoiceDate).toISOString().split("T")[0]}
              </p>
              <p>Status: {data.status}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold">Invoice ID</span>
              <p>#{data.invoiceNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">Date</span>
              <p>{new Date(data.invoiceDate).toISOString().split("T")[0]}</p>
            </div>
          </div>

          {data.isGstBill && data.gstNumber && (
            <div className="flex items-center gap-2">
              <span className="font-bold">GST No.</span>
              <p>{data.gstNumber}</p>
            </div>
          )}
        </div>
      </div>
      <div className="py-6 border-b border-black/50">
        <InvoiceProductsTable data={data.products} />
      </div>
      <div className="flex flex-col items-end">
        <div className="grid grid-cols-2 w-55 pb-4 pt-8 border-b-2 border-black/40">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold">Subtotal</span>
            <span className="text-xs font-semibold">Total Tax </span>
            <span className="text-xs font-semibold">Discount</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-end">
              {formatToINRCurrency(Number(data.subTotal))}
            </span>

            <span className="text-xs font-semibold text-end">
              {formatToINRCurrency(Number(data.totalTaxAmount))}
            </span>

            <span className="text-xs font-semibold text-end">
              {formatToINRCurrency(Number(data.totalDiscount))}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 w-55 mt-2 ">
          <div className="w-full">
            <span className="text-sm font-bold">Grand Total</span>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm font-bold  text-end">
              {formatToINRCurrency(
                Number(data.subTotal) +
                  Number(data.totalTaxAmount) -
                  Number(data.totalDiscount)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
