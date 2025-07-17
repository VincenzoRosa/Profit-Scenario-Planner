'use client';

interface MetricCardProps {
  title: string;
  originalValue: number;
  adjustedValue: number;
  format: 'currency' | 'percentage' | 'ratio' | 'number';
  viewMode: 'side-by-side' | 'overlay' | 'delta';
  subtitle?: string;
}

export function MetricCard({ 
  title, 
  originalValue, 
  adjustedValue, 
  format, 
  viewMode, 
  subtitle 
}: MetricCardProps) {
  const formatValue = (value: number, formatType: string) => {
    switch (formatType) {
      case 'currency':
        return `€${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'ratio':
        return value.toFixed(2);
      case 'number':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  const getChangeColor = (original: number, adjusted: number) => {
    const change = adjusted - original;
    const percentChange = original !== 0 ? (change / original) * 100 : 0;
    
    if (percentChange > 2) return 'text-green-600';
    if (percentChange < -2) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (original: number, adjusted: number) => {
    const change = adjusted - original;
    const percentChange = original !== 0 ? (change / original) * 100 : 0;
    
    if (percentChange > 2) return '↗️';
    if (percentChange < -2) return '↘️';
    return '→';
  };

  const getChangeText = (original: number, adjusted: number) => {
    const change = adjusted - original;
    const percentChange = original !== 0 ? (change / original) * 100 : 0;
    
    if (Math.abs(percentChange) < 2) return 'No change';
    return `${change > 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
  };

  const renderSideBySide = () => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Original</span>
        <span className="text-sm font-medium text-gray-900">
          {formatValue(originalValue, format)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Adjusted</span>
        <span className="text-sm font-bold text-gray-900">
          {formatValue(adjustedValue, format)}
        </span>
      </div>
      <div className="flex justify-between items-center pt-1 border-t border-gray-100">
        <span className="text-xs text-gray-500">Change</span>
        <span className={`text-xs font-medium ${getChangeColor(originalValue, adjustedValue)}`}>
          {getChangeIcon(originalValue, adjustedValue)} {getChangeText(originalValue, adjustedValue)}
        </span>
      </div>
    </div>
  );

  const renderOverlay = () => (
    <div className="relative">
      <div className="text-lg font-bold text-gray-900">
        {formatValue(adjustedValue, format)}
      </div>
      <div className="text-sm text-gray-500 opacity-75">
        was {formatValue(originalValue, format)}
      </div>
      <div className={`text-xs font-medium mt-1 ${getChangeColor(originalValue, adjustedValue)}`}>
        {getChangeIcon(originalValue, adjustedValue)} {getChangeText(originalValue, adjustedValue)}
      </div>
    </div>
  );

  const renderDelta = () => {
    const change = adjustedValue - originalValue;
    const percentChange = originalValue !== 0 ? (change / originalValue) * 100 : 0;
    
    return (
      <div className="text-center">
        <div className={`text-2xl font-bold ${getChangeColor(originalValue, adjustedValue)}`}>
          {getChangeIcon(originalValue, adjustedValue)} {getChangeText(originalValue, adjustedValue)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {formatValue(adjustedValue, format)}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'side-by-side':
        return renderSideBySide();
      case 'overlay':
        return renderOverlay();
      case 'delta':
        return renderDelta();
      default:
        return renderSideBySide();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
} 