import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Wallet } from '../../types';
import { ArrowsLeftRight, Plus, Minus } from '@phosphor-icons/react';
import { useTransactions } from '../../hooks/useTransactions';
import { useWallets } from '../../hooks/useWallets';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Wallet[];
}

type TransactionType = 'income' | 'expense' | 'transfer';

const categories = {
  income: ['Salary', 'Business', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other'],
  transfer: ['Transfer'],
};

export function TransactionModal({ isOpen, onClose, wallets }: TransactionModalProps) {
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories.expense[0]);
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [toWalletId, setToWalletId] = useState(wallets[1]?.id || wallets[0]?.id || '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { createTransaction, executeTransfer } = useTransactions();

  const handleTypeChange = (newType: string) => {
    setTxType(newType as TransactionType);
    setCategory(categories[newType as TransactionType][0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      if (txType === 'transfer') {
        const { error } = await executeTransfer(
          walletId,
          toWalletId,
          parseFloat(amount),
          note || 'Transfer'
        );
        if (error) throw error;
      } else {
        const { error } = await createTransaction({
          wallet_id: walletId,
          amount: parseFloat(amount),
          type: txType,
          category,
          date: new Date().toISOString(),
          note,
          is_recurring: false,
        });
        if (error) throw error;
      }

      setAmount('');
      setNote('');
      setCategory(categories[txType][0]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          {(['expense', 'income', 'transfer'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                txType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {type === 'income' && <Plus size={18} />}
              {type === 'expense' && <Minus size={18} />}
              {type === 'transfer' && <ArrowsLeftRight size={18} />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={setAmount}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />

        <Select
          label="Wallet"
          value={walletId}
          onChange={setWalletId}
          options={wallets.map(w => ({ value: w.id, label: w.name }))}
        />

        {txType === 'transfer' && (
          <Select
            label="Transfer To"
            value={toWalletId}
            onChange={setToWalletId}
            options={wallets
              .filter(w => w.id !== walletId)
              .map(w => ({ value: w.id, label: w.name }))}
          />
        )}

        <Select
          label="Category"
          value={category}
          onChange={setCategory}
          options={categories[txType].map(cat => ({
            value: cat,
            label: cat,
          }))}
        />

        <Input
          label="Note (Optional)"
          type="text"
          value={note}
          onChange={setNote}
          placeholder="Add a note..."
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Creating...' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
