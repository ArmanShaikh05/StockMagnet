"use client";

import React, { useRef, useState } from "react";

import { editBranchDetails } from "@/actions/branchActions";
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
import { Branches } from "@/lib/generated/prisma";
import { uploadImageToImagekit } from "@/lib/imageUpload";
import { Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

type ErrorState = {
  branchName?: string;
  branchAddress?: string;
  branchImage?: string;
};

const EditBranchDialog = ({
  branchData,
  openDialog,
  setOpenDialog,
}: {
  branchData: Branches;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(
    branchData.branchImage
  );
  const [branchName, setBranchName] = useState<string>(
    branchData.branchName || ""
  );
  const [branchAddress, setBranchAddress] = useState<string>(
    branchData.branchAddress || ""
  );
  const [gstNumber, setGstNumber] = useState<string>(
    branchData.GstNumber || ""
  );
  const [errorState, setErrorState] = useState<ErrorState>({});
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleImageChange = () => {
    if (fileInputRef.current) {
      const file = fileInputRef.current?.files?.[0] || null;
      if (file) {
        const preview = URL.createObjectURL(file);
        setSelectedFile(file);
        setFilePreviewUrl(preview);
        console.log({ preview, file });
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
  };

  const editBranch = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    let hasError = false;
    setErrorState({});

    if (!selectedFile && !filePreviewUrl) {
      setErrorState((prev) => ({
        ...prev,
        branchImage: "Branch image is required.",
      }));
      hasError = true;
    }

    if (!branchName) {
      setErrorState((prev) => ({
        ...prev,
        branchName: "Branch name is required.",
      }));
      hasError = true;
    }

    if (!branchAddress) {
      setErrorState((prev) => ({
        ...prev,
        branchAddress: "Branch address is required.",
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      let image = filePreviewUrl;
      if (selectedFile) {
        const uploadFileResponse = await uploadImageToImagekit(selectedFile);
        if (uploadFileResponse) {
          image = uploadFileResponse.url || filePreviewUrl;
        }
      }
      const newBranchData = {
        branchName,
        branchAddress,
        branchImage: image || "",
        gstNumber,
      };

      const response: { success: boolean; message: string } =
        await editBranchDetails({
          branchId: branchData.id,
          data: newBranchData,
        });

      if (response.success) {
        router.refresh();
        toast.success(response.message);
        setOpenDialog(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Branch Data</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="h-[400px]">
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
              {errorState.branchImage && (
                <p className="text-xs sm:text-sm text-red-500 mt-2">
                  {errorState.branchImage}
                </p>
              )}
            </div>
          )}

          <div className="w-full flex flex-col gap-2 px-2 mt-6">
            <Label htmlFor="branchName" className="text-xs">
              Branch Name
            </Label>
            <Input
              type="text"
              id="branchName"
              placeholder="Branch Name"
              className="text-xs"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            />
            {errorState.branchName && (
              <p className="text-xs text-red-500 mt-2">
                {errorState.branchName}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 mt-6">
            <Label htmlFor="branchName" className="text-xs">
              Branch Address
            </Label>
            <Textarea
              id="branchName"
              placeholder="Branch Address"
              className="resize-none h-28 text-xs"
              value={branchAddress}
              onChange={(e) => setBranchAddress(e.target.value)}
            />
            {errorState.branchAddress && (
              <p className="text-xs text-red-500 mt-2">
                {errorState.branchAddress}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-2 px-2 mt-6">
            <Label htmlFor="gstNumber" className="text-xs">
              GST Number <span className="text-[10px]">(optional)</span>
            </Label>
            <Input
              type="text"
              id="gstNumber"
              placeholder="GST Number"
              className="text-xs"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
            />
          </div>
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button disabled={loading} onClick={(e) => editBranch(e)}>
              {loading ? (
                <div className="flex w-full items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Editing Branch</span>
                </div>
              ) : (
                "Edit Branch"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditBranchDialog;
