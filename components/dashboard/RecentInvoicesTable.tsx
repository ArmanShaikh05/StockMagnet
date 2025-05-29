import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/tables/recentInvoices/InvoicesTable";
import { columns } from "@/components/tables/recentInvoices/Columns";
import { InvoicesData } from "@/utils/data";



const RecentInvoicesTable = () => {
  return (
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
        <DataTable columns={columns} data={InvoicesData} />
      </CardContent>
    </Card>
  );
};

export default RecentInvoicesTable;
