"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { taxData } from "@/utils/data";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getProductsDataofBranch } from "@/actions/branchActions";
import { useBranchStore } from "@/store/branchStore";
import { SerializedProductType } from "@/types/serializedTypes";
import { InvoiceProductFormType, ProductFieldErrorsTypes } from "@/types/types";
import { calculateGST } from "@/utils/helper";

const HandleInvoiceProducts = ({
  productsArray,
  setProductsArray,
  porductsErrorStates,
}: {
  productsArray: InvoiceProductFormType[];
  setProductsArray: React.Dispatch<
    React.SetStateAction<InvoiceProductFormType[]>
  >;
  porductsErrorStates: ProductFieldErrorsTypes[];
}) => {
  const { selectedBranch } = useBranchStore();

  const [productsData, setProductsData] = useState<SerializedProductType[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedBranch) {
      (async () => {
        const productsData = await getProductsDataofBranch(selectedBranch.id);
        setProductsData(productsData.data || []);
      })();
    }
  }, [selectedBranch]);

  return (
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
                    ? productsData
                        .find((item) => item.id === product.productId)
                        ?.productName.slice(0, 15)
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
                      {productsData.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={(currentValue) => {
                            setProductsArray((prev) => {
                              const updated = [...prev];
                              const taxPercent =
                                item.taxRate?.split("@")[1].slice(0, -1) || "0";
                              const mrp = Number(item.MRP);

                              updated[index].productId = currentValue;
                              updated[index].productSno = item.productSno;
                              updated[index].taxRate = item.taxRate || "";
                              updated[index].taxIncludedWithMrp =
                                item.taxIncludedWithMrp;
                              updated[index].quantity = 1;
                              updated[index].totalStock = item.stockInHand;
                              updated[index].productMrp = mrp;
                              updated[index].Brand = item.Brand.brandName;
                              updated[index].Category =
                                item.category.categoryName;
                              updated[index].productImage = item.productImage;
                              updated[index].BrandColorCode =
                                item.Brand.colorCode;
                              updated[index].CategoryColorCode =
                                item.category.colorCode;
                              updated[index].productName = item.productName;
                              updated[index].units = item.unit.unitCode;
                              updated[index].purchasePrice = Number(
                                item.purchasePrice
                              );

                              updated[index].sellingPrice = mrp;

                              const { basePrice, gstAmount } = calculateGST(
                                updated[index].sellingPrice,
                                Number(taxPercent),
                                updated[index].taxIncludedWithMrp
                                  ? "inclusive"
                                  : "exclusive"
                              );

                              updated[index].rate = basePrice;

                              updated[index].discountAmount =
                                (updated[index].productMrp -
                                  updated[index].sellingPrice) *
                                updated[index].quantity;

                              updated[index].taxAmount =
                                gstAmount * updated[index].quantity;

                              updated[index].subTotal =
                                updated[index].rate * updated[index].quantity;

                              updated[index].profitGain =
                                (updated[index].sellingPrice -
                                  updated[index].purchasePrice) *
                                updated[index].quantity;

                              return updated;
                            });
                            setOpenIndex(null);
                          }}
                        >
                          <div className="text-xs sm:text-sm flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={item.productImage} />
                              <AvatarFallback>
                                {item.productName
                                  .split(" ")
                                  .map((word) => word[0]?.toUpperCase())
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {item.productName}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto",
                              product.productId === item.id
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
            {porductsErrorStates[index]?.productId && (
              <p className="text-xs text-red-500 mt-2">
                {porductsErrorStates[index]?.productId}
              </p>
            )}
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
              value={product.quantity}
              min={0}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setProductsArray((prev) => {
                  const updated = [...prev];
                  const taxPercent = updated[index].taxRate
                    ?.split("@")[1]
                    .slice(0, -1);

                  updated[index].quantity = value;
                  updated[index].discountAmount =
                    (updated[index].productMrp - updated[index].sellingPrice) *
                    updated[index].quantity;

                  const { gstAmount } = calculateGST(
                    updated[index].sellingPrice,
                    Number(taxPercent),
                    updated[index].taxIncludedWithMrp
                      ? "inclusive"
                      : "exclusive"
                  );

             
                  updated[index].taxAmount =
                    gstAmount * updated[index].quantity;

                  updated[index].subTotal =
                    updated[index].rate * updated[index].quantity;

                  updated[index].profitGain =
                    (updated[index].sellingPrice - updated[index].purchasePrice) *
                    updated[index].quantity;
                  return updated;
                });
              }}
            />
            {porductsErrorStates[index]?.quantity && (
              <p className="text-xs text-red-500 mt-2">
                {porductsErrorStates[index]?.quantity}
              </p>
            )}
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
                setProductsArray((prev) => {
                  const updated = [...prev];

                  updated[index].sellingPrice = Number(e.target.value);
                  const taxPercent =
                    updated[index].taxRate?.split("@")[1].slice(0, -1) || "0";

                  const { basePrice, gstAmount } = calculateGST(
                    updated[index].sellingPrice,
                    Number(taxPercent),
                    updated[index].taxIncludedWithMrp
                      ? "inclusive"
                      : "exclusive"
                  );

                  updated[index].rate = basePrice;

                  updated[index].discountAmount =
                    (updated[index].productMrp - updated[index].sellingPrice) *
                    updated[index].quantity;

                  updated[index].taxAmount =
                    gstAmount * updated[index].quantity;

                  updated[index].subTotal =
                    updated[index].rate * updated[index].quantity;

                  updated[index].profitGain =
                    (updated[index].sellingPrice - updated[index].purchasePrice) *
                    updated[index].quantity;

                  return updated;
                });
              }}
            />

            {porductsErrorStates[index]?.sellingPrice && (
              <p className="text-xs text-red-500 mt-2">
                {porductsErrorStates[index]?.sellingPrice}
              </p>
            )}
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
            {porductsErrorStates[index]?.productSno && (
              <p className="text-xs text-red-500 mt-2">
                {porductsErrorStates[index]?.productSno}
              </p>
            )}
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
                  const taxPercent = value.split("@")[1].slice(0, -1) || "0";

                  updated[index].taxRate = value;

                  const { basePrice, gstAmount } = calculateGST(
                    updated[index].sellingPrice,
                    Number(taxPercent),
                    updated[index].taxIncludedWithMrp
                      ? "inclusive"
                      : "exclusive"
                  );

                  updated[index].rate = basePrice;

                  updated[index].discountAmount =
                    (updated[index].productMrp - updated[index].sellingPrice) *
                    updated[index].quantity;

                  updated[index].taxAmount =
                    gstAmount * updated[index].quantity;

                  updated[index].subTotal =
                    updated[index].rate * updated[index].quantity;

                  updated[index].profitGain =
                    (updated[index].sellingPrice - updated[index].purchasePrice) *
                    updated[index].quantity;

                  return updated;
                })
              }
            >
              <SelectTrigger className="w-full bg-white text-xs" id="taxRate">
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
              value={product.taxIncludedWithMrp ? "included" : "excluded"}
              onValueChange={(value) => {
                const isIncluded = value === "included" ? true : false;
                setProductsArray((prev) => {
                  const updated = [...prev];
                  const taxPercent =
                    updated[index].taxRate?.split("@")[1].slice(0, -1) || "0";

                  updated[index].taxIncludedWithMrp = isIncluded;

                  const { basePrice, gstAmount } = calculateGST(
                    updated[index].sellingPrice,
                    Number(taxPercent),
                    updated[index].taxIncludedWithMrp
                      ? "inclusive"
                      : "exclusive"
                  );

                  updated[index].rate = basePrice;

                  updated[index].discountAmount =
                    (updated[index].productMrp - updated[index].sellingPrice) *
                    updated[index].quantity;

                  updated[index].taxAmount =
                    gstAmount * updated[index].quantity;

                  updated[index].subTotal =
                    updated[index].rate * updated[index].quantity;

                  updated[index].profitGain =
                    (updated[index].sellingPrice - updated[index].purchasePrice) *
                    updated[index].quantity;

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
  );
};

export default HandleInvoiceProducts;
