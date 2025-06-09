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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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

const BrandCard = ({
  brandData,
  onDelete,
}: {
  brandData: SerializedBrandType;
  onDelete: () => void;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await deleteBrand(brandData.id);
      if (res.success) {
        toast.success(res.message);
        onDelete();
        setShowDeleteDialog(false);
      } else {
        toast.error(res.message);
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

      {brandData.totalProduct === 0 && (
        <div
          className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/20 transition duration-300 cursor-pointer"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 size={16} />
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete <b>{brandData.brandName}</b>?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. It will permanently delete the brand.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button disabled={loading} onClick={handleDelete}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting
                  </div>
                ) : (
                  "Delete"
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

  const [showManageDialog, setShowManageDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [colorCode, setColorCode] = useState("x");
  const [errorStates, setErrorStates] = useState({
    nameError: null as string | null,
    colorError: null as string | null,
  });
  const [loading, setLoading] = useState(false);

  const colors = [
    "#BFD8B8",
    "#D0C9E2",
    "#F5CBA7",
    "#A7D3E9",
    "#F7E1AE",
    "#A8C686",
    "#D9B8FF",
    "#BEE5D3",
    "#F2B8B5",
  ];

  const createBrand = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setErrorStates({ nameError: null, colorError: null });

    if (!brandName) {
      setErrorStates((prev) => ({
        ...prev,
        nameError: "Brand name is required",
      }));
      return;
    }

    if (colorCode === "x") {
      setErrorStates((prev) => ({
        ...prev,
        colorError: "Color code is required",
      }));
      return;
    }

    try {
      setLoading(true);
      const res = await createNewBrand({ brandName, colorCode });
      if (res.success) {
        toast.success(res.message);
        router.refresh();
        setShowCreateDialog(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log("Error while creating brand", error);
    } finally {
      setLoading(false);
    }
  };

  const switchToCreateDialog = () => {
    setShowManageDialog(false);
    setTimeout(() => setShowCreateDialog(true), 100);
  };

  return (
    <>
      {/* Manage Brands Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogTrigger asChild>
          <Button className="w-full text-xs h-8 mt-2 flex items-center justify-center gap-2">
            <Plus size={14} />
            New Brand
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage your Brands</DialogTitle>
            <DialogDescription>
              View all your brands and delete empty ones.
            </DialogDescription>
          </DialogHeader>

          {brandsData?.length > 0 ? (
            <ScrollArea className="h-92">
              {brandsData.map((brand) => (
                <BrandCard
                  key={brand.id}
                  brandData={brand}
                  onDelete={() => router.refresh()}
                />
              ))}
            </ScrollArea>
          ) : (
            <p>No Brands</p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={switchToCreateDialog}>Add New</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Brand Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Brand</DialogTitle>
            <DialogDescription>
              Enter brand name and choose a color.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label>Brand Name</Label>
              <Input
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
              <Label>Color Code</Label>
              <div className="flex gap-2 items-center flex-wrap">
                {colors.map((color, i) => (
                  <span
                    key={i}
                    className={`h-6 w-6 rounded-full cursor-pointer border ${
                      colorCode === color ? "border-black border-2" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setColorCode(color)}
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
              onClick={() => setShowCreateDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button disabled={loading} onClick={createBrand}>
              {loading ? (
                <div className="flex gap-2 items-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating
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
