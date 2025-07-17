'use client';

import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { ChannelMetrics } from '@/lib/scenarioCalculations';

interface ChannelSliderProps {
  label: string;
  value: ChannelMetrics;
  onChange: (value: ChannelMetrics) => void;
  icon: string;
  subtitle?: string;
}

const channels = [
  { key: 'paid', label: 'Paid', icon: '💰' },
  { key: 'organic', label: 'Organic', icon: '🌱' },
  { key: 'crm', label: 'CRM', icon: '📧' },
  { key: 'socialPaid', label: 'Social Paid', icon: '📱' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'affiliate', label: 'Affiliate', icon: '🤝' }
] as const;

export function ChannelSlider({ label, value, onChange, icon, subtitle }: ChannelSliderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChannelChange = (channelKey: keyof ChannelMetrics, newValue: number) => {
    onChange({
      ...value,
      [channelKey]: newValue
    });
  };

  const getTotalChange = () => {
    const total = Object.values(value).reduce((sum, val) => sum + val, 0);
    return total;
  };

  const getChangeColor = (total: number) => {
    if (total > 0) return 'text-green-600';
    if (total < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (total: number) => {
    if (total > 2) return '↗️';
    if (total < -2) return '↘️';
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
          <span className={`text-sm font-bold ${getChangeColor(getTotalChange())}`}>
            {getChangeIcon(getTotalChange())} {getTotalChange() > 0 ? '+' : ''}{getTotalChange()}%
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pl-6 border-l-2 border-gray-200">
          {channels.map((channel) => (
            <div key={channel.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{channel.icon}</span>
                  <label className="text-xs font-medium text-gray-700">{channel.label}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold ${getChangeColor(value[channel.key])}`}>
                    {getChangeIcon(value[channel.key])} {value[channel.key] > 0 ? '+' : ''}{value[channel.key]}%
                  </span>
                  {value[channel.key] !== 0 && (
                    <button
                      onClick={() => handleChannelChange(channel.key, 0)}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="relative">
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-4"
                  value={[value[channel.key]]}
                  onValueChange={(newValue) => handleChannelChange(channel.key, newValue[0])}
                  max={100}
                  min={-50}
                  step={5}
                >
                  <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-500 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all" />
                </Slider.Root>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-50%</span>
                  <span>+100%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 