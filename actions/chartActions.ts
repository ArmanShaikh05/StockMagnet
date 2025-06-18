"use server";

import db from "@/lib/prisma";
import {
  MonthlyStockSummaryChartType,
  RevenueChartData,
  RevenueChartDataType,
  StockComparisonChartData
} from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import {
  differenceInCalendarWeeks,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  getMonth,
  getYear,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

export const getBranchRevenueChartData = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return {
        success: false,
        message: "Unauthorized user",
      };

    const invoiceData = await db.invoices.findMany({
      where: {
        branchId: branchId,
      },
      select: {
        invoiceDate: true,
        grandTotal: true,
      },
    });

    const generateChartData = (
      invoices: { invoiceDate: Date; grandTotal: number }[]
    ) => {
      const dayMap = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const monthMap = [
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

      // === WEEKLY (days of week)
      const weekly: { day: string; revenue: number }[] = dayMap.map((day) => ({
        day,
        revenue: 0,
      }));

      // === MONTHLY (weeks in current month)
      const now = new Date();
      const firstDay = startOfMonth(now);
      const lastDay = endOfMonth(now);
      const startWeek = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
      const endWeek = endOfWeek(now, { weekStartsOn: 0 }); // Saturday

      const allWeeks = eachWeekOfInterval(
        { start: firstDay, end: lastDay },
        { weekStartsOn: 0 } // Sunday
      );

      const monthly = allWeeks.map((_, i) => ({
        week: `Week ${i + 1}`,
        revenue: 0,
      }));

      // === YEARLY (months of year)
      const yearly: { month: string; revenue: number }[] = monthMap.map(
        (month) => ({ month, revenue: 0 })
      );

      invoices.forEach((invoice) => {
        const date = new Date(invoice.invoiceDate);

        // Weekly: group by day
        if (isWithinInterval(date, { start: startWeek, end: endWeek })) {
          const dayName = dayMap[getDay(date)];
          const dayEntry = weekly.find((d) => d.day === dayName);
          if (dayEntry) {
            dayEntry.revenue += parseFloat(invoice.grandTotal.toFixed(2));
          }
        }

        // Monthly: group by week index
        const weekIndex = differenceInCalendarWeeks(date, firstDay, {
          weekStartsOn: 0,
        });
        if (monthly[weekIndex]) {
          monthly[weekIndex].revenue += parseFloat(
            invoice.grandTotal.toFixed(2)
          );
        }

        // Yearly: group by month
        const monthIndex = getMonth(date);
        yearly[monthIndex].revenue += parseFloat(invoice.grandTotal.toFixed(2));
      });

      return {
        weekly,
        monthly,
        yearly,
      };
    };

    const revenueChartData: RevenueChartDataType = generateChartData(
      invoiceData.map((invoice) => {
        return {
          ...invoice,
          grandTotal: Number(invoice.grandTotal),
        };
      })
    );

    return {
      success: true,
      message: "branch revenue chart data fetched successfully",
      data: revenueChartData,
    };
  } catch (error) {
    console.error("Error fetching branch revenue chart data:", error);
    return {
      success: false,
      message: "Error fetching branch revenue chart data",
    };
  }
};

export const getMonthStockSummary = async (branchId: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id)
      return {
        success: false,
        message: "Unauthorized user",
      };

    const monthlyStockData: MonthlyStockSummaryChartType = [];

    const now = new Date();
    const previousMonthDate = subMonths(now, 1);

    const month = format(now, "MMMM");
    const year = getYear(now);
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const previousMonthStart = startOfMonth(previousMonthDate);
    const previousMonthEnd = endOfMonth(previousMonthDate);

    const currentMonthInvoiceData = await db.invoices.findMany({
      where: {
        branchId: branchId,
        invoiceDate: {
          gte: start,
          lte: end,
        },
      },
      select: {
        totalQuantity: true,
      },
    });

    const previousMonthInvoiceData = await db.invoices.aggregate({
      _sum: { totalQuantity: true },
      where: {
        branchId: branchId,
        invoiceDate: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    });

    const branchProducts = await db.products.findMany({
      where: {
        branchId: branchId,
      },
      select: {
        stockInHand: true,
      },
    });

    const totalStock = branchProducts.reduce((acc, curr) => {
      acc += curr.stockInHand;
      return acc;
    }, 0);

    const currentMonthSoldStock = currentMonthInvoiceData.reduce(
      (acc, curr) => {
        acc += curr.totalQuantity;
        return acc;
      },
      0
    );

    const previousMonthStockSold =
      previousMonthInvoiceData._sum.totalQuantity || 0;

    function calculateStockSoldChange(
      currentSold: number,
      previousSold: number
    ): string {
      if (previousSold === 0 && currentSold === 0) {
        return "0%"; // No change
      } else if (previousSold === 0 && currentSold > 0) {
        return "+100%"; // Technically infinite, show a placeholder
      } else {
        const percentChange =
          ((currentSold - previousSold) / previousSold) * 100;
        return `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(2)}%`;
      }
    }

    const stockSoldPercentage = calculateStockSoldChange(
      currentMonthSoldStock,
      previousMonthStockSold
    );

    monthlyStockData.push({
      month,
      year: year.toString(),
      total: totalStock,
      sold: currentMonthSoldStock,
      remaining: totalStock - currentMonthSoldStock,
    });

    return {
      success: true,
      message: "monthly stocked data fetched successfully",
      data: monthlyStockData,
      percentChange: stockSoldPercentage,
    };
  } catch (error) {
    console.error("Error fetching monthly stock data:", error);
    return {
      success: false,
      message: "Error fetching monthly stock data",
    };
  }
};

export const getRevenueComparisonChartData = async () => {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }

    const branches = await db.branches.findMany({
      where: {
        User: {
          is: {
            clerkUserId: user.id,
          },
        },
      },
      select: {
        id: true,
        branchName: true,
        isPrimary: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!branches || branches.length === 0) {
      return {
        success: false,
        message: "No branches found",
      };
    }

    const monthMap = [
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

    // Initialize chart data
    const chartData: RevenueChartData[] = monthMap.map((month) => ({
      date: month,
    }));

    for (const branch of branches) {
      const branchLabel = branch.branchName
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");

      // Add zero for this branch in every month
      for (const monthData of chartData) {
        monthData[branchLabel] = 0;
      }

      const invoices = await db.invoices.findMany({
        where: {
          branchId: branch.id,
        },
        select: {
          invoiceDate: true,
          grandTotal: true,
        },
      });

      for (const invoice of invoices) {
        const month = format(new Date(invoice.invoiceDate), "MMMM");
        const monthEntry = chartData.find((d) => d.date === month);
        if (monthEntry) {
          monthEntry[branchLabel] =
            Number(monthEntry[branchLabel]) + Number(invoice.grandTotal) || 0;
        }
      }
    }

    return {
      success: true,
      message: "Revenue comparison data fetched successfully",
      data: branches,
      chartData: chartData,
    };
  } catch (error) {
    console.error("Error fetching revenue comparison data:", error);
    return {
      success: false,
      message: "Error fetching revenue comparison data",
    };
  }
};

export const getStockComparisonChartDataAction = async () => {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }

    const branches = await db.branches.findMany({
      where: {
        User: {
          is: {
            clerkUserId: user.id,
          },
        },
      },
      select: {
        id: true,
        branchName: true,
        isPrimary: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!branches || branches.length === 0) {
      return {
        success: false,
        message: "No branches found",
      };
    }

    // Initialize chart data
    const chartData: StockComparisonChartData[] = [];

    for (const branch of branches) {
      // const branchLabel = branch.branchName
      //   .split(" ")
      //   .map(
      //     (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      //   )
      //   .join("");

      const productsData = await db.products.aggregate({
        _sum: { stockInHand: true },
        where: {
          branchId: branch.id,
        },
      });

      chartData.push({
        name: branch.branchName,
        stock: productsData._sum.stockInHand || 0,
        isPrimary: branch.isPrimary,
      });
    }

    return {
      success: true,
      message: "Stock comparison data fetched successfully",
      data: branches,
      chartData,
    };
  } catch (error) {
    console.error("Error fetching stock comparison data:", error);
    return {
      success: false,
      message: "Error fetching stock comparison data",
    };
  }
};
