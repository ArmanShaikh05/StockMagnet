"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", year: "2025", new: 1260, sold: 570, remaining: 200 },
];

const chartConfig = {
  new: {
    label: "New Stock",
    color: "hsl(var(--chart-1))",
  },
  sold: {
    label: "Sold Stock",
    color: "hsl(var(--chart-2))",
  },
  remaining: {
    label: "Remaining Stock",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const BranchStockSummaryChart = () => {
  const totalStock =
    chartData[0].new + chartData[0].sold + chartData[0].remaining;

  return (
    <Card className="flex flex-col shadow-xl">
      <CardHeader className="items-center pb-0">
        <CardTitle>Monthly Stock Summary</CardTitle>
        <CardDescription>
          {chartData[0].month} {chartData[0].year}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full gap-6 flex-1 items-center pb-0">
        <div className="w-full grid grid-cols-3 gap-2  place-items-center h-max">
          <div className="flex flex-col border-l-8 border-[#FF9777] pl-2 h-full">
            <span className="text-xs font-light">New Stock</span>
            <span className="text-2xl font-bold">{chartData[0].new}</span>
          </div>
          <div className="flex flex-col border-l-8 border-[#39D3F2] pl-2 h-full">
            <span className="text-xs font-light">Sold Stock</span>
            <span className="text-2xl font-bold">{chartData[0].sold}</span>
          </div>
          <div className="flex flex-col border-l-8 border-[#D9D9D9] pl-2 h-full">
            <span className="text-xs font-light">Remaining Stock</span>
            <span className="text-2xl font-bold">{chartData[0].remaining}</span>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto  w-full max-w-[250px] h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalStock.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Total Stock
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="remaining"
              fill="#D9D9D9"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />

            <RadialBar
              dataKey="sold"
              fill="#39D3F2"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />

            <RadialBar
              dataKey="new"
              stackId="a"
              cornerRadius={5}
              fill="#FF9777"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the stock summary for the month of {chartData[0].month}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BranchStockSummaryChart;
