'use client';

import { useState } from 'react';
import { MetricSlider } from './MetricSlider';
import { MetricCard } from './MetricCard';
import { ChannelSlider } from './ChannelSlider';
import { ScenarioPresets } from './ScenarioPresets';
import { DataInputPanel } from './DataInputPanel';
import { ThemeToggle } from './ThemeToggle';
import { calculateScenario, OriginalMetrics, ChannelMetrics, sumChannels, ScenarioAdjustments } from '@/lib/scenarioCalculations';

export function ScenarioPlanner() {
  const [adjustments, setAdjustments] = useState<ScenarioAdjustments>({
    revenue: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
    orders: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
    aov: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
    marketingSpend: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
    shippingCost: 0,
    cogsPercent: 0
  });

  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'delta'>('side-by-side');
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(true);

  const [original, setOriginal] = useState<OriginalMetrics>({
    revenue: { paid: 2000000, organic: 800000, crm: 400000, socialPaid: 300000, other: 200000, affiliate: 300000 },
    spend: { paid: 1000000, organic: 200000, crm: 100000, socialPaid: 200000, other: 150000, affiliate: 350000 },
    orders: { paid: 50000, organic: 20000, crm: 10000, socialPaid: 8000, other: 6000, affiliate: 6000 },
    aov: { paid: 40, organic: 40, crm: 40, socialPaid: 37.5, other: 33.33, affiliate: 50 },
    shippingCost: 100000,
    cogsPercent: 12
  });

  const adjusted = calculateScenario(original, adjustments);

  const handleAdjustmentChange = (metric: keyof ScenarioAdjustments, value: number | ChannelMetrics) => {
    setAdjustments(prev => ({
      ...prev,
      [metric]: value
    }));
  };

  const handlePreset = (preset: ScenarioAdjustments) => {
    setAdjustments(preset);
  };

  const resetAll = () => {
    setAdjustments({
      revenue: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      orders: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      aov: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      marketingSpend: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      shippingCost: 0,
      cogsPercent: 0
    });
  };

  const handleDataChange = (newData: OriginalMetrics) => {
    setOriginal(newData);
  };

  const originalTotalRevenue = sumChannels(original.revenue);
  const originalTotalSpend = sumChannels(original.spend);
  const originalNetProfit = originalTotalRevenue - (originalTotalRevenue * (original.cogsPercent / 100)) - original.shippingCost - originalTotalSpend;
  const profitImpact = adjusted.netProfit - originalNetProfit;

  // Helper functions to safely handle division
  const safeDivide = (numerator: number, denominator: number, fallback: number = 0) => {
    return denominator !== 0 ? numerator / denominator : fallback;
  };

  const safePercentage = (numerator: number, denominator: number, fallback: number = 0) => {
    return denominator !== 0 ? (numerator / denominator) * 100 : fallback;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">€</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">E-commerce Profit Scenario Planner v1.2</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adjust metrics and see real-time impact on profitability</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDataPanelOpen(!isDataPanelOpen)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
              >
                {isDataPanelOpen ? 'Hide' : 'Edit Business Data'}
              </button>
              <button
                onClick={resetAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Reset All
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'side-by-side'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setViewMode('overlay')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'overlay'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Overlay
                </button>
                <button
                  onClick={() => setViewMode('delta')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'delta'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Delta
                </button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Data Input Panel */}
      <DataInputPanel
        originalData={original}
        onDataChange={handleDataChange}
        isOpen={isDataPanelOpen}
        onToggle={() => setIsDataPanelOpen(!isDataPanelOpen)}
      />

      {/* Preset Scenarios */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ScenarioPresets onPresetSelect={handlePreset} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Adjustment Controls */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Adjust Your Metrics
              </h2>

              <div className="space-y-6">
                <ChannelSlider
                  label="Revenue by Channel"
                  value={adjustments.revenue}
                  onChange={(value: ChannelMetrics) => handleAdjustmentChange('revenue', value)}
                  icon="📈"
                  subtitle="Adjust revenue by marketing channel"
                  originalValues={original.revenue}
                />
                <ChannelSlider
                  label="Orders by Channel"
                  value={adjustments.orders}
                  onChange={(value: ChannelMetrics) => handleAdjustmentChange('orders', value)}
                  icon="📦"
                  subtitle="Adjust orders by marketing channel"
                  originalValues={original.orders}
                />
                <ChannelSlider
                  label="Average Order Value by Channel"
                  value={adjustments.aov}
                  onChange={(value: ChannelMetrics) => handleAdjustmentChange('aov', value)}
                  icon="💰"
                  subtitle="Adjust AOV by marketing channel"
                  originalValues={original.aov}
                />
                <ChannelSlider
                  label="Marketing Spend by Channel"
                  value={adjustments.marketingSpend}
                  onChange={(value: ChannelMetrics) => handleAdjustmentChange('marketingSpend', value)}
                  icon="📢"
                  subtitle="Adjust marketing spend by channel"
                  originalValues={original.spend}
                />
                <MetricSlider
                  label="Shipping Cost"
                  value={adjustments.shippingCost}
                  onChange={(value: number) => handleAdjustmentChange('shippingCost', value)}
                  icon="🚚"
                  subtitle="Additional cost beyond order-based shipping"
                />
                <MetricSlider
                  label="COGS %"
                  value={adjustments.cogsPercent}
                  onChange={(value: number) => handleAdjustmentChange('cogsPercent', value)}
                  icon="🏭"
                  subtitle="Cost of goods as % of revenue"
                />

              </div>

              {/* Revenue Correlation Info */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">📊 Revenue Calculation:</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <div>Base: {sumChannels(original.orders).toLocaleString()} orders × €{(sumChannels(original.aov) / 6).toFixed(2)} avg AOV = €{(sumChannels(original.orders) * (sumChannels(original.aov) / 6)).toLocaleString()}</div>
                  <div>Adjusted: {sumChannels(adjusted.orders).toLocaleString()} orders × €{(sumChannels(adjusted.aov) / 6).toFixed(2)} avg AOV = €{(sumChannels(adjusted.orders) * (sumChannels(adjusted.aov) / 6)).toLocaleString()}</div>
                  <div>Revenue Multiplier: {((sumChannels(adjusted.orders) * (sumChannels(adjusted.aov) / 6)) / (sumChannels(original.orders) * (sumChannels(original.aov) / 6))).toFixed(2)}x</div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">Total Revenue: €{sumChannels(adjusted.revenue).toLocaleString()}</div>
                </div>
              </div>

              {/* Profit Impact Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">💰 Profit Impact</div>
                  <div className={`text-2xl font-bold ${
                    profitImpact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {profitImpact >= 0 ? '+' : ''}€{Math.round(Math.abs(profitImpact)).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {profitImpact >= 0 ? 'Increase' : 'Decrease'} in net profit
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results Dashboard */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard
                title="📈 Revenue"
                originalValue={sumChannels(original.revenue)}
                adjustedValue={sumChannels(adjusted.revenue)}
                format="currency"
                viewMode={viewMode}
              />
              <MetricCard
                title="💳 Marketing Performance"
                originalValue={safeDivide(sumChannels(original.revenue), sumChannels(original.spend), 0)}
                adjustedValue={safeDivide(sumChannels(adjusted.revenue), sumChannels(adjusted.spend), 0)}
                format="ratio"
                viewMode={viewMode}
                subtitle="ROAS"
              />
              <MetricCard
                title="📊 Cost per Acquisition"
                originalValue={safeDivide(sumChannels(original.spend), sumChannels(original.orders), 0)}
                adjustedValue={safeDivide(sumChannels(adjusted.spend), sumChannels(adjusted.orders), 0)}
                format="currency"
                viewMode={viewMode}
                subtitle="CPA"
              />
              <MetricCard
                title="💰 Profitability"
                originalValue={safePercentage(originalNetProfit, originalTotalRevenue, 0)}
                adjustedValue={adjusted.netProfitMargin}
                format="percentage"
                viewMode={viewMode}
                subtitle="Net Profit Margin"
              />
              <MetricCard
                title="📦 Gross Margin"
                originalValue={safePercentage(originalTotalRevenue - originalTotalRevenue * (original.cogsPercent / 100), originalTotalRevenue, 0)}
                adjustedValue={adjusted.grossMargin}
                format="percentage"
                viewMode={viewMode}
              />
              <MetricCard
                title="💵 Net Profit"
                originalValue={originalNetProfit}
                adjustedValue={adjusted.netProfit}
                format="currency"
                viewMode={viewMode}
              />
              <MetricCard
                title="📢 Marketing Cost %"
                originalValue={safePercentage(sumChannels(original.spend), sumChannels(original.revenue), 0)}
                adjustedValue={adjusted.marketingCostPercent}
                format="percentage"
                viewMode={viewMode}
                subtitle="of Revenue"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              💻 Developed with ❤️ by <span className="font-medium text-gray-900 dark:text-white">Vincenzo Rosa</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 