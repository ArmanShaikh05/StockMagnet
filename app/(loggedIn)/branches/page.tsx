import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockBranches } from "@/utils/data";
import BranchesCard from "@/components/branches/BranchesCard";
import { getCurrentUserDetails } from "@/actions/userActions";
import EmptyBranches from "@/components/empty/EmptyBarnches";

const Branches = async () => {
  const user = await getCurrentUserDetails();

  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      {user?.branches && user.branches.length > 0 ? (
        <div className=" w-full ">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl text-balance tracking-tight">
              Your Branches
            </h2>
            <Button>
              <Plus size={16} />
              <span>Create Branch</span>
            </Button>
          </div>
          <Breadcrumb className="my-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Branches</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid gird-cols-1 sm:grid-cols-2 w-full gap-10 lg:grid-cols-3">
            {mockBranches.map((branch, index) => (
              <BranchesCard key={index} branchData={branch} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyBranches />
      )}
    </section>
  );
};

export default Branches;
