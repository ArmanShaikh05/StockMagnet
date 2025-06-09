"use client";

import { createNewBrand, deleteBrand } from "@/actions/utilityActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { SerializedBrandType } from "@/types/serializedTypes";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";

const BrandCard = ({ brandData }: { brandData: SerializedBrandType }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteBrandDialog, setShowDeleteBrandDialog] =
    useState<boolean>(false);

  const handleDeleteBrand = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setLoading(true);

      const response: { success: boolean; message: string } = await deleteBrand(
        brandData.id
      );

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        setShowDeleteBrandDialog(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6 py-2 border-b flex justify-between items-center">
      <div className="flex flex-col grow">
        <h2 className="text-sm">{brandData.brandName}</h2>
        <p className="text-[10px]">{brandData.totalProduct} products</p>
      </div>

      <AlertDialog
        open={showDeleteBrandDialog}
        onOpenChange={setShowDeleteBrandDialog}
      >
        <AlertDialogTrigger asChild>
          {brandData.totalProduct === 0 && (
            <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/20 transition duration-300 cursor-pointer">
              <Trash2 size={16} />
            </div>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to delete <b>{brandData.brandName}</b> Brand?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              Brand.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button disabled={loading} onClick={(e) => handleDeleteBrand(e)}>
                {loading ? (
                  <div className="flex w-full items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Deleting Brand</span>
                  </div>
                ) : (
                  "Delete Brand"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const CreateNewBrand = ({
  brandsData,
}: {
  brandsData: SerializedBrandType[];
}) => {
  const router = useRouter();

  const [showCreateNewBrandDialog, setShowCreateNewBrandDialog] =
    useState<boolean>(false);

  const [brandName, setBrandName] = useState<string>("");
  const [colorCode, setColorCode] = useState<string>("x");
  const [errorStates, setErrorStates] = useState<{
    nameError: string | null;
    colorError: string | null;
  }>({
    nameError: null,
    colorError: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const colors = [
    "bg-[#BFD8B8]",
    "bg-[#D0C9E2]",
    "bg-[#F5CBA7]",
    "bg-[#A7D3E9]",
    "bg-[#F7E1AE]",
    "bg-[#A8C686]",
    "bg-[#D9B8FF]",
    "bg-[#BEE5D3]",
    "bg-[#F2B8B5]",
  ];

  const createBrand = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setErrorStates({ nameError: null, colorError: null });

      if (!brandName) {
        setErrorStates((prev) => ({
          ...prev,
          nameError: "Brand name is required",
        }));
        return;
      }

      if (!colorCode || colorCode === "x") {
        setErrorStates((prev) => ({
          ...prev,
          colorError: "Color code is required",
        }));
        return;
      }

      setLoading(true);

      const brandData = { brandName, colorCode };

      const response: { success: boolean; message: string } =
        await createNewBrand(brandData);

      if (response.success) {
        router.refresh();
        toast.success(response.message);
        setShowCreateNewBrandDialog(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while creating brand", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Manage Brands Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full text-xs h-8 mt-2 flex items-center justify-center gap-2">
            <Plus size={14} />
            New Brand
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Manage your Brands</AlertDialogTitle>
            <AlertDialogDescription>
              Here you can view all your brands along with number of products
              and can remove brand with none.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {brandsData && brandsData.length > 0 ? (
            <ScrollArea className="h-92">
              {brandsData.map((brand) => (
                <BrandCard key={brand.id} brandData={brand} />
              ))}
            </ScrollArea>
          ) : (
            <p>No Brands</p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => setShowCreateNewBrandDialog(true)}>
                Add New
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Brand Dialog */}
      <Dialog open={showCreateNewBrandDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Brand</DialogTitle>
            <DialogDescription>
              Enter brand name and select a color code.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Brand Name</Label>
              <Input
                id="name-1"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Brand name here"
              />
              {errorStates.nameError && (
                <p className="text-red-500 text-xs mt-2">
                  {errorStates.nameError}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label>Color code</Label>
              <div className="w-full flex items-center gap-2">
                {colors.map((color, index) => (
                  <span
                    key={index}
                    className={`h-6 w-6 rounded-full cursor-pointer ${color} ${
                      color.includes(colorCode) && "border-3 border-black"
                    }`}
                    onClick={() => setColorCode(color.slice(4, 11))}
                  />
                ))}
              </div>
              {errorStates.colorError && (
                <p className="text-red-500 text-xs mt-2">
                  {errorStates.colorError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setShowCreateNewBrandDialog(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button disabled={loading} onClick={(e) => createBrand(e)}>
              {loading ? (
                <div className="flex w-full items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Creating Brand</span>
                </div>
              ) : (
                "Create Brand"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateNewBrand;
