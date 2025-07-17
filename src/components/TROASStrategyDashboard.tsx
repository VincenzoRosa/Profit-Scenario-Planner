'use client';

import { TROASRecommendation, BusinessMetrics } from '@/lib/calculations';

interface TROASStrategyDashboardProps {
  recommendation: TROASRecommendation;
  metrics: BusinessMetrics;
}

export function TROASStrategyDashboard({ recommendation }: TROASStrategyDashboardProps) {
  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'STRONG': return 'text-green-600 bg-green-100';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-100';
      case 'WEAK': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">tROAS Strategy Dashboard</h2>
      
      {/* Recommended Strategy Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-3">Recommended Strategy</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700">Business Health:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getHealthStatusColor(recommendation.businessHealthStatus)}`}>
              {recommendation.businessHealthStatus}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700">Recommended tROAS:</span>
            <span className="text-lg font-bold text-blue-900">{recommendation.recommendedTROAS.toFixed(1)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700">Current tROAS:</span>
            <span className="text-sm text-blue-900">{recommendation.currentTROAS.toFixed(1)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700">Suggested Change:</span>
            <span className={`text-sm font-medium ${getChangeColor(recommendation.suggestedChange)}`}>
              {recommendation.suggestedChange > 0 ? '+' : ''}{recommendation.suggestedChange.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Reasoning</h3>
        <div className="space-y-2">
          {recommendation.reasoning.map((reason, index) => (
            <div key={index} className="text-sm text-gray-700 flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Projections */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">If You Apply Recommended tROAS</h3>
        
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">SEA Spend Change</div>
            <div className={`text-lg font-bold ${getChangeColor(recommendation.projectedSpendChange)}`}>
              {recommendation.projectedSpendChange > 0 ? '+' : ''}${recommendation.projectedSpendChange.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Expected Revenue Impact</div>
            <div className={`text-lg font-bold ${getChangeColor(recommendation.expectedRevenueImpact)}`}>
              {recommendation.expectedRevenueImpact > 0 ? '+' : ''}${recommendation.expectedRevenueImpact.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Profit Impact</div>
            <div className={`text-lg font-bold ${getChangeColor(recommendation.profitImpact)}`}>
              {recommendation.profitImpact > 0 ? '+' : ''}${recommendation.profitImpact.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Market Share Gain</div>
            <div className={`text-lg font-bold ${getChangeColor(recommendation.marketShareGain)}`}>
              {recommendation.marketShareGain > 0 ? '+' : ''}{recommendation.marketShareGain.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Additional Insights</h3>
        
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-sm font-medium text-yellow-800 mb-1">tROAS Flexibility</div>
            <div className="text-xs text-yellow-700">{recommendation.troasFlexibility}</div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-sm font-medium text-purple-800 mb-1">Market Opportunity Score</div>
            <div className="text-lg font-bold text-purple-600">{recommendation.marketOpportunityScore.toFixed(0)}/100</div>
          </div>
          
          {recommendation.overrideMessage && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-sm font-medium text-orange-800 mb-1">Special Consideration</div>
              <div className="text-xs text-orange-700">{recommendation.overrideMessage}</div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          Apply Recommended tROAS
        </button>
        <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
          Export Strategy Report
        </button>
      </div>
    </div>
  );
} 