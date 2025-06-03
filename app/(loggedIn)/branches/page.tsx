
import BranchesList from "@/components/branches/BranchesList";
import CreateBranchDialog from "@/components/branches/CreateBranchDialog";
import BranchesLoading from "@/components/loading/BranchesLoading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suspense } from "react";

const Branches = () => {
  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      <div className=" w-full ">
        <div className="w-full flex items-center justify-between">
          <h2 className="font-semibold text-2xl text-balance tracking-tight">
            Your Branches
          </h2>
          <CreateBranchDialog />
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

        <Suspense fallback={<BranchesLoading />}>
          <BranchesList />
        </Suspense>
        
      </div>
    </section>
  );
};

export default Branches;
