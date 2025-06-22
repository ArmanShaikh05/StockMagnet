import { getCurrentUserDetails } from "@/actions/userActions";
import EmptyInvoices from "@/components/empty/EmptyInvoices";
import ExportInvoiceToCsv from "@/components/invoices/ExportInvoiceToCsv";
import InvoiceCardSection from "@/components/invoices/InvoiceCardsSection";
import InvoicesTable from "@/components/invoices/InvoicesTable";
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
import Link from "next/link";

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
              <ExportInvoiceToCsv />
              <Link href={"/new-invoice"}>
                <Button>
                  <Plus size={16} />
                  <span className="hidden xs:block">Create Invoice</span>
                  <span className="xs:hidden">Create</span>
                </Button>
              </Link>
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
