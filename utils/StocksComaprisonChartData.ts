import { StockComparisonChartData } from "@/types/types";

export const generateStockComparisonChartData = (
  branches: StockComparisonChartData[]
) => {
  const colors = [
    "#FF9777",
    "#39D3F2",
    "#A084E8",
    "#F9C80E",
    "#ff8d98",
    "#6A4C93",
    "#43AA8B",
    "#B9FBC0",
    "#F15BB5",
    "#9B5DE5",
    "#00BBF9",
    "#00F5D4",
  ];
  const chartData = branches.map((branch, index) => {
    return {
      branch: branch.name.split(" ").join(""),
      stock: branch.stock,
      fill: colors[index % colors.length],
    };
  });

  return chartData;
};

export const getChartConfigData = (branches: StockComparisonChartData[]) => {
  const colors = [
    "#FF9777",
    "#39D3F2",
    "#A084E8",
    "#F9C80E",
    "#ff8d98",
    "#6A4C93",
    "#43AA8B",
    "#B9FBC0",
    "#F15BB5",
    "#9B5DE5",
    "#00BBF9",
    "#00F5D4",
  ];
  const chartConfig = branches.reduce(
    (acc, curr, index) => {
      const key = curr.name.split(" ").join("");
      acc[key] = {
        label: curr.name,
        colors: colors[index % colors.length],
      };

      return acc;
    },
    {
      stock: {
        label: "Stock",
      },
    } as Record<string, { label: string; colors?: string }>
  );

  return chartConfig;
};
