"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getBranchesLabel } from "@/utils/BarChartData";
import {
  getChartConfigData,
  getStockComparisonChartData,
} from "@/utils/StocksComaprisonChartData";
import { mockBranches } from "@/utils/data";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";

export function StocksComparisonChart() {
  const branchesLabel = getBranchesLabel(mockBranches);

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

  const chartData = getStockComparisonChartData(filteredBranches);
  const chartConfig = getChartConfigData(
    filteredBranches
  ) satisfies ChartConfig;

  return (
    <Card className="flex flex-col shadow-xl">
      <CardHeader>
        <div className="w-full flex items-start sm:items-center justify-between relative">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-balance">
              Stock Comparison Among Branches
            </CardTitle>
            <CardDescription className="text-balance">
              January 2024
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
      <CardContent className="flex-1 pb-0 px-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[450px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={chartData} dataKey="stock" label nameKey="branch" />
            <ChartLegend
              content={<ChartLegendContent nameKey="branch" />}
              className="-translate-y-2  mt-2 xs:mt-4 flex-wrap gap-2 sm:[&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
