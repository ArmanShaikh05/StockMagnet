"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Branches } from "@/lib/generated/prisma";
import { Edit, Ellipsis, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import EditBranchDialog from "./EditBranchDialog";
import { useState } from "react";

const BranchesCard = ({ branchData }: { branchData: Branches }) => {
  const router = useRouter();
  const [editDialog, setEditDialog] = useState<boolean>(false);

  return (
    <Card>
      <CardContent>
        <div className="w-full flex  items-center justify-center ">
          <Image
            src={branchData.branchImage}
            alt="branch-image"
            width={400}
            height={300}
            className="h-64 w-full object-contain"
          />
        </div>
        <div className="w-full flex flex-col mt-6">
          <div className="flex flex-row items-center mb-2">
            <h1 className="text-xl grow text-balance w-24">
              {branchData.branchName}
            </h1>
            {branchData.isPrimary && (
              <Badge variant={"default"}>
                <Star />
                <span>primary</span>
              </Badge>
            )}
          </div>
          <p className="text-sm mb-6">{branchData.branchAddress}</p>
          <div className="flex w-full items-center justify-between">
            <Button
              size={"sm"}
              className="text-xs"
              onClick={() => router.push(`/branches/${branchData.id}`)}
            >
              View Branch
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-main/20 transition duration-200">
                  <Ellipsis size={16} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={4}>
                <DropdownMenuLabel>Branch Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div
                    className="w-full flex items-center gap-2"
                    onClick={() => setEditDialog(true)}
                  >
                    <Edit size={14} />
                    <span className="text-xs">Edit</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <div className="w-full flex items-center gap-2">
                    <Star size={14} />
                    <span className="text-xs">Make Primary</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild variant="destructive">
                  <div className="w-full flex items-center gap-2">
                    <Trash2 size={14} />
                    <span className="text-xs">Delete</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {editDialog && (
            <EditBranchDialog
              branchData={branchData}
              openDialog={editDialog}
              setOpenDialog={setEditDialog}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchesCard;
