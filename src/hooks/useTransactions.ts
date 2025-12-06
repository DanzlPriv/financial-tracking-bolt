import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (
    transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      await updateWalletBalance(transaction.wallet_id, transaction.amount, transaction.type);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const transaction = transactions.find(t => t.id === id);
      if (!transaction) throw new Error('Transaction not found');

      await updateWalletBalance(
        transaction.wallet_id,
        transaction.amount,
        transaction.type === 'income' ? 'expense' : 'income'
      );

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const executeTransfer = async (
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    note: string = 'Transfer'
  ) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const transferId = crypto.randomUUID();
      const date = new Date().toISOString();

      const { error: expenseError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          wallet_id: fromWalletId,
          amount,
          type: 'expense',
          category: 'Transfer',
          date,
          note,
          is_recurring: false,
          transfer_id: transferId,
        });

      if (expenseError) throw expenseError;

      const { error: incomeError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          wallet_id: toWalletId,
          amount,
          type: 'income',
          category: 'Transfer',
          date,
          note,
          is_recurring: false,
          transfer_id: transferId,
        });

      if (incomeError) throw incomeError;

      await updateWalletBalance(fromWalletId, amount, 'expense');
      await updateWalletBalance(toWalletId, amount, 'income');

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updateWalletBalance = async (walletId: string, amount: number, type: 'income' | 'expense') => {
    const adjustment = type === 'income' ? amount : -amount;

    const { data: wallet, error: fetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', walletId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('wallets')
      .update({ balance: wallet.balance + adjustment })
      .eq('id', walletId);

    if (updateError) throw updateError;
  };

  return {
    transactions,
    loading,
    error,
    createTransaction,
    deleteTransaction,
    executeTransfer,
    refetch: fetchTransactions,
  };
}
