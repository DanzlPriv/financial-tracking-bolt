import { ChartLine } from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { Wallet } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { usePrivacy } from '../../contexts/PrivacyContext';

interface NetWorthCardProps {
  wallets: Wallet[];
}

export function NetWorthCard({ wallets }: NetWorthCardProps) {
  const { privacyMode } = usePrivacy();
  const totalNetWorth = wallets.reduce((sum, w) => sum + w.balance, 0);
  const isPositive = totalNetWorth >= 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Net Worth
        </h3>
        <ChartLine
          size={24}
          color={isPositive ? '#10b981' : '#ef4444'}
          weight="duotone"
        />
      </div>

      <p
        className={`text-3xl font-bold ${
          isPositive
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        } ${privacyMode ? 'blur-sm' : ''}`}
      >
        {formatCurrency(totalNetWorth, privacyMode)}
      </p>

      <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Total Wallets
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {wallets.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Active Wallets
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {wallets.filter(w => !w.is_simulated).length}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
