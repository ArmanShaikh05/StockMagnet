"use client";

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
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { makeBranchPrimary } from "@/actions/branchActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MakePrimaryDialog = ({
  branchId,
  branchName,
  open,
  setOpen,
}: {
  branchId: string;
  branchName: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const makePrimary = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      if (!branchId) throw new Error("Branch Id not included");
      setLoading(true);
      const response: { success: boolean; message: string } =
        await makeBranchPrimary(branchId);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        setOpen(false);
      }

      if (response.success) {
        setOpen(false);
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
          <AlertDialogTitle>{`Make ${branchName} as Primary branch?`}</AlertDialogTitle>
          <AlertDialogDescription>
            There can only be one primary branch for an account. So any other
            branch marked as primary would be removed from primary branch
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button disabled={loading} onClick={(e) => makePrimary(e)}>
              {loading ? (
                <div className="flex w-full items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Making Primary</span>
                </div>
              ) : (
                "Make Primary"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MakePrimaryDialog;
