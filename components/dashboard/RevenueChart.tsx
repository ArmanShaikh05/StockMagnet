"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { getBranchRevenueChartData } from "@/actions/chartActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useBranchStore } from "@/store/branchStore";
import { RevenueChartDataType } from "@/types/types";
import { Skeleton } from "../ui/skeleton";
import RevenueChartRangeDropdown, {
  RangeOption,
} from "./RevenueChartRangeDropdown";

// Chart Data
// const chartData = {
//   weekly: [
//     { day: "Monday", revenue: 150 },
//     { day: "Tuesday", revenue: 52 },
//     { day: "Wednesday", revenue: 41 },
//     { day: "Thursday", revenue: 65 },
//     { day: "Friday", revenue: 23 },
//     { day: "Saturday", revenue: 18 },
//     { day: "Sunday", revenue: 27 },
//   ],
//   monthly: [
//     { week: "Week 1", revenue: 120 },
//     { week: "Week 2", revenue: 98 },
//     { week: "Week 3", revenue: 132 },
//     { week: "Week 4", revenue: 114 },
//   ],
//   yearly: [
//     { month: "January", revenue: 186 },
//     { month: "February", revenue: 305 },
//     { month: "March", revenue: 237 },
//     { month: "April", revenue: 73 },
//     { month: "May", revenue: 209 },
//     { month: "June", revenue: 0 },
//     { month: "July", revenue: 0 },
//     { month: "August", revenue: 0 },
//     { month: "September", revenue: 0 },
//     { month: "October", revenue: 0 },
//     { month: "November", revenue: 254 },
//     { month: "December", revenue: 304 },
//   ],
// };

const chartConfig: ChartConfig = {
  revenue: {
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
  const { selectedBranch } = useBranchStore();

  const [range, setRange] = useState<RangeOption>("This Year");
  const [chartData, setChartData] = useState<RevenueChartDataType>({
    weekly: [
      { day: "Sunday", revenue: 0 },
      { day: "Monday", revenue: 0 },
      { day: "Tuesday", revenue: 0 },
      { day: "Wednesday", revenue: 0 },
      { day: "Thursday", revenue: 0 },
      { day: "Friday", revenue: 0 },
      { day: "Saturday", revenue: 0 },
    ],
    monthly: [
      { week: "Week 1", revenue: 0 },
      { week: "Week 2", revenue: 0 },
      { week: "Week 3", revenue: 0 },
      { week: "Week 4", revenue: 0 },
    ],
    yearly: [
      { month: "January", revenue: 0 },
      { month: "February", revenue: 0 },
      { month: "March", revenue: 0 },
      { month: "April", revenue: 0 },
      { month: "May", revenue: 0 },
      { month: "June", revenue: 0 },
      { month: "July", revenue: 0 },
      { month: "August", revenue: 0 },
      { month: "September", revenue: 0 },
      { month: "October", revenue: 0 },
      { month: "November", revenue: 0 },
      { month: "December", revenue: 0 },
    ],
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        setLoading(true);
        const response = await getBranchRevenueChartData(selectedBranch.id);
        if (response.data) {
          setChartData(response.data);
        }
        setLoading(false);
      }
    })();
  }, [selectedBranch]);

  const { actualChartData, xAxisKey } = useMemo(() => {
    const key = labelToKeyMap[range];
    const dataKey = keyToDataKey[key];
    return {
      actualChartData: chartData[key],
      xAxisKey: dataKey,
    };
  }, [chartData, range]);

  return loading ? (
    <Skeleton className="w-fu h-[500px]" />
  ) : (
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
                  ? value.replace("eek ", "")
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
              dataKey="revenue"
              type="monotone"
              fill="var(--color-revenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
