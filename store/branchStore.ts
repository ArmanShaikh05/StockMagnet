import { Branches } from "@/lib/generated/prisma";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type BranchSateTypes = {
  selectedBranch: Branches | null;
  setSelectedBranch: (branch: Branches) => void;
};

export const useBranchStore = create<BranchSateTypes>()(
  persist(
    (set) => ({
      selectedBranch: null,
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
    }),
    {
      name: "BranchState", // localStorage key
    }
  )
);
