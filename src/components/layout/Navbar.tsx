import { Moon, Sun, Eye, EyeSlash, SignOut, List } from '@phosphor-icons/react';
import { useTheme } from '../../contexts/ThemeContext';
import { usePrivacy } from '../../contexts/PrivacyContext';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { effectiveTheme, setTheme } = useTheme();
  const { privacyMode, togglePrivacyMode } = usePrivacy();
  const { signOut } = useAuth();

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <List size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Finance Tracker
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePrivacyMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title={privacyMode ? 'Disable Privacy Mode' : 'Enable Privacy Mode'}
          >
            {privacyMode ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title={effectiveTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {effectiveTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            onClick={() => signOut()}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Sign Out"
          >
            <SignOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
