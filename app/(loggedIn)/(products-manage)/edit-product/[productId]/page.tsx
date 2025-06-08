import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { getAllBranchesOfUser } from "@/actions/branchActions";
import {
  getAllBrands,
  getAllCategory,
  getAllUnits,
} from "@/actions/utilityActions";
import EditProductDialog from "@/components/inventory/EditProductDialog";
import { getSingleProductData } from "@/actions/productsActions";
import { redirect } from "next/navigation";

const EditProductData = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;

  const productsData = await getSingleProductData(productId);

  if (!productsData.data) {
    redirect("/inventory");
  }

  const brands = await getAllBrands();
  const units = await getAllUnits();
  const branches = await getAllBranchesOfUser();
  const categories = await getAllCategory();
  return (
    <section className="my-2 mt-6 w-full  flex flex-col items-center">
      <div className=" w-full ">
        <div className="w-full flex items-center justify-between">
          <h2 className="font-semibold text-2xl text-balance tracking-tight">
            Edit Product
          </h2>
        </div>
        <Breadcrumb className="my-4 border-b pb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Edit Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-8">
          <EditProductDialog
            brands={brands.data || []}
            branches={branches.data || []}
            units={units.data || []}
            categories={categories.data || []}
            productsData={productsData.data}
          />
        </div>
      </div>
    </section>
  );
};

export default EditProductData;
