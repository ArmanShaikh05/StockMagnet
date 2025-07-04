import { getCurrentUserDetails } from "@/actions/userActions";
import EmptyInventory from "@/components/empty/EmptyInventory";
import ExportProductsToCsv from "@/components/inventory/ExportProductsToCsv";
import InventoryCardSection from "@/components/inventory/InventoryCardSection";
import InventoryTable from "@/components/inventory/InventoryTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CurrentUserType } from "@/types/types";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";

const page = async () => {
  const user: CurrentUserType | null = await getCurrentUserDetails();

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      {user?.branches && user.branches.length === 0 ? (
        <EmptyInventory />
      ) : (
        <div className=" w-full ">
          <div className="w-full flex items-center justify-between">
            <h2 className="font-semibold text-2xl text-balance tracking-tight">
              Inventory
            </h2>
            <div className="flex items-center gap-2">
              <ExportProductsToCsv user={user} />
              <Link href={"/add-product"}>
                <Button>
                  <Plus size={16} />
                  <span className="hidden xs:block">Add Product</span>
                  <span className="xs:hidden">Add</span>
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
                <BreadcrumbPage>Inventory</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-8">
            <InventoryCardSection />
            <InventoryTable />
          </div>
        </div>
      )}
    </section>
  );
};

export default page;
