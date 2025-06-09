"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createNewBrand, deleteBrand } from "@/actions/utilityActions";
import { SerializedBrandType } from "@/types/serializedTypes";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// BrandCard component
const BrandCard = ({ brandData }: { brandData: SerializedBrandType }) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await deleteBrand(brandData.id);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
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
                <Button disabled={loading} onClick={(e) => handleDelete(e)}>
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

  const createBrand = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setErrorStates({ nameError: null, colorError: null });
    e.preventDefault();

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
        // Close dialog by switching view back to manage (dialog auto closes when trigger clicked again)
        setView("manage");
        setBrandName("");
        setColorCode("x");
        setErrorStates({ nameError: null, colorError: null });

        // Optionally refresh list here without full page refresh
        router.refresh();
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

  return view === "manage" ? (
    <Dialog
      // Use uncontrolled dialog: no open or setOpen
      onOpenChange={(open) => {
        if (!open) {
          // Reset state on dialog close
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

      <DialogContent className="mobile:fixed">
        <DialogHeader>
          <DialogTitle>Manage Brands</DialogTitle>
          <DialogDescription>
            View all brands and remove those with no products.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-92">
          {brandsData.length > 0 ? (
            brandsData.map((brand) => (
              <BrandCard key={brand.id} brandData={brand} />
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground mt-4">
              No brands found.
            </p>
          )}
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => setView("create")}>Add New</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <AlertDialog
      open={view === "create"}
      onOpenChange={(open) => {
        if (!open) {
          setView("manage");
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Brand</AlertDialogTitle>
          <AlertDialogDescription>
            Provide brand name and choose a color.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              variant={"secondary"}
              onClick={(e) => {
                e.preventDefault();
                setView("manage");
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={(e) => createBrand(e)} disabled={loading}>
              {loading ? (
                <div className="flex gap-2 items-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Brand"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateNewBrand;
