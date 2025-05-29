import { BranchesType } from "@/types/types";
import { Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const BranchDetails = ({
  singleBranchData,
}: {
  singleBranchData: BranchesType;
}) => {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4 w-full h-full">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-black/20">
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
                    <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer">
                      <Pencil size={16} />
                    </div>
                    <div className="aspect-square w-8 flex justify-center items-center rounded-full hover:bg-main/30 transition duration-200 cursor-pointer">
                      <Trash2 size={16} />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm">{singleBranchData.branchAddress}</p>
              </div>
              <Button className="mb-2">
                <Star size={14} />
                <span className="text-sm">Make Primary</span>
              </Button>
            </div>
          </div>
          <div className="w-full h-24 flex justify-center items-center">
            Branch Statistics
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchDetails;
