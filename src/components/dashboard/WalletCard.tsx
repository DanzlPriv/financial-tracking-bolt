import { TrendingUp, Warning } from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { Wallet, GhostBalance } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { usePrivacy } from '../../contexts/PrivacyContext';
import { getIconComponent } from '../../utils/icons';

interface WalletCardProps {
  wallet: Wallet;
  ghostBalance: GhostBalance;
  onClick?: () => void;
}

export function WalletCard({ wallet, ghostBalance, onClick }: WalletCardProps) {
  const { privacyMode } = usePrivacy();
  const IconComponent = getIconComponent(wallet.icon);

  return (
    <Card onClick={onClick} className="p-6 cursor-pointer hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: wallet.color + '20' }}
          >
            <IconComponent size={24} color={wallet.color} weight="duotone" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {wallet.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {wallet.type}
            </p>
          </div>
        </div>
        {ghostBalance.hasPendingBills && (
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded text-xs">
            <Warning size={14} />
            Pending
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Real Balance</p>
          <p
            className={`text-xl font-bold text-gray-900 dark:text-white ${
              privacyMode ? 'blur-sm' : ''
            }`}
          >
            {formatCurrency(ghostBalance.realBalance, privacyMode)}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Available Balance
          </p>
          <p
            className={`text-lg font-semibold ${
              ghostBalance.ghostBalance < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            } ${privacyMode ? 'blur-sm' : ''}`}
          >
            {formatCurrency(ghostBalance.ghostBalance, privacyMode)}
          </p>
          {ghostBalance.pendingExpenses > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {ghostBalance.pendingExpenses > 0 &&
                `${formatCurrency(ghostBalance.pendingExpenses, privacyMode)} pending`}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
