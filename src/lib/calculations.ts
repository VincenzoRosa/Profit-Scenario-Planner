export interface BusinessMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  grossMargin: number;
  operatingExpenseRatio: number;
  cashReserveRatio: number;
  inventoryTurnoverRate: number;
  seaSpend: number;
  seaROAS: number;
  currentTROAS: number;
  seaRevenuePercentage: number;
  season: 'high' | 'normal' | 'low';
  marketCompetition: 'high' | 'medium' | 'low';
  businessStage: 'growth' | 'stable' | 'optimize';
}

export interface TROASRecommendation {
  recommendedTROAS: number;
  currentTROAS: number;
  suggestedChange: number;
  businessHealthScore: number;
  businessHealthStatus: 'STRONG' | 'MODERATE' | 'WEAK';
  reasoning: string[];
  projectedSpendChange: number;
  expectedRevenueImpact: number;
  profitImpact: number;
  marketShareGain: number;
  affordabilityIndex: number;
  troasFlexibility: string;
  marketOpportunityScore: number;
  overrideMessage?: string;
}

export interface ProfitCurvePoint {
  troas: number;
  profit: number;
  revenue: number;
  spend: number;
}

export function calculateBusinessHealthScore(metrics: BusinessMetrics): number {
  // Revenue growth score (0-100)
  const revenueGrowthScore = Math.max(0, Math.min(100, 
    ((metrics.revenueGrowth + 20) / 70) * 100
  ));

  // Profit margin score (0-100)
  const profitMarginScore = Math.max(0, Math.min(100, 
    (metrics.grossMargin / 40) * 100
  ));

  // Cash reserve score (0-100)
  const cashReserveScore = Math.max(0, Math.min(100, 
    (metrics.cashReserveRatio / 12) * 100
  ));

  // Inventory turnover score (0-100)
  const inventoryTurnoverScore = Math.max(0, Math.min(100, 
    (metrics.inventoryTurnoverRate / 8) * 100
  ));

  return (
    revenueGrowthScore * 0.3 +
    profitMarginScore * 0.3 +
    cashReserveScore * 0.2 +
    inventoryTurnoverScore * 0.2
  );
}

export function calculateRecommendedTROAS(metrics: BusinessMetrics): TROASRecommendation {
  const healthScore = calculateBusinessHealthScore(metrics);
  
  // Base tROAS calculation
  let baseTROAS: number;
  if (healthScore > 80) {
    baseTROAS = 2.0; // Aggressive
  } else if (healthScore > 60) {
    baseTROAS = 3.0; // Balanced
  } else if (healthScore > 40) {
    baseTROAS = 4.0; // Conservative
  } else {
    baseTROAS = 5.0; // Defensive
  }

  // Adjustments based on context
  let troasAdjustment = 0;

  // Seasonal adjustment
  if (metrics.season === 'high') {
    troasAdjustment -= 0.5; // More aggressive during peak season
  } else if (metrics.season === 'low') {
    troasAdjustment += 0.5; // More conservative off-season
  }

  // Competition adjustment
  if (metrics.marketCompetition === 'high' && healthScore > 70) {
    troasAdjustment -= 0.3; // Fight for market share if healthy
  }

  // Growth stage adjustment
  if (metrics.businessStage === 'growth' && metrics.cashReserveRatio > 6) {
    troasAdjustment -= 0.4; // Invest in growth if well-funded
  }

  const recommendedTROAS = Math.max(1.5, Math.min(6.0, baseTROAS + troasAdjustment));
  const suggestedChange = recommendedTROAS - metrics.currentTROAS;

  // Calculate affordability index
  const minimumAcceptableMargin = 15; // 15% minimum margin
  const affordabilityIndex = Math.max(0, 
    ((metrics.grossMargin - minimumAcceptableMargin) / metrics.grossMargin) * 100
  );

  let troasFlexibility: string;
  if (affordabilityIndex > 20) {
    troasFlexibility = "High - can reduce tROAS by 1-2 points";
  } else if (affordabilityIndex > 10) {
    troasFlexibility = "Medium - can reduce tROAS by 0.5-1 point";
  } else {
    troasFlexibility = "Low - maintain or increase tROAS";
  }

  // Market opportunity score
  const seasonalityFactor = metrics.season === 'high' ? 100 : metrics.season === 'normal' ? 50 : 0;
  const competitorWeakness = metrics.marketCompetition === 'low' ? 100 : 
                            metrics.marketCompetition === 'medium' ? 50 : 0;
  const marketGrowthRate = metrics.revenueGrowth > 0 ? Math.min(100, metrics.revenueGrowth * 2) : 0;
  
  const marketOpportunityScore = (
    seasonalityFactor * 0.4 +
    competitorWeakness * 0.3 +
    marketGrowthRate * 0.3
  );

  let overrideMessage: string | undefined;
  if (marketOpportunityScore > 80 && healthScore > 50) {
    overrideMessage = "High market opportunity - consider aggressive tROAS despite moderate health";
  }

  // Business health status
  let businessHealthStatus: 'STRONG' | 'MODERATE' | 'WEAK';
  if (healthScore > 70) {
    businessHealthStatus = 'STRONG';
  } else if (healthScore > 40) {
    businessHealthStatus = 'MODERATE';
  } else {
    businessHealthStatus = 'WEAK';
  }

  // Reasoning
  const reasoning: string[] = [];
  if (metrics.revenueGrowth > 0) {
    reasoning.push(`Revenue trend: +${metrics.revenueGrowth.toFixed(1)}% MoM ✓`);
  } else {
    reasoning.push(`Revenue trend: ${metrics.revenueGrowth.toFixed(1)}% MoM ⚠️`);
  }
  
  reasoning.push(`Margin health: ${metrics.grossMargin.toFixed(1)}% ${metrics.grossMargin > 25 ? 'Above' : 'Below'} target`);
  reasoning.push(`Cash position: ${metrics.cashReserveRatio.toFixed(1)} months runway`);
  reasoning.push(`Market opportunity: ${marketOpportunityScore > 70 ? 'High' : marketOpportunityScore > 40 ? 'Medium' : 'Low'}`);

  // Projections
  const currentSeaRevenue = metrics.seaSpend * metrics.seaROAS;
  const newSeaRevenue = metrics.seaSpend * recommendedTROAS;
  const projectedSpendChange = (newSeaRevenue / recommendedTROAS) - metrics.seaSpend;
  const expectedRevenueImpact = newSeaRevenue - currentSeaRevenue;
  const profitImpact = expectedRevenueImpact * (metrics.grossMargin / 100) - projectedSpendChange;
  const marketShareGain = (expectedRevenueImpact / metrics.totalRevenue) * 100;

  return {
    recommendedTROAS,
    currentTROAS: metrics.currentTROAS,
    suggestedChange,
    businessHealthScore: healthScore,
    businessHealthStatus,
    reasoning,
    projectedSpendChange,
    expectedRevenueImpact,
    profitImpact,
    marketShareGain,
    affordabilityIndex,
    troasFlexibility,
    marketOpportunityScore,
    overrideMessage
  };
}

export function generateProfitCurve(metrics: BusinessMetrics, scenario: 'current' | 'improved' | 'declined' = 'current'): ProfitCurvePoint[] {
  const points: ProfitCurvePoint[] = [];
  
  // Apply scenario adjustments
  let adjustedRevenue = metrics.totalRevenue;
  let adjustedMargin = metrics.grossMargin;
  let adjustedOpEx = metrics.operatingExpenseRatio;
  
  if (scenario === 'improved') {
    adjustedRevenue *= 1.1;
    adjustedMargin *= 1.1;
    adjustedOpEx *= 0.9;
  } else if (scenario === 'declined') {
    adjustedRevenue *= 0.9;
    adjustedMargin *= 0.9;
    adjustedOpEx *= 1.1;
  }

  // Generate points for tROAS range 1.0 to 8.0
  for (let troas = 1.0; troas <= 8.0; troas += 0.1) {
    const seaRevenue = metrics.seaSpend * troas;
    const totalRevenue = adjustedRevenue + seaRevenue - metrics.seaSpend;
    const grossProfit = totalRevenue * (adjustedMargin / 100);
    const operatingExpenses = totalRevenue * (adjustedOpEx / 100);
    const profit = grossProfit - operatingExpenses;
    
    points.push({
      troas: parseFloat(troas.toFixed(1)),
      profit: parseFloat(profit.toFixed(2)),
      revenue: parseFloat(totalRevenue.toFixed(2)),
      spend: parseFloat(metrics.seaSpend.toFixed(2))
    });
  }

  return points;
}

export function generateTROASMatrix(): { x: number; y: number; troas: number; color: string }[] {
  const matrix: { x: number; y: number; troas: number; color: string }[] = [];
  
  for (let margin = 0; margin <= 40; margin += 2) {
    for (let growth = -20; growth <= 50; growth += 2) {
      // Simulate business health score based on margin and growth
      const healthScore = Math.max(0, Math.min(100, 
        (margin / 40) * 50 + ((growth + 20) / 70) * 50
      ));
      
      let troas: number;
      if (healthScore > 80) {
        troas = 2.0;
      } else if (healthScore > 60) {
        troas = 3.0;
      } else if (healthScore > 40) {
        troas = 4.0;
      } else {
        troas = 5.0;
      }
      
      let color: string;
      if (troas <= 2.5) {
        color = '#10b981'; // Green - Aggressive
      } else if (troas <= 4.0) {
        color = '#f59e0b'; // Yellow - Balanced
      } else {
        color = '#ef4444'; // Red - Conservative
      }
      
      matrix.push({ x: margin, y: growth, troas, color });
    }
  }
  
  return matrix;
}

export function calculateEfficiencyCurve(metrics: BusinessMetrics): { troas: number; revenue: number; efficiency: number }[] {
  const points: { troas: number; revenue: number; efficiency: number }[] = [];
  
  for (let troas = 1.0; troas <= 6.0; troas += 0.1) {
    const revenue = metrics.seaSpend * troas;
    const efficiency = revenue / (metrics.seaSpend * troas); // Revenue per dollar spent
    
    points.push({
      troas: parseFloat(troas.toFixed(1)),
      revenue: parseFloat(revenue.toFixed(2)),
      efficiency: parseFloat(efficiency.toFixed(3))
    });
  }
  
  return points;
} 