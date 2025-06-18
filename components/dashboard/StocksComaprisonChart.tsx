"use client";

import { Pie, PieChart } from "recharts";

import { getStockComparisonChartDataAction } from "@/actions/chartActions";
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
import { StockComparisonChartData } from "@/types/types";
import { getBranchesLabel } from "@/utils/BarChartData";
import {
  generateStockComparisonChartData,
  getChartConfigData,
} from "@/utils/StocksComaprisonChartData";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export function StocksComparisonChart() {
  const [branchesLabel, setBranchesLabel] = useState<Record<
    string,
    {
      label: string;
      value: string;
      isPrimary: boolean;
      stock?: number;
    }
  > | null>(null);

  const [branchesFilter, setBranchesFilter] = useState<string[]>([]);

  const [chartResponse, setChartResponse] = useState<
    StockComparisonChartData[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getStockComparisonChartDataAction();
      if (response.data && response.chartData) {
        const labels = getBranchesLabel(response.data);

        if (labels) {
          setBranchesLabel(labels);
          setBranchesFilter(
            Object.keys(labels).map((branch) => {
              return labels[branch].value;
            })
          );
        }

        setChartResponse(response.chartData);
      }

      setLoading(false);
    })();
  }, []);

  const filteredBranches = useMemo(() => {
    return chartResponse.filter((branch) => {
      const branchName = branch.name.split(" ").join("").toLowerCase();
      const filteredBrach =
        branchesFilter.length > 0 ? branchesFilter.includes(branchName) : true;

      return filteredBrach;
    });
  }, [branchesFilter, chartResponse]);

  const chartData = generateStockComparisonChartData(filteredBranches);
  const chartConfig = getChartConfigData(
    filteredBranches
  ) satisfies ChartConfig;

  return loading ? (
    <Skeleton className="w-full h-[570px]" />
  ) : (
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

              {branchesLabel &&
                Object.keys(branchesLabel).map((branch, index) => (
                  <DropdownMenuCheckboxItem
                    key={index}
                    checked={branchesFilter.includes(
                      branchesLabel[branch].value
                    )}
                    onCheckedChange={(checked) => {
                      setBranchesFilter((prev) =>
                        checked
                          ? [...prev, branchesLabel[branch].value]
                          : prev.filter(
                              (f) => f !== branchesLabel[branch].value
                            )
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
    </Card>
  );
}
