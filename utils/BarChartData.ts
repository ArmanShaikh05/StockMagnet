import { BranchesType } from "@/types/types";

// DATA AND CHART CONFIG GENRATION FOR THE REVENUE COMPARISON CHART IN THE DASHBOARD

export const generateComparisonRevenueData = (branches: BranchesType[]) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Initialize chart data with months
  const chartData = months.map((month) => {
    const entry: Record<string, string | number> = { date: month };

    // Fill each branch with a dummy value
    branches.forEach((branch) => {
      entry[branch.branchName.split(" ").join("")] =
        Math.floor(Math.random() * 500) + 100;
    });

    return entry;
  });

  return chartData;
};

export const generateComparisonRevenueChartConfig = (
  branches: BranchesType[]
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

  const chartConfig = branches.reduce((acc, branch, index) => {
    acc[branch.branchName.split(" ").join("")] = {
      label: branch.branchName,
      color: colors[index % colors.length], // Cycle if > colors.length
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return chartConfig;
};

export const getBranchesLabel = (branches: BranchesType[]) => {
  return branches.reduce((acc, curr) => {
    const key = curr.branchName.split(" ").join("");
    acc[key] = {
      label: curr.branchName,
      value: key.toLowerCase(),
      isPrimary: curr.isPrimaryBranch,
    };
    return acc;
  }, {} as Record<string, { label: string; value: string; isPrimary: boolean }>);
};
