"use client";

import { useEffect, useState } from "react";

import { getBranchCardData } from "@/actions/branchActions";
import StatCard from "@/components/common/StatCard";
import { CardDataType } from "@/types/types";
import { formatToINRCurrency } from "@/utils/helper";
import { Banknote, DollarSign, FileSpreadsheet, Package2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const CardsSection = ({ branchId }: { branchId: string }) => {
  const [cardData, setCardData] = useState<CardDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getBranchCardData(branchId);
      if (response.data) {
        const data = response.data;
        setCardData([
          {
            icon: Banknote,
            title: "Total Revenue",
            value: formatToINRCurrency(data.currentMonthTotalRevenue),
            percentChange: data.revenuePercentChange,
            positiveChange:
              Number(data.revenuePercentChange.slice(0, -1) || 0) > 0
                ? true
                : false,
            theme: "green",
          },
          {
            icon: DollarSign,
            title: "Total Profit",
            value: formatToINRCurrency(data.currentMonthTotalProfit),
            percentChange: data.profitPercentChange,
            positiveChange:
              Number(data.profitPercentChange.slice(0, -1) || 0) > 0
                ? true
                : false,
            theme: "blue",
          },
          {
            icon: Package2,
            title: "Total Stocks",
            value: data.currentMonthTotalStock.toString(),
            percentChange: data.stockPercentChange,
            positiveChange:
              Number(data.stockPercentChange.slice(0, -1) || 0) > 0
                ? true
                : false,
            theme: "orange",
          },
          {
            icon: FileSpreadsheet,
            title: "Total Invoices",
            value: data.currentMonthTotalSales.toString(),
            percentChange: data.salesPercentChange,
            positiveChange:
              Number(data.salesPercentChange.slice(0, -1) || 0) > 0
                ? true
                : false,
            theme: "red",
          },
        ]);
      }
      setLoading(false);
    })();
  }, [branchId]);

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
            />
          ))}
    </div>
  );
};

export default CardsSection;
