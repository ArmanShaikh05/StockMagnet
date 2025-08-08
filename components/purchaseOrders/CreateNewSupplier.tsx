"use client";

import { createNewSupplier, deleteSupplier } from "@/actions/supplierActions";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Suppliers } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { INDIAN_STATES } from "@/utils/data";
import { Check, ChevronsUpDown, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

const SupplierCard = ({ supplierData }: { supplierData: Suppliers }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteBrandDialog, setShowDeleteBrandDialog] =
    useState<boolean>(false);

  // Needs to be modified
  const handleDeleteSupplier = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setLoading(true);

      const response: { success: boolean; message: string } =
        await deleteSupplier(supplierData.id);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        setShowDeleteBrandDialog(false);
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
        <h2 className="text-sm">{supplierData.name}</h2>
      </div>

      <AlertDialog
        open={showDeleteBrandDialog}
        onOpenChange={setShowDeleteBrandDialog}
      >
        <AlertDialogTrigger asChild>
          <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/20 transition duration-300 cursor-pointer">
            <Trash2 size={16} />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to delete <b>{supplierData.name}</b> Supplier?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              Brand.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                disabled={loading}
                onClick={(e) => handleDeleteSupplier(e)}
              >
                {loading ? (
                  <div className="flex w-full items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Deleting Supplier</span>
                  </div>
                ) : (
                  "Delete Supplier"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const CreateNewSupplier = ({
  supplierData,
  setIsOpen,
}: {
  supplierData: Suppliers[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const [supplierName, setSupplierName] = useState<string>("");
  const [supplierEmail, setSupplierEmail] = useState<string>("");
  const [supplierPhone, setSupplierPhone] = useState<string>("");
  const [supplierAddress, setSupplierAddress] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [gstNumber, setGstNumber] = useState<string>("");

  // Combobox popover states
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState("");

  const [errorStates, setErrorStates] = useState<{
    nameError: string | null;
    stateError: string | null;
    phoneError: string | null;
    addressError: string | null;
  }>({
    nameError: null,
    addressError: null,
    phoneError: null,
    stateError: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [dialogType, setDialogType] = useState<"manage" | "create">("manage");

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";
    return () => {
      // Unlock scroll when modal unmounts
      document.body.style.overflow = "";
    };
  }, []);

  const createSupplier = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setErrorStates({
        nameError: null,
        addressError: null,
        stateError: null,
        phoneError: null,
      });

      const mobileRegex = /^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/;

      if (!supplierName) {
        setErrorStates((prev) => ({
          ...prev,
          nameError: "Supplier name is required",
        }));
        return;
      }

      if (!supplierAddress) {
        setErrorStates((prev) => ({
          ...prev,
          addressError: "Supplier address is required",
        }));
        return;
      }

      if (!state) {
        setErrorStates((prev) => ({
          ...prev,
          stateError: "Supplier state is required",
        }));
        return;
      }

      if (!supplierPhone) {
        setErrorStates((prev) => ({
          ...prev,
          phoneError: "Supplier mobile no is required",
        }));
        return;
      }

      if (!mobileRegex.test(supplierPhone)) {
        setErrorStates((prev) => ({
          ...prev,
          phoneError: "Invalid Mobile number. Please check it.",
        }));
        return;
      }

      setLoading(true);

      const supplierData = {
        supplierName,
        supplierAddress,
        state,
        supplierPhone,
        supplierEmail,
        gstNumber,
      };

      const response: { success: boolean; message: string } =
        await createNewSupplier(supplierData);

      if (response.success) {
        router.refresh();
        toast.success(response.message);
        setDialogType("manage");
      }

      if (!response.success) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while creating brand", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      <Card className="max-w-xl w-[95%]">
        <CardHeader>
          <CardTitle>
            {dialogType === "manage"
              ? "Manage your Suppliers"
              : "Create Supplier"}
          </CardTitle>
          <CardDescription>
            {dialogType === "manage" &&
              "Here you can view all your supplier and can manage them."}
          </CardDescription>
        </CardHeader>
        <CardContent className=" w-full  h-[450px] overflow-auto">
          {dialogType === "create" ? (
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Supplier Name</Label>
                <Input
                  id="name-1"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Supplier name here"
                  className="text-sm"
                />
                {errorStates.nameError && (
                  <p className="text-red-500 text-xs mt-2">
                    {errorStates.nameError}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="supplierAddress">Supplier Address</Label>
                <Textarea
                  id="supplierAddress"
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  placeholder="Supplier Address"
                  className="text-sm resize-none h-24"
                />
                {errorStates.addressError && (
                  <p className="text-red-500 text-xs mt-2">
                    {errorStates.addressError}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="supplierAddress">Supplier State</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {state
                        ? INDIAN_STATES.find((item) => item === state)
                        : "Select state..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No States found.</CommandEmpty>
                        <CommandGroup>
                          {INDIAN_STATES.map((item) => (
                            <CommandItem
                              key={item}
                              value={item}
                              onSelect={(currentValue) => {
                                setState(
                                  currentValue === state ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              {item}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  state === item ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errorStates.stateError && (
                  <p className="text-red-500 text-xs mt-2">
                    {errorStates.stateError}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="supplierPhone">Mobile Number</Label>
                <Input
                  id="supplierPhone"
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  placeholder="Supplier Mobile No"
                  className="text-sm"
                />
                {errorStates.phoneError && (
                  <p className="text-red-500 text-xs mt-2">
                    {errorStates.phoneError}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="supplierEmail">Supplier Email (optional)</Label>
                <Input
                  id="supplierEmail"
                  value={supplierEmail}
                  onChange={(e) => setSupplierEmail(e.target.value)}
                  placeholder="Supplier Email"
                  className="text-sm"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="supplierGst">Supplier GSTIN (optional)</Label>
                <Input
                  id="supplierGst"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="Supplier GSTIN"
                  className="text-sm"
                />
              </div>
            </div>
          ) : supplierData && supplierData.length > 0 ? (
            <ScrollArea className="h-92">
              {supplierData.map((brand) => (
                <SupplierCard key={brand.id} supplierData={brand} />
              ))}
            </ScrollArea>
          ) : (
            <p>No Suppliers</p>
          )}
        </CardContent>

        <CardFooter>
          {dialogType === "create" ? (
            <div className="w-full flex flex-col gap-2 sm:flex-row items-center sm:justify-end">
              <Button
                disabled={loading}
                onClick={(e) => createSupplier(e)}
                className="w-full sm:w-max"
              >
                {loading ? (
                  <div className="flex w-full items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Creating Supplier</span>
                  </div>
                ) : (
                  "Create Supplier"
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
                disabled={loading}
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

export default CreateNewSupplier;
