'use client';

import { TROASRecommendation } from '@/lib/calculations';

interface TROASMatrixProps {
  matrix: { x: number; y: number; troas: number; color: string }[];
  currentPosition: { x: number; y: number };
  recommendation: TROASRecommendation;
}

export function TROASMatrix({ matrix, currentPosition, recommendation }: TROASMatrixProps) {
  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Aggressive (1.5-2.5)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Balanced (2.5-4.0)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Conservative (4.0-6.0)</span>
          </div>
        </div>
      </div>

      {/* Matrix Visualization */}
      <div className="relative">
        <div className="grid grid-cols-21 gap-px bg-gray-200 rounded-lg overflow-hidden" style={{ gridTemplateColumns: 'repeat(21, 1fr)' }}>
          {matrix.map((point, index) => (
            <div
              key={index}
              className="w-full h-3"
              style={{ backgroundColor: point.color }}
              title={`Margin: ${point.x}%, Growth: ${point.y}%, tROAS: ${point.troas}`}
            />
          ))}
        </div>

        {/* Current Position Marker */}
        <div
          className="absolute w-4 h-4 bg-blue-600 rounded-full pulse-glow border-2 border-white"
          style={{
            left: `${(currentPosition.x / 40) * 100}%`,
            top: `${100 - ((currentPosition.y + 20) / 70) * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
          title={`Current: ${currentPosition.x}% margin, ${currentPosition.y}% growth`}
        />

        {/* Historical Path (simulated) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 25% 60% L 30% 55% L 35% 50% L 40% 45% L 45% 40% L 50% 35%"
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between text-xs text-gray-600">
        <span>0% Margin</span>
        <span>40% Margin</span>
      </div>
      <div className="text-xs text-gray-600 text-center">
        <div className="transform -rotate-90 origin-center inline-block">
          <span>-20% Growth</span>
          <span className="mx-4">+50% Growth</span>
        </div>
      </div>

      {/* Current Position Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-sm font-medium text-blue-900 mb-1">Current Position</div>
        <div className="text-xs text-blue-700 space-y-1">
          <div>Profit Margin: {currentPosition.x.toFixed(1)}%</div>
          <div>Revenue Growth: {currentPosition.y.toFixed(1)}%</div>
          <div>Recommended tROAS: {recommendation.recommendedTROAS.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
} 