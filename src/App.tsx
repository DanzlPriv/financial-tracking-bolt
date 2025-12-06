import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { TransactionList } from './components/transactions/TransactionList';
import { Analytics } from './components/analytics/Analytics';
import { Calendar } from './components/calendar/Calendar';
import { Settings } from './components/settings/Settings';
import { Spinner } from './components/ui/Spinner';
import { useWallets } from './hooks/useWallets';
import { useTransactions } from './hooks/useTransactions';
import { useRecurring } from './hooks/useRecurring';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { wallets, loading: walletsLoading } = useWallets();
  const { transactions } = useTransactions();
  const { recurring } = useRecurring();
  const [currentView, setCurrentView] = useState('dashboard');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const isLoading = walletsLoading;

  return (
    <AppLayout currentView={currentView} onViewChange={setCurrentView}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner />
        </div>
      ) : currentView === 'dashboard' ? (
        <Dashboard />
      ) : currentView === 'transactions' ? (
        <TransactionList transactions={transactions} wallets={wallets} />
      ) : currentView === 'analytics' ? (
        <Analytics
          wallets={wallets}
          recurring={recurring}
          transactions={transactions}
        />
      ) : currentView === 'calendar' ? (
        <Calendar transactions={transactions} wallets={wallets} />
      ) : currentView === 'settings' ? (
        <Settings />
      ) : null}
    </AppLayout>
  );
}

export default App;
