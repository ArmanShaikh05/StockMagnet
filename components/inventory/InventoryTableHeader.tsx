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
  Brand: [
    { label: "Amaron", value: "amaron" },
    { label: "Exide", value: "exide" },
    { label: "Luminious", value: "luminous" },
    { label: "Okaya", value: "okaya" },
  ],
  Category: [
    { label: "Two Wheeler", value: "twoWheeler" },
    { label: "Four Wheeler", value: "fourWheeler" },
  ],
  Status: [
    { label: "Available", value: "available" },
    { label: "Low Stock", value: "lowstock" },
    { label: "Out of Stock", value: "unavailable" },
  ],
};

const InventoryTableHeader = ({
  setSearchString,
  setStatusFilters,
  statusFilters,
  brandFilters,
  categoryFilters,
  setBrandFilters,
  setCategoryFilters,
}: {
  setSearchString: (value: string) => void;
  statusFilters: string[];
  setStatusFilters: React.Dispatch<React.SetStateAction<string[]>>;
  categoryFilters: string[];
  setCategoryFilters: React.Dispatch<React.SetStateAction<string[]>>;
  brandFilters: string[];
  setBrandFilters: React.Dispatch<React.SetStateAction<string[]>>;
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
          {brandFilters.length === 0 ? (
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Brand</Button>
            </DropdownMenuTrigger>
          ) : (
            <div className="rounded-2xl flex items-center bg-main w-max overflow-hidden pr-2">
              <DropdownMenuTrigger asChild>
                <Button variant="default">Brand</Button>
              </DropdownMenuTrigger>
              <CircleX
                size={16}
                onClick={() => setBrandFilters([])}
                className="text-white"
              />
            </div>
          )}
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Brands</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterData.Brand.map((brand, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={brandFilters.includes(brand.value)}
                onCheckedChange={(checked) => {
                  setBrandFilters((prev) =>
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
          {categoryFilters.length === 0 ? (
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Category</Button>
            </DropdownMenuTrigger>
          ) : (
            <div className="rounded-2xl flex items-center bg-main w-max overflow-hidden pr-2">
              <DropdownMenuTrigger asChild>
                <Button variant="default">Category</Button>
              </DropdownMenuTrigger>
              <CircleX
                size={16}
                onClick={() => setCategoryFilters([])}
                className="text-white"
              />
            </div>
          )}
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterData.Category.map((category, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={categoryFilters.includes(category.value)}
                onCheckedChange={(checked) => {
                  setCategoryFilters((prev) =>
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
            {filterData.Status.map((status, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={statusFilters.includes(status.value)}
                onCheckedChange={(checked) => {
                  setStatusFilters((prev) =>
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
      </div>
    </div>
  );
};

export default InventoryTableHeader;
