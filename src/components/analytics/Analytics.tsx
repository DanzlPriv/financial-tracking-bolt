import { Wallet, Recurring, Transaction } from '../../types';
import { ForecastChart } from './ForecastChart';
import { Spinner } from '../ui/Spinner';

interface AnalyticsProps {
  wallets: Wallet[];
  recurring: Recurring[];
  transactions: Transaction[];
  loading?: boolean;
}

export function Analytics({
  wallets,
  recurring,
  transactions,
  loading = false,
}: AnalyticsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ForecastChart
        wallets={wallets}
        recurring={recurring}
        transactions={transactions}
      />
    </div>
  );
}
