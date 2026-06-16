-- Supabase Schema Migration: 00001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    handle TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_grandfathered BOOLEAN DEFAULT FALSE,
    subscription_tier TEXT DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    daily_streak INTEGER DEFAULT 0,
    watch_streak INTEGER DEFAULT 0,
    engagement_streak INTEGER DEFAULT 0,
    total_spend NUMERIC DEFAULT 0.0,
    invited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}'
);

-- Creators Profile Table
CREATE TABLE public.creators (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    stripe_account_id TEXT,
    subscribers_count INTEGER DEFAULT 0,
    momentum_score NUMERIC DEFAULT 0.0,
    tier TEXT DEFAULT 'Rising',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content / Posts Table
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    caption TEXT,
    is_premium BOOLEAN DEFAULT TRUE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    momentum_score NUMERIC DEFAULT 0.0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals & Network Effects Table
CREATE TABLE public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inviter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, active, rewarded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(fan_id, creator_id)
);

-- Transactions Ledger
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL, -- 'tip', 'subscription', 'unlock'
    stripe_intent_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Creators can insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Fans can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = fan_id);
CREATE POLICY "Creators can view own subscribers" ON public.subscriptions FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Trigger to prevent users from escalating their stats
CREATE OR REPLACE FUNCTION check_user_privilege_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent users from modifying their own gamified stats or spend
  IF auth.uid() = NEW.id THEN
    NEW.daily_streak = OLD.daily_streak;
    NEW.watch_streak = OLD.watch_streak;
    NEW.engagement_streak = OLD.engagement_streak;
    NEW.total_spend = OLD.total_spend;
    NEW.is_grandfathered = OLD.is_grandfathered;
    NEW.subscription_tier = OLD.subscription_tier;
    NEW.subscription_expires_at = OLD.subscription_expires_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_prevent_user_escalation
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION check_user_privilege_escalation();

-- Trigger to automatically create a profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, handle, name)
  VALUES (
    NEW.id,
    -- Attempt to pull handle from metadata, fallback to email prefix + random string
    COALESCE(NEW.raw_user_meta_data->>'handle', split_part(NEW.email, '@', 1) || '_' || substr(md5(random()::text), 1, 6)),
    -- Attempt to pull name from metadata, fallback to email prefix
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Live Streams
CREATE TABLE public.live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    livekit_room_id TEXT UNIQUE NOT NULL,
    title TEXT,
    status TEXT DEFAULT 'scheduled', -- scheduled, live, ended
    viewer_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Private Rooms (1-on-1)
CREATE TABLE public.private_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    fan_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    livekit_room_id TEXT UNIQUE NOT NULL,
    price_per_minute NUMERIC NOT NULL,
    status TEXT DEFAULT 'requested', -- requested, active, completed, declined
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Direct Messages (with PPV support)
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT,
    media_url TEXT,
    is_locked BOOLEAN DEFAULT FALSE,
    price NUMERIC DEFAULT 0.0,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'tip', 'subscribe', 'live', 'message'
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Basic Policies for new tables
CREATE POLICY "Public live streams are viewable by everyone" ON public.live_streams FOR SELECT USING (true);
CREATE POLICY "Creators can insert own live streams" ON public.live_streams FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can view own private rooms" ON public.private_rooms FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = fan_id);
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
