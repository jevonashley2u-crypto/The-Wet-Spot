import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AppRole = 'owner' | 'partner' | 'creator' | 'fan';

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  x?: string;
  youtube?: string;
  website?: string;
}

export interface UserProfile {
  id: string;
  handle: string;
  name: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  social_links: SocialLinks;
  role: AppRole;
  subscription_tier: string | null;
  is_grandfathered: boolean | null;
  created_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  /** True after the user clicks a password-reset link, until they set a new password. */
  isPasswordRecovery: boolean;
  isOwner: boolean;
  /** Owner or partner. */
  isStaff: boolean;
  refreshProfile: () => Promise<void>;
  finishPasswordRecovery: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_COLUMNS =
  'id, handle, name, avatar_url, banner_url, bio, social_links, role, subscription_tier, is_grandfathered, created_at';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from('users')
      .select(PROFILE_COLUMNS)
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.error('Failed to load profile', error);
      setProfile(null);
      return;
    }
    setProfile(
      data
        ? ({ ...data, social_links: (data.social_links as SocialLinks) || {} } as UserProfile)
        : null
    );
  }, []);

  useEffect(() => {
    // Password-reset links land here with type=recovery in the URL hash.
    if (window.location.hash.includes('type=recovery')) {
      setIsPasswordRecovery(true);
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      await loadProfile(session?.user?.id);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
      setSession(session);
      setUser(session?.user ?? null);
      // Load outside the auth callback to avoid Supabase client deadlocks.
      setTimeout(() => {
        loadProfile(session?.user?.id).finally(() => setIsLoading(false));
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    await loadProfile(user?.id);
  }, [loadProfile, user?.id]);

  const finishPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const role = profile?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isPasswordRecovery,
        isOwner: role === 'owner',
        isStaff: role === 'owner' || role === 'partner',
        refreshProfile,
        finishPasswordRecovery,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/** Owner and partner always show the verified check. Paid verification can extend this later. */
export const hasVerifiedBadge = (p: Pick<UserProfile, 'role'> | null | undefined) =>
  !!p && (p.role === 'owner' || p.role === 'partner');
