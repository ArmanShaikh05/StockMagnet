"use client";

import { getRecentInvoicesOfBranch } from "@/actions/invoiceActions";
import { columns } from "@/components/tables/recentInvoices/Columns";
import { DataTable } from "@/components/tables/recentInvoices/InvoicesTable";
import { SerializedInvoiceType } from "@/types/serializedTypes";
import { useEffect, useState } from "react";
import NoRecentInvoices from "../empty/NoRecentInvoices";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const BranchRecentInvoicesTable = ({ branchId }: { branchId: string }) => {
  const [recentInvoicesData, setRecentInvoicesData] = useState<
    SerializedInvoiceType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (branchId) {
        setLoading(true);
        const response: {
          success: boolean;
          message: string;
          data?: SerializedInvoiceType[];
        } = await getRecentInvoicesOfBranch(branchId);

        if (response.data) {
          setRecentInvoicesData(response.data);
        }
        setLoading(false);
      }
    })();
  }, [branchId]);
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
      </CardHeader>

      <CardContent className="w-full overflow-auto ">
        {recentInvoicesData.length > 0 ? (
          <DataTable columns={columns} data={recentInvoicesData} />
        ) : (
          <div className="w-full h-full flex items-center pt-2">
            <NoRecentInvoices />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BranchRecentInvoicesTable;
