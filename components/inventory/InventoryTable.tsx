"use client";

import { getProductsDataofBranch } from "@/actions/branchActions";
import { getAllBrands, getAllCategory } from "@/actions/utilityActions";
import { useBranchStore } from "@/store/branchStore";
import {
  SerializedBrandType,
  SerializedCategoryType,
  SerializedProductType,
} from "@/types/serializedTypes";
import { useEffect, useMemo, useState } from "react";
import EmptyInventory from "../empty/EmptyInventory";
import TableLoading from "../loading/InventoryLoading";
import { columns } from "../tables/products/Columns";
import ProductsTable from "../tables/products/ProductsTable";
import { Card, CardContent, CardHeader } from "../ui/card";
import DeleteProductDialog from "./DeleteProductDialog";
import InventoryTableHeader from "./InventoryTableHeader";

const InventoryTable = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);

  const [productsData, setProductsData] = useState<SerializedProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [allBrands, setAllBrands] = useState<SerializedBrandType[]>([]);
  const [allCategories, setAllCategories] = useState<SerializedCategoryType[]>(
    []
  );

  const [showDeleteProductDialog, setShowDeleteProductDialog] =
    useState<boolean>(false);
  const [deletProductId, setDeleteProductId] = useState<string>("");

  const { selectedBranch } = useBranchStore();

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        setLoading(true);
        const response: {
          success: boolean;
          message: string;
          data?: SerializedProductType[];
        } = await getProductsDataofBranch(selectedBranch.id);

        const brands = await getAllBrands();
        setAllBrands(brands?.data || []);

        const categories = await getAllCategory();
        setAllCategories(categories?.data || []);

        setProductsData(response?.data || []);
        setLoading(false);
      }
    })();
  }, [selectedBranch]);

  const filteredData = useMemo(() => {
    return productsData.filter((product) => {
      const matchesSearch = searchString
        ? product.productName.toLowerCase().includes(searchString.toLowerCase())
        : true;

      const matchesTag = searchString
        ? product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchString.toLowerCase())
          )
        : true;

      const matchesStatus =
        statusFilters.length > 0
          ? statusFilters.includes(product.status.toLowerCase())
          : true;

      const matchesBrand =
        brandFilters.length > 0
          ? brandFilters.includes(product.Brand.brandName)
          : true;

      const matchesCategory =
        categoryFilters.length > 0
          ? categoryFilters.includes(product.category.categoryName)
          : true;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBrand &&
        matchesCategory &&
        matchesTag
      );
    });
  }, [
    brandFilters,
    categoryFilters,
    productsData,
    searchString,
    statusFilters,
  ]);

  const handleDeleteProduct = (productId: string) => {
    setDeleteProductId(productId);
    setShowDeleteProductDialog(true);
  };

  return (
    <Card className="shadow-lg">
      {loading ? (
        <CardContent>
          <TableLoading />
        </CardContent>
      ) : (
        <>
          <CardHeader className="-mb-4">
            {productsData.length > 0 && (
              <InventoryTableHeader
                setSearchString={setSearchString}
                setStatusFilters={setStatusFilters}
                statusFilters={statusFilters}
                brandFilters={brandFilters}
                categoryFilters={categoryFilters}
                setBrandFilters={setBrandFilters}
                setCategoryFilters={setCategoryFilters}
                allBrands={allBrands}
                allCategories={allCategories}
              />
            )}
          </CardHeader>
          <CardContent>
            {productsData.length > 0 ? (
              <ProductsTable
                columns={columns(handleDeleteProduct)}
                data={filteredData}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <EmptyInventory />
              </div>
            )}

            {showDeleteProductDialog && (
              <DeleteProductDialog
                open={showDeleteProductDialog}
                setOpen={setShowDeleteProductDialog}
                productId={deletProductId}
              />
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default InventoryTable;
