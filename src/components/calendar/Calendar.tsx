import { useState } from 'react';
import { Transaction, Wallet } from '../../types';
import { Card } from '../ui/Card';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { formatDate } from '../../utils/formatters';

interface CalendarProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

export function Calendar({ transactions, wallets }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthDays = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const getTransactionsForDate = (date: string) => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date).toISOString().split('T')[0];
      return txDate === date;
    });
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = [];

  for (let i = 0; i < prevMonthDays; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const monthStr = String(month + 1).padStart(2, '0');
  const selectedDateTxs = selectedDate
    ? getTransactionsForDate(selectedDate)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(year, month).toLocaleDateString('en-US', {
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

          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const dateStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
              const dayTxs = getTransactionsForDate(dateStr);
              const hasIncome = dayTxs.some(t => t.type === 'income');
              const hasExpense = dayTxs.some(t => t.type === 'expense');
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-2 rounded-lg font-medium text-sm transition relative ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {day}
                  {dayTxs.length > 0 && (
                    <div className="flex gap-1 justify-center mt-1">
                      {hasIncome && (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                      {hasExpense && (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-6 h-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {selectedDate ? formatDate(selectedDate) : 'Select a Day'}
          </h3>

          {selectedDate ? (
            selectedDateTxs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No transactions on this day
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDateTxs.map(tx => {
                  const wallet = wallets.find(w => w.id === tx.wallet_id);
                  return (
                    <div
                      key={tx.id}
                      className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded text-sm"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {tx.category}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {wallet?.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Click a date to view transactions
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
