import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CardsSection from "@/components/dashboard/CardsSection";
import RevenueChart from "@/components/dashboard/RevenueChart";
import LowStockProducts from "@/components/dashboard/LowStockProducts";
import StockSummaryChart from "@/components/dashboard/StockSummaryChart";
import RecentInvoicesTable from "@/components/dashboard/RecentInvoicesTable";
import { ComparisonRevenueChart } from "@/components/dashboard/ComparisonRevenueChart";
import { StocksComparisonChart } from "@/components/dashboard/StocksComaprisonChart";
import { getCurrentUserDetails } from "@/actions/userActions";
import EmptyBranches from "@/components/empty/EmptyBarnches";
import Link from "next/link";

const Dashboard = async () => {
  const user = await getCurrentUserDetails();

  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      {user?.branches && user.branches.length > 0 ? (
        <div className=" w-full ">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl text-balance tracking-tight">
              Dashboard
            </h2>
            <Link href={"/new-invoice"}>
              <Button>
                <Plus size={16} />
                <span>Create Invoice</span>
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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-8">
            <CardsSection />

            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 ">
              <RevenueChart />
              <LowStockProducts />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
              <StockSummaryChart />
              <RecentInvoicesTable />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 ">
              <ComparisonRevenueChart />
              <StocksComparisonChart />
            </div>
          </div>
        </div>
      ) : (
        <EmptyBranches />
      )}
    </section>
  );
};

export default Dashboard;
