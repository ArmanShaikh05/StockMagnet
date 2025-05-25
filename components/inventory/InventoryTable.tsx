"use client";

import { ProductsData } from "@/utils/data";
import { useMemo, useState } from "react";
import { columns } from "../tables/products/Columns";
import ProductsTable from "../tables/products/ProductsTable";
import { Card, CardContent, CardHeader } from "../ui/card";
import InventoryTableHeader from "./InventoryTableHeader";

const InventoryTable = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return ProductsData.filter((product) => {
      const matchesSearch = searchString
        ? product.name.toLowerCase().includes(searchString.toLowerCase())
        : true;

      const matchesStatus =
        statusFilters.length > 0
          ? statusFilters.includes(product.status.toLowerCase())
          : true;

      const matchesBrand =
        brandFilters.length > 0
          ? brandFilters.includes(product.brand.toLowerCase())
          : true;

      const matchesCategory =
        categoryFilters.length > 0
          ? categoryFilters.includes(product.category.toLowerCase())
          : true;

      return matchesSearch && matchesStatus && matchesBrand && matchesCategory;
    });
  }, [brandFilters, categoryFilters, searchString, statusFilters]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="-mb-4">
        <InventoryTableHeader
          setSearchString={setSearchString}
          setStatusFilters={setStatusFilters}
          statusFilters={statusFilters}
          brandFilters={brandFilters}
          categoryFilters={categoryFilters}
          setBrandFilters={setBrandFilters}
          setCategoryFilters={setCategoryFilters}
        />
      </CardHeader>
      <CardContent>
        <ProductsTable columns={columns} data={filteredData} />
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
