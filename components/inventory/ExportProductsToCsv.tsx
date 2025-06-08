"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FileSpreadsheet } from "lucide-react";
import { CurrentUserType } from "@/types/types";
import { useBranchStore } from "@/store/branchStore";

const ExportProductsToCsv = ({ user }: { user: CurrentUserType }) => {
  const { selectedBranch } = useBranchStore();
  const [hasProductsToExport, setHasProductsToExport] = useState(false);

  useEffect(() => {
    const branch = user.branches.find(
      (branch) => branch.id === selectedBranch?.id
    );
    setHasProductsToExport(!!branch && branch.products.length > 0);
  }, [selectedBranch?.id, user.branches]);

  return hasProductsToExport ? (
    <Button variant="outline">
      <FileSpreadsheet size={16} />
      <span className="hidden xs:block">Export CSV</span>
      <span className="xs:hidden">Export</span>
    </Button>
  ) : null;
};

export default ExportProductsToCsv;
