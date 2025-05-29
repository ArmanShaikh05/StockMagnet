import React from "react";
import StatCard from "../common/StatCard";
import { DollarSign } from "lucide-react";
import { CardDataType } from "@/types/types";

const cardData: CardDataType[] = [
  {
    icon: DollarSign,
    title: "Total Revenue",
    value: "80,000",
    percentChange: "3.4",
    positiveChange: true,
    theme: "green",
  },
  {
    icon: DollarSign,
    title: "Total Orders",
    value: "80,000",
    percentChange: "3.4",
    positiveChange: false,
    theme: "blue",
  },
  {
    icon: DollarSign,
    title: "Low Stocks",
    value: "80,000",
    percentChange: "3.4",
    positiveChange: true,
    theme: "orange",
  },
  {
    icon: DollarSign,
    title: "Total Invoices",
    value: "80,000",
    percentChange: "3.4",
    positiveChange: true,
    theme: "red",
  },
];

const InvoiceCardSection = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 column gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card) => (
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

export default InvoiceCardSection;
