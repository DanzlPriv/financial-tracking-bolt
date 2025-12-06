import { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Transaction, Wallet, TransactionFilters } from '../../types';
import { formatCurrency, formatDate, getMonthKey } from '../../utils/formatters';
import { usePrivacy } from '../../contexts/PrivacyContext';
import { getIconComponent, getCategoryIcon } from '../../utils/icons';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

interface TransactionListProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

export function TransactionList({ transactions, wallets }: TransactionListProps) {
  const { privacyMode } = usePrivacy();
  const [filters, setFilters] = useState<TransactionFilters>({
    keyword: '',
    startDate: '',
    endDate: '',
    category: '',
    walletId: '',
    type: '',
  });
  const [currentMonth, setCurrentMonth] = useState(getMonthKey(new Date()));

  const handlePrevMonth = () => {
    const date = new Date(currentMonth + '-01');
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(getMonthKey(date));
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth + '-01');
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(getMonthKey(date));
  };

  const filtered = transactions.filter(tx => {
    const txMonthKey = getMonthKey(tx.date);
    if (txMonthKey !== currentMonth) return false;

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const wallet = wallets.find(w => w.id === tx.wallet_id);
      if (
        !tx.category.toLowerCase().includes(keyword) &&
        !tx.note.toLowerCase().includes(keyword) &&
        !wallet?.name.toLowerCase().includes(keyword)
      ) {
        return false;
      }
    }

    if (filters.category && tx.category !== filters.category) return false;
    if (filters.walletId && tx.wallet_id !== filters.walletId) return false;
    if (filters.type && tx.type !== filters.type) return false;

    return true;
  });

  const groupedByDate = filtered.reduce((acc, tx) => {
    const date = formatDate(tx.date);
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Search & Filter
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Keyword"
            type="text"
            value={filters.keyword}
            onChange={(v) => setFilters({ ...filters, keyword: v })}
            placeholder="Search category, note, wallet..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Wallet
            </label>
            <select
              value={filters.walletId}
              onChange={(e) => setFilters({ ...filters, walletId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
            >
              <option value="">All Wallets</option>
              {wallets.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Date(currentMonth + '-01').toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <CaretLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <CaretRight size={20} />
            </button>
          </div>
        </div>

        {sortedDates.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No transactions found
          </p>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <div key={date}>
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  {date}
                </h4>
                <div className="space-y-2">
                  {groupedByDate[date].map((tx) => {
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
                              size={18}
                              color={isIncome ? '#10b981' : '#ef4444'}
                              weight="duotone"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {tx.category}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {wallet?.name}
                              {tx.note && ` • ${tx.note}`}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-semibold ${
                            isIncome
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-900 dark:text-white'
                          } ${privacyMode ? 'blur-sm' : ''}`}
                        >
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount, privacyMode)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
