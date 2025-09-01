'use client';

import { ProfitCurvePoint } from '@/lib/calculations';

interface ProfitImpactSimulatorProps {
  current: ProfitCurvePoint[];
  improved: ProfitCurvePoint[];
  declined: ProfitCurvePoint[];
  currentTROAS: number;
  recommendedTROAS: number;
}

export function ProfitImpactSimulator({ 
  current, 
  improved, 
  declined, 
  currentTROAS, 
  recommendedTROAS 
}: ProfitImpactSimulatorProps) {
  const maxProfit = Math.max(...current.map(p => p.profit));
  const minProfit = Math.min(...current.map(p => p.profit));
  const profitRange = maxProfit - minProfit;

  const getYPosition = (profit: number) => {
    return 100 - ((profit - minProfit) / profitRange) * 80; // 80% of height for chart
  };

  const getXPosition = (troas: number) => {
    return ((troas - 1) / 7) * 100; // 1.0 to 8.0 range
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-blue-500"></div>
          <span>Current Business Health</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-green-500 border-dashed border"></div>
          <span>If Business Improves 10%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-red-500 border-dashed border"></div>
          <span>If Business Declines 10%</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-64 bg-gray-50 rounded-lg border border-gray-200">
        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-5 grid-rows-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-r border-gray-200"></div>
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-b border-gray-200"></div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 px-2">
          <span>${(maxProfit / 1000).toFixed(0)}k</span>
          <span>${((maxProfit + minProfit) / 2 / 1000).toFixed(0)}k</span>
          <span>${(minProfit / 1000).toFixed(0)}k</span>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4 pb-1">
          <span>1.0</span>
          <span>2.0</span>
          <span>3.0</span>
          <span>4.0</span>
          <span>5.0</span>
          <span>6.0</span>
          <span>7.0</span>
          <span>8.0</span>
        </div>

        {/* Profit Curves */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Current curve */}
          <path
            d={`M ${current.map((point) => 
              `${getXPosition(point.troas)} ${getYPosition(point.profit)}`
            ).join(' L ')}`}
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
          />

          {/* Improved curve */}
          <path
            d={`M ${improved.map((point) => 
              `${getXPosition(point.troas)} ${getYPosition(point.profit)}`
            ).join(' L ')}`}
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />

          {/* Declined curve */}
          <path
            d={`M ${declined.map((point) => 
              `${getXPosition(point.troas)} ${getYPosition(point.profit)}`
            ).join(' L ')}`}
            stroke="#ef4444"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />

          {/* Current tROAS marker */}
          <circle
            cx={`${getXPosition(currentTROAS)}%`}
            cy={`${getYPosition(current.find(p => p.troas >= currentTROAS)?.profit || 0)}%`}
            r="4"
            fill="#3b82f6"
            className="pulse-glow"
          />

          {/* Recommended tROAS marker */}
          <circle
            cx={`${getXPosition(recommendedTROAS)}%`}
            cy={`${getYPosition(current.find(p => p.troas >= recommendedTROAS)?.profit || 0)}%`}
            r="4"
            fill="#10b981"
            className="pulse-glow"
          />
        </svg>

        {/* Shaded zones */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-green-100 opacity-30 rounded-t-lg"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-red-100 opacity-30 rounded-b-lg"></div>
        </div>

        {/* Zone labels */}
        <div className="absolute top-2 left-2 text-xs font-medium text-green-700">
          Safe to Expand
        </div>
        <div className="absolute bottom-2 left-2 text-xs font-medium text-red-700">
          Risky Territory
        </div>
      </div>

      {/* Chart Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="font-medium text-blue-900">Current tROAS</div>
          <div className="text-2xl font-bold text-blue-600">{currentTROAS}</div>
          <div className="text-xs text-blue-700">
            Profit: ${(current.find(p => p.troas >= currentTROAS)?.profit || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="font-medium text-green-900">Recommended tROAS</div>
          <div className="text-2xl font-bold text-green-600">{recommendedTROAS}</div>
          <div className="text-xs text-green-700">
            Profit: ${(current.find(p => p.troas >= recommendedTROAS)?.profit || 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
} 