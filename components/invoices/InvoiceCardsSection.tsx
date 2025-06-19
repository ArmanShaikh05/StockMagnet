"use client";

import { getInvoicesCardData } from "@/actions/invoiceActions";
import { useBranchStore } from "@/store/branchStore";
import { CardDataType } from "@/types/types";
import { DollarSign, FileSpreadsheet } from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "../common/StatCard";
import { Skeleton } from "../ui/skeleton";

const InvoiceCardSection = () => {
  const [cardData, setCardData] = useState<CardDataType[]>([]);
  const { selectedBranch } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        setLoading(true);
        const response = await getInvoicesCardData(selectedBranch.id);
        if (response.data) {
          setCardData([
            {
              icon: FileSpreadsheet,
              title: "Total Invoice",
              value: response.data.totalInvoice.toString(),
              percentChange: "3.4",
              positiveChange: true,
              showPercent: false,
              theme: "green",
            },
            {
              icon: FileSpreadsheet,
              title: "GST Bills",
              value: response.data.totalGstBill.toString(),
              percentChange: "3.4",
              showPercent: false,
              positiveChange: false,
              theme: "blue",
            },
            {
              icon: FileSpreadsheet,
              title: "Credited Invoice",
              value: response.data.totalCreditedBill.toString(),
              percentChange: "3.4",
              positiveChange: true,
              showPercent: false,
              theme: "orange",
            },
            {
              icon: DollarSign,
              title: "Credited Amount",
              value: response.data.totalCreditedAmount.toString(),
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

export default InvoiceCardSection;
