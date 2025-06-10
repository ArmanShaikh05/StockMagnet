"use client";

import { createNewCategory, deleteCategory } from "@/actions/utilityActions";
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
import { SerializedCategoryType } from "@/types/serializedTypes";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";

const Categorycard = ({
  categoryData,
}: {
  categoryData: SerializedCategoryType;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] =
    useState<boolean>(false);

  const handleDeleteCategory = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setLoading(true);

      const response: { success: boolean; message: string } =
        await deleteCategory(categoryData.id);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
        setShowDeleteCategoryDialog(false);
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
        <h2 className="text-sm">{categoryData.categoryName}</h2>
        <p className="text-[10px]">{categoryData.totalProducts} products</p>
      </div>

      <AlertDialog
        open={showDeleteCategoryDialog}
        onOpenChange={setShowDeleteCategoryDialog}
      >
        <AlertDialogTrigger asChild>
          {categoryData.totalProducts === 0 && (
            <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/20 transition duration-300 cursor-pointer">
              <Trash2 size={16} />
            </div>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to delete <b>{categoryData.categoryName}</b> Category?
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
                onClick={(e) => handleDeleteCategory(e)}
              >
                {loading ? (
                  <div className="flex w-full items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Deleting Category</span>
                  </div>
                ) : (
                  "Delete Category"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const CreateNewCategory = ({
  categoryData,
  setIsOpen,
}: {
  categoryData: SerializedCategoryType[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const [dialogType, setDialogType] = useState<"manage" | "create">("manage");

  const [categoryName, setCategoryName] = useState<string>("");
  const [colorCode, setColorCode] = useState<string>("x");
  const [errorStates, setErrorStates] = useState<{
    nameError: string | null;
    colorError: string | null;
  }>({
    nameError: null,
    colorError: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const colors = [
    "bg-[#BFD8B8]",
    "bg-[#D0C9E2]",
    "bg-[#F5CBA7]",
    "bg-[#A7D3E9]",
    "bg-[#F7E1AE]",
    "bg-[#A8C686]",
    "bg-[#D9B8FF]",
    "bg-[#BEE5D3]",
    "bg-[#F2B8B5]",
  ];

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";
    return () => {
      // Unlock scroll when modal unmounts
      document.body.style.overflow = "";
    };
  }, []);

  const createCategory = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      setErrorStates({
        nameError: null,
        colorError: null,
      });

      if (!categoryName) {
        setErrorStates((prev) => ({
          ...prev,
          nameError: "Category name is required",
        }));
        return;
      }

      if (!colorCode || colorCode === "x") {
        setErrorStates((prev) => ({
          ...prev,
          colorError: "color code is required",
        }));
        return;
      }

      setLoading(true);

      const categoryData = {
        categoryName,
        colorCode,
      };

      const response: { success: boolean; message: string } =
        await createNewCategory(categoryData);

      if (response.success) {
        router.refresh();
        toast.success(response.message);
        setDialogType("manage");
      }

      if (!response.success) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while creating category", error);
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
              ? "Manage your Categories"
              : "Create Category"}
          </CardTitle>
          <CardDescription>
            {dialogType === "manage" &&
              "Here you can view all your categories along with number of products and can remove brand with none."}
          </CardDescription>
        </CardHeader>
        <CardContent className=" w-full ">
          {dialogType === "create" ? (
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Category Name</Label>
                <Input
                  id="name-1"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Category name here"
                />
                {errorStates.nameError && (
                  <p className="text-red-500 text-xs mt-2">
                    {errorStates.nameError}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label>Color code</Label>
                <div className="w-full flex items-center gap-2 ">
                  {colors.map((color, index) => (
                    <span
                      key={index}
                      className={`h-6 w-6 rounded-full cursor-pointer ${color} ${
                        color.includes(colorCode) && "border-3 border-black"
                      }`}
                      onClick={() => setColorCode(color.slice(4, 11))}
                    />
                  ))}
                </div>
                {errorStates.colorError && (
                  <p className="text-red-500 text-xs mt-2">
                    {errorStates.colorError}
                  </p>
                )}
              </div>
            </div>
          ) : categoryData && categoryData.length > 0 ? (
            <ScrollArea className="h-92">
              {categoryData.map((category) => (
                <Categorycard key={category.id} categoryData={category} />
              ))}
            </ScrollArea>
          ) : (
            <p>No Category</p>
          )}
        </CardContent>

        <CardFooter>
          {dialogType === "create" ? (
            <div className="w-full flex flex-col gap-2 sm:flex-row items-center sm:justify-end">
              <Button
                disabled={loading}
                onClick={(e) => createCategory(e)}
                className="w-full sm:w-max"
              >
                {loading ? (
                  <div className="flex w-full items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Creating Category</span>
                  </div>
                ) : (
                  "Create Category"
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

export default CreateNewCategory;
