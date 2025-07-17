'use client';

import { useState } from 'react';
import { MetricSlider } from './MetricSlider';
import { MetricCard } from './MetricCard';
import { ScenarioPresets } from './ScenarioPresets';
import { DataInputPanel } from './DataInputPanel';
import { calculateScenario, OriginalMetrics } from '@/lib/scenarioCalculations';

export interface ScenarioAdjustments {
  revenue: number;
  orders: number;
  aov: number;
  marketingSpend: number;
  shippingCost: number;
  cogsPercent: number;
  operatingExpenses: number;
}

export function ScenarioPlanner() {
  const [adjustments, setAdjustments] = useState<ScenarioAdjustments>({
    revenue: 0,
    orders: 0,
    aov: 0,
    marketingSpend: 0,
    shippingCost: 0,
    cogsPercent: 0,
    operatingExpenses: 0
  });

  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'delta'>('side-by-side');
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(true);

  const [original, setOriginal] = useState<OriginalMetrics>({
    revenue: 4000000,
    spend: 2000000,
    orders: 100000,
    aov: 40,
    shippingCost: 100000,
    cogsPercent: 12,
    opex: 200000
  });

  const adjusted = calculateScenario(original, adjustments);

  const handleAdjustmentChange = (metric: keyof ScenarioAdjustments, value: number) => {
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
      revenue: 0,
      orders: 0,
      aov: 0,
      marketingSpend: 0,
      shippingCost: 0,
      cogsPercent: 0,
      operatingExpenses: 0
    });
  };

  const handleDataChange = (newData: OriginalMetrics) => {
    setOriginal(newData);
  };

  const profitImpact = adjusted.netProfit - (original.revenue - original.revenue * (original.cogsPercent / 100) - original.shippingCost - original.spend - original.opex);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">€</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">E-commerce Profit Scenario Planner</h1>
                <p className="text-sm text-gray-500">Adjust metrics and see real-time impact on profitability</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDataPanelOpen(!isDataPanelOpen)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {isDataPanelOpen ? 'Hide' : 'Edit Business Data'}
              </button>
              <button
                onClick={resetAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Reset All
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'side-by-side'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setViewMode('overlay')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'overlay'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Overlay
                </button>
                <button
                  onClick={() => setViewMode('delta')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'delta'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Delta
                </button>
              </div>
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ScenarioPresets onPresetSelect={handlePreset} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Adjustment Controls */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Adjust Your Metrics
              </h2>

              <div className="space-y-6">
                <MetricSlider
                  label="Revenue (Manual)"
                  value={adjustments.revenue}
                  onChange={(value: number) => handleAdjustmentChange('revenue', value)}
                  icon="📈"
                  subtitle="Additional revenue beyond orders × AOV"
                />
                <MetricSlider
                  label="Orders"
                  value={adjustments.orders}
                  onChange={(value: number) => handleAdjustmentChange('orders', value)}
                  icon="📦"
                  subtitle="Affects revenue automatically"
                />
                <MetricSlider
                  label="Average Order Value"
                  value={adjustments.aov}
                  onChange={(value: number) => handleAdjustmentChange('aov', value)}
                  icon="💰"
                  subtitle="Affects revenue automatically"
                />
                <MetricSlider
                  label="Marketing Spend"
                  value={adjustments.marketingSpend}
                  onChange={(value: number) => handleAdjustmentChange('marketingSpend', value)}
                  icon="📢"
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
                <MetricSlider
                  label="Operating Expenses"
                  value={adjustments.operatingExpenses}
                  onChange={(value: number) => handleAdjustmentChange('operatingExpenses', value)}
                  icon="🏢"
                />
              </div>

              {/* Revenue Correlation Info */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">📊 Revenue Calculation:</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Base: {original.orders.toLocaleString()} orders × €{original.aov} AOV = €{(original.orders * original.aov).toLocaleString()}</div>
                  <div>Adjusted: {adjusted.orders.toLocaleString()} orders × €{adjusted.aov.toFixed(2)} AOV = €{(adjusted.orders * adjusted.aov).toLocaleString()}</div>
                  <div className="text-blue-600 font-medium">Total Revenue: €{adjusted.revenue.toLocaleString()}</div>
                </div>
              </div>

              {/* Profit Impact Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">💰 Profit Impact</div>
                  <div className={`text-2xl font-bold ${
                    profitImpact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {profitImpact >= 0 ? '+' : ''}€{Math.abs(profitImpact).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
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
                originalValue={original.revenue}
                adjustedValue={adjusted.revenue}
                format="currency"
                viewMode={viewMode}
              />
              <MetricCard
                title="💳 Marketing Performance"
                originalValue={original.revenue / original.spend}
                adjustedValue={adjusted.roas}
                format="ratio"
                viewMode={viewMode}
                subtitle="ROAS"
              />
              <MetricCard
                title="📊 Cost per Acquisition"
                originalValue={original.spend / original.orders}
                adjustedValue={adjusted.cpa}
                format="currency"
                viewMode={viewMode}
                subtitle="CPA"
              />
              <MetricCard
                title="💰 Profitability"
                originalValue={(original.revenue - original.revenue * (original.cogsPercent / 100) - original.shippingCost - original.spend - original.opex) / original.revenue * 100}
                adjustedValue={adjusted.netProfitMargin}
                format="percentage"
                viewMode={viewMode}
                subtitle="Net Profit Margin"
              />
              <MetricCard
                title="📦 Gross Margin"
                originalValue={(original.revenue - original.revenue * (original.cogsPercent / 100)) / original.revenue * 100}
                adjustedValue={adjusted.grossMargin}
                format="percentage"
                viewMode={viewMode}
              />
              <MetricCard
                title="💵 Net Profit"
                originalValue={original.revenue - original.revenue * (original.cogsPercent / 100) - original.shippingCost - original.spend - original.opex}
                adjustedValue={adjusted.netProfit}
                format="currency"
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 