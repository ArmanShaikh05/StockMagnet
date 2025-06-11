"use client";

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
import {
  Calendar1Icon,
  Check,
  ChevronsUpDown,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taxData } from "@/utils/data";
import { cn } from "@/lib/utils";
import Link from "next/link";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

type InvoiceProduct = {
  productId: string;
  productQty: number;
  sellingPrice: number;
  productSno: string;
  taxRate: string;
  taxInclusion: boolean;
};

const CreateInvoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDateDialogOpen, setInvoiceDateDialogOpen] =
    useState<boolean>(false);
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(undefined);

  const [isGstInvoice, setIsGstInvoice] = useState<boolean>(false);
  const [gstNumber, setGstNumber] = useState<string>("");

  const [customerName, setCustomerName] = useState<string>("");
  const [customerMobile, setCustomerMobile] = useState<string>("");

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [paymentMode, setPaymentMode] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  const [creditedAmount, setCreditedAmount] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [productsArray, setProductsArray] = useState<InvoiceProduct[]>([
    {
      productId: "",
      productQty: 0,
      sellingPrice: 0,
      productSno: "",
      taxRate: "",
      taxInclusion: false,
    },
  ]);

  const createInvoice = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col sm:px-8 gap-8 mt-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 ">
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-sm font-bold capitalize text-balance">
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
                      ? invoiceDate.toLocaleDateString()
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
                    onSelect={(date) => {
                      setInvoiceDate(date);
                      setInvoiceDateDialogOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
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
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <h2 className="text-sm font-bold capitalize text-balance">
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
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h2 className="text-sm font-bold capitalize text-balance">
          Product Details
        </h2>

        <div className="w-full flex flex-col gap-4 mt-4">
          {productsArray.map((product, index) => (
            <div
              key={index}
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8 bg-gray-200/50 rounded-xl relative"
            >
              <div className="w-full flex flex-col gap-2 px-2 ">
                <Label htmlFor="product" className="text-xs">
                  Product
                </Label>
                <Popover
                  open={openIndex === index}
                  onOpenChange={(isOpen) => setOpenIndex(isOpen ? index : null)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      id="product"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openIndex === index}
                      className="w-full justify-between text-xs"
                    >
                      {product.productId
                        ? frameworks.find(
                            (framework) => framework.value === product.productId
                          )?.label
                        : "Select Product"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search product..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((item) => (
                            <CommandItem
                              key={item.value}
                              value={item.value}
                              onSelect={(currentValue) => {
                                setProductsArray((prev) => {
                                  const updated = [...prev];
                                  updated[index].productId = currentValue;
                                  return updated;
                                });
                                setOpenIndex(null);
                              }}
                            >
                              <div className="text-xs sm:text-sm flex items-center gap-2">
                                <Avatar>
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                {item.label}
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto",
                                  product.productId === item.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-full flex flex-col gap-2 px-2 ">
                <Label htmlFor="productQty" className="text-xs">
                  Product Quantity
                </Label>
                <Input
                  type="number"
                  id="productQty"
                  placeholder="Product Quantity"
                  className="text-xs bg-white"
                  value={product.productQty}
                  min={0}
                  onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    setProductsArray((prev) => {
                      const updated = [...prev];
                      updated[index].productQty = value;
                      return updated;
                    });
                  }}
                />
              </div>

              <div className="w-full flex flex-col gap-2 px-2 ">
                <Label htmlFor="sellingPrice" className="text-xs">
                  Selling Price
                </Label>
                <Input
                  type="number"
                  id="sellingPrice"
                  placeholder="Selling Price"
                  className="text-xs bg-white"
                  value={product.sellingPrice}
                  min={0}
                  onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    setProductsArray((prev) => {
                      const updated = [...prev];
                      updated[index].sellingPrice = value;
                      return updated;
                    });
                  }}
                />
              </div>

              <div className="w-full flex flex-col gap-2 px-2 ">
                <Label htmlFor="productSno" className="text-xs">
                  Product S.no
                </Label>
                <Input
                  type="text"
                  id="productSno"
                  placeholder="Product S.no"
                  className="text-xs bg-white"
                  value={product.productSno}
                  onChange={(e) => {
                    setProductsArray((prev) => {
                      const updated = [...prev];
                      updated[index].productSno = e.target.value;
                      return updated;
                    });
                  }}
                />
              </div>

              <div className="w-full flex flex-col gap-2 px-2 ">
                <Label htmlFor="taxRate" className="text-xs">
                  Tax Rate
                </Label>
                <Select
                  value={product.taxRate}
                  onValueChange={(value) =>
                    setProductsArray((prev) => {
                      const updated = [...prev];
                      updated[index].taxRate = value;
                      return updated;
                    })
                  }
                >
                  <SelectTrigger
                    className="w-full bg-white text-xs"
                    id="taxRate"
                  >
                    <SelectValue placeholder="Tax rate" />
                  </SelectTrigger>
                  <SelectContent className="h-62">
                    {taxData.map((tax, index) => (
                      <SelectItem key={index} value={tax.label}>
                        {tax.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full flex flex-col gap-2 px-2 ">
                <Label htmlFor="taxInclusion" className="text-xs">
                  Tax Inclusion
                </Label>
                <Select
                  value={product.taxInclusion ? "included" : "excluded"}
                  onValueChange={(value) => {
                    const isIncluded = value === "included" ? true : false;
                    setProductsArray((prev) => {
                      const updated = [...prev];
                      updated[index].taxInclusion = isIncluded;
                      return updated;
                    });
                  }}
                >
                  <SelectTrigger
                    id="taxInclusion"
                    className="w-full bg-white text-xs"
                  >
                    <SelectValue placeholder="Tax Inclusion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exempted" className="">
                      Exempted
                    </SelectItem>
                    <SelectItem value="included" className="">
                      Included in MRP
                    </SelectItem>
                    <SelectItem value="excluded" className="">
                      Excluded from MRP
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {productsArray.length > 1 && (
                <Trash2
                  size={14}
                  className="cursor-pointer absolute top-2 right-2 h-8 w-8 p-2 rounded-full hover:bg-white/40 transition duration-200"
                  onClick={() =>
                    setProductsArray((prev) =>
                      prev.filter((_, idx) => idx !== index)
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>

        <Button
          className="flex items-center gap-2 w-max mx-auto mt-6"
          variant={"secondary"}
          onClick={() =>
            setProductsArray((prev) => [
              ...prev,
              {
                productId: "",
                productQty: 0,
                sellingPrice: 0,
                productSno: "",
                taxRate: "",
                taxInclusion: false,
              },
            ])
          }
        >
          <Plus size={14} />
          <span className="text-xs md:text-sm">Add more product</span>
        </Button>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h2 className="text-sm font-bold capitalize text-balance">
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
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-end gap-4 mt-6">
        <Button disabled={loading} onClick={(e) => createInvoice(e)}>
          {loading ? (
            <div className="flex w-full items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Creating Product</span>
            </div>
          ) : (
            "Create Invoice"
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

export default CreateInvoice;
