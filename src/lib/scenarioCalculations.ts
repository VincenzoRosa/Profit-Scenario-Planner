export interface ChannelMetrics {
  paid: number;
  organic: number;
  crm: number;
  socialPaid: number;
  other: number;
  affiliate: number;
}

export interface OriginalMetrics {
  revenue: ChannelMetrics;
  spend: ChannelMetrics;
  orders: ChannelMetrics;
  aov: ChannelMetrics;
  shippingCost: number;
  cogsPercent: number;
}

export interface ScenarioAdjustments {
  revenue: ChannelMetrics;
  orders: ChannelMetrics;
  aov: ChannelMetrics;
  marketingSpend: ChannelMetrics;
  shippingCost: number;
  cogsPercent: number;
}

export interface AdjustedMetrics {
  revenue: ChannelMetrics;
  spend: ChannelMetrics;
  orders: ChannelMetrics;
  aov: ChannelMetrics;
  shippingCost: number;
  cogsPercent: number;
  roas: ChannelMetrics;
  cpa: ChannelMetrics;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  contributionProfit: number;
  netProfit: number;
  netProfitMargin: number;
  marketingCostPercent: number;
}

// Helper function to sum channel metrics
export function sumChannels(channels: ChannelMetrics): number {
  return channels.paid + channels.organic + channels.crm + channels.socialPaid + channels.other + channels.affiliate;
}

// Helper function to apply percentage adjustment to channels
export function adjustChannels(channels: ChannelMetrics, adjustment: ChannelMetrics): ChannelMetrics {
  return {
    paid: channels.paid * (1 + adjustment.paid / 100),
    organic: channels.organic * (1 + adjustment.organic / 100),
    crm: channels.crm * (1 + adjustment.crm / 100),
    socialPaid: channels.socialPaid * (1 + adjustment.socialPaid / 100),
    other: channels.other * (1 + adjustment.other / 100),
    affiliate: channels.affiliate * (1 + adjustment.affiliate / 100)
  };
}

export function calculateScenario(original: OriginalMetrics, adjustments: ScenarioAdjustments): AdjustedMetrics {
  // Calculate adjusted orders and AOV by channel
  const adjustedOrders = adjustChannels(original.orders, adjustments.orders);
  const adjustedAOV = adjustChannels(original.aov, adjustments.aov);
  
  // Calculate total orders and AOV
  const totalOriginalOrders = sumChannels(original.orders);
  const totalOriginalAOV = sumChannels(original.aov);
  const totalAdjustedOrders = sumChannels(adjustedOrders);
  const totalAdjustedAOV = sumChannels(adjustedAOV);
  
  // Calculate the base revenue change from orders and AOV
  const baseRevenueChange = (totalAdjustedOrders * totalAdjustedAOV) / (totalOriginalOrders * totalOriginalAOV);
  
  // Adjust revenue by channels AND by orders/AOV correlation
  const channelAdjustedRevenue = adjustChannels(original.revenue, adjustments.revenue);
  const adjustedRevenue = {
    paid: channelAdjustedRevenue.paid * baseRevenueChange,
    organic: channelAdjustedRevenue.organic * baseRevenueChange,
    crm: channelAdjustedRevenue.crm * baseRevenueChange,
    socialPaid: channelAdjustedRevenue.socialPaid * baseRevenueChange,
    other: channelAdjustedRevenue.other * baseRevenueChange,
    affiliate: channelAdjustedRevenue.affiliate * baseRevenueChange
  };
  
  const adjustedSpend = adjustChannels(original.spend, adjustments.marketingSpend);
  
  // Shipping cost correlates with orders (more orders = more shipping)
  const orderBasedShippingCost = original.shippingCost * (totalAdjustedOrders / totalOriginalOrders);
  const manualShippingAdjustment = original.shippingCost * (adjustments.shippingCost / 100);
  const adjustedShippingCost = orderBasedShippingCost + manualShippingAdjustment;
  
  // COGS percentage can be adjusted manually, but COGS amount correlates with revenue
  const adjustedCogsPercent = original.cogsPercent * (1 + adjustments.cogsPercent / 100);

  // Calculate total revenue and spend
  const totalRevenue = sumChannels(adjustedRevenue);
  const totalSpend = sumChannels(adjustedSpend);

  // Helper function for safe division
  const safeDivide = (numerator: number, denominator: number, fallback: number = 0) => {
    return denominator !== 0 ? numerator / denominator : fallback;
  };

  // Calculate ROAS and CPA by channel
  const roas: ChannelMetrics = {
    paid: safeDivide(adjustedRevenue.paid, adjustedSpend.paid, 0),
    organic: safeDivide(adjustedRevenue.organic, adjustedSpend.organic, 0),
    crm: safeDivide(adjustedRevenue.crm, adjustedSpend.crm, 0),
    socialPaid: safeDivide(adjustedRevenue.socialPaid, adjustedSpend.socialPaid, 0),
    other: safeDivide(adjustedRevenue.other, adjustedSpend.other, 0),
    affiliate: safeDivide(adjustedRevenue.affiliate, adjustedSpend.affiliate, 0)
  };

  const cpa: ChannelMetrics = {
    paid: safeDivide(adjustedSpend.paid, totalAdjustedOrders, 0),
    organic: safeDivide(adjustedSpend.organic, totalAdjustedOrders, 0),
    crm: safeDivide(adjustedSpend.crm, totalAdjustedOrders, 0),
    socialPaid: safeDivide(adjustedSpend.socialPaid, totalAdjustedOrders, 0),
    other: safeDivide(adjustedSpend.other, totalAdjustedOrders, 0),
    affiliate: safeDivide(adjustedSpend.affiliate, totalAdjustedOrders, 0)
  };

  // Create adjusted object
  const adjusted = {
    revenue: adjustedRevenue,
    spend: adjustedSpend,
    orders: adjustedOrders,
    aov: adjustedAOV,
    shippingCost: adjustedShippingCost,
    cogsPercent: adjustedCogsPercent
  };

  // Calculate derived metrics
  const cogs = totalRevenue * (adjustedCogsPercent / 100);
  const grossProfit = totalRevenue - cogs;
  const grossMargin = safeDivide(grossProfit, totalRevenue, 0) * 100;
  
  // Contribution profit
  const contributionProfit = grossProfit - adjustedShippingCost;
  
  // Net profit (removed operating expenses)
  const netProfit = contributionProfit - totalSpend;
  const netProfitMargin = safeDivide(netProfit, totalRevenue, 0) * 100;
  
  // Marketing cost as percentage of total revenue
  const marketingCostPercent = safeDivide(totalSpend, totalRevenue, 0) * 100;
  
  return {
    ...adjusted,
    roas,
    cpa,
    cogs,
    grossProfit,
    grossMargin,
    contributionProfit,
    netProfit,
    netProfitMargin,
    marketingCostPercent
  };
} 