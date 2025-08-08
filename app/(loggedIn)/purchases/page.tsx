import { getAllBranchesOfUser } from "@/actions/branchActions";
import { getAllSuppliers } from "@/actions/supplierActions";
import { getCurrentUserDetails } from "@/actions/userActions";
import EmptyPurchaseOrder from "@/components/empty/EmptyPurchaseOrder";
import ExportPurchaseOrderToCsv from "@/components/purchaseOrders/ExportPurchaseOrderToCsv";
import PurchaseOrdersCardsSection from "@/components/purchaseOrders/PurchaseOrdersCardsSection";
import PurchaseOrderTable from "@/components/purchaseOrders/PurchaseOrderTable";
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

const Purchases = async () => {
  const user = await getCurrentUserDetails();
  const suppliersList = await getAllSuppliers();
  const branchesList = await getAllBranchesOfUser()

  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      {user?.branches && user.branches.length > 0 ? (
        <div className=" w-full ">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl text-balance tracking-tight">
              Purchase Orders
            </h2>
            <div className="flex items-center gap-2">
              <ExportPurchaseOrderToCsv />
              <Link href={"/purchases/new-purchase-order"}>
                <Button>
                  <Plus size={16} />
                  <span className="hidden xs:block">Create Order</span>
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
                <BreadcrumbPage>Purchases</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-8">
            <PurchaseOrdersCardsSection />
            <PurchaseOrderTable suppliersList={suppliersList.data || []} branchesList={branchesList.data || []} />
          </div>
        </div>
      ) : (
        <EmptyPurchaseOrder />
      )}
    </section>
  );
};

export default Purchases;
