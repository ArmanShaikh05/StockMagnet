"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  //   ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  generateComparisonRevenueChartConfig,
  generateComparisonRevenueData,
  getBranchesLabel,
} from "@/utils/BarChartData";
import { mockBranches } from "@/utils/data";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
// const chartData = [
//   { date: "January", running: 450, swimming: 300 },
//   { date: "February", running: 380, swimming: 420 },
//   { date: "March", running: 520, swimming: 120 },
//   { date: "April", running: 140, swimming: 550 },
//   { date: "May", running: 600, swimming: 350 },
//   { date: "June", running: 480, swimming: 400 },
//   { date: "July", running: 480, swimming: 400 },
//   { date: "August", running: 480, swimming: 400 },
//   { date: "September", running: 480, swimming: 400 },
//   { date: "October", running: 480, swimming: 400 },
//   { date: "November", running: 480, swimming: 400 },
//   { date: "December", running: 480, swimming: 400 },
// ];

// const chartConfig = {
//   running: {
//     label: "Running",
//     color: "#FF9777",
//   },
//   swimming: {
//     label: "Swimming",
//     color: "#39D3F2",
//   },
// } satisfies ChartConfig;

const branchesLabel = getBranchesLabel(mockBranches);

export function ComparisonRevenueChart() {
  // console.log(branchesLabel);
  const [branchesFilter, setBranchesFilter] = useState<string[]>(
    Object.keys(branchesLabel).map((branch) => {
      return branchesLabel[branch].value;
    })
  );

  const filteredBranches = useMemo(() => {
    return mockBranches.filter((branch) => {
      const branchName = branch.branchName.split(" ").join("").toLowerCase();
      const filteredBrach =
        branchesFilter.length > 0 ? branchesFilter.includes(branchName) : true;

      return filteredBrach;
    });
  }, [branchesFilter]);

  const chartData = generateComparisonRevenueData(filteredBranches);
  const chartConfig = generateComparisonRevenueChartConfig(filteredBranches);

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="w-full flex items-start sm:items-center justify-between relative">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-balance">
              Revenue Comparison Among Branches
            </CardTitle>
            <CardDescription className="text-balance">
              Compare the revenue growth among all branches
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={"sm"}
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:block">Choose</span>
                <span>Branches</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {Object.keys(branchesLabel).map((branch, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={branchesFilter.includes(branchesLabel[branch].value)}
                  onCheckedChange={(checked) => {
                    setBranchesFilter((prev) =>
                      checked
                        ? [...prev, branchesLabel[branch].value]
                        : prev.filter((f) => f !== branchesLabel[branch].value)
                    );
                  }}
                  defaultChecked={branchesLabel[branch].isPrimary}
                  disabled={branchesLabel[branch].isPrimary}
                >
                  {branchesLabel[branch].label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="px-1 xs:px-6">
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            {/* Dynamically generate bars based on chartConfig keys */}
            {Object.keys(chartConfig).map((branchName, index) => (
              <Bar
                key={branchName}
                dataKey={branchName}
                stackId="a"
                fill={`var(--color-${branchName})`}
                radius={
                  index === 0
                    ? [0, 0, 4, 4] // bottom bar
                    : index === Object.keys(chartConfig).length - 1
                    ? [4, 4, 0, 0] // top bar
                    : [0, 0, 0, 0]
                }
              />
            ))}

            <ChartLegend content={<ChartLegendContent />} className="mt-4" />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-[250px]"
                  formatter={(value, name, item, index) => {
                    const total = Object.keys(chartConfig).reduce(
                      (sum, key) => sum + (item?.payload?.[key] ?? 0),
                      0
                    );

                    return (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={{
                            backgroundColor:
                              chartConfig[name as keyof typeof chartConfig]
                                ?.color || "#ccc",
                          }}
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {value}
                          <span className="font-normal text-muted-foreground">
                            Rs
                          </span>
                        </div>

                        {/* Add total only once (after last item) */}
                        {index === Object.keys(chartConfig).length - 1 && (
                          <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                            Total
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {total}
                              <span className="font-normal text-muted-foreground">
                                Rs
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  }}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
