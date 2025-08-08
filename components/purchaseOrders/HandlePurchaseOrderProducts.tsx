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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { getProductsDataofBranch } from "@/actions/branchActions";
import { SerializedProductType } from "@/types/serializedTypes";
import {
  PurchaseOrderProductsErrorsTypes,
  PurchaseOrderProductsType,
} from "@/types/types";
import { useEffect, useState } from "react";

const HandlePurchaseOrderProducts = ({
  productsArray,
  setProductsArray,
  porductsErrorStates,
  selectedBranchId,
}: {
  productsArray: PurchaseOrderProductsType[];
  setProductsArray: React.Dispatch<
    React.SetStateAction<PurchaseOrderProductsType[]>
  >;
  porductsErrorStates: PurchaseOrderProductsErrorsTypes[];
  selectedBranchId: string;
}) => {
  const [productsData, setProductsData] = useState<SerializedProductType[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedBranchId) {
      (async () => {
        const productsData = await getProductsDataofBranch(selectedBranchId);
        setProductsData(productsData.data || []);
      })();
    }
  }, [selectedBranchId]);

  return (
    <div className="w-full flex flex-col gap-4 mt-4">
      {productsArray.map((product, index) => (
        <div
          key={index}
          className="w-full grid grid-cols-1 sm:grid-cols-2  gap-6 px-4 py-8 bg-gray-200/50 rounded-xl relative"
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
                {selectedBranchId ? (
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
                            value={item.productName}
                            onSelect={(currentValue) => {
                              setProductsArray((prev) => {
                                const updated = [...prev];

                                updated[index].productId = item.id;
                                updated[index].productImage = item.productImage;
                                updated[index].productName = currentValue;
                                updated[index].quantity = 1;

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
                ) : (
                  <Command>
                    <CommandList>
                      <CommandItem>Select Branch First</CommandItem>
                    </CommandList>
                  </Command>
                )}
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

                  updated[index].quantity = value;

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

export default HandlePurchaseOrderProducts;
