"use client";

import { SerializedInvoiceType } from "@/types/serializedTypes";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar1Icon, Loader2, Plus } from "lucide-react";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { editInvoiceData } from "@/actions/invoiceActions";
import {
  InvoiceDataType,
  InvoiceProductFormType,
  ProductFieldErrorsTypes,
} from "@/types/types";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import HandleInvoiceProducts from "./HandleInvoiceProducts";

type ErrorStates = {
  invoiceNoError: string;
  invoiceDateError: string;
  gstNumberError: string;
  customerNameError: string;
  customerMobileError: string;
  customerAddressError: string;
  paymentModeError: string;
  paymentStatusError: string;
  creditedAmountError: string;
};
const EditInvoices = ({
  invoiceData,
  additionalProductData,
}: {
  invoiceData: SerializedInvoiceType;
  additionalProductData: {
    stockInHand: number;
    purchasePrice: number;
  }[];
}) => {
  const router = useRouter();

  const [invoiceNumber, setInvoiceNumber] = useState<string>(
    invoiceData.invoiceNumber
  );
  const [invoiceDateDialogOpen, setInvoiceDateDialogOpen] =
    useState<boolean>(false);
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(
    invoiceData.invoiceDate
  );
  const [isGstInvoice, setIsGstInvoice] = useState<boolean>(
    invoiceData.isGstBill
  );
  const [gstNumber, setGstNumber] = useState<string>(
    invoiceData.gstNumber || ""
  );
  const [customerName, setCustomerName] = useState<string>(
    invoiceData.customerName
  );
  const [customerMobile, setCustomerMobile] = useState<string>(
    invoiceData.customerMobile
  );
  const [customerAddress, setCustomerAddress] = useState<string>(
    invoiceData.customerAddress
  );
  const [paymentMode, setPaymentMode] = useState<string>(
    invoiceData.paymentMode
  );
  const [paymentStatus, setPaymentStatus] = useState<string>(
    invoiceData.status
  );
  const [creditedAmount, setCreditedAmount] = useState<number>(
    parseFloat(invoiceData.creditedAmount) || 0
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [productsArray, setProductsArray] = useState<InvoiceProductFormType[]>(
    invoiceData.products.map((product, index) => {
      return {
        ...product,
        productMrp: parseFloat(product.productMrp),
        sellingPrice: parseFloat(product.sellingPrice),
        taxAmount: parseFloat(product.taxAmount || "0"),
        subTotal: parseFloat(product.subTotal),
        discountAmount: parseFloat(product.discountAmount || "0"),
        rate: parseFloat(product.rate),
        profitGain: parseFloat(product.profitGain),
        quantity: Number(product.quantity),
        purchasePrice: additionalProductData[index]?.purchasePrice || 0,
        totalStock: additionalProductData[index]?.stockInHand || 0,
      };
    })
  );

  const [errorStates, setErrorStates] = useState<ErrorStates>({
    invoiceNoError: "",
    invoiceDateError: "",
    gstNumberError: "",
    customerNameError: "",
    customerMobileError: "",
    customerAddressError: "",
    paymentModeError: "",
    paymentStatusError: "",
    creditedAmountError: "",
  });

  const [productErrors, setProductErrors] = useState<ProductFieldErrorsTypes[]>(
    [
      {
        productId: "",
        quantity: "",
        sellingPrice: "",
        productSno: "",
      },
    ]
  );

  const handleEditInvoice = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setLoading(true);

      // Clear existing errors first
      const newErrorStates = {
        invoiceNoError: "",
        invoiceDateError: "",
        gstNumberError: "",
        customerNameError: "",
        customerMobileError: "",
        customerAddressError: "",
        paymentModeError: "",
        paymentStatusError: "",
        creditedAmountError: "",
      };

      let hasFormError = false;

      // Validate each field
      if (!invoiceNumber) {
        newErrorStates.invoiceNoError = "Please enter invoice number";
        toast.error("Please enter invoice number");
        hasFormError = true;
      }

      if (!invoiceDate) {
        newErrorStates.invoiceDateError = "Please enter invoice date";
        toast.error("Please enter invoice date");
        hasFormError = true;
      }

      if (isGstInvoice && !gstNumber) {
        newErrorStates.gstNumberError = "Please enter GST number";
        toast.error("Please enter GST number");
        hasFormError = true;
      }

      if (!customerName) {
        newErrorStates.customerNameError = "Please enter customer name";
        toast.error("Please enter customer name");
        hasFormError = true;
      }

      if (!customerMobile) {
        newErrorStates.customerMobileError = "Please enter customer mobile";
        toast.error("Please enter customer mobile");
        hasFormError = true;
      }

      if (!customerAddress) {
        newErrorStates.customerAddressError = "Please enter customer address";
        toast.error("Please enter customer address");
        hasFormError = true;
      }

      if (!paymentMode) {
        newErrorStates.paymentModeError = "Please select payment mode";
        toast.error("Please select payment mode");
        hasFormError = true;
      }

      if (!paymentStatus) {
        newErrorStates.paymentStatusError = "Please select payment status";
        toast.error("Please select payment status");
        hasFormError = true;
      }

      if (paymentStatus === "Credited" && creditedAmount === 0) {
        newErrorStates.creditedAmountError = "Please enter credited amount";
        toast.error("Please enter credited amount");
        hasFormError = true;
      }

      // Apply all general form errors at once
      setErrorStates(newErrorStates);

      // If form errors exist, stop
      if (hasFormError) return;

      // Validate product fields
      const newProductErrors: ProductFieldErrorsTypes[] = [];

      productsArray.forEach((product, index) => {
        const error: ProductFieldErrorsTypes = {};

        if (!product.productId) error.productId = "Product is required";
        if (!product.quantity || product.quantity <= 0)
          error.quantity = "Quantity must be greater than 0";
        if (product.quantity > product.totalStock)
          error.quantity = `Quantity is greater than available stock.(${product.totalStock} stock available)`;
        if (!product.sellingPrice || Number(product.sellingPrice) <= 0)
          error.sellingPrice = "Selling price must be greater than 0";
        if (!product.productSno) error.productSno = "Product S.no is required";

        newProductErrors[index] = error;
      });

      setProductErrors(newProductErrors);

      const hasProductErrors = newProductErrors.some(
        (err) => Object.keys(err).length > 0
      );
      if (hasProductErrors) {
        toast.error("Please fill product details properly.");
        return;
      }

      // ✅ If no errors, continue to create invoice

      const subTotal = productsArray.reduce((acc, curr) => {
        return acc + curr.subTotal;
      }, 0);

      const totalTaxAmount = productsArray.reduce((acc, curr) => {
        return acc + curr.taxAmount;
      }, 0);

      const totalDiscount = productsArray.reduce((acc, curr) => {
        return acc + curr.discountAmount;
      }, 0);

      const totalQuantity = productsArray.reduce((acc, curr) => {
        return acc + curr.quantity;
      }, 0);

      const totalProfitGain = productsArray.reduce((acc, curr) => {
        return acc + curr.profitGain;
      }, 0);

      const dataToSend: InvoiceDataType = {
        invoiceNumber,
        invoiceDate: invoiceDate!,
        customerName,
        customerMobile,
        customerAddress,
        subTotal,
        totalTaxAmount,
        totalDiscount,
        grandTotal: subTotal + totalTaxAmount,
        isGstBill: isGstInvoice,
        gstNumber: gstNumber,
        status: paymentStatus,
        paymentMode: paymentMode,
        totalQuantity,
        amountPaid:
          paymentStatus === "NotPaid"
            ? 0
            : subTotal + totalTaxAmount - creditedAmount,
        creditedAmount: creditedAmount,
        profitGain: totalProfitGain,

        branchId: invoiceData.branchId,
        products: productsArray,
      };

      const response: { success: boolean; message: string } =
        await editInvoiceData(dataToSend, invoiceData.id);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        router.push("/invoices");
      }

      if (!response.success) {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col sm:px-8 gap-8 mt-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 ">
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-sm font-bold capitalize text-balance text-main">
            Invoice Details
          </h2>

          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-2 px-2 mt-4">
              <Label htmlFor="invoiceNo" className="text-xs">
                Invoice No
              </Label>
              <Input
                type="text"
                id="invoiceNo"
                placeholder="Invoice No"
                className="text-xs"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
              {errorStates.invoiceNoError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorStates.invoiceNoError}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2 px-2 ">
              <Label htmlFor="invoiceDate" className="px-1 text-xs">
                Invoice Date
              </Label>
              <Popover
                open={invoiceDateDialogOpen}
                onOpenChange={setInvoiceDateDialogOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="invoiceDate"
                    className="w-full text-xs justify-between font-normal"
                  >
                    {invoiceDate
                      ? format(invoiceDate, "dd/MM/yyyy")
                      : "Select date"}
                    <Calendar1Icon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={invoiceDate}
                    captionLayout="dropdown"
                    disabled={(date) => date > new Date()}
                    onSelect={(date) => {
                      setInvoiceDate(date);
                      setInvoiceDateDialogOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errorStates.invoiceDateError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorStates.invoiceDateError}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2 px-2 ">
              <div className="flex items-center gap-2">
                <Label htmlFor="gstInvoice" className="text-xs">
                  Gst Invoice
                </Label>
                <Switch
                  id="gstInvoice-toggle"
                  checked={isGstInvoice}
                  onCheckedChange={setIsGstInvoice}
                />
              </div>
              <Input
                type="text"
                id="gstInvoice"
                placeholder="Customer GST Number"
                disabled={!isGstInvoice}
                className="text-xs"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
              />
              {errorStates.gstNumberError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorStates.gstNumberError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <h2 className="text-sm font-bold capitalize text-balance text-main">
            Customer Details
          </h2>

          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-6 lg:gap-2 lg:flex-row lg:items-center lg:mt-4">
              <div className="w-full flex flex-col gap-2 px-2 mt-4 lg:mt-0">
                <Label htmlFor="customerName" className="text-xs">
                  Customer Name
                </Label>
                <Input
                  type="text"
                  id="customerName"
                  placeholder="Customer Name"
                  className="text-xs"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                {errorStates.customerNameError && (
                  <p className="text-xs text-red-500 mt-2">
                    {errorStates.customerNameError}
                  </p>
                )}
              </div>

              <div className="w-full flex flex-col gap-2 px-2 ">
                <Label htmlFor="customerMobile" className="text-xs">
                  Customer Mobile
                </Label>
                <Input
                  type="text"
                  id="customerMobile"
                  placeholder="Customer Mobile"
                  className="text-xs"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                />
                {errorStates.customerMobileError && (
                  <p className="text-xs text-red-500 mt-2">
                    {errorStates.customerMobileError}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 px-2 ">
              <Label htmlFor="customerAddress" className="text-xs">
                Customer Address
              </Label>
              <Textarea
                id="customerAddress"
                placeholder="Customer Address"
                className="text-xs resize-none h-24 lg:h-30"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
              {errorStates.customerAddressError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorStates.customerAddressError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h2 className="text-sm font-bold capitalize text-balance text-main">
          Product Details
        </h2>

        <HandleInvoiceProducts
          productsArray={productsArray}
          setProductsArray={setProductsArray}
          porductsErrorStates={productErrors}
        />

        <Button
          className="flex items-center gap-2 w-max mx-auto mt-6"
          variant={"secondary"}
          onClick={() => {
            setProductsArray((prev) => [
              ...prev,
              {
                productId: "",
                quantity: 0,
                sellingPrice: 0,
                productSno: "",
                taxRate: "",
                taxIncludedWithMrp: false,
                productName: "",
                productMrp: 0,
                subTotal: 0,
                taxAmount: 0,
                discountAmount: 0,
                units: "",
                rate: 0,
                profitGain: 0,
                purchasePrice: 0,
                totalStock: 0,
                Brand: "",
                Category: "",
                productImage: "",
                BrandColorCode: "",
                CategoryColorCode: "",
              },
            ]);
            setProductErrors((prev) => [
              ...prev,
              {
                productId: "",
                quantity: "",
                sellingPrice: "",
                productSno: "",
              },
            ]);
          }}
        >
          <Plus size={14} />
          <span className="text-xs md:text-sm">Add more product</span>
        </Button>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h2 className="text-sm font-bold capitalize text-balance text-main">
          Payment Details
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-4">
          <div className="w-full flex flex-col gap-2 px-2 mt-4 md:mt-0">
            <Label htmlFor="paymentMode" className="text-xs">
              Payment Mode
            </Label>
            <Select value={paymentMode} onValueChange={setPaymentMode}>
              <SelectTrigger
                id="paymentMode"
                className="w-full bg-white text-xs"
              >
                <SelectValue placeholder="Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPI" className="">
                  UPI
                </SelectItem>
                <SelectItem value="Cash" className="">
                  Cash
                </SelectItem>
                <SelectItem value="Bank" className="">
                  Bank
                </SelectItem>
              </SelectContent>
            </Select>
            {errorStates.paymentModeError && (
              <p className="text-xs text-red-500 mt-2">
                {errorStates.paymentModeError}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 ">
            <Label htmlFor="paymentStatus" className="px-1 text-xs">
              Payment Status
            </Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger
                id="paymentStatus"
                className="w-full bg-white text-xs"
              >
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FullPaid" className="">
                  FullPaid
                </SelectItem>
                <SelectItem value="Credited" className="">
                  Credited
                </SelectItem>
                <SelectItem value="NotPaid" className="">
                  NotPaid
                </SelectItem>
              </SelectContent>
            </Select>
            {errorStates.paymentStatusError && (
              <p className="text-xs text-red-500 mt-2">
                {errorStates.paymentStatusError}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 ">
            <Label htmlFor="creditedAmount" className="text-xs">
              Credited Amount
            </Label>

            <Input
              type="number"
              id="creditedAmount"
              placeholder="Credited Amount"
              min={0}
              disabled={paymentStatus !== "Credited"}
              className="text-xs"
              value={creditedAmount}
              onChange={(e) => setCreditedAmount(Number(e.target.value))}
            />
            {errorStates.creditedAmountError && (
              <p className="text-xs text-red-500 mt-2">
                {errorStates.creditedAmountError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-end gap-4 mt-6">
        <Button disabled={loading} onClick={(e) => handleEditInvoice(e)}>
          {loading ? (
            <div className="flex w-full items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Editing Invoice</span>
            </div>
          ) : (
            "Edit Invoice"
          )}
        </Button>
        <Link href={"/dashboard"}>
          <Button disabled={loading} variant={"secondary"} className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EditInvoices;
