'use client';

import { BusinessMetrics } from '@/lib/calculations';

interface BusinessHealthInputsProps {
  metrics: BusinessMetrics;
  onMetricsChange: (metrics: BusinessMetrics) => void;
}

export function BusinessHealthInputs({ metrics, onMetricsChange }: BusinessHealthInputsProps) {
  const updateMetric = (key: keyof BusinessMetrics, value: string | number) => {
    onMetricsChange({ ...metrics, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Business Health Inputs</h2>
      
      {/* Current Business Metrics */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Current Business Metrics</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Monthly Revenue ($)
            </label>
            <input
              type="number"
              value={metrics.totalRevenue}
              onChange={(e) => updateMetric('totalRevenue', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month-over-Month Revenue Growth (%)
            </label>
            <input
              type="number"
              value={metrics.revenueGrowth}
              onChange={(e) => updateMetric('revenueGrowth', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Gross Margin (%)
            </label>
            <input
              type="number"
              value={metrics.grossMargin}
              onChange={(e) => updateMetric('grossMargin', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operating Expense Ratio (% of revenue)
            </label>
            <input
              type="number"
              value={metrics.operatingExpenseRatio}
              onChange={(e) => updateMetric('operatingExpenseRatio', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cash Reserve Ratio (months of OpEx)
            </label>
            <input
              type="number"
              value={metrics.cashReserveRatio}
              onChange={(e) => updateMetric('cashReserveRatio', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inventory Turnover Rate
            </label>
            <input
              type="number"
              value={metrics.inventoryTurnoverRate}
              onChange={(e) => updateMetric('inventoryTurnoverRate', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SEA Campaign Inputs */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">SEA Campaign Inputs</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current SEA Spend ($)
            </label>
            <input
              type="number"
              value={metrics.seaSpend}
              onChange={(e) => updateMetric('seaSpend', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current SEA ROAS
            </label>
            <input
              type="number"
              step="0.1"
              value={metrics.seaROAS}
              onChange={(e) => updateMetric('seaROAS', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current tROAS Setting
            </label>
            <input
              type="number"
              step="0.1"
              value={metrics.currentTROAS}
              onChange={(e) => updateMetric('currentTROAS', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              % of Total Revenue from SEA
            </label>
            <input
              type="number"
              value={metrics.seaRevenuePercentage}
              onChange={(e) => updateMetric('seaRevenuePercentage', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Business Context Indicators */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Business Context</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Season
            </label>
            <select
              value={metrics.season}
              onChange={(e) => updateMetric('season', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Market Competition
            </label>
            <select
              value={metrics.marketCompetition}
              onChange={(e) => updateMetric('marketCompetition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Stage
            </label>
            <select
              value={metrics.businessStage}
              onChange={(e) => updateMetric('businessStage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="growth">Growth</option>
              <option value="stable">Stable</option>
              <option value="optimize">Optimize</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 