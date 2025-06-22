"use client";

import { createNewProduct } from "@/actions/productsActions";
import { Branches } from "@/lib/generated/prisma";
import { uploadImageToImagekit } from "@/lib/imageUpload";
import {
  SerializedBrandType,
  SerializedCategoryType,
  SerializedUnitType,
} from "@/types/serializedTypes";
import { taxData } from "@/utils/data";
import { Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import ToolTip from "../common/ToolTip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CreateNewBrand from "./CreateNewBrand";
import CreateNewCategory from "./CreateNewCategory";
import CreateNewUnit from "./CreateNewUnit";

type ErrorTypes = {
  imageError: string | null;
  productNameError: string | null;
  productSnoError: string | null;
  productBrandIdError: string | null;
  productMrpError: string | null;
  purchasePriceError: string | null;
  taxRateError: string | null;
  taxInclusionError: string | null;
  stockInHandError: string | null;
  minStockQtyError: string | null;
  branchError: string | null;
  unitIdError: string | null;
  categoryIdError: string | null;
  tagsError: string | null;
};

const AddProductDialog = ({
  brands,
  branches,
  units,
  categories,
}: {
  brands: SerializedBrandType[];
  branches: Branches[];
  units: SerializedUnitType[];
  categories: SerializedCategoryType[];
}) => {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const [productName, setProductName] = useState<string>("");
  const [productSno, setProductSno] = useState<string>("");
  const [productBrandId, setProductBrandId] = useState<string>("");
  const [productMrp, setProductMrp] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [hsnCode, setHsnCode] = useState<string>("");
  const [taxRate, setTaxRate] = useState<string>("");
  const [taxInclusion, setTaxInclusion] = useState<string>("");
  const [warranty, setWarranty] = useState<number>(0);
  const [stockInHand, setStockInHand] = useState<number>(0);
  const [minStockQty, setMinStockQty] = useState<number>(0);
  const [branch, setBranch] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [reorderQty, setReorderQty] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [errorState, setErrorState] = useState<ErrorTypes>({
    imageError: null,
    productNameError: null,
    productSnoError: null,
    productBrandIdError: null,
    productMrpError: null,
    purchasePriceError: null,
    taxRateError: null,
    taxInclusionError: null,
    stockInHandError: null,
    minStockQtyError: null,
    branchError: null,
    unitIdError: null,
    categoryIdError: null,
    tagsError: null,
  });

  // Select States
  const [brandDialogOpen, setBrandDialogOpen] = useState<boolean>(false);
  const [brandSelect, setBrandSelect] = useState(false);
  const [unitDialogOpen, setUnitDialogOpen] = useState<boolean>(false);
  const [unitSelect, setUnitSelect] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);
  const [categorySelect, setCategorySelect] = useState(false);

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

  const createProduct = async () => {
    try {
      const tagsRegex = /^[A-Za-z, ]+$/;
      setLoading(true);
      setErrorState({
        imageError: null,
        productNameError: null,
        productSnoError: null,
        productBrandIdError: null,
        productMrpError: null,
        purchasePriceError: null,
        taxRateError: null,
        taxInclusionError: null,
        stockInHandError: null,
        minStockQtyError: null,
        branchError: null,
        unitIdError: null,
        categoryIdError: null,
        tagsError: null,
      });

      if (!selectedFile || !filePreviewUrl) {
        setErrorState((prev) => ({
          ...prev,
          imageError: "Please select an image",
        }));
        return;
      }

      if (!productName) {
        setErrorState((prev) => ({
          ...prev,
          productNameError: "Please enter product name",
        }));
        return;
      }

      if (!productSno) {
        setErrorState((prev) => ({
          ...prev,
          productSnoError: "Please enter product S.no",
        }));
        return;
      }

      if (!productBrandId) {
        setErrorState((prev) => ({
          ...prev,
          productBrandIdError: "Please select product brand",
        }));
        return;
      }

      if (!productMrp) {
        setErrorState((prev) => ({
          ...prev,
          productMrpError: "Please enter product MRP",
        }));
        return;
      } else if (productMrp < 0) {
        setErrorState((prev) => ({
          ...prev,
          productMrpError: "Product MRP cannot be less than 0",
        }));
        return;
      }

      if (!purchasePrice) {
        setErrorState((prev) => ({
          ...prev,
          purchasePriceError: "Please enter product MRP",
        }));
        return;
      } else if (purchasePrice < 0) {
        setErrorState((prev) => ({
          ...prev,
          purchasePriceError: "Product MRP cannot be less than 0",
        }));
        return;
      }

      if (!taxRate) {
        setErrorState((prev) => ({
          ...prev,
          taxRateError: "Please select tax rate",
        }));
        return;
      }

      if (!taxInclusion) {
        setErrorState((prev) => ({
          ...prev,
          taxInclusionError: "Please specify the inlcuion of tax",
        }));
        return;
      }

      if (!stockInHand) {
        setErrorState((prev) => ({
          ...prev,
          stockInHandError: "Please enter Stock In Hand",
        }));
        return;
      } else if (stockInHand < 0) {
        setErrorState((prev) => ({
          ...prev,
          stockInHandError: "Stock In Hand cannot be less than 0",
        }));
        return;
      }

      if (!minStockQty) {
        setErrorState((prev) => ({
          ...prev,
          minStockQtyError: "Please enter Minimum Stock Quantity",
        }));
        return;
      } else if (minStockQty < 0) {
        setErrorState((prev) => ({
          ...prev,
          minStockQtyError: "Minimum Stock Quantity cannot be less than 0",
        }));
        return;
      }

      if (!branch) {
        setErrorState((prev) => ({
          ...prev,
          branchError: "Please select a Branch",
        }));
        return;
      }

      if (!unitId) {
        setErrorState((prev) => ({
          ...prev,
          unitIdError: "Please select an Unit",
        }));
        return;
      }

      if (!categoryId) {
        setErrorState((prev) => ({
          ...prev,
          categoryIdError: "Please select a Category",
        }));
        return;
      }

      const isAllTagsValid = tags.every((tag) => tagsRegex.test(tag));

      if (!isAllTagsValid) {
        setErrorState((prev) => ({
          ...prev,
          tagsError: "Tags can only contain letters, spaces and comma(,)",
        }));
        return;
      }

      let productImageUrl = "";
      let productImageId = "";

      const uploadResponse = await uploadImageToImagekit(
        selectedFile,
        "Products"
      );

      if (uploadResponse && uploadResponse.url && uploadResponse?.fileId) {
        productImageUrl = uploadResponse.url;
        productImageId = uploadResponse?.fileId;
      }

      const productData = {
        productImageUrl,
        productImageId,
        productName,
        productSno,
        productBrandId,
        productMrp,
        purchasePrice,
        hsnCode,
        taxRate,
        taxInclusion: taxInclusion === "included" ? true : false,
        warranty,
        stockInHand,
        minStockQty,
        branch,
        unitId,
        reorderQty,
        categoryId,
        tags,
      };

      const response: { success: boolean; message: string } =
        await createNewProduct(productData);

      if (response.success) {
        toast.success(response.message);
        router.push("/inventory");
      }

      if (!response.success) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while creating product", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:px-16">
      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 md:gap-12 h-max">
        {filePreviewUrl ? (
          <div className="w-full h-[15rem] border-2 border-dashed border-black/80 rounded-2xl flex items-center justify-center mt-6 relative">
            <Image
              src={filePreviewUrl}
              alt="branch image"
              width={250}
              height={100}
              className="rounded-sm object-contain h-[90%] w-full"
            />
            <Trash2
              size={16}
              className="absolute top-3 right-[1rem] bg-white h-8 w-8 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition duration-200 text-main border max-[450px]:right-[3%]"
              onClick={() => removeSelectedImage()}
            />
          </div>
        ) : (
          <div className="w-full h-[15rem] border-2 border-dashed border-black/80 rounded-2xl flex flex-col items-center justify-end pb-10 gap-2 mt-6">
            <Upload size={24} className="text-black/60" />
            <Button
              variant={"secondary"}
              size={"sm"}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-sm">Upload Image</span>
            </Button>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={() => handleImageChange()}
            />
            {errorState.imageError && (
              <p className="text-xs sm:text-sm text-red-500 mt-2">
                {errorState.imageError}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-col grow h-full">
          <h1 className="text-sm text-main">Basic Details*</h1>

          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:py-4 h-full">
            <div className="w-full flex flex-col gap-2 px-2 mt-4">
              <Label htmlFor="productName" className="text-xs">
                Product Name
              </Label>
              <Input
                type="text"
                id="productName"
                placeholder="Product Name"
                className="text-xs"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              {errorState.productNameError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorState.productNameError}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2 px-2 mt-4">
              <Label htmlFor="productSno" className="text-xs">
                Product S.no
              </Label>
              <Input
                type="text"
                id="productSno"
                placeholder="Product S.no"
                className="text-xs"
                value={productSno}
                onChange={(e) => setProductSno(e.target.value)}
              />
              {errorState.productSnoError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorState.productSnoError}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2 px-2 mt-4">
              <Label htmlFor="branchName" className="text-xs">
                Product Brand
              </Label>
              <Select
                open={brandSelect}
                onOpenChange={setBrandSelect}
                value={productBrandId}
                onValueChange={setProductBrandId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.brandName}
                    </SelectItem>
                  ))}
                  {brands.length === 0 && (
                    <p className=" py-2 pl-2 text-sm">No Brands</p>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => {
                      setBrandSelect(false); // close the dropdown
                      setTimeout(() => setBrandDialogOpen(true), 0); // open modal after dropdown closes
                    }}
                  >
                    New Brand
                  </Button>
                </SelectContent>
              </Select>
              {brandDialogOpen && (
                <CreateNewBrand
                  brandsData={brands}
                  setIsOpen={setBrandDialogOpen}
                />
              )}

              {errorState.productBrandIdError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorState.productBrandIdError}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2 px-2 mt-4">
              <Label htmlFor="productMrp" className="text-xs">
                Product MRP
              </Label>
              <Input
                type="number"
                id="productMrp"
                placeholder="Product MRP"
                className="text-xs"
                min={0}
                value={productMrp === 0 ? "" : productMrp}
                onChange={(e) => setProductMrp(Number(e.target.value))}
              />
              {errorState.productMrpError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorState.productMrpError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-4 flex flex-col grow h-full">
        <h1 className="text-sm text-main">More Details*</h1>

        <div className="flex flex-col gap-2 md:grid md:grid-cols-3">
          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <Label htmlFor="purchasePrice" className="text-xs">
              Purchase Price
            </Label>
            <Input
              type="number"
              min={0}
              id="purchasePrice"
              placeholder="Purchase Price"
              className="text-xs"
              value={purchasePrice === 0 ? "" : purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
            />
            {errorState.purchasePriceError && (
              <p className="text-xs text-red-500 mt-2">
                {errorState.purchasePriceError}
              </p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <div className="w-full flex items-center gap-2">
              <Label htmlFor="hsnCode" className="text-xs">
                HSN Code
              </Label>
              <ToolTip content="A standardized 6-digit code used to classify goods for GST and international trade. Helps in identifying the type of product and applying the correct tax rate." />
            </div>
            <Input
              type="text"
              id="hsnCode"
              placeholder="HSN Code"
              className="text-xs"
              value={hsnCode}
              onChange={(e) => setHsnCode(e.target.value)}
            />
          </div>

          <div className="flex w-full gap-2 items-center">
            <div className="w-full flex flex-col gap-2 px-2 mt-4">
              <Label htmlFor="taxRate" className="text-xs">
                Tax Rate
              </Label>
              <Select value={taxRate} onValueChange={setTaxRate}>
                <SelectTrigger className="w-full" id="taxRate">
                  <SelectValue placeholder="Tax rate" />
                </SelectTrigger>
                <SelectContent className="h-62">
                  {taxData.map((tax, index) => (
                    <SelectItem key={index} value={tax.label}>
                      {tax.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorState.taxRateError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorState.taxRateError}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col gap-2 px-2 mt-4">
              <Label htmlFor="branchName" className="text-xs">
                Tax Inclusion
              </Label>
              <Select value={taxInclusion} onValueChange={setTaxInclusion}>
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Tax Inclusion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exempted" className="">
                    Exempted
                  </SelectItem>
                  <SelectItem value="included" className="">
                    Included in MRP
                  </SelectItem>
                  <SelectItem value="excluded" className="">
                    Excluded from MRP
                  </SelectItem>
                </SelectContent>
              </Select>
              {errorState.taxInclusionError && (
                <p className="text-xs text-red-500 mt-2">
                  {errorState.taxInclusionError}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <Label htmlFor="warranty" className="text-xs">
              Warranty (months)
            </Label>
            <Input
              type="number"
              id="warranty"
              placeholder="Warranty in months"
              className="text-xs"
              min={0}
              value={warranty === 0 ? "" : warranty}
              onChange={(e) => setWarranty(Number(e.target.value))}
            />
          </div>

          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <div className="w-full flex gap-2">
              <Label htmlFor="stocks" className="text-xs">
                Stock In Hand
              </Label>
              <ToolTip content="Total quantity of the product currently in your inventory." />
            </div>
            <Input
              type="number"
              id="stocks"
              placeholder="Stock"
              className="text-xs"
              min={0}
              value={stockInHand === 0 ? "" : stockInHand}
              onChange={(e) => setStockInHand(Number(e.target.value))}
            />
            {errorState.stockInHandError && (
              <p className="text-xs text-red-500 mt-2">
                {errorState.stockInHandError}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <div className="flex w-full items-center gap-2">
              <Label htmlFor="minStockQty" className="text-xs">
                Min Stock Qty
              </Label>
              <ToolTip content="The minimum number of units you want to keep in stock before restocking." />
            </div>
            <Input
              type="number"
              id="minStockQty"
              placeholder="Min Stock"
              className="text-xs"
              min={0}
              value={minStockQty === 0 ? "" : minStockQty}
              onChange={(e) => setMinStockQty(Number(e.target.value))}
            />
            {errorState.minStockQtyError && (
              <p className="text-xs text-red-500 mt-2">
                {errorState.minStockQtyError}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <Label htmlFor="branchName" className="text-xs">
              Store Branch
            </Label>
            <Select value={branch} onValueChange={setBranch}>
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
            {errorState.branchError && (
              <p className="text-xs text-red-500 mt-2">
                {errorState.branchError}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <Label htmlFor="branchName" className="text-xs">
              Units
            </Label>
            <Select
              open={unitSelect}
              onOpenChange={setUnitSelect}
              value={unitId}
              onValueChange={setUnitId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="h-62">
                {units.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.unitName}{" "}
                    <span className="text-xs font-light">{`(${item.unitCode})`}</span>
                  </SelectItem>
                ))}
                {units.length === 0 && <p className=" py-2 pl-2">No Units</p>}

                <Button
                  className="w-full"
                  onClick={() => {
                    setUnitSelect(false); // close the dropdown
                    setTimeout(() => setUnitDialogOpen(true), 0); // open modal after dropdown closes
                  }}
                >
                  New Unit
                </Button>
              </SelectContent>
            </Select>

            {unitDialogOpen && (
              <CreateNewUnit unitsData={units} setIsOpen={setUnitDialogOpen} />
            )}

            {errorState.unitIdError && (
              <p className="text-xs text-red-500 mt-2">
                {errorState.unitIdError}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <div className="w-full flex items-center gap-2">
              <Label htmlFor="reorderQty" className="text-xs">
                Reorder Qty
              </Label>
              <ToolTip content="The number of units you typically purchase when restocking this product." />
            </div>
            <Input
              type="number"
              id="reorderQty"
              placeholder="Reorder Qty"
              className="text-xs"
              min={0}
              value={reorderQty === 0 ? "" : reorderQty}
              onChange={(e) => setReorderQty(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-[2fr_1fr]">
          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <Label htmlFor="branchName" className="text-xs">
              Category
            </Label>
            <Select
              open={categorySelect}
              onOpenChange={setCategorySelect}
              value={categoryId}
              onValueChange={setCategoryId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.categoryName}
                  </SelectItem>
                ))}
                {categories.length === 0 && (
                  <p className=" py-2 pl-2 text-sm">No category</p>
                )}

                <Button
                  className="w-full"
                  onClick={() => {
                    setCategorySelect(false); // close the dropdown
                    setTimeout(() => setCategoryDialogOpen(true), 0); // open modal after dropdown closes
                  }}
                >
                  New Category
                </Button>
              </SelectContent>
            </Select>

            {categoryDialogOpen && (
              <CreateNewCategory
                categoryData={categories}
                setIsOpen={setCategoryDialogOpen}
              />
            )}
            {errorState.categoryIdError && (
              <p className="text-xs text-red-500 mt-2">
                {errorState.categoryIdError}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 mt-4">
            <div className="w-full flex items-center gap-2">
              <Label htmlFor="tags" className="text-xs">
                Tags
              </Label>
              <ToolTip content='Keywords or labels to help categorize and quickly search for this product (e.g., "summer", "electronics", "bestseller").' />
            </div>
            <Input
              type="text"
              id="tags"
              placeholder="Tags (seperated by ' , ' )"
              className="text-xs"
              value={tags.join(",")}
              onChange={(e) => setTags(e.target.value.split(","))}
            />
            {errorState.tagsError && (
              <p className="text-xs text-red-500 mt-2">
                {errorState.tagsError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-end gap-4 mt-6">
        <Button disabled={loading} onClick={() => createProduct()}>
          {loading ? (
            <div className="flex w-full items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Creating Product</span>
            </div>
          ) : (
            "Create Product"
          )}
        </Button>
        <Link href={"/inventory"}>
          <Button disabled={loading} variant={"secondary"} className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AddProductDialog;
