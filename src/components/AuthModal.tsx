import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, UserPlus, Sparkles, Check } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [clickCount, setClickCount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isCorpAdmin = normalizedEmail === 'admin@ridelanka.com' || (normalizedEmail.includes('admin') && normalizedEmail.endsWith('@ridelanka.com'));

    try {
      if (isLogin) {
        // Enforce admin role automatically based on email credentials for maximum security
        const targetRole = isCorpAdmin ? 'admin' : 'customer';
        const result = await login(normalizedEmail, targetRole);
        if (result.success) {
          setToastMessage(`Signed in successfully as ${targetRole === 'admin' ? 'Administrator' : 'Customer'}!`);
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        if (!fullName || !phone) {
          setError('All fields are required to register');
          setLoading(false);
          return;
        }
        // Protect portal: Block unauthorized creation of accounts containing 'admin' or corporate admin domains
        if (isCorpAdmin || normalizedEmail.includes('admin')) {
          setError('Registration of administrative or corporate emails is prohibited for site security.');
          setLoading(false);
          return;
        }
        const result = await register(normalizedEmail, fullName, phone, 'customer');
        if (result.success) {
          setToastMessage('Account created successfully!');
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (presetEmail: string, presetRole: 'admin' | 'customer') => {
    setError('');
    setLoading(true);
    const result = await login(presetEmail, presetRole);
    if (result.success) {
      setToastMessage(`Signed in as ${presetRole}!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError(result.error || 'Quick login failed');
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Please type your email first to request a password reset reset link.');
      return;
    }
    setError('');
    setToastMessage('Reset link dispatched to ' + email + ' (Simulated)');
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 transition-all transform scale-100">
        
        {/* Toast Notification Header */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white py-3 px-4 flex items-center gap-2 text-sm font-semibold transition-all">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 
              onClick={() => setClickCount(prev => prev + 1)}
              className="font-display font-extrabold text-xl text-gray-900 cursor-default select-none group"
              title="Click 5 times for Developer panel"
            >
              {isLogin ? 'Welcome back to RideLanka' : 'Create RideLanka Account'}
            </h3>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Sandbox Logins bar - Hidden for Site Security unless secret code is activated */}
          {clickCount >= 5 && (
            <div className="bg-orange-50/80 p-3.5 rounded-xl border border-orange-100 mb-6 space-y-2 animate-in fade-in duration-250">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-850">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0 animate-pulse" />
                <span>Developer SECURE Presets Connected ({clickCount}/5)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('kavindugayan024@gmail.com', 'customer')}
                  className="bg-white hover:bg-orange-100 text-orange-950 font-semibold p-2 rounded-lg border border-orange-200 shadow-sm transition-colors text-left"
                >
                  👤 Test Customer
                  <span className="block text-[9px] text-gray-500 font-normal mt-0.5 font-mono">kavindugayan024@gmail.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@ridelanka.com', 'admin')}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold p-2 rounded-lg border border-gray-850 shadow-sm transition-colors text-left"
                >
                  ⚙️ Admin Officer
                  <span className="block text-[9px] text-orange-300 font-normal mt-0.5 font-mono font-bold">admin@ridelanka.com</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Tabs selector */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-5">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="E.g., Kavindu Gayan"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                    />
                    <UserPlus className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Sri Lankan Telephone Phone
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 7X XXX XXXX"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-semibold text-red-700 leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Free Account'}
            </button>

            {isLogin && (
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-gray-500 hover:text-orange-600 transition-colors"
                >
                  Forgot your password? Reset it here.
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
