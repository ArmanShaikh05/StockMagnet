export function formatToINRCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

type GSTCalculationMode = "inclusive" | "exclusive";

interface GSTResult {
  basePrice: number;
  gstAmount: number;
  finalPrice: number;
}

/**
 * Calculates GST based on the price and mode.
 * @param price - The input price (either base or inclusive of GST).
 * @param gstRate - The GST rate in percentage (e.g., 18 for 18%).
 * @param mode - 'exclusive' if price doesn't include GST, 'inclusive' if it already includes GST.
 * @returns GSTResult object with basePrice, gstAmount, and finalPrice.
 */
export function calculateGST(
  price: number,
  gstRate: number,
  mode: GSTCalculationMode = "exclusive"
): GSTResult {
  let basePrice: number, gstAmount: number, finalPrice: number;

  if (mode === "exclusive") {
    gstAmount = (price * gstRate) / 100;
    basePrice = price;
    finalPrice = basePrice + gstAmount;
  } else {
    gstAmount = (price * gstRate) / (100 + gstRate);
    basePrice = price - gstAmount;
    finalPrice = price;
  }

  return {
    basePrice: parseFloat(basePrice.toFixed(2)),
    gstAmount: parseFloat(gstAmount.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2)),
  };
}

export function calculatePercentChange(
  current: number,
  previous: number
): string {
  if (previous === 0 && current === 0) {
    return "0%"; // No change
  } else if (previous === 0 && current > 0) {
    return "+100%"; // Technically infinite, show a placeholder
  } else {
    const percentChange = ((current - previous) / previous) * 100;
    return `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(2)}%`;
  }
}

export function getCurrentFinancialYear(invoiceNumber: string): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = Jan, 1 = Feb, ..., 11 = Dec

  // Financial year starts in April
  const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;

  // Get last two digits of both years
  const start = startYear.toString().slice(-2);
  const end = endYear.toString().slice(-2);

  return `FY${start}${end}-${invoiceNumber}`;
}
