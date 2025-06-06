"use client";

import { Branches } from "@/lib/generated/prisma";
import { Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import EditBranchDialog from "../branches/EditBranchDialog";
import MakePrimaryDialog from "../branches/MakePrimaryDialog";
import DeleteBranchDialog from "../branches/DeleteBranchDialog";

const BranchDetails = ({
  singleBranchData,
}: {
  singleBranchData: Branches;
}) => {
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showMakePrimaryBranchDialog, setShowMakePrimaryBranchDialog] =
    useState<boolean>(false);

  return (
    <Card>
      <CardContent>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          <div className="w-full flex items-center justify-center">
            <Image
              src={singleBranchData.branchImage}
              alt={singleBranchData.branchName}
              width={400}
              height={500}
            />
          </div>
          <div className="flex flex-col justify-between gap-6 sm:gap-0">
            <div className="flex flex-col">
              <div className="w-full flex justify-between items-center">
                <h3 className="text-lg font-bold text-balance">
                  {singleBranchData.branchName}
                </h3>
                <div className="flex items-center gap-1">
                  <div
                    className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Pencil size={16} />
                  </div>
                  <div
                    className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 size={16} />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm">{singleBranchData.branchAddress}</p>
            </div>
            <Button
              className="mb-2"
              disabled={singleBranchData.isPrimary}
              onClick={() => setShowMakePrimaryBranchDialog(true)}
            >
              <Star size={14} />
              {singleBranchData.isPrimary ? (
                <span className="text-sm">Primary Branch</span>
              ) : (
                <span className="text-sm">Make Primary</span>
              )}
            </Button>
          </div>
          {showEditDialog && (
            <EditBranchDialog
              branchData={singleBranchData}
              openDialog={showEditDialog}
              setOpenDialog={setShowEditDialog}
            />
          )}

          {showMakePrimaryBranchDialog && (
            <MakePrimaryDialog
              branchId={singleBranchData.id}
              branchName={singleBranchData.branchName}
              open={showMakePrimaryBranchDialog}
              setOpen={setShowMakePrimaryBranchDialog}
            />
          )}

          {showDeleteDialog && (
            <DeleteBranchDialog
              branchId={singleBranchData.id}
              branchName={singleBranchData.branchName}
              open={showDeleteDialog}
              setOpen={setShowDeleteDialog}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchDetails;
