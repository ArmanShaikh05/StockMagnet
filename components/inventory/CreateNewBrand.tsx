"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

import { createNewBrand, deleteBrand } from "@/actions/utilityActions";
import { SerializedBrandType } from "@/types/serializedTypes";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// BrandCard component
const BrandCard = ({
  brandData,
  onDeleteSuccess,
}: {
  brandData: SerializedBrandType;
  onDeleteSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteBrand(brandData.id);

      if (response.success) {
        toast.success(response.message);
        onDeleteSuccess();
        setShowDeleteDialog(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting brand");
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
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/20 transition duration-300 cursor-pointer">
              <Trash2 size={16} />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete <b>{brandData.brandName}</b>?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button disabled={loading} onClick={handleDelete}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

// CreateNewBrand main component
const CreateNewBrand = ({
  brandsData,
}: {
  brandsData: SerializedBrandType[];
}) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<"manage" | "create">("manage");

  const [brandName, setBrandName] = useState("");
  const [colorCode, setColorCode] = useState("x");
  const [errorStates, setErrorStates] = useState<{
    nameError: string | null;
    colorError: string | null;
  }>({
    nameError: null,
    colorError: null,
  });
  const [loading, setLoading] = useState(false);

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

  const createBrand = async () => {
    setErrorStates({ nameError: null, colorError: null });

    if (!brandName.trim()) {
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
        setDialogOpen(false);
        // Delay router refresh to allow dialog to close properly on mobile
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setView("manage");
          setBrandName("");
          setColorCode("x");
          setErrorStates({ nameError: null, colorError: null });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full text-xs h-8 mt-2 flex items-center justify-center gap-2">
          <Plus size={14} />
          New Brand
        </Button>
      </DialogTrigger>

      <DialogContent onClick={(e) => e.stopPropagation()}>
        {view === "manage" ? (
          <>
            <DialogHeader>
              <DialogTitle>Manage Brands</DialogTitle>
              <DialogDescription>
                View all brands and remove those with no products.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-92">
              {brandsData.length > 0 ? (
                brandsData.map((brand) => (
                  <BrandCard
                    key={brand.id}
                    brandData={brand}
                    onDeleteSuccess={router.refresh}
                  />
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  No brands found.
                </p>
              )}
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setView("create")}>Add New</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create Brand</DialogTitle>
              <DialogDescription>
                Provide brand name and choose a color.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Brand Name</Label>
                <Input
                  placeholder="Enter brand name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
                {errorStates.nameError && (
                  <p className="text-xs text-red-500">{errorStates.nameError}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color, index) => {
                    const hex = color.slice(5, -1); // extract actual hex value
                    return (
                      <span
                        key={index}
                        className={`h-6 w-6 rounded-full cursor-pointer ${color} ${
                          colorCode === hex ? "ring-2 ring-black" : ""
                        }`}
                        onClick={() => setColorCode(hex)}
                      />
                    );
                  })}
                </div>
                {errorStates.colorError && (
                  <p className="text-xs text-red-500">{errorStates.colorError}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setView("manage")}>
                Back
              </Button>
              <Button onClick={createBrand} disabled={loading}>
                {loading ? (
                  <div className="flex gap-2 items-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Brand"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewBrand;
