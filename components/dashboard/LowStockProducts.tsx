import React from "react";
import { Card, CardContent } from "../ui/card";
import { LowStockProductTypes } from "@/types/types";
import Image from "next/image";
import { formatToINRCurrency } from "@/utils/helper";

const lowStockData: LowStockProductTypes[] = [
  {
    name: "Nike Air Max 170",
    category: "Battery",
    price: 17000,
    stock: 10,
    image: "/stock.png",
  },
  {
    name: "Nike Air Max 170",
    category: "Battery",
    price: 17000,
    stock: 10,
    image: "/stock.png",
  },
  {
    name: "Nike Air Max 170",
    category: "Battery",
    price: 17000,
    stock: 10,
    image: "/stock.png",
  },
  {
    name: "Nike Air Max 170",
    category: "Battery",
    price: 17000,
    stock: 10,
    image: "/stock.png",
  },
  {
    name: "Nike Air Max 170",
    category: "Battery",
    price: 17000,
    stock: 10,
    image: "/stock.png",
  },
];

const ProductCard = ({
  name,
  category,
  image,
  price,
  stock,
}: LowStockProductTypes) => {
  return (
    <div className="w-full flex items-center cursor-pointer py-4  hover:bg-main/20">
      <div className="flex flex-1 items-center gap-4">
        <Image
          src={image}
          alt="product-image"
          height={50}
          width={70}
          className="rounded-sm overflow-hidden"
        />
        <div className="flex flex-col gap-2 justify-between">
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold leading-4 ">{name}</h4>
            <p className="text-xs font-normal uppercase">{category}</p>
          </div>
          <h2 className="text-lg font-bold">{formatToINRCurrency(price)}</h2>
        </div>
      </div>
      <div className="bg-gray-200 flex justify-center items-center w-14 h-12 rounded-full">
        <span className="font-semibold text-lg text-gray-600">{stock}</span>
      </div>
    </div>
  );
};

const LowStockProducts = () => {
  return (
    <Card className="shadow-lg">
      <CardContent>
        <h2 className="text-xl font-bold text-balance capitalize">
          Low Stock Products
        </h2>
        <div className="w-full flex flex-col gap-0 mt-8">
          {lowStockData.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockProducts;
