"use client";

import { deleteMultipleInvoices } from "@/actions/invoiceActions";
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
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const DeleteAllInvoiceRows = ({
  open,
  setOpen,
  selectedRowsId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRowsId: string[];
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const deleteProducts = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setLoading(true);

      const response: { success: boolean; message: string } =
        await deleteMultipleInvoices(selectedRowsId);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        setOpen(false);
      }

      if (!response.success) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to delete {selectedRowsId.length} selected rows?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected {selectedRowsId.length} rows and their data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button disabled={loading} onClick={(e) => deleteProducts(e)}>
              {loading ? (
                <div className="flex w-full items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Deleting Invoices</span>
                </div>
              ) : (
                "Delete Invoices"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllInvoiceRows;
