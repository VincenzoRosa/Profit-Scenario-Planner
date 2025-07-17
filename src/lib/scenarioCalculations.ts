export interface OriginalMetrics {
  revenue: number;
  spend: number;
  orders: number;
  aov: number;
  shippingCost: number;
  cogsPercent: number;
  opex: number;
}

export interface ScenarioAdjustments {
  revenue: number;
  orders: number;
  aov: number;
  marketingSpend: number;
  shippingCost: number;
  cogsPercent: number;
  operatingExpenses: number;
}

export interface AdjustedMetrics {
  revenue: number;
  spend: number;
  orders: number;
  aov: number;
  shippingCost: number;
  cogsPercent: number;
  opex: number;
  roas: number;
  cpa: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  contributionProfit: number;
  netProfit: number;
  netProfitMargin: number;
}

export function calculateScenario(original: OriginalMetrics, adjustments: ScenarioAdjustments): AdjustedMetrics {
  // Calculate adjusted base values
  const adjustedOrders = original.orders * (1 + adjustments.orders / 100);
  const adjustedAOV = original.aov * (1 + adjustments.aov / 100);
  const adjustedSpend = original.spend * (1 + adjustments.marketingSpend / 100);
  
  // Shipping cost correlates with orders (more orders = more shipping)
  const orderBasedShippingCost = original.shippingCost * (adjustedOrders / original.orders);
  const manualShippingAdjustment = original.shippingCost * (adjustments.shippingCost / 100);
  const adjustedShippingCost = orderBasedShippingCost + manualShippingAdjustment;
  
  // COGS percentage can be adjusted manually, but COGS amount correlates with revenue
  const adjustedCogsPercent = original.cogsPercent * (1 + adjustments.cogsPercent / 100);
  const adjustedOpex = original.opex * (1 + adjustments.operatingExpenses / 100);

  // Calculate revenue with correlations
  // Revenue = Orders × AOV, but also consider manual revenue adjustment
  const calculatedRevenue = adjustedOrders * adjustedAOV;
  const manualRevenueAdjustment = original.revenue * (adjustments.revenue / 100);
  const adjustedRevenue = calculatedRevenue + manualRevenueAdjustment;

  // Create adjusted object
  const adjusted = {
    revenue: adjustedRevenue,
    spend: adjustedSpend,
    orders: adjustedOrders,
    aov: adjustedAOV,
    shippingCost: adjustedShippingCost,
    cogsPercent: adjustedCogsPercent,
    opex: adjustedOpex
  };

  // Calculate derived metrics
  const roas = adjusted.revenue / adjusted.spend;
  const cpa = adjusted.spend / adjusted.orders;
  const cogs = adjusted.revenue * (adjusted.cogsPercent / 100);
  const grossProfit = adjusted.revenue - cogs;
  const grossMargin = (grossProfit / adjusted.revenue) * 100;
  
  // Contribution profit
  const contributionProfit = grossProfit - adjusted.shippingCost;
  
  // Net profit
  const netProfit = contributionProfit - adjusted.spend - adjusted.opex;
  const netProfitMargin = (netProfit / adjusted.revenue) * 100;
  
  return {
    ...adjusted,
    roas,
    cpa,
    cogs,
    grossProfit,
    grossMargin,
    contributionProfit,
    netProfit,
    netProfitMargin
  };
} 