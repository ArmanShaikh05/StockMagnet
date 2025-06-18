"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
import { useEffect, useState } from "react";
import { getProfitMarginChartData } from "@/actions/chartActions";
import { ProfitGainChartType } from "@/types/types";
import { Skeleton } from "../ui/skeleton";

export const description = "A radar chart with dots";

const chartConfig = {
  profitGain: {
    label: "Profit Gain",
    color: "#ff895b",
  },
} satisfies ChartConfig;

export function BranchProfitMargin({ branchId }: { branchId: string }) {
  const [chartData, setChartData] = useState<ProfitGainChartType>([]);
  const [changePercent, setChangePercent] = useState<string>("0");

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const response = await getProfitMarginChartData(branchId);
      if (response.data && response.changePercent) {
        setChartData(response.data);
        setChangePercent(response.changePercent);
      }
      setLoading(false)
    })();
  }, [branchId]);

  const formattedChartData = chartData.map((entry) => ({
    ...entry,
    month: entry.month.split(" ")[0], // Extracts "January" from "January 2025"
  }));

  return loading ? (<Skeleton className="w-full h-[450px]" />) : (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Profit Gain</CardTitle>
        <CardDescription>Profit generated in the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-square max-h-[250px]"
        >
          <RadarChart data={formattedChartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="profitGain"
              fill="var(--color-profitGain)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by {changePercent} this month{" "}
          {Number(changePercent.slice(0, -1) || 0) > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          {chartData[0]?.month} - {chartData[chartData.length - 1]?.month}
        </div>
      </CardFooter>
    </Card>
  );
}
