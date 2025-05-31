"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { getPerformanceScore } from "@/utils/getPerformanceScore";

export const description = "A radial chart with stacked sections";

// const chartData = [{ total: 1.5, score: 8.5 }];

const chartConfig = {
  total: {
    label: "Total",
    color: "#D9D9D9",
  },
  score: {
    label: "Score",
    color: "#FF9777",
  },
} satisfies ChartConfig;

const branchMetrics = {
  stockAvailabilityRate: 95,
  profitGenerated: 40000,
  revenueGenerated: 200000,
  numberOfSales: 800,
};

export function PerformanceScore() {
  const chartData = getPerformanceScore(branchMetrics);
  const score = chartData[0].score;
  const fillColor = score > 8 ? "#4CAF50" : score > 5 ? "#FFC107" : "#F44336";
  const perfomance = score > 8 ? "Good" : score > 5 ? "Average" : "Poor";

  return (
    <Card className="flex flex-col gap-2 relative">
      <CardHeader className="items-center pb-0 ">
        <CardTitle>Performance Score</CardTitle>
        <CardDescription>
          <div></div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0 ">
        <ChartContainer config={chartConfig} className=" w-full h-[250px]">
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-main text-2xl font-bold"
                        >
                          {score.toLocaleString()}
                          <tspan className="text-xs"> / 10</tspan>
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          {perfomance}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="total"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-total)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="score"
              fill={fillColor}
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 text-sm">
        <div className="absolute flex flex-col w-full gap-4  bottom-6 items-center sm:items-start sm:pl-8 ">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-4 h-4 bg-green-600 rounded-sm"></span>
            <p>
              {" "}
              - Branch is perfroming <b>good</b>.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs ">
            <span className="w-4 h-4 bg-amber-600 rounded-sm"></span>
            <p>
              {" "}
              - Branch is perfroming <b>average</b>.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-4 h-4 bg-red-600 rounded-sm"></span>
            <p>
              {" "}
              - Branch is perfroming <b>poor</b>.
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
