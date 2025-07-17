'use client';

import { TROASRecommendation, BusinessMetrics } from '@/lib/calculations';

interface SmartAlertsProps {
  recommendation: TROASRecommendation;
  metrics: BusinessMetrics;
}

export function SmartAlerts({ recommendation, metrics }: SmartAlertsProps) {
  const generateAlerts = () => {
    const alerts = [];

    // Business health improved but tROAS unchanged
    if (recommendation.businessHealthScore > 70 && Math.abs(recommendation.suggestedChange) > 0.5) {
      alerts.push({
        type: 'opportunity',
        title: 'Business health improved but tROAS unchanged',
        message: `Your business health score is ${recommendation.businessHealthScore.toFixed(0)}/100. Consider lowering tROAS to ${recommendation.recommendedTROAS.toFixed(1)} to capture growth opportunities.`,
        action: `Lower tROAS to ${recommendation.recommendedTROAS.toFixed(1)}`,
        priority: 'high'
      });
    }

    // Margins compressed
    if (metrics.grossMargin < 20) {
      alerts.push({
        type: 'warning',
        title: 'Margins compressed this month',
        message: `Your gross margin of ${metrics.grossMargin.toFixed(1)}% is below the recommended 20% threshold. Consider increasing tROAS to protect profitability.`,
        action: 'Increase tROAS to protect margins',
        priority: 'medium'
      });
    }

    // High market opportunity
    if (recommendation.marketOpportunityScore > 80) {
      alerts.push({
        type: 'opportunity',
        title: 'High market opportunity detected',
        message: `Market opportunity score is ${recommendation.marketOpportunityScore.toFixed(0)}/100. Consider aggressive tROAS strategy to capture market share.`,
        action: 'Consider aggressive tROAS approach',
        priority: 'high'
      });
    }

    // Cash position warning
    if (metrics.cashReserveRatio < 3) {
      alerts.push({
        type: 'warning',
        title: 'Low cash reserve position',
        message: `Cash reserve of ${metrics.cashReserveRatio.toFixed(1)} months is below recommended 3-month minimum. Consider conservative tROAS approach.`,
        action: 'Adopt conservative tROAS strategy',
        priority: 'high'
      });
    }

    // Revenue growth declining
    if (metrics.revenueGrowth < 0) {
      alerts.push({
        type: 'warning',
        title: 'Revenue growth declining',
        message: `Month-over-month revenue growth is ${metrics.revenueGrowth.toFixed(1)}%. Consider adjusting tROAS strategy to address declining performance.`,
        action: 'Review and adjust tROAS strategy',
        priority: 'medium'
      });
    }

    // High competition environment
    if (metrics.marketCompetition === 'high' && recommendation.businessHealthScore > 60) {
      alerts.push({
        type: 'info',
        title: 'High competition environment',
        message: 'Market competition is high but business health is strong. Consider aggressive tROAS to maintain market position.',
        action: 'Consider aggressive positioning',
        priority: 'medium'
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Smart Alerts</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">tROAS Optimization Opportunities</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">No optimization alerts at this time</p>
          <p className="text-sm text-gray-500 mt-1">Your tROAS strategy appears to be well-aligned with current business conditions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      {alert.action}
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Historical Performance Tracker */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Historical Performance Tracker</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600">Date</th>
                <th className="text-left py-2 text-gray-600">Recommended</th>
                <th className="text-left py-2 text-gray-600">Actual</th>
                <th className="text-left py-2 text-gray-600">Revenue Impact</th>
                <th className="text-left py-2 text-gray-600">Profit Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-900">Dec 2024</td>
                <td className="py-2 text-gray-900">3.2</td>
                <td className="py-2 text-gray-900">3.0</td>
                <td className="py-2 text-green-600">+$12,400</td>
                <td className="py-2 text-green-600">+$3,720</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-900">Nov 2024</td>
                <td className="py-2 text-gray-900">3.5</td>
                <td className="py-2 text-gray-900">3.5</td>
                <td className="py-2 text-gray-600">$0</td>
                <td className="py-2 text-gray-600">$0</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-900">Oct 2024</td>
                <td className="py-2 text-gray-900">3.8</td>
                <td className="py-2 text-gray-900">4.0</td>
                <td className="py-2 text-red-600">-$8,200</td>
                <td className="py-2 text-red-600">-$2,460</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 