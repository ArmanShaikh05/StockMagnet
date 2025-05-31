interface BranchMetrics {
  stockAvailabilityRate: number; // % e.g., 95
  profitGenerated: number; // e.g., ₹40,000
  revenueGenerated: number; // e.g., ₹2,00,000
  numberOfSales: number; // e.g., 800
}

// Set benchmark max values (customize based on your data)
const BENCHMARKS = {
  maxProfit: 50000,
  maxRevenue: 250000,
  maxSales: 1000,
};

const metricsWeight = {
  stockAvailabilityRate: 0.2,
  profitGenerated: 0.3,
  revenueGenerated: 0.2,
  numberOfSales: 0.3,
};

export function getPerformanceScore(metrics: BranchMetrics) {
  const stockAvailabilityScore = (metrics.stockAvailabilityRate / 100) * 10;

  const profitScore = Math.min(
    (metrics.profitGenerated / BENCHMARKS.maxProfit) * 10,
    10
  );
  const revenueScore = Math.min(
    (metrics.revenueGenerated / BENCHMARKS.maxRevenue) * 10,
    10
  );
  const salesCountScore = Math.min(
    (metrics.numberOfSales / BENCHMARKS.maxSales) * 10,
    10
  );

  const performanceScore = parseFloat(
    (
      stockAvailabilityScore * metricsWeight.stockAvailabilityRate +
      profitScore * metricsWeight.profitGenerated +
      revenueScore * metricsWeight.revenueGenerated +
      salesCountScore * metricsWeight.numberOfSales
    ).toFixed(1)
  );

  return [
    {
      total: parseFloat((10 - performanceScore).toFixed(1)),
      score: performanceScore,
    },
  ];
}
