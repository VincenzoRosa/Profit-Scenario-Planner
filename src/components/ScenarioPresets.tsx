'use client';

import { ScenarioAdjustments } from '@/lib/scenarioCalculations';

interface ScenarioPresetsProps {
  onPresetSelect: (preset: ScenarioAdjustments) => void;
}

const presets = [
  {
    name: 'Growth Mode',
    description: 'Aggressive revenue growth with increased marketing',
    adjustments: {
      revenue: { paid: 20, organic: 20, crm: 20, socialPaid: 20, other: 20, affiliate: 20 },
      orders: { paid: 25, organic: 25, crm: 25, socialPaid: 25, other: 25, affiliate: 25 },
      aov: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      marketingSpend: { paid: 30, organic: 30, crm: 30, socialPaid: 30, other: 30, affiliate: 30 },
      shippingCost: 15,
      cogsPercent: 0
    },
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800'
  },
  {
    name: 'Efficiency Focus',
    description: 'Optimize costs while maintaining revenue',
    adjustments: {
      revenue: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      orders: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      aov: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      marketingSpend: { paid: -20, organic: -20, crm: -20, socialPaid: -20, other: -20, affiliate: -20 },
      shippingCost: -15,
      cogsPercent: -10
    },
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800'
  },
  {
    name: 'Scale Up',
    description: 'Major expansion with proportional cost increases',
    adjustments: {
      revenue: { paid: 50, organic: 50, crm: 50, socialPaid: 50, other: 50, affiliate: 50 },
      orders: { paid: 50, organic: 50, crm: 50, socialPaid: 50, other: 50, affiliate: 50 },
      aov: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      marketingSpend: { paid: 40, organic: 40, crm: 40, socialPaid: 40, other: 40, affiliate: 40 },
      shippingCost: 25,
      cogsPercent: 5
    },
    color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800'
  },
  {
    name: 'Conservative',
    description: 'Cautious approach with minimal changes',
    adjustments: {
      revenue: { paid: 5, organic: 5, crm: 5, socialPaid: 5, other: 5, affiliate: 5 },
      orders: { paid: 5, organic: 5, crm: 5, socialPaid: 5, other: 5, affiliate: 5 },
      aov: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      marketingSpend: { paid: 0, organic: 0, crm: 0, socialPaid: 0, other: 0, affiliate: 0 },
      shippingCost: 0,
      cogsPercent: 0
    },
    color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800'
  }
];

export function ScenarioPresets({ onPresetSelect }: ScenarioPresetsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Quick Scenarios</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onPresetSelect(preset.adjustments)}
            className={`px-4 py-3 rounded-lg border text-left transition-colors ${preset.color}`}
          >
            <div className="font-medium text-sm">{preset.name}</div>
            <div className="text-xs opacity-75 mt-1">{preset.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
} 