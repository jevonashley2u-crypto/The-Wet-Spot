import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setIsLoading(true);

    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setNotice('If that email has an account, a reset link is on its way. Check your inbox and spam.');
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              handle: username || email.split('@')[0],
              name: username || email.split('@')[0],
              username: username || email.split('@')[0],
              full_name: username || email.split('@')[0]
            }
          }
        });
        if (error) throw error;
        // If email confirmation is on, there is no session yet.
        if (!data.session) {
          setNotice('Check your email for the confirmation link!');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="fixed inset-0 w-full h-full object-cover z-0" 
        src="/videos/bg-theme.mp4" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto mb-4 flex items-center justify-center rotate-12 shadow-lg border border-white/30">
            <Sparkles className="w-8 h-8 text-white -rotate-12 drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-md">The Wet Spot</h1>
          <p className="text-white/80 drop-shadow-sm font-medium">Join the ultimate Creator Ecosystem</p>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-6 p-4 bg-teal-500/10 border border-teal-400/30 rounded-xl text-teal-100 text-sm text-center">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <AnimatePresence>
            {!isLogin && !isForgot && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/20 border border-white/20 focus:border-white/60 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/60 outline-none transition-colors backdrop-blur-md shadow-inner"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/20 focus:border-white/60 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/60 outline-none transition-colors backdrop-blur-md shadow-inner"
            />
          </div>

          {!isForgot && (
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="password"
              required
              minLength={isLogin ? undefined : 8}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/20 focus:border-white/60 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/60 outline-none transition-colors backdrop-blur-md shadow-inner"
            />
          </div>
          )}

          {isLogin && !isForgot && (
            <div className="text-right -mt-1">
              <button
                type="button"
                onClick={() => { setIsForgot(true); setError(null); setNotice(null); }}
                className="text-white/80 hover:text-white text-sm font-semibold drop-shadow-md"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-6 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold rounded-xl transition-all shadow-[0_4px_16px_rgba(0,0,0,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 backdrop-blur-md"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isForgot ? 'Send reset link' : isLogin ? 'Enter Ecosystem' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          {isForgot ? (
            <button 
              onClick={() => { setIsForgot(false); setError(null); setNotice(null); }}
              className="text-white/80 hover:text-white transition-colors text-sm font-bold drop-shadow-md"
            >
              Back to log in
            </button>
          ) : (
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); setNotice(null); }}
              className="text-white/80 hover:text-white transition-colors text-sm font-bold drop-shadow-md"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/** Shown after the user opens a password-reset link from their email. */
export const ResetPasswordView: React.FC = () => {
  const { finishPasswordRecovery } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    finishPasswordRecovery();
  };

  const inputClass =
    'w-full bg-black/20 border border-white/20 focus:border-white/60 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/60 outline-none transition-colors backdrop-blur-md shadow-inner';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0" src="/videos/bg-theme.mp4" />
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <h1 className="text-2xl font-bold text-white mb-2 text-center drop-shadow-md">Set a new password</h1>
        <p className="text-white/80 text-center mb-6 text-sm">Choose a password you don't use anywhere else.</p>
        {error && (
          <div role="alert" className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input type="password" required placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input type="password" required placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center backdrop-blur-md"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save new password'}
          </button>
        </form>
      </div>
    </div>
  );
};
