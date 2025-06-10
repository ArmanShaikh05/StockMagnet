"use client";

import { createNewUnit, deleteUnit } from "@/actions/utilityActions";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Units } from "@/lib/generated/prisma";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";

const UnitCard = ({ unitData }: { unitData: Units }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteUnitDialog, setShowDeleteUnitDialog] =
    useState<boolean>(false);

  const handleDeleteUnit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setLoading(true);

      const response: { success: boolean; message: string } = await deleteUnit(
        unitData.id
      );

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        setShowDeleteUnitDialog(false);
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
    <div className="w-full px-6 py-2  border-b flex justify-between items-center">
      <div className="flex flex-col grow">
        <div className="flex items-center gap-2">
          <h2 className="text-sm">{unitData.unitName}</h2>
          <span className="text-xs font-light">{`(${unitData.unitCode})`}</span>
        </div>
        {/* <p className="text-[10px]">{unitData.totalProduct} products</p> */}
      </div>

      <AlertDialog
        open={showDeleteUnitDialog}
        onOpenChange={setShowDeleteUnitDialog}
      >
        <AlertDialogTrigger asChild>
          {unitData.canDelete && (
            <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/20 transition duration-300 cursor-pointer">
              <Trash2 size={16} />
            </div>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to delete <b>{unitData.unitName}</b> Unit?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              Unit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button disabled={loading} onClick={(e) => handleDeleteUnit(e)}>
                {loading ? (
                  <div className="flex w-full items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Deleting Unit</span>
                  </div>
                ) : (
                  "Delete Unit"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const CreateNewUnit = ({
  unitsData,
  setIsOpen,
}: {
  unitsData: Units[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const [dialogType, setDialogType] = useState<"manage" | "create">("manage");

  const [unitName, setUnitName] = useState<string>("");
  const [unitCode, setUnitCode] = useState<string>("");
  const [errorStates, setErrorStates] = useState<{
    nameError: string | null;
    unitCode: string | null;
  }>({
    nameError: null,
    unitCode: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";
    return () => {
      // Unlock scroll when modal unmounts
      document.body.style.overflow = "";
    };
  }, []);

  const createUnit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setErrorStates({
        nameError: null,
        unitCode: null,
      });

      if (!unitName) {
        setErrorStates((prev) => ({
          ...prev,
          nameError: "Unit name is required",
        }));
        return;
      }

      if (!unitCode) {
        setErrorStates((prev) => ({
          ...prev,
          unitCode: "Unit code is required",
        }));
        return;
      } else if (unitCode.length > 6) {
        setErrorStates((prev) => ({
          ...prev,
          unitCode: "Unit code should be less than 6 letters",
        }));
        return;
      }

      setLoading(true);

      const unitdata = {
        unitName,
        unitCode,
      };

      const response: { success: boolean; message: string } =
        await createNewUnit(unitdata);

      if (response.success) {
        router.refresh();
        toast.success(response.message);
        setDialogType("manage");
      }

      if (!response.success) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while creating unit", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      <Card className="max-w-xl w-[95%]">
        <CardHeader>
          <CardTitle>
            {dialogType === "manage" ? "Manage your Units" : "Create Unit"}
          </CardTitle>
          <CardDescription>
            {dialogType === "manage" &&
              "Here you can view all your units and can create custom units along with default ones."}
          </CardDescription>
        </CardHeader>
        <CardContent className=" w-full ">
          {dialogType === "create" ? (
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Unit Name</Label>
                <Input
                  id="name-1"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="Enter unit full name ( Kilogram...)"
                />
                {errorStates.nameError && (
                  <p className="text-red-500 text-xs mt-2">
                    {errorStates.nameError}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name-1">Unit Code</Label>
                <Input
                  id="name-1"
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  placeholder="Enter unit short code ( Kg...)"
                />
                {errorStates.unitCode && (
                  <p className="text-red-500 text-xs mt-2">
                    {errorStates.unitCode}
                  </p>
                )}
              </div>
            </div>
          ) : unitsData && unitsData.length > 0 ? (
            <ScrollArea className="h-92">
              {unitsData.map((unit) => (
                <UnitCard key={unit.id} unitData={unit} />
              ))}
            </ScrollArea>
          ) : (
            <p>No Units</p>
          )}
        </CardContent>

        <CardFooter>
          {dialogType === "create" ? (
            <div className="w-full flex flex-col gap-2 sm:flex-row items-center sm:justify-end">
              <Button
                disabled={loading}
                onClick={(e) => createUnit(e)}
                className="w-full sm:w-max"
              >
                {loading ? (
                  <div className="flex w-full items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Creating Unit</span>
                  </div>
                ) : (
                  "Create Unit"
                )}
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => setDialogType("manage")}
                className="w-full sm:w-max"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2 sm:flex-row items-center sm:justify-end">
              <Button
                onClick={() => setDialogType("create")}
                className="w-full sm:w-max"
              >
                Add new
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-max"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateNewUnit;
