'use client';

import { TROASRecommendation } from '@/lib/calculations';

interface ScenarioPlanningProps {
  scenario: 'conservative' | 'balanced' | 'aggressive';
  onScenarioChange: (scenario: 'conservative' | 'balanced' | 'aggressive') => void;
  recommendation: TROASRecommendation;
}

export function ScenarioPlanning({ scenario, onScenarioChange, recommendation }: ScenarioPlanningProps) {
  const getScenarioTROAS = () => {
    switch (scenario) {
      case 'conservative':
        return Math.min(6.0, recommendation.recommendedTROAS + 1.0);
      case 'aggressive':
        return Math.max(1.5, recommendation.recommendedTROAS - 1.0);
      default:
        return recommendation.recommendedTROAS;
    }
  };

  const scenarioTROAS = getScenarioTROAS();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Scenario Toggles */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Scenario Planning Mode</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onScenarioChange('conservative')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                scenario === 'conservative'
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Conservative
            </button>
            <button
              onClick={() => onScenarioChange('balanced')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                scenario === 'balanced'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Balanced
            </button>
            <button
              onClick={() => onScenarioChange('aggressive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                scenario === 'aggressive'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aggressive
            </button>
          </div>
        </div>

        {/* Scenario Summary */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-sm text-gray-600">Recommended tROAS</div>
            <div className="text-2xl font-bold text-gray-900">{scenarioTROAS.toFixed(1)}</div>
            <div className="text-xs text-gray-500 capitalize">{scenario} approach</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">Change from Current</div>
            <div className={`text-lg font-bold ${
              scenarioTROAS > recommendation.currentTROAS ? 'text-red-600' : 
              scenarioTROAS < recommendation.currentTROAS ? 'text-green-600' : 'text-gray-600'
            }`}>
              {scenarioTROAS > recommendation.currentTROAS ? '+' : ''}
              {(scenarioTROAS - recommendation.currentTROAS).toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* What-If Sliders */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">What-If Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Expected Revenue Change: <span className="font-medium">0%</span>
            </label>
            <input
              type="range"
              min="-20"
              max="50"
              defaultValue="0"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-20%</span>
              <span>+50%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Expected Margin Change: <span className="font-medium">0%</span>
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              defaultValue="0"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-10%</span>
              <span>+10%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Planned OpEx Change: <span className="font-medium">0%</span>
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              defaultValue="0"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-20%</span>
              <span>+20%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            See how tROAS should adapt to these changes →
          </button>
        </div>
      </div>
    </div>
  );
} 