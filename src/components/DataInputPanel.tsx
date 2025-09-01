'use client';

import { useState } from 'react';
import { OriginalMetrics, ChannelMetrics, sumChannels } from '@/lib/scenarioCalculations';

interface DataInputPanelProps {
  originalData: OriginalMetrics;
  onDataChange: (data: OriginalMetrics) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function DataInputPanel({ originalData, onDataChange, isOpen, onToggle }: DataInputPanelProps) {
  const [localData, setLocalData] = useState<OriginalMetrics>(originalData);
  const [isEditing, setIsEditing] = useState(false);

  // Helper function for safe division
  const safeDivide = (numerator: number, denominator: number, fallback: number = 0) => {
    return denominator !== 0 ? numerator / denominator : fallback;
  };

  const handleInputChange = (field: keyof OriginalMetrics, value: string | ChannelMetrics) => {
    if (typeof value === 'string') {
      const numValue = parseFloat(value) || 0;
      setLocalData(prev => ({
        ...prev,
        [field]: numValue
      }));
    } else {
      // Handle ChannelMetrics
      setLocalData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleChannelChange = (field: 'revenue' | 'spend' | 'orders' | 'aov', channel: keyof ChannelMetrics, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [channel]: numValue
      }
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
      revenue: { paid: 2000000, organic: 800000, crm: 400000, socialPaid: 300000, other: 200000, affiliate: 300000 },
      spend: { paid: 1000000, organic: 200000, crm: 100000, socialPaid: 200000, other: 150000, affiliate: 350000 },
      orders: { paid: 50000, organic: 20000, crm: 10000, socialPaid: 8000, other: 6000, affiliate: 6000 },
      aov: { paid: 40, organic: 40, crm: 40, socialPaid: 37.5, other: 33.33, affiliate: 50 },
      shippingCost: 100000,
      cogsPercent: 12
    };
    setLocalData(defaultData);
    onDataChange(defaultData);
    setIsEditing(false);
  };

  const exportToCSV = () => {
    const totalRevenue = sumChannels(originalData.revenue);
    const totalSpend = sumChannels(originalData.spend);
    
    const csvContent = [
      'Metric,Value',
      `Total Revenue,${totalRevenue}`,
      `Total Marketing Spend,${totalSpend}`,
      `Paid Revenue,${originalData.revenue.paid}`,
      `Organic Revenue,${originalData.revenue.organic}`,
      `CRM Revenue,${originalData.revenue.crm}`,
      `Social Paid Revenue,${originalData.revenue.socialPaid}`,
      `Other Revenue,${originalData.revenue.other}`,
      `Affiliate Revenue,${originalData.revenue.affiliate}`,
      `Paid Spend,${originalData.spend.paid}`,
      `Organic Spend,${originalData.spend.organic}`,
      `CRM Spend,${originalData.spend.crm}`,
      `Social Paid Spend,${originalData.spend.socialPaid}`,
      `Other Spend,${originalData.spend.other}`,
      `Affiliate Spend,${originalData.spend.affiliate}`,
      `Total Orders,${sumChannels(originalData.orders)}`,
      `Total AOV,${sumChannels(originalData.aov) / 6}`,
      `Paid Orders,${originalData.orders.paid}`,
      `Organic Orders,${originalData.orders.organic}`,
      `CRM Orders,${originalData.orders.crm}`,
      `Social Paid Orders,${originalData.orders.socialPaid}`,
      `Other Orders,${originalData.orders.other}`,
      `Affiliate Orders,${originalData.orders.affiliate}`,
      `Paid AOV,${originalData.aov.paid}`,
      `Organic AOV,${originalData.aov.organic}`,
      `CRM AOV,${originalData.aov.crm}`,
      `Social Paid AOV,${originalData.aov.socialPaid}`,
      `Other AOV,${originalData.aov.other}`,
      `Affiliate AOV,${originalData.aov.affiliate}`,
      `Shipping Cost,${originalData.shippingCost}`,
      `COGS %,${originalData.cogsPercent}`,
      `ROAS,${safeDivide(totalRevenue, totalSpend, 0).toFixed(2)}`
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
            case 'total revenue':
              // Distribute total revenue proportionally
              const currentTotal = sumChannels(newData.revenue);
              if (currentTotal > 0) {
                const ratio = numValue / currentTotal;
                newData.revenue = {
                  paid: newData.revenue.paid * ratio,
                  organic: newData.revenue.organic * ratio,
                  crm: newData.revenue.crm * ratio,
                  socialPaid: newData.revenue.socialPaid * ratio,
                  other: newData.revenue.other * ratio,
                  affiliate: newData.revenue.affiliate * ratio
                };
              }
              break;
            case 'total marketing spend':
              // Distribute total spend proportionally
              const currentSpendTotal = sumChannels(newData.spend);
              if (currentSpendTotal > 0) {
                const spendRatio = numValue / currentSpendTotal;
                newData.spend = {
                  paid: newData.spend.paid * spendRatio,
                  organic: newData.spend.organic * spendRatio,
                  crm: newData.spend.crm * spendRatio,
                  socialPaid: newData.spend.socialPaid * spendRatio,
                  other: newData.spend.other * spendRatio,
                  affiliate: newData.spend.affiliate * spendRatio
                };
              }
              break;
            case 'paid revenue':
              newData.revenue.paid = numValue;
              break;
            case 'organic revenue':
              newData.revenue.organic = numValue;
              break;
            case 'crm revenue':
              newData.revenue.crm = numValue;
              break;
            case 'social paid revenue':
              newData.revenue.socialPaid = numValue;
              break;
            case 'other revenue':
              newData.revenue.other = numValue;
              break;
            case 'affiliate revenue':
              newData.revenue.affiliate = numValue;
              break;
            case 'paid spend':
              newData.spend.paid = numValue;
              break;
            case 'organic spend':
              newData.spend.organic = numValue;
              break;
            case 'crm spend':
              newData.spend.crm = numValue;
              break;
            case 'social paid spend':
              newData.spend.socialPaid = numValue;
              break;
            case 'other spend':
              newData.spend.other = numValue;
              break;
            case 'affiliate spend':
              newData.spend.affiliate = numValue;
              break;
            case 'orders':
              // Distribute orders across channels equally
              const orderPerChannel = numValue / 6;
              newData.orders = {
                paid: orderPerChannel,
                organic: orderPerChannel,
                crm: orderPerChannel,
                socialPaid: orderPerChannel,
                other: orderPerChannel,
                affiliate: orderPerChannel
              };
              break;
            case 'paid orders':
              newData.orders.paid = numValue;
              break;
            case 'organic orders':
              newData.orders.organic = numValue;
              break;
            case 'crm orders':
              newData.orders.crm = numValue;
              break;
            case 'social paid orders':
              newData.orders.socialPaid = numValue;
              break;
            case 'other orders':
              newData.orders.other = numValue;
              break;
            case 'affiliate orders':
              newData.orders.affiliate = numValue;
              break;
            case 'average order value':
              // Distribute AOV across channels equally
              const aovPerChannel = numValue / 6;
              newData.aov = {
                paid: aovPerChannel,
                organic: aovPerChannel,
                crm: aovPerChannel,
                socialPaid: aovPerChannel,
                other: aovPerChannel,
                affiliate: aovPerChannel
              };
              break;
            case 'paid aov':
              newData.aov.paid = numValue;
              break;
            case 'organic aov':
              newData.aov.organic = numValue;
              break;
            case 'crm aov':
              newData.aov.crm = numValue;
              break;
            case 'social paid aov':
              newData.aov.socialPaid = numValue;
              break;
            case 'other aov':
              newData.aov.other = numValue;
              break;
            case 'affiliate aov':
              newData.aov.affiliate = numValue;
              break;
            case 'shipping cost':
              newData.shippingCost = numValue;
              break;
            case 'cogs %':
              newData.cogsPercent = numValue;
              break;
            case 'operating expenses':
              // Operating expenses not currently supported in the data model
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

  const totalRevenue = sumChannels(originalData.revenue);
  const totalSpend = sumChannels(originalData.spend);

  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 ${isEditing ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-900'} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white dark:text-white">
            {isEditing ? '📝 Editing Business Data' : '📊 Business Data'}
          </h3>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={exportToCSV}
                  className="px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-colors"
                >
                  Export CSV
                </button>
                <label className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors cursor-pointer">
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
                  className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
                >
                  Edit Data
                </button>
              </>
            )}
            <button
              onClick={onToggle}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {isOpen ? '▼' : '▶'}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Total Revenue</label>
                <div className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
                  {formatCurrency(totalRevenue)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Total Marketing Spend</label>
                <div className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
                  {formatCurrency(totalSpend)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Current ROAS</label>
                <div className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
                  {safeDivide(totalRevenue, totalSpend, 0).toFixed(2)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Marketing Cost %</label>
                <div className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
                  {(safeDivide(totalSpend, totalRevenue, 0) * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Channel Breakdown */}
            {isEditing && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Revenue by Channel</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Paid</label>
                    <input
                      type="number"
                      value={localData.revenue.paid}
                      onChange={(e) => handleChannelChange('revenue', 'paid', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Organic</label>
                    <input
                      type="number"
                      value={localData.revenue.organic}
                      onChange={(e) => handleChannelChange('revenue', 'organic', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="800000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">CRM</label>
                    <input
                      type="number"
                      value={localData.revenue.crm}
                      onChange={(e) => handleChannelChange('revenue', 'crm', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="400000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Social Paid</label>
                    <input
                      type="number"
                      value={localData.revenue.socialPaid}
                      onChange={(e) => handleChannelChange('revenue', 'socialPaid', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="300000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Other</label>
                    <input
                      type="number"
                      value={localData.revenue.other}
                      onChange={(e) => handleChannelChange('revenue', 'other', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="200000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Affiliate</label>
                    <input
                      type="number"
                      value={localData.revenue.affiliate}
                      onChange={(e) => handleChannelChange('revenue', 'affiliate', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="300000"
                    />
                  </div>
                </div>

                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Marketing Spend by Channel</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Paid</label>
                    <input
                      type="number"
                      value={localData.spend.paid}
                      onChange={(e) => handleChannelChange('spend', 'paid', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Organic</label>
                    <input
                      type="number"
                      value={localData.spend.organic}
                      onChange={(e) => handleChannelChange('spend', 'organic', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="200000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">CRM</label>
                    <input
                      type="number"
                      value={localData.spend.crm}
                      onChange={(e) => handleChannelChange('spend', 'crm', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Social Paid</label>
                    <input
                      type="number"
                      value={localData.spend.socialPaid}
                      onChange={(e) => handleChannelChange('spend', 'socialPaid', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="200000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Other</label>
                    <input
                      type="number"
                      value={localData.spend.other}
                      onChange={(e) => handleChannelChange('spend', 'other', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="150000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Affiliate</label>
                    <input
                      type="number"
                      value={localData.spend.affiliate}
                      onChange={(e) => handleChannelChange('spend', 'affiliate', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="350000"
                    />
                  </div>
                </div>

                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Orders by Channel</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Paid</label>
                    <input
                      type="number"
                      value={localData.orders.paid}
                      onChange={(e) => handleChannelChange('orders', 'paid', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Organic</label>
                    <input
                      type="number"
                      value={localData.orders.organic}
                      onChange={(e) => handleChannelChange('orders', 'organic', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">CRM</label>
                    <input
                      type="number"
                      value={localData.orders.crm}
                      onChange={(e) => handleChannelChange('orders', 'crm', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Social Paid</label>
                    <input
                      type="number"
                      value={localData.orders.socialPaid}
                      onChange={(e) => handleChannelChange('orders', 'socialPaid', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Other</label>
                    <input
                      type="number"
                      value={localData.orders.other}
                      onChange={(e) => handleChannelChange('orders', 'other', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Affiliate</label>
                    <input
                      type="number"
                      value={localData.orders.affiliate}
                      onChange={(e) => handleChannelChange('orders', 'affiliate', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6000"
                    />
                  </div>
                </div>

                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Average Order Value by Channel</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Paid</label>
                    <input
                      type="number"
                      value={localData.aov.paid}
                      onChange={(e) => handleChannelChange('aov', 'paid', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="40"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Organic</label>
                    <input
                      type="number"
                      value={localData.aov.organic}
                      onChange={(e) => handleChannelChange('aov', 'organic', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="40"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">CRM</label>
                    <input
                      type="number"
                      value={localData.aov.crm}
                      onChange={(e) => handleChannelChange('aov', 'crm', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="40"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Social Paid</label>
                    <input
                      type="number"
                      value={localData.aov.socialPaid}
                      onChange={(e) => handleChannelChange('aov', 'socialPaid', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="37.5"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Other</label>
                    <input
                      type="number"
                      value={localData.aov.other}
                      onChange={(e) => handleChannelChange('aov', 'other', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="33.33"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Affiliate</label>
                    <input
                      type="number"
                      value={localData.aov.affiliate}
                      onChange={(e) => handleChannelChange('aov', 'affiliate', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Other Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Total Orders</label>
                <div className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
                  {formatNumber(sumChannels(originalData.orders))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Average AOV</label>
                <div className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
                  €{(sumChannels(originalData.aov) / 6).toFixed(2)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Shipping Cost</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={localData.shippingCost}
                    onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100000"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
                    {formatCurrency(originalData.shippingCost)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">COGS %</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={localData.cogsPercent}
                    onChange={(e) => handleInputChange('cogsPercent', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12"
                    step="0.1"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md">
                    {originalData.cogsPercent}%
                  </div>
                )}
              </div>


            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isOpen && isEditing && (
          <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Reset to Default
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
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