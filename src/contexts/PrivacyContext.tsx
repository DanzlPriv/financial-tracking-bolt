import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface PrivacyContextType {
  privacyMode: boolean;
  togglePrivacyMode: () => Promise<void>;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [privacyMode, setPrivacyMode] = useState(false);

  useEffect(() => {
    if (!user) {
      setPrivacyMode(false);
      return;
    }
    fetchUserPreferences();
  }, [user]);

  const fetchUserPreferences = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('preferences')
        .select('privacy_mode')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setPrivacyMode(data.privacy_mode);
      } else {
        await supabase.from('preferences').insert({
          user_id: user.id,
          theme: 'system',
          privacy_mode: false,
          widget_order: ['netWorth', 'wallets', 'recentTransactions'],
        });
      }
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  };

  const togglePrivacyMode = async () => {
    const newMode = !privacyMode;
    setPrivacyMode(newMode);
    if (user) {
      try {
        await supabase
          .from('preferences')
          .update({ privacy_mode: newMode })
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Failed to save privacy mode:', err);
        setPrivacyMode(!newMode);
      }
    }
  };

  const value = { privacyMode, togglePrivacyMode };
  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>;
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
}
