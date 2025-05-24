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

const RecentInvoicesTable = () => {
  return (
    <Card className="w-full">
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

      <CardContent className="w-full">
        <div className="w-full grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto_auto_auto] border border-red-500">
          <p className="border">Hello</p>
          <p className="border">Hello</p>
          <p className="border">Hello</p>
          <p className="border">Hello</p>
          <p className="border">Hello</p>
          <p className="border">Hello</p>
          <p className="border">Hello</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentInvoicesTable;
