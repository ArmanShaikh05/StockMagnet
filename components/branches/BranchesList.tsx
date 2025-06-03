import { getAllBranchesOfUser } from "@/actions/branchActions";
import React from "react";
import BranchesCard from "./BranchesCard";
import EmptyBranches from "../empty/EmptyBarnches";

const BranchesList = async () => {
  const branches = await getAllBranchesOfUser();
  return (
    <div className="w-full">
      {branches.data && branches.data.length > 0 ? (
        <div className="grid gird-cols-1 sm:grid-cols-2 w-full gap-10 lg:grid-cols-3">
          {branches.data.map((branch, index) => (
            <BranchesCard key={index} branchData={branch} />
          ))}
        </div>
      ) : (
        <EmptyBranches />
      )}
    </div>
  );
};

export default BranchesList;
