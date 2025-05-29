import { BranchesType } from "@/types/types";
import { Edit, Ellipsis, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BranchesCard = ({ branchData }: { branchData: BranchesType }) => {
  return (
    <Card>
      <CardContent>
        <div className="w-full flex items-center justify-center ">
          <Image
            src={branchData.branchImage}
            alt="branch-image"
            width={400}
            height={600}
          />
        </div>
        <div className="w-full flex flex-col mt-4">
          <div className="flex flex-row items-center mb-2">
            <h1 className="text-xl grow text-balance">
              {branchData.branchName}
            </h1>
            <Badge variant={"default"}>
              <Star />
              <span>primary</span>
            </Badge>
          </div>
          <p className="text-sm mb-6">{branchData.branchAddress}</p>
          <div className="flex w-full items-center justify-between">
            <Button size={"sm"} className="text-xs">View Branch</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-main/20 transition duration-200">
                  <Ellipsis size={16} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Branch Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div className="w-full flex items-center gap-2">
                    <Edit size={14} />
                    <span className="text-xs">Edit</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <div className="w-full flex items-center gap-2">
                    <Trash2 size={14} />
                    <span className="text-xs">Delete</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <div className="w-full flex items-center gap-2">
                    <Star size={14} />
                    <span className="text-xs">Make Primary</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchesCard;
