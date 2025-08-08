"use client";

import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar1Icon, Loader2, Plus, Trash2, Upload } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createNewPurchaseOrder } from "@/actions/purchaseOrderActions";
import { Branches, Suppliers } from "@/lib/generated/prisma";
import { uploadImageToImagekit } from "@/lib/imageUpload";
import { useBranchStore } from "@/store/branchStore";
import {
  PurchaseOrderProductsErrorsTypes,
  PurchaseOrderProductsType,
} from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CreateNewSupplier from "./CreateNewSupplier";
import HandlePurchaseOrderProducts from "./HandlePurchaseOrderProducts";

type ErrorStates = {
  purchaseDateError: string;
  branchError: string;
  supplierError: string;
  paymentModeError: string;
  paymentStatusError: string;
  creditedAmountError: string;
};

const CreatePurchaseOrder = ({
  suppliers,
  branches,
}: {
  suppliers: Suppliers[];
  branches: Branches[];
}) => {
  const { selectedBranch } = useBranchStore();
  const router = useRouter();

  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [purchaseDateDialogOpen, setPurchaseDateDialogOpen] =
    useState<boolean>(false);
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(
    new Date()
  );
  const [supplierId, setSupplierId] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [creditedAmount, setCreditedAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [branchId, setBranchId] = useState<string>("");
  const [productsArray, setProductsArray] = useState<
    PurchaseOrderProductsType[]
  >([
    {
      productId: "",
      quantity: 1,
      productImage: "",
      productName: "",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const [errorStates, setErrorStates] = useState<ErrorStates>({
    purchaseDateError: "",
    branchError: "",
    supplierError: "",
    paymentModeError: "",
    paymentStatusError: "",
    creditedAmountError: "",
  });

  const [productErrors, setProductErrors] = useState<
    PurchaseOrderProductsErrorsTypes[]
  >([
    {
      productId: "",
      quantity: "",
    },
  ]);

  const [supplierDialogOpen, setSupplierDialogOpen] = useState<boolean>(false);
  const [supplierSelect, setSupplierSelect] = useState(false);

  const handleImageChange = () => {
    if (fileInputRef.current) {
      const file = fileInputRef.current?.files?.[0] || null;
      if (file) {
        const preview = URL.createObjectURL(file);
        setSelectedFile(file);
        setFilePreviewUrl(preview);
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
  };

  const createPurchaseOrder = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setLoading(true);

      // Clear existing errors first
      const newErrorStates: ErrorStates = {
        purchaseDateError: "",
        branchError: "",
        supplierError: "",
        paymentModeError: "",
        paymentStatusError: "",
        creditedAmountError: "",
      };

      let hasFormError = false;

      // Validate each field

      if (!purchaseDate) {
        newErrorStates.purchaseDateError = "Please enter purchase date";
        toast.error("Please enter purchase date");
        hasFormError = true;
      }

      if (!selectedBranch) {
        newErrorStates.branchError = "Please select a branch";
        toast.error("Please select a branch");
        hasFormError = true;
      }

      if (!supplierId) {
        newErrorStates.supplierError = "Please select a supplier";
        toast.error("Please select a supplier");
        hasFormError = true;
      }

      if (!paymentMode) {
        newErrorStates.paymentModeError = "Please select payment mode";
        toast.error("Please select payment mode");
        hasFormError = true;
      }

      if (!paymentStatus) {
        newErrorStates.paymentStatusError = "Please select payment status";
        toast.error("Please select payment status");
        hasFormError = true;
      }

      if (paymentStatus === "Credited" && creditedAmount === 0) {
        newErrorStates.creditedAmountError = "Please enter credited amount";
        toast.error("Please enter credited amount");
        hasFormError = true;
      }

      // Apply all general form errors at once
      setErrorStates(newErrorStates);

      // If form errors exist, stop
      if (hasFormError) return;

      // Validate product fields
      const newProductErrors: PurchaseOrderProductsErrorsTypes[] = [];

      productsArray.forEach((product, index) => {
        const error: PurchaseOrderProductsErrorsTypes = {};

        if (!product.productId) error.productId = "Product is required";
        if (!product.quantity || product.quantity <= 0)
          error.quantity = "Quantity must be greater than 0";

        newProductErrors[index] = error;
      });

      setProductErrors(newProductErrors);

      const hasProductErrors = newProductErrors.some(
        (err) => Object.keys(err).length > 0
      );
      if (hasProductErrors) {
        toast.error("Please fill product details properly.");
        return;
      }

      // ✅ If no errors, continue to create invoice
      let invoiceImageUrl = "";
      let invoiceImageId = "";

      if (selectedFile) {
        const uploadResponse = await uploadImageToImagekit(
          selectedFile,
          `PurchaseOrders`
        );

        if (uploadResponse && uploadResponse.url && uploadResponse?.fileId) {
          invoiceImageUrl = uploadResponse.url;
          invoiceImageId = uploadResponse?.fileId;
        }
      }

      const totalQuantity = productsArray.reduce((acc, curr) => {
        return acc + curr.quantity;
      }, 0);

      const invoiceData = {
        invoiceNumber,
        purchaseDate: purchaseDate!,
        branchId: branchId,
        supplier: supplierId,
        products: productsArray,
        paymentMode: paymentMode,
        status: paymentStatus,
        creditedAmount: creditedAmount,
        invoiceImageId: invoiceImageId,
        invoiceImageURL: invoiceImageUrl,
        totalQuantity,
      };

      const response: { success: boolean; message: string } =
        await createNewPurchaseOrder(invoiceData);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        router.push("/purchases");
      }

      if (!response.success) {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col sm:px-8 gap-8 mt-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 ">
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-sm font-bold capitalize text-balance text-main">
            Purchase Order Details
          </h2>

          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-2 px-2 mt-4">
              <Label htmlFor="invoiceNo" className="text-xs">
                Supplier Invoice No (optional)
              </Label>
              <Input
                type="text"
                id="invoiceNo"
                placeholder="Invoice No"
                className="text-xs"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col gap-2 px-2 ">
              <Label htmlFor="purchaseDate" className="px-1 text-xs">
                Purchase Date
              </Label>
              <Popover
                open={purchaseDateDialogOpen}
                onOpenChange={setPurchaseDateDialogOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="purchaseDate"
                    className="w-full text-xs justify-between font-normal"
                  >
                    {purchaseDate
                      ? purchaseDate.toLocaleDateString()
                      : "Select date"}
                    <Calendar1Icon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={purchaseDate}
                    captionLayout="dropdown"
                    disabled={(date) => date > new Date()}
                    onSelect={(date) => {
                      setPurchaseDate(date);
                      setPurchaseDateDialogOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errorStates.purchaseDateError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorStates.purchaseDateError}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2 px-2 mt-4">
              <Label htmlFor="branchName" className="text-xs">
                Store Branch
              </Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="max-h-62">
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      <div className="w-full flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={branch.branchImage} />
                          <AvatarFallback>
                            {branch.branchName
                              .split(" ")
                              .map((word) => word[0].toUpperCase())
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs">{branch.branchName}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorStates.branchError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorStates.branchError}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2 px-2 ">
              <Label htmlFor="branchName" className="text-xs">
                Supplier
              </Label>
              <Select
                open={supplierSelect}
                onOpenChange={setSupplierSelect}
                value={supplierId}
                onValueChange={setSupplierId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                  {suppliers.length === 0 && (
                    <p className=" py-2 pl-2 text-sm">No Suppliers</p>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSupplierSelect(false); // close the dropdown
                      setTimeout(() => setSupplierDialogOpen(true), 0); // open modal after dropdown closes
                    }}
                  >
                    New Supplier
                  </Button>
                </SelectContent>
              </Select>
              {supplierDialogOpen && (
                <CreateNewSupplier
                  supplierData={suppliers}
                  setIsOpen={setSupplierDialogOpen}
                />
              )}

              {errorStates.supplierError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorStates.supplierError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 h-full">
          <h2 className="text-sm font-bold capitalize text-balance text-main">
            Invoice Copy <span className="text-xs ml-2">(optional)</span>
          </h2>

          <div className="w-full flex flex-col gap-6 h-full">
            {filePreviewUrl ? (
              <div className="w-full h-[22rem]  border-2 border-dashed border-black/80 rounded-2xl flex items-center justify-center mt-6 relative">
                <Image
                  src={filePreviewUrl}
                  alt="branch image"
                  width={150}
                  height={50}
                  className="rounded-sm object-contain h-[90%] w-full"
                />
                <Trash2
                  size={16}
                  className="absolute top-3 right-[1rem] bg-white h-8 w-8 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition duration-200 text-main border max-[450px]:right-[3%]"
                  onClick={() => removeSelectedImage()}
                />
              </div>
            ) : (
              <div className="w-full h-[22rem] border-2 border-dashed border-black/80 rounded-2xl flex flex-col items-center justify-center pb-10 gap-2 mt-4">
                <Upload size={24} className="text-black/60" />
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="text-sm">Upload Invoice Copy</span>
                </Button>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={() => handleImageChange()}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h2 className="text-sm font-bold capitalize text-balance text-main">
          Product Details
        </h2>

        <HandlePurchaseOrderProducts
          productsArray={productsArray}
          setProductsArray={setProductsArray}
          porductsErrorStates={productErrors}
          selectedBranchId={branchId}
        />

        <Button
          className="flex items-center gap-2 w-max mx-auto mt-6"
          variant={"secondary"}
          onClick={() => {
            setProductsArray((prev) => [
              ...prev,
              {
                productId: "",
                quantity: 0,
                productName: "",
                productImage: "",
              },
            ]);
            setProductErrors((prev) => [
              ...prev,
              {
                productId: "",
                quantity: "",
              },
            ]);
          }}
        >
          <Plus size={14} />
          <span className="text-xs md:text-sm">Add more product</span>
        </Button>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h2 className="text-sm font-bold capitalize text-balance text-main">
          Payment Details
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-4">
          <div className="w-full flex flex-col gap-2 px-2 mt-4 md:mt-0">
            <Label htmlFor="paymentMode" className="text-xs">
              Payment Mode
            </Label>
            <Select value={paymentMode} onValueChange={setPaymentMode}>
              <SelectTrigger
                id="paymentMode"
                className="w-full bg-white text-xs"
              >
                <SelectValue placeholder="Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPI" className="">
                  UPI
                </SelectItem>
                <SelectItem value="Cash" className="">
                  Cash
                </SelectItem>
                <SelectItem value="Bank" className="">
                  Bank
                </SelectItem>
              </SelectContent>
            </Select>
            {errorStates.paymentModeError && (
              <p className="text-xs text-red-500 mt-2">
                {errorStates.paymentModeError}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 ">
            <Label htmlFor="paymentStatus" className="px-1 text-xs">
              Payment Status
            </Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger
                id="paymentStatus"
                className="w-full bg-white text-xs"
              >
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FullPaid" className="">
                  FullPaid
                </SelectItem>
                <SelectItem value="Credited" className="">
                  Credited
                </SelectItem>
                <SelectItem value="NotPaid" className="">
                  NotPaid
                </SelectItem>
              </SelectContent>
            </Select>
            {errorStates.paymentStatusError && (
              <p className="text-xs text-red-500 mt-2">
                {errorStates.paymentStatusError}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 ">
            <Label htmlFor="creditedAmount" className="text-xs">
              Credited Amount
            </Label>

            <Input
              type="number"
              id="creditedAmount"
              placeholder="Credited Amount"
              min={0}
              disabled={paymentStatus !== "Credited"}
              className="text-xs"
              value={creditedAmount}
              onChange={(e) => setCreditedAmount(Number(e.target.value))}
            />
            {errorStates.creditedAmountError && (
              <p className="text-xs text-red-500 mt-2">
                {errorStates.creditedAmountError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-end gap-4 mt-6">
        <Button disabled={loading} onClick={(e) => createPurchaseOrder(e)}>
          {loading ? (
            <div className="flex w-full items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Creating...</span>
            </div>
          ) : (
            "Create Purchase Order"
          )}
        </Button>
        <Link href={"/dashboard"}>
          <Button disabled={loading} variant={"secondary"} className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
