'use client';

import { useState } from 'react';
import { OriginalMetrics } from '@/lib/scenarioCalculations';

interface DataInputPanelProps {
  originalData: OriginalMetrics;
  onDataChange: (data: OriginalMetrics) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function DataInputPanel({ originalData, onDataChange, isOpen, onToggle }: DataInputPanelProps) {
  const [localData, setLocalData] = useState<OriginalMetrics>(originalData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof OriginalMetrics, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSave = () => {
    onDataChange(localData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalData(originalData);
    setIsEditing(false);
  };

  const handleReset = () => {
    const defaultData: OriginalMetrics = {
      revenue: 4000000,
      spend: 2000000,
      orders: 100000,
      aov: 40,
      shippingCost: 100000,
      cogsPercent: 12,
      opex: 200000
    };
    setLocalData(defaultData);
    onDataChange(defaultData);
    setIsEditing(false);
  };

  const exportToCSV = () => {
    const csvContent = [
      'Metric,Value',
      `Revenue,${originalData.revenue}`,
      `Marketing Spend,${originalData.spend}`,
      `Orders,${originalData.orders}`,
      `Average Order Value,${originalData.aov}`,
      `Shipping Cost,${originalData.shippingCost}`,
      `COGS %,${originalData.cogsPercent}`,
      `Operating Expenses,${originalData.opex}`,
      `ROAS,${(originalData.revenue / originalData.spend).toFixed(2)}`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-metrics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newData = { ...originalData };

      lines.forEach(line => {
        const [metric, value] = line.split(',');
        const numValue = parseFloat(value);
        
        if (!isNaN(numValue)) {
          switch (metric.toLowerCase()) {
            case 'revenue':
              newData.revenue = numValue;
              break;
            case 'marketing spend':
              newData.spend = numValue;
              break;
            case 'orders':
              newData.orders = numValue;
              break;
            case 'average order value':
              newData.aov = numValue;
              break;
            case 'shipping cost':
              newData.shippingCost = numValue;
              break;
            case 'cogs %':
              newData.cogsPercent = numValue;
              break;
            case 'operating expenses':
              newData.opex = numValue;
              break;
          }
        }
      });

      setLocalData(newData);
      onDataChange(newData);
    };
    reader.readAsText(file);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className={`border-b border-gray-200 ${isEditing ? 'bg-blue-50' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">
            {isEditing ? '📝 Editing Business Data' : '📊 Business Data'}
          </h3>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={exportToCSV}
                  className="px-3 py-1 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                >
                  Export CSV
                </button>
                <label className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer">
                  Import CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={importFromCSV}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                >
                  Edit Data
                </button>
              </>
            )}
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isOpen ? '▼' : '▶'}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Revenue</label>
              {isEditing ? (
                <input
                  type="number"
                  value={localData.revenue}
                  onChange={(e) => handleInputChange('revenue', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="4000000"
                />
              ) : (
                <div className="px-3 py-2 text-sm bg-gray-50 rounded-md">
                  {formatCurrency(originalData.revenue)}
                </div>
              )}
            </div>

            {/* Marketing Spend */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Marketing Spend</label>
              {isEditing ? (
                <input
                  type="number"
                  value={localData.spend}
                  onChange={(e) => handleInputChange('spend', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2000000"
                />
              ) : (
                <div className="px-3 py-2 text-sm bg-gray-50 rounded-md">
                  {formatCurrency(originalData.spend)}
                </div>
              )}
            </div>

            {/* Orders */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Orders</label>
              {isEditing ? (
                <input
                  type="number"
                  value={localData.orders}
                  onChange={(e) => handleInputChange('orders', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100000"
                />
              ) : (
                <div className="px-3 py-2 text-sm bg-gray-50 rounded-md">
                  {formatNumber(originalData.orders)}
                </div>
              )}
            </div>

            {/* Average Order Value */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">AOV</label>
              {isEditing ? (
                <input
                  type="number"
                  value={localData.aov}
                  onChange={(e) => handleInputChange('aov', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="40"
                />
              ) : (
                <div className="px-3 py-2 text-sm bg-gray-50 rounded-md">
                  €{originalData.aov}
                </div>
              )}
            </div>

            {/* Shipping Cost */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Shipping Cost</label>
              {isEditing ? (
                <input
                  type="number"
                  value={localData.shippingCost}
                  onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100000"
                />
              ) : (
                <div className="px-3 py-2 text-sm bg-gray-50 rounded-md">
                  {formatCurrency(originalData.shippingCost)}
                </div>
              )}
            </div>

            {/* COGS % */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">COGS %</label>
              {isEditing ? (
                <input
                  type="number"
                  value={localData.cogsPercent}
                  onChange={(e) => handleInputChange('cogsPercent', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12"
                  step="0.1"
                />
              ) : (
                <div className="px-3 py-2 text-sm bg-gray-50 rounded-md">
                  {originalData.cogsPercent}%
                </div>
              )}
            </div>

            {/* Operating Expenses */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Operating Expenses</label>
              {isEditing ? (
                <input
                  type="number"
                  value={localData.opex}
                  onChange={(e) => handleInputChange('opex', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="200000"
                />
              ) : (
                <div className="px-3 py-2 text-sm bg-gray-50 rounded-md">
                  {formatCurrency(originalData.opex)}
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Current ROAS</label>
              <div className="px-3 py-2 text-sm bg-gray-50 rounded-md">
                {(originalData.revenue / originalData.spend).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isOpen && isEditing && (
          <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Reset to Default
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 