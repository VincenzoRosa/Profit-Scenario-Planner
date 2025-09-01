'use client';

import { TROASRecommendation, BusinessMetrics } from '@/lib/calculations';

interface SupportingVisualizationsProps {
  efficiencyCurve: { troas: number; revenue: number; efficiency: number }[];
  recommendation: TROASRecommendation;
  metrics: BusinessMetrics;
}

export function SupportingVisualizations({ efficiencyCurve, recommendation, metrics }: SupportingVisualizationsProps) {
  const getHealthColor = (score: number) => {
    if (score >= 70) return '#10b981'; // Green
    if (score >= 40) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getHealthZone = (score: number) => {
    if (score >= 70) return 'Strong';
    if (score >= 40) return 'Moderate';
    return 'Weak';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* tROAS Efficiency Curve */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">tROAS Efficiency Curve</h3>
        
        <div className="relative h-48 bg-gray-50 rounded-lg border border-gray-200 mb-4">
          <svg className="absolute inset-0 w-full h-full">
            {/* Grid lines */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={i}
                x1={`${(i + 1) * 20}%`}
                y1="0"
                x2={`${(i + 1) * 20}%`}
                y2="100%"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Efficiency curve */}
            <path
                          d={`M ${efficiencyCurve.map((point) => 
              `${(point.troas - 1) / 5 * 100} ${100 - (point.efficiency * 100)}`
            ).join(' L ')}`}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Current position */}
            <circle
              cx={`${(metrics.currentTROAS - 1) / 5 * 100}%`}
              cy={`${100 - (efficiencyCurve.find(p => p.troas >= metrics.currentTROAS)?.efficiency || 0) * 100}%`}
              r="4"
              fill="#3b82f6"
              className="pulse-glow"
            />
            
            {/* Recommended position */}
            <circle
              cx={`${(recommendation.recommendedTROAS - 1) / 5 * 100}%`}
              cy={`${100 - (efficiencyCurve.find(p => p.troas >= recommendation.recommendedTROAS)?.efficiency || 0) * 100}%`}
              r="4"
              fill="#10b981"
              className="pulse-glow"
            />
            
            {/* Efficient frontier shading */}
            <path
                          d={`M 0 100 L ${efficiencyCurve.map((point) => 
              `${(point.troas - 1) / 5 * 100} ${100 - (point.efficiency * 100)}`
            ).join(' L ')} L 100 100 Z`}
              fill="#3b82f6"
              opacity="0.1"
            />
          </svg>
          
          {/* Axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2 pb-1">
            <span>1.0</span>
            <span>2.0</span>
            <span>3.0</span>
            <span>4.0</span>
            <span>5.0</span>
            <span>6.0</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Current: {metrics.currentTROAS.toFixed(1)}</span>
            <span>Recommended: {recommendation.recommendedTROAS.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Business Health Gauge */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Health Gauge</h3>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Speedometer */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background arc */}
              <path
                d="M 10 90 A 40 40 0 0 1 90 90"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              
              {/* Health score arc */}
              <path
                d={`M 10 90 A 40 40 0 0 1 ${10 + (recommendation.businessHealthScore / 100) * 80} ${90 - Math.sin((recommendation.businessHealthScore / 100) * Math.PI) * 40}`}
                stroke={getHealthColor(recommendation.businessHealthScore)}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Needle */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="20"
                stroke="#374151"
                strokeWidth="2"
                transform={`rotate(${(recommendation.businessHealthScore / 100) * 180 - 90}, 50, 50)`}
              />
              
              {/* Center dot */}
              <circle cx="50" cy="50" r="3" fill="#374151" />
            </svg>
          </div>
          
          {/* Score display */}
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: getHealthColor(recommendation.businessHealthScore) }}>
              {recommendation.businessHealthScore.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Health Score</div>
            <div className="text-xs text-gray-500 mt-1">{getHealthZone(recommendation.businessHealthScore)}</div>
          </div>
          
          {/* Health zones */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-red-600">Weak (0-40)</span>
              <span className="text-yellow-600">Moderate (40-70)</span>
              <span className="text-green-600">Strong (70-100)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk/Reward Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk/Reward Matrix</h3>
        
        <div className="relative h-48 bg-gray-50 rounded-lg border border-gray-200 mb-4">
          <svg className="absolute inset-0 w-full h-full">
            {/* Grid */}
            <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            
            {/* Risk zones */}
            <rect x="0" y="0" width="33%" height="100%" fill="#fef2f2" opacity="0.3" />
            <rect x="33%" y="0" width="34%" height="100%" fill="#fffbeb" opacity="0.3" />
            <rect x="67%" y="0" width="33%" height="100%" fill="#f0fdf4" opacity="0.3" />
            
            {/* tROAS options */}
            {[
              { troas: 1.5, risk: 0.2, reward: 0.8, label: 'Aggressive' },
              { troas: 2.5, risk: 0.4, reward: 0.7, label: 'Balanced' },
              { troas: 3.5, risk: 0.6, reward: 0.6, label: 'Conservative' },
              { troas: 4.5, risk: 0.8, reward: 0.4, label: 'Defensive' },
              { troas: 5.5, risk: 0.9, reward: 0.2, label: 'Ultra-Conservative' }
            ].map((option, index) => (
              <g key={index}>
                <circle
                  cx={`${option.risk * 100}%`}
                  cy={`${100 - option.reward * 100}%`}
                  r="6"
                  fill={option.troas === recommendation.recommendedTROAS ? "#10b981" : "#3b82f6"}
                  className={option.troas === recommendation.recommendedTROAS ? "pulse-glow" : ""}
                />
                <text
                  x={`${option.risk * 100}%`}
                  y={`${100 - option.reward * 100 - 10}%`}
                  textAnchor="middle"
                  className="text-xs font-medium"
                  fill="#374151"
                >
                  {option.troas}
                </text>
              </g>
            ))}
            
            {/* Axes */}
            <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#374151" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="100%" stroke="#374151" strokeWidth="1" />
          </svg>
          
          {/* Axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2 pb-1">
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-2 pl-1">
            <span>High Reward</span>
            <span>Low Reward</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 text-center">
          <div className="font-medium">Recommended: {recommendation.recommendedTROAS.toFixed(1)}</div>
          <div className="text-xs text-gray-500 mt-1">
            Optimal balance of risk and reward
          </div>
        </div>
      </div>
    </div>
  );
} 