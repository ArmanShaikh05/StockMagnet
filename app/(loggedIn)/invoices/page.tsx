import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import InvoiceCardSection from "@/components/invoices/InvoiceCardsSection";
import InvoicesTable from "@/components/invoices/InvoicesTable";
import { getCurrentUserDetails } from "@/actions/userActions";
import EmptyInvoices from "@/components/empty/EmptyInvoices";

const Invoices = async () => {
  const user = await getCurrentUserDetails();

  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      {user?.branches && user.branches.length > 0 ? (
        <div className=" w-full ">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl text-balance tracking-tight">
              Invoices
            </h2>
            <div className="flex items-center gap-2">
              <Button variant={"outline"}>
                <FileSpreadsheet size={16} />
                <span className="hidden xs:block">Export CSV</span>
                <span className="xs:hidden">Export</span>
              </Button>
              <Button>
                <Plus size={16} />
                <span className="hidden xs:block">Create Invoice</span>
                <span className="xs:hidden">Create</span>
              </Button>
            </div>
          </div>
          <Breadcrumb className="my-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Invoices</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-8">
            <InvoiceCardSection />
            <InvoicesTable />
          </div>
        </div>
      ) : (
        <EmptyInvoices />
      )}
    </section>
  );
};

export default Invoices;
