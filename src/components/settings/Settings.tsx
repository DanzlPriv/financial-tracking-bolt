import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useTheme } from '../../contexts/ThemeContext';
import { usePrivacy } from '../../contexts/PrivacyContext';
import { useWallets } from '../../hooks/useWallets';
import { useTransactions } from '../../hooks/useTransactions';
import { useAuth } from '../../contexts/AuthContext';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { privacyMode } = usePrivacy();
  const { wallets } = useWallets();
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleExportData = async () => {
    setLoading(true);
    try {
      const data = {
        user: {
          id: user?.id,
          email: user?.email,
          exportedAt: new Date().toISOString(),
        },
        wallets,
        transactions,
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finance-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Display Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    theme === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Privacy Mode: {privacyMode ? 'Enabled' : 'Disabled'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Toggle privacy mode from the navbar to blur sensitive values
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Export Data
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Download all your financial data as a JSON file
            </p>
            <Button
              onClick={handleExportData}
              disabled={loading}
              variant="secondary"
            >
              {loading ? 'Exporting...' : 'Export Data'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account Information
        </h3>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {user?.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Wallets</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {wallets.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Transactions
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {transactions.length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
