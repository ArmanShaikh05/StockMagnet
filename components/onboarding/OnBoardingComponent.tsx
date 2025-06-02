"use client";

import { completeOnboarding } from "@/actions/branchActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageToImagekit } from "@/lib/imageUpload";
import { Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";

type ErrorState = {
  firstName?: string;
  lastName?: string;
  branchName?: string;
  branchAddress?: string;
  branchImage?: string;
};

const OnboardingComponent = ({
  firstName,
  lastName,
  id,
}: {
  firstName: string;
  lastName: string;
  id: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string>(firstName);
  const [userLastName, setUserLastName] = useState<string>(lastName);
  const [branchName, setBranchName] = useState<string>("");
  const [branchAddress, setBranchAddress] = useState<string>("");
  const [gstNumber, setGstNumber] = useState<string>("");
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

  const createBranch = async () => {
    const nameRegex = /^[A-Za-z]+$/;
    let hasError = false;
    setErrorState({});

    if (!selectedFile) {
      setErrorState((prev) => ({
        ...prev,
        branchImage: "Branch image is required.",
      }));
      hasError = true;
    }

    if (!userFirstName) {
      setErrorState((prev) => ({
        ...prev,
        firstName: "First name is required.",
      }));
      hasError = true;
    } else if (!nameRegex.test(userFirstName)) {
      setErrorState((prev) => ({
        ...prev,
        firstName: "First name must contain only letters.",
      }));
      hasError = true;
    }

    if (!userLastName) {
      setErrorState((prev) => ({
        ...prev,
        lastName: "Last name is required.",
      }));
      hasError = true;
    } else if (!nameRegex.test(userLastName)) {
      setErrorState((prev) => ({
        ...prev,
        lastName: "Last name must contain only letters.",
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
      const uploadFileResponse = await uploadImageToImagekit(selectedFile!);
      const branchData = {
        branchName,
        branchAddress,
        branchImage: uploadFileResponse?.url || "",
        firstName: userFirstName,
        lastName: userLastName,
        gstNumber,
        userId: id,
        isPrimary: true,
      };

      const response: { success: boolean; message: string } =
        await completeOnboarding(branchData);

      if (response.success) {
        toast.success(response.message);
        router.push("/dashboard");
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
    <Card className="max-[450px]:w-[95%] max-[450px]:mx-auto">
      <CardContent className="w-[95%] xs:w-full mx-auto px-2 xs:px-6">
        <div className="flex flex-col   max-w-[550px] items-center">
          <div className="flex gap-2 items-end ">
            <p className="text-xs sm:text-sm pb-1 ">Welcom To,</p>
            <span className="text-xl sm:text-3xl  text-main font-bold">
              StockMagnet
            </span>
          </div>

          <ScrollArea className="h-[600px]">
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

            <div className="w-full flex gap-4 px-2 mt-6">
              <div className="flex flex-col grow gap-2">
                <Label htmlFor="firstName" className="text-xs">
                  First Name
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  className="text-xs"
                  value={userFirstName}
                  onChange={(e) => setUserFirstName(e.target.value)}
                />
                {errorState.firstName && (
                  <p className="text-xs text-red-500 mt-2">
                    {errorState.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col grow gap-2">
                <Label htmlFor="lastName" className="text-xs">
                  Last Name
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  className="text-xs"
                  value={userLastName}
                  onChange={(e) => setUserLastName(e.target.value)}
                />
                {errorState.lastName && (
                  <p className="text-xs text-red-500 mt-2">
                    {errorState.lastName}
                  </p>
                )}
              </div>
            </div>

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

          <Button
            disabled={loading}
            className="w-full mt-6"
            onClick={() => createBranch()}
          >
            {loading ? (
              <div className="flex w-full items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Creating Branch</span>
              </div>
            ) : (
              "Create Branch"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingComponent;
