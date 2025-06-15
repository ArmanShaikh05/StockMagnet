import { getSingleInvoiceData } from "@/actions/invoiceActions";
import { SerializedInvoiceType } from "@/types/serializedTypes";
import { redirect } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import EditInvoices from "@/components/invoices/EditInvoices";

const EditInvoice = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  const { invoiceId } = await params;
  const response: {
    success: boolean;
    message: string;
    data?: SerializedInvoiceType;
    additionalProductData?: {
      stockInHand: number;
      purchasePrice: number;
    }[];
  } = await getSingleInvoiceData(invoiceId);

   if (!response.data || !response.additionalProductData) {
    redirect("/invoices");
  }

  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      <div className=" w-full ">
        <div className="w-full flex items-center justify-between">
          <h2 className="font-semibold text-2xl text-balance tracking-tight">
            Edit Invoice
          </h2>
        </div>
        <Breadcrumb className="my-4 border-b pb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Edit Invoice</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <EditInvoices
            invoiceData={response.data}
            additionalProductData={response.additionalProductData}
          />
        </div>
      </div>
    </section>
  );
};

export default EditInvoice;
