import { useMemo } from 'react';
import { Wallet, Recurring, Transaction, ForecastData } from '../types';

export function useForecast(
  wallets: Wallet[],
  recurring: Recurring[],
  transactions: Transaction[],
  months: number = 6,
  includeSpending: boolean = false
) {
  return useMemo(() => {
    const currentNetWorth = wallets.reduce((sum, w) => sum + w.balance, 0);

    const recurringIncome = recurring
      .filter(r => r.is_active && !r.is_expense)
      .reduce((sum, r) => {
        const monthlyAmount = convertToMonthly(r.amount, r.frequency);
        return sum + monthlyAmount;
      }, 0);

    const recurringExpense = recurring
      .filter(r => r.is_active && r.is_expense)
      .reduce((sum, r) => {
        const monthlyAmount = convertToMonthly(r.amount, r.frequency);
        return sum + monthlyAmount;
      }, 0);

    const netMonthlyChange = recurringIncome - recurringExpense;

    let avgDailySpend = 0;
    if (includeSpending) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentExpenses = transactions
        .filter(t => {
          const txDate = new Date(t.date);
          return t.type === 'expense' && txDate >= thirtyDaysAgo && !t.is_recurring;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      avgDailySpend = recentExpenses / 30;
    }

    const forecast: ForecastData[] = [];
    const now = new Date();

    for (let i = 0; i <= months; i++) {
      const projected = currentNetWorth + (netMonthlyChange * i);
      const conservative = projected - (avgDailySpend * 30 * i);

      const forecastDate = new Date(now);
      forecastDate.setMonth(forecastDate.getMonth() + i);

      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        projected,
        conservative: includeSpending ? conservative : projected,
      });
    }

    return forecast;
  }, [wallets, recurring, transactions, months, includeSpending]);
}

function convertToMonthly(amount: number, frequency: string): number {
  switch (frequency) {
    case 'daily':
      return amount * 30;
    case 'weekly':
      return amount * 4.33;
    case 'biweekly':
      return amount * 2.17;
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
      return amount / 12;
    default:
      return 0;
  }
}
