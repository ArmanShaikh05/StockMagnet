"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { CurrentUserType } from "@/types/types";
import { useBranchStore } from "@/store/branchStore";
import { getProductsDataofBranch } from "@/actions/branchActions";
import * as XLSX from "xlsx";
import { toast } from "sonner";

const ExportProductsToCsv = ({ user }: { user: CurrentUserType }) => {
  const { selectedBranch } = useBranchStore();
  const [hasProductsToExport, setHasProductsToExport] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const branch = user.branches.find(
      (branch) => branch.id === selectedBranch?.id
    );
    setHasProductsToExport(!!branch && branch.products.length > 0);
  }, [selectedBranch?.id, user.branches]);

  const exportData = async () => {
    try {
      if (selectedBranch?.id) {
        setLoading(true);
        const response = await getProductsDataofBranch(selectedBranch.id);

        const exportData = response.data?.map(
          ({
            productSno,
            productName,
            category,
            Brand,
            MRP,
            stockInHand,
            status,
            HSNCode,
            unit,
            minStockQty,
            warrantyMonths,
          }) => ({
            "S.no": productSno,
            Name: productName,
            Category: category.categoryName,
            Brand: Brand.brandName,
            "HSN Code": HSNCode,
            "Price (INR)": MRP,
            Stock: stockInHand,
            Unit: unit.unitName,
            "Total Value": parseFloat(MRP) * stockInHand,
            "Minimum Stock Limit": minStockQty,
            "Warranty (months)": warrantyMonths || 0,
            Status: status,
          })
        );

        if (exportData) {
          if (exportData.length === 0) {
            toast.error("No products data to export");
            return;
          }

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

          XLSX.writeFile(workbook, "Products_Data.xlsx");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return hasProductsToExport ? (
    <Button variant="outline" onClick={() => exportData()} disabled={loading}>
      {loading ? (
        <div className="flex w-full items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Exporting</span>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center gap-2">
          <FileSpreadsheet size={16} />
          <span className="hidden xs:block">Export CSV</span>
          <span className="xs:hidden">Export</span>
        </div>
      )}
    </Button>
  ) : null;
};

export default ExportProductsToCsv;
