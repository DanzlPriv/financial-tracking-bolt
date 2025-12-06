import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { FAB } from '../ui/FAB';
import { Spinner } from '../ui/Spinner';
import { WalletCard } from './WalletCard';
import { NetWorthCard } from './NetWorthCard';
import { RecentTransactions } from './RecentTransactions';
import { TransactionModal } from './TransactionModal';
import { useWallets } from '../../hooks/useWallets';
import { useTransactions } from '../../hooks/useTransactions';
import { useRecurring } from '../../hooks/useRecurring';
import { useGhostBalance } from '../../hooks/useGhostBalance';

export function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const { wallets, loading: walletsLoading } = useWallets();
  const { transactions } = useTransactions();
  const { recurring } = useRecurring();
  const ghostBalances = useGhostBalance(wallets, recurring);

  if (walletsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NetWorthCard wallets={wallets} />

        {wallets.map((wallet) => {
          const ghostBalance = ghostBalances.find(
            gb => gb.walletId === wallet.id
          );
          return (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              ghostBalance={ghostBalance || {
                walletId: wallet.id,
                realBalance: wallet.balance,
                ghostBalance: wallet.balance,
                pendingExpenses: 0,
                hasPendingBills: false,
              }}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={transactions} wallets={wallets} />

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Add Transaction
            </button>
          </div>
        </Card>
      </div>

      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        wallets={wallets}
      />

      <FAB
        onClick={() => setShowModal(true)}
        icon={<Plus size={28} weight="bold" />}
      />
    </div>
  );
}
