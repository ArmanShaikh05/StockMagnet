"use client";

import { deletePurchaseOrder } from "@/actions/purchaseOrderActions";
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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const DeletePurchaseOrderDialog = ({
  open,
  invoiceId,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceId: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteInvoice = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setLoading(true);

      const response: { success: boolean; message: string } =
        await deletePurchaseOrder(invoiceId);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      console.log("Error deleting invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            purchase order and all its details from the branch.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button disabled={loading} onClick={(e) => handleDeleteInvoice(e)}>
              {loading ? (
                <div className="flex w-full items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Deleting Order</span>
                </div>
              ) : (
                "Delete Order"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePurchaseOrderDialog;
