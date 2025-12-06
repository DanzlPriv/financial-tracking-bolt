import { Card } from '../ui/Card';
import { Transaction, Wallet } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { usePrivacy } from '../../contexts/PrivacyContext';
import { getIconComponent, getCategoryIcon } from '../../utils/icons';

interface RecentTransactionsProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

export function RecentTransactions({
  transactions,
  wallets,
}: RecentTransactionsProps) {
  const { privacyMode } = usePrivacy();
  const recent = transactions.slice(0, 5);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Transactions
      </h3>

      {recent.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No transactions yet
        </p>
      ) : (
        <div className="space-y-3">
          {recent.map((tx) => {
            const wallet = wallets.find(w => w.id === tx.wallet_id);
            const icon = getCategoryIcon(tx.category);
            const IconComponent = getIconComponent(icon);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: isIncome
                        ? '#d1fae5'
                        : '#fee2e2',
                    }}
                  >
                    <IconComponent
                      size={16}
                      color={isIncome ? '#10b981' : '#ef4444'}
                      weight="duotone"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {tx.category}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {wallet?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold text-sm ${
                      isIncome
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-900 dark:text-white'
                    } ${privacyMode ? 'blur-sm' : ''}`}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, privacyMode)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(tx.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
