"use client";

import { BranchesType } from "@/types/types";
import { mockBranches } from "@/utils/data";
import { useParams } from "next/navigation";
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
import { ChevronLeft } from "lucide-react";
import CardsSection from "@/components/singleBranch/CardsSection";
import BranchLowStocks from "@/components/singleBranch/BranchLowStock";
import BranchDetails from "@/components/singleBranch/BranchDetails";
import BranchStockSummaryChart from "@/components/singleBranch/BranchStockSummaryChart";
import BranchRecentInvoicesTable from "@/components/singleBranch/BranchRecentInvoicesTable";
import Link from "next/link";

const SingleBranchPage = () => {
  const { branchId } = useParams();

  const singleBranchData: BranchesType = mockBranches.filter(
    (branch) => branch.id === branchId
  )[0];

  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      <div className=" w-full ">
        <div className="w-full flex items-center justify-between">
          <h2 className="font-semibold text-2xl text-balance tracking-tight">
            {singleBranchData.branchName}
          </h2>
          <Link href={"/branches"}>
            <Button>
              <ChevronLeft size={16} />
              <span className="hidden xs:block">Go Back</span>
            </Button>
          </Link>
        </div>
        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/branches">Branches</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{singleBranchData.branchName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <CardsSection />

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 ">
            <BranchDetails singleBranchData={singleBranchData} />
            <BranchLowStocks />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
            <BranchStockSummaryChart />
            <BranchRecentInvoicesTable />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleBranchPage;
