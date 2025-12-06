import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeMode } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (!user) {
      applySystemTheme();
      return;
    }
    fetchUserPreferences();
  }, [user]);

  useEffect(() => {
    updateEffectiveTheme();
  }, [theme]);

  const fetchUserPreferences = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('preferences')
        .select('theme')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setThemeState(data.theme);
      } else {
        await supabase.from('preferences').insert({
          user_id: user.id,
          theme: 'system',
          privacy_mode: false,
          widget_order: ['netWorth', 'wallets', 'recentTransactions'],
        });
      }
    } catch (err) {
      applySystemTheme();
    }
  };

  const updateEffectiveTheme = () => {
    if (theme === 'system') {
      applySystemTheme();
    } else {
      applyTheme(theme);
    }
  };

  const applySystemTheme = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(isDark ? 'dark' : 'light');
  };

  const applyTheme = (newTheme: 'light' | 'dark') => {
    setEffectiveTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (user) {
      try {
        await supabase
          .from('preferences')
          .update({ theme: newTheme })
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Failed to save theme preference:', err);
      }
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        applySystemTheme();
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const value = { theme, effectiveTheme, setTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
