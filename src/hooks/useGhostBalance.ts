import { useMemo } from 'react';
import { Wallet, Recurring, GhostBalance } from '../types';

export function useGhostBalance(wallets: Wallet[], recurring: Recurring[]): GhostBalance[] {
  return useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return wallets.map(wallet => {
      const pendingExpenses = recurring
        .filter(r => {
          if (!r.is_active || !r.is_expense) return false;
          if (r.wallet_id !== wallet.id) return false;

          const dueDate = new Date(r.next_due_date);
          return dueDate >= now && dueDate <= sevenDaysFromNow;
        })
        .reduce((sum, r) => sum + r.amount, 0);

      const ghostBalance = wallet.balance - pendingExpenses;

      return {
        walletId: wallet.id,
        realBalance: wallet.balance,
        ghostBalance,
        pendingExpenses,
        hasPendingBills: pendingExpenses > 0,
      };
    });
  }, [wallets, recurring]);
}
