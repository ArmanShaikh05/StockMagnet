import { columns } from "@/components/tables/recentInvoices/Columns";
import { DataTable } from "@/components/tables/recentInvoices/InvoicesTable";
import { InvoicesData } from "@/utils/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const BranchRecentInvoicesTable = () => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex w-full justify-between items-center">
        <div className="mb-6">
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            <div></div>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="w-full overflow-auto ">
        <DataTable columns={columns} data={InvoicesData} />
      </CardContent>
    </Card>
  );
};

export default BranchRecentInvoicesTable;
