'use client';

import { ScenarioAdjustments } from './ScenarioPlanner';

interface ScenarioPresetsProps {
  onPresetSelect: (preset: ScenarioAdjustments) => void;
}

const presets = [
  {
    name: 'Growth Mode',
    description: 'Aggressive revenue growth with increased marketing',
    adjustments: {
      revenue: 20,
      orders: 25,
      aov: 0,
      marketingSpend: 30,
      shippingCost: 15,
      cogsPercent: 0,
      operatingExpenses: 10
    },
    color: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
  },
  {
    name: 'Efficiency Focus',
    description: 'Optimize costs while maintaining revenue',
    adjustments: {
      revenue: 0,
      orders: 0,
      aov: 0,
      marketingSpend: -20,
      shippingCost: -15,
      cogsPercent: -10,
      operatingExpenses: -15
    },
    color: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
  },
  {
    name: 'Scale Up',
    description: 'Major expansion with proportional cost increases',
    adjustments: {
      revenue: 50,
      orders: 50,
      aov: 0,
      marketingSpend: 40,
      shippingCost: 25,
      cogsPercent: 5,
      operatingExpenses: 20
    },
    color: 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
  },
  {
    name: 'Conservative',
    description: 'Cautious approach with minimal changes',
    adjustments: {
      revenue: 5,
      orders: 5,
      aov: 0,
      marketingSpend: 0,
      shippingCost: 0,
      cogsPercent: 0,
      operatingExpenses: 0
    },
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200'
  }
];

export function ScenarioPresets({ onPresetSelect }: ScenarioPresetsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Quick Scenarios</h3>
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