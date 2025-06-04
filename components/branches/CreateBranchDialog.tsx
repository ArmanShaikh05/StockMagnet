"use client";

import React, { useEffect, useRef, useState } from "react";

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
import { Button } from "../ui/button";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { uploadImageToImagekit } from "@/lib/imageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createNewBranch } from "@/actions/branchActions";

type ErrorState = {
  branchName?: string;
  branchAddress?: string;
  branchImage?: string;
};

const CreateBranchDialog = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string>("");
  const [branchAddress, setBranchAddress] = useState<string>("");
  const [gstNumber, setGstNumber] = useState<string>("");
  const [errorState, setErrorState] = useState<ErrorState>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

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

  const createBranch = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let hasError = false;
    setErrorState({});

    if (!selectedFile) {
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
      const uploadFileResponse = await uploadImageToImagekit(
        selectedFile!,
        "Branches"
      );

      if (
        !uploadFileResponse ||
        !uploadFileResponse.url ||
        !uploadFileResponse?.fileId
      ) {
        return toast("Error in uploading image. Please try again!");
      }

      const branchData = {
        branchName,
        branchAddress,
        imageId: uploadFileResponse.fileId,
        branchImage: uploadFileResponse.url,
        gstNumber,
      };

      const response: { success: boolean; message: string } =
        await createNewBranch(branchData);

      if (response.success) {
        toast.success(response.message);
        setOpenDialog(false);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus size={16} />
          <span>Create Branch</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Branch</AlertDialogTitle>
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
            <Button disabled={loading} onClick={(e) => createBranch(e)}>
              {loading ? (
                <div className="flex w-full items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Creating Branch</span>
                </div>
              ) : (
                "Create Branch"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateBranchDialog;
