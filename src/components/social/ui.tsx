import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { PublicProfile } from '../../lib/social';

export const Avatar: React.FC<{ profile: Pick<PublicProfile, 'avatar_url' | 'name' | 'handle'> | null; size?: number; className?: string }> = ({
  profile,
  size = 40,
  className = '',
}) => {
  const initial = (profile?.name || profile?.handle || '?').trim().slice(0, 1).toUpperCase();
  const style = { width: size, height: size };
  if (profile?.avatar_url) {
    return <img src={profile.avatar_url} alt="" style={style} className={`rounded-full object-cover shrink-0 ${className}`} />;
  }
  return (
    <div
      style={{ ...style, fontSize: Math.max(12, size * 0.4) }}
      className={`rounded-full shrink-0 bg-gradient-to-tr from-teal-600 to-pink-600 flex items-center justify-center font-black text-white ${className}`}
    >
      {initial}
    </div>
  );
};

export const VerifiedCheck: React.FC<{ show: boolean; className?: string }> = ({ show, className = 'w-4 h-4' }) =>
  show ? <CheckCircle aria-label="Verified" className={`text-teal-400 fill-teal-400/20 shrink-0 ${className}`} /> : null;

export const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] ${className}`}>
    {children}
  </div>
);

export const ErrorNote: React.FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
      {message}
    </div>
  ) : null;
