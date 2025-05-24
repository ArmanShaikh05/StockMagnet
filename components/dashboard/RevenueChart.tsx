"use client";

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import RevenueChartRangeDropdown, {
  RangeOption,
} from "./RevenueChartRangeDropdown";

// Chart Data
const chartData = {
  weekly: [
    { day: "Monday", desktop: 150 },
    { day: "Tuesday", desktop: 52 },
    { day: "Wednesday", desktop: 41 },
    { day: "Thursday", desktop: 65 },
    { day: "Friday", desktop: 23 },
    { day: "Saturday", desktop: 18 },
    { day: "Sunday", desktop: 27 },
  ],
  monthly: [
    { week: "Week 1", desktop: 120 },
    { week: "Week 2", desktop: 98 },
    { week: "Week 3", desktop: 132 },
    { week: "Week 4", desktop: 114 },
  ],
  yearly: [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
    { month: "July", desktop: 214 },
    { month: "August", desktop: 214 },
    { month: "September", desktop: 214 },
    { month: "October", desktop: 264 },
    { month: "November", desktop: 254 },
    { month: "December", desktop: 304 },
  ],
};

const chartConfig: ChartConfig = {
  desktop: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
};

const labelToKeyMap = {
  "This Week": "weekly",
  "This Month": "monthly",
  "This Year": "yearly",
} as const;

const keyToDataKey = {
  weekly: "day",
  monthly: "week",
  yearly: "month",
} as const;

const RevenueChart = () => {
  const [range, setRange] = useState<RangeOption>("This Year");

  const { actualChartData, xAxisKey } = useMemo(() => {
    const key = labelToKeyMap[range];
    const dataKey = keyToDataKey[key];
    return {
      actualChartData: chartData[key],
      xAxisKey: dataKey,
    };
  }, [range]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>
              Showing total revenue growth based on selected range
            </CardDescription>
          </div>
          <RevenueChartRangeDropdown range={range} setRange={setRange} />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={actualChartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) =>
                value.startsWith("Week")
                  ? value.replace("eek ","")
                  : value.length > 3
                  ? value.slice(0, 3)
                  : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RevenueChart;
