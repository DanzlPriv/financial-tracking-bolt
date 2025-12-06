import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

type AuthView = 'login' | 'signup' | 'forgot';

export function AuthPage() {
  const [view, setView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {view === 'login' && (
        <LoginForm
          onSwitchToSignup={() => setView('signup')}
          onSwitchToForgot={() => setView('forgot')}
        />
      )}
      {view === 'signup' && (
        <SignupForm onSwitchToLogin={() => setView('login')} />
      )}
      {view === 'forgot' && (
        <ForgotPasswordForm onBack={() => setView('login')} />
      )}
    </div>
  );
}
