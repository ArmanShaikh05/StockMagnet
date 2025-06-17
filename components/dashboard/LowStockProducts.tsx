"use client";

import { getLowStockProductsDataofBranch } from "@/actions/branchActions";
import { useBranchStore } from "@/store/branchStore";
import { SerializedLowStockProductType } from "@/types/serializedTypes";
import { formatToINRCurrency } from "@/utils/helper";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import NoLowStock from "../empty/NoLowStock";
import { ScrollArea } from "../ui/scroll-area";

const ProductCard = ({
  MRP,
  Brand,
  productName,
  productImage,
  stockInHand,
}: SerializedLowStockProductType) => {
  return (
    <div className="w-full flex items-center cursor-pointer py-4 lg:px-4  hover:bg-main/20 border-b">
      <div className="flex flex-1 items-center gap-4">
        <Image
          src={productImage}
          alt="product-image"
          height={50}
          width={60}
          className="rounded-sm overflow-hidden"
        />
        <div className="flex flex-col gap-2 justify-between">
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold leading-4 ">{productName}</h4>
            <Badge
              className="text-white text-xs uppercase font-normal"
              style={{ backgroundColor: Brand.colorCode }}
            >
              {Brand.brandName}
            </Badge>
          </div>
          <h2 className="text-[16px] font-bold">
            {formatToINRCurrency(parseFloat(MRP))}
          </h2>
        </div>
      </div>
      <div className="bg-gray-200 flex justify-center items-center w-14 h-12 rounded-full">
        <span className="font-semibold text-[16px] text-gray-600">
          {stockInHand}
        </span>
      </div>
    </div>
  );
};

const LowStockProducts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [lowStockProductsData, setLowStockProductsData] = useState<
    SerializedLowStockProductType[]
  >([]);
  const { selectedBranch } = useBranchStore();

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        setLoading(true);
        const response: {
          success: boolean;
          message: string;
          data?: SerializedLowStockProductType[];
        } = await getLowStockProductsDataofBranch(selectedBranch.id);

        if (response.data) {
          setLowStockProductsData(response.data);
        }
        setLoading(false);
      }
    })();
  }, [selectedBranch]);

  return loading ? (
    <Skeleton className="w-full h-[500px]" />
  ) : (
    <Card className="shadow-lg">
      <CardContent>
        <h2 className="text-[16px] font-bold text-balance capitalize">
          Low Stock Products
        </h2>
        {lowStockProductsData.length > 0 ? (
          <ScrollArea className="h-[500px]">
            <div className="w-full flex flex-col gap-0 mt-8">
              {lowStockProductsData.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="w-full h-full flex items-center pt-12">
            <NoLowStock />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockProducts;
