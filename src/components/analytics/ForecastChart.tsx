import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { useState } from 'react';
import { useForecast } from '../../hooks/useForecast';
import { Wallet, Recurring, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { usePrivacy } from '../../contexts/PrivacyContext';

interface ForecastChartProps {
  wallets: Wallet[];
  recurring: Recurring[];
  transactions: Transaction[];
}

export function ForecastChart({
  wallets,
  recurring,
  transactions,
}: ForecastChartProps) {
  const { privacyMode } = usePrivacy();
  const [period, setPeriod] = useState('6');
  const [includeSpending, setIncludeSpending] = useState(false);

  const forecast = useForecast(
    wallets,
    recurring,
    transactions,
    parseInt(period),
    includeSpending
  );

  const formattedData = forecast.map(d => ({
    ...d,
    projected: parseFloat(d.projected.toFixed(2)),
    conservative: parseFloat(d.conservative.toFixed(2)),
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Balance Forecast
      </h3>

      <div className="flex gap-4 mb-6">
        <Select
          label="Period"
          value={period}
          onChange={setPeriod}
          options={[
            { value: '1', label: '1 Month' },
            { value: '3', label: '3 Months' },
            { value: '6', label: '6 Months' },
            { value: '12', label: '1 Year' },
          ]}
        />

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={includeSpending}
              onChange={(e) => setIncludeSpending(e.target.checked)}
              className="rounded"
            />
            Include Average Spending
          </label>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="currentColor"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            tickFormatter={(value) => {
              if (privacyMode) return '***';
              return `$${(value / 1000).toFixed(0)}k`;
            }}
          />
          <Tooltip
            formatter={(value: number) => {
              if (privacyMode) return '****';
              return formatCurrency(value, false);
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="projected"
            stroke="#3b82f6"
            dot={false}
            name="Projected Balance"
          />
          {includeSpending && (
            <Line
              type="monotone"
              dataKey="conservative"
              stroke="#ef4444"
              dot={false}
              name="Conservative"
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
