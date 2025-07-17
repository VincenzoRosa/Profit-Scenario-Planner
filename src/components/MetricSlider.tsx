'use client';

import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface MetricSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: string;
  subtitle?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function MetricSlider({ 
  label, 
  value, 
  onChange, 
  icon, 
  subtitle,
  min = -50, 
  max = 100, 
  step = 5 
}: MetricSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleValueChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  const resetValue = () => {
    onChange(0);
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (value: number) => {
    if (value > 2) return '↗️';
    if (value < -2) return '↘️';
    return '→';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{icon}</span>
          <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {subtitle && (
              <div className="text-xs text-gray-500">{subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${getChangeColor(value)}`}>
            {getChangeIcon(value)} {value > 0 ? '+' : ''}{value}%
          </span>
          {value !== 0 && (
            <button
              onClick={resetValue}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[value]}
          onValueChange={handleValueChange}
          onValueCommit={() => setIsDragging(false)}
          onPointerDown={() => setIsDragging(true)}
          max={max}
          min={min}
          step={step}
        >
          <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className={`block w-5 h-5 bg-white border-2 border-blue-500 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
              isDragging ? 'scale-110 shadow-lg' : ''
            }`}
          />
        </Slider.Root>

        {/* Min/Max labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}%</span>
          <span>{max}%</span>
        </div>
      </div>
    </div>
  );
} 