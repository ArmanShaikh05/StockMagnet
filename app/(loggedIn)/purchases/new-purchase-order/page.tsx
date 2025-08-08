import { getAllBranchesOfUser } from "@/actions/branchActions";
import { getAllSuppliers } from "@/actions/supplierActions";
import CreatePurchaseOrder from "@/components/purchaseOrders/CreatePurchaseOrder";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suppliers } from "@/lib/generated/prisma";

const NewPurchaseOrder = async () => {
  const suppliers: Suppliers[] = (await getAllSuppliers()).data;
  const branches = (await getAllBranchesOfUser())?.data;

  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      <div className=" w-full ">
        <div className="w-full flex items-center justify-between">
          <h2 className="font-semibold text-2xl text-balance tracking-tight">
            Create New Purchase Order
          </h2>
        </div>
        <Breadcrumb className="my-4 border-b pb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/purchases">Purchases</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Create Purchase Order</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <CreatePurchaseOrder
            suppliers={suppliers}
            branches={branches || []}
          />
        </div>
      </div>
    </section>
  );
};

export default NewPurchaseOrder;
