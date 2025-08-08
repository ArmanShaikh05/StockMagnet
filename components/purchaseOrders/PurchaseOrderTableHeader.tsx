"use client";

import { CircleX, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Branches, Suppliers } from "@/lib/generated/prisma";

const filterData = {
  Status: [
    { label: "Full Paid", value: "FullPaid" },
    { label: "Credited", value: "Credited" },
    { label: "Not Paid", value: "NotPaid" },
  ],
};

const PurchaseOrderTableHeader = ({
  setSearchString,
  setBranchFilter,
  branchFilter,
  supplierFilter,
  paymentFilter,
  setSupplierFilter,
  setPaymentFilter,
  suppliersList,
  branchesList,
}: {
  setSearchString: (value: string) => void;
  branchFilter: string[];
  setBranchFilter: React.Dispatch<React.SetStateAction<string[]>>;
  paymentFilter: string[];
  setPaymentFilter: React.Dispatch<React.SetStateAction<string[]>>;
  supplierFilter: string[];
  setSupplierFilter: React.Dispatch<React.SetStateAction<string[]>>;
  suppliersList: Suppliers[];
  branchesList: Branches[];
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchString(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setSearchString]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
      <div className="flex w-full sm:max-w-[18rem] items-center gap-2">
        <Input
          type="search"
          placeholder="Search invoices"
          className="text-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="submit">
          <Search />
        </Button>
      </div>

      <div className="grid grid-cols-3 place-items-center md:flex md:items-center gap-4">
        <DropdownMenu>
          {supplierFilter.length === 0 ? (
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Supplier</Button>
            </DropdownMenuTrigger>
          ) : (
            <div className="rounded-2xl flex items-center bg-main w-max overflow-hidden pr-2">
              <DropdownMenuTrigger asChild>
                <Button variant="default">Supplier</Button>
              </DropdownMenuTrigger>
              <CircleX
                size={16}
                onClick={() => setSupplierFilter([])}
                className="text-white"
              />
            </div>
          )}
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Suppliers</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {suppliersList?.map((brand, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={supplierFilter.includes(brand.name)}
                onCheckedChange={(checked) => {
                  setSupplierFilter((prev) =>
                    checked
                      ? [...prev, brand.name]
                      : prev.filter((f) => f !== brand.name)
                  );
                }}
              >
                {brand.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          {branchFilter.length === 0 ? (
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Branch</Button>
            </DropdownMenuTrigger>
          ) : (
            <div className="rounded-2xl flex items-center bg-main w-max overflow-hidden pr-2">
              <DropdownMenuTrigger asChild>
                <Button variant="default">Branch</Button>
              </DropdownMenuTrigger>
              <CircleX
                size={16}
                onClick={() => setBranchFilter([])}
                className="text-white"
              />
            </div>
          )}
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Branch</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {branchesList.map((status, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={branchFilter.includes(status.branchName)}
                onCheckedChange={(checked) => {
                  setBranchFilter((prev) =>
                    checked
                      ? [...prev, status.branchName]
                      : prev.filter((f) => f !== status.branchName)
                  );
                }}
              >
                {status.branchName}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          {paymentFilter.length === 0 ? (
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Status</Button>
            </DropdownMenuTrigger>
          ) : (
            <div className="rounded-2xl flex items-center bg-main w-max overflow-hidden pr-2">
              <DropdownMenuTrigger asChild>
                <Button variant="default">Status</Button>
              </DropdownMenuTrigger>
              <CircleX
                size={16}
                onClick={() => setPaymentFilter([])}
                className="text-white"
              />
            </div>
          )}
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterData.Status.map((category, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={paymentFilter.includes(category.value)}
                onCheckedChange={(checked) => {
                  setPaymentFilter((prev) =>
                    checked
                      ? [...prev, category.value]
                      : prev.filter((f) => f !== category.value)
                  );
                }}
              >
                {category.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PurchaseOrderTableHeader;
