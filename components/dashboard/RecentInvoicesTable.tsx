"use client";

import { getRecentInvoicesOfBranch } from "@/actions/invoiceActions";
import { columns } from "@/components/tables/recentInvoices/Columns";
import { DataTable } from "@/components/tables/recentInvoices/InvoicesTable";
import { useBranchStore } from "@/store/branchStore";
import { SerializedInvoiceType } from "@/types/serializedTypes";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import NoRecentInvoices from "../empty/NoRecentInvoices";

const RecentInvoicesTable = () => {
  const { selectedBranch } = useBranchStore();
  const [recentInvoicesData, setRecentInvoicesData] = useState<
    SerializedInvoiceType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        setLoading(true);
        const response: {
          success: boolean;
          message: string;
          data?: SerializedInvoiceType[];
        } = await getRecentInvoicesOfBranch(selectedBranch.id);

        if (response.data) {
          setRecentInvoicesData(response.data);
        }
        setLoading(false);
      }
    })();
  }, [selectedBranch]);

  return loading ? (
    <Skeleton className="w-full h-full" />
  ) : (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex w-full justify-between items-center">
        <div>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            <div></div>
          </CardDescription>
        </div>
        <div>
          <Link href="/invoices">
            <Button variant="outline">
              <span>View All</span>
              <ChevronRight size={12} />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="w-full overflow-auto ">
        {recentInvoicesData.length > 0 ? (
          <DataTable columns={columns} data={recentInvoicesData} />
        ):(
          <div className="w-full h-full flex items-center pt-2">
            <NoRecentInvoices />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentInvoicesTable;
