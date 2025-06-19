"use client";

import { getInventoryCardData } from "@/actions/productsActions";
import { useBranchStore } from "@/store/branchStore";
import { CardDataType } from "@/types/types";
import { Package2 } from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "../common/StatCard";
import { Skeleton } from "../ui/skeleton";

const InventoryCardSection = () => {
  const [cardData, setCardData] = useState<CardDataType[]>([]);
  const { selectedBranch } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        setLoading(true);
        const response = await getInventoryCardData(selectedBranch.id);
        if (response.data) {
          setCardData([
            {
              icon: Package2,
              title: "Total Stock",
              value: response.data.totalStock.toString(),
              percentChange: "3.4",
              positiveChange: true,
              showPercent: false,
              theme: "green",
            },
            {
              icon: Package2,
              title: "Low Stocks",
              value: response.data.totalLowStock.toString(),
              percentChange: "3.4",
              showPercent: false,
              positiveChange: false,
              theme: "blue",
            },
            {
              icon: Package2,
              title: "Availabale Stocks",
              value: response.data.totalAvailableStock.toString(),
              percentChange: "3.4",
              positiveChange: true,
              showPercent: false,
              theme: "orange",
            },
            {
              icon: Package2,
              title: "Unavailable Stocks",
              value: response.data.totalUnavailableStock.toString(),
              percentChange: "3.4",
              showPercent: false,
              positiveChange: true,
              theme: "red",
            },
          ]);
        }
        setLoading(false);
      }
    })();
  }, [selectedBranch]);

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 column gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[150px]" />
          ))
        : cardData.map((card) => (
            <StatCard
              key={card.title}
              Icon={card.icon}
              percentChange={card.percentChange}
              positiveChange={card.positiveChange}
              theme={card.theme}
              title={card.title}
              value={card.value}
              showPercent={card?.showPercent}
            />
          ))}
    </div>
  );
};

export default InventoryCardSection;
