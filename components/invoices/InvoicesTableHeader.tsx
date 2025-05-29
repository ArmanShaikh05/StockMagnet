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

const filterData = {
  Payment: [
    { label: "UPI", value: "upi" },
    { label: "Cash", value: "cash" },
    { label: "Bank", value: "bank" },
  ],
  GST: [
    { label: "GST Bill", value: "true" },
    { label: "Non GST Bill", value: "false" },
  ],
  Status: [
    { label: "Full Paid", value: "Full-Paid" },
    { label: "Credited", value: "Credited" },
    { label: "Not Paid", value: "Not-Paid" },
  ],
};

const InvoicesTableHeader = ({
  setSearchString,
  setStatusFilters,
  statusFilters,
  gstFilter,
  paymentFilter,
  setGstFilter,
  setPaymentFilter,
}: {
  setSearchString: (value: string) => void;
  statusFilters: string[];
  setStatusFilters: React.Dispatch<React.SetStateAction<string[]>>;
  paymentFilter: string[];
  setPaymentFilter: React.Dispatch<React.SetStateAction<string[]>>;
  gstFilter: string[];
  setGstFilter: React.Dispatch<React.SetStateAction<string[]>>;
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
          placeholder="Search products"
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
          {gstFilter.length === 0 ? (
            <DropdownMenuTrigger asChild>
              <Button variant="outline">GST Bill</Button>
            </DropdownMenuTrigger>
          ) : (
            <div className="rounded-2xl flex items-center bg-main w-max overflow-hidden pr-2">
              <DropdownMenuTrigger asChild>
                <Button variant="default">GST Bill</Button>
              </DropdownMenuTrigger>
              <CircleX
                size={16}
                onClick={() => setGstFilter([])}
                className="text-white"
              />
            </div>
          )}
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select GST Bill</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterData.GST.map((brand, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={gstFilter.includes(brand.value)}
                onCheckedChange={(checked) => {
                  setGstFilter((prev) =>
                    checked
                      ? [...prev, brand.value]
                      : prev.filter((f) => f !== brand.value)
                  );
                }}
              >
                {brand.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          {paymentFilter.length === 0 ? (
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Payment</Button>
            </DropdownMenuTrigger>
          ) : (
            <div className="rounded-2xl flex items-center bg-main w-max overflow-hidden pr-2">
              <DropdownMenuTrigger asChild>
                <Button variant="default">Payment</Button>
              </DropdownMenuTrigger>
              <CircleX
                size={16}
                onClick={() => setPaymentFilter([])}
                className="text-white"
              />
            </div>
          )}
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Payment Mode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterData.Payment.map((status, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={paymentFilter.includes(status.value)}
                onCheckedChange={(checked) => {
                  setPaymentFilter((prev) =>
                    checked
                      ? [...prev, status.value]
                      : prev.filter((f) => f !== status.value)
                  );
                }}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          {statusFilters.length === 0 ? (
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
                onClick={() => setStatusFilters([])}
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
                checked={statusFilters.includes(category.value)}
                onCheckedChange={(checked) => {
                  setStatusFilters((prev) =>
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

export default InvoicesTableHeader;
