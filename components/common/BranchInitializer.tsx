"use client";

import { Branches } from "@/lib/generated/prisma";
import { useBranchStore } from "@/store/branchStore";
import { useEffect } from "react";

const BranchInitializer = ({ initialBranch }: { initialBranch: Branches }) => {
  const { setSelectedBranch } = useBranchStore();
  useEffect(() => {
    if (initialBranch) {
      setSelectedBranch(initialBranch);
    }
  }, [initialBranch, setSelectedBranch]);
  return null;
};

export default BranchInitializer;
