import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import bgVideo from '../assets/bg-theme.mp4';
import { supabase } from '../lib/supabase';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
              full_name: username
            }
          }
        });
        if (error) throw error;
        // Depending on Supabase settings, they might need to verify email
        setError('Check your email for the confirmation link!');
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
        src={bgVideo} 
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
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <AnimatePresence>
            {!isLogin && (
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

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/20 focus:border-white/60 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/60 outline-none transition-colors backdrop-blur-md shadow-inner"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-6 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold rounded-xl transition-all shadow-[0_4px_16px_rgba(0,0,0,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 backdrop-blur-md"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isLogin ? 'Enter Ecosystem' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-white/80 hover:text-white transition-colors text-sm font-bold drop-shadow-md"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
