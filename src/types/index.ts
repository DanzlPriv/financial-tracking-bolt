export type TransactionType = 'income' | 'expense' | 'transfer';
export type WalletType = 'checking' | 'savings' | 'credit' | 'cash' | 'investment';
export type FrequencyType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  type: WalletType;
  balance: number;
  color: string;
  icon: string;
  is_default: boolean;
  is_simulated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note: string;
  is_recurring: boolean;
  transfer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Recurring {
  id: string;
  user_id: string;
  wallet_id: string;
  amount: number;
  frequency: FrequencyType;
  next_due_date: string;
  category: string;
  is_expense: boolean;
  is_active: boolean;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface Preferences {
  id: string;
  user_id: string;
  theme: ThemeMode;
  privacy_mode: boolean;
  widget_order: string[];
  created_at: string;
  updated_at: string;
}

export interface GhostBalance {
  walletId: string;
  realBalance: number;
  ghostBalance: number;
  pendingExpenses: number;
  hasPendingBills: boolean;
}

export interface ForecastData {
  date: string;
  projected: number;
  conservative: number;
}

export interface TransactionFilters {
  keyword: string;
  startDate: string;
  endDate: string;
  category: string;
  walletId: string;
  type: TransactionType | '';
}
