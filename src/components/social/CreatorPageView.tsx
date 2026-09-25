import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Loader2, MessageSquare, Shield, UserCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { FeedPost, fetchFeed, fetchProfile, getFollowState, PublicProfile, setFollow } from '../../lib/social';
import { PostCard } from './PostCard';
import { Avatar, ErrorNote, Panel, VerifiedCheck } from './ui';

interface CreatorPageViewProps {
  creatorId: string;
  onBack: () => void;
  onMessage: (userId: string) => void;
  onEditOwn: () => void;
}

const ROLE_LABEL: Record<string, string> = { owner: 'Founder', partner: 'Founding Partner', creator: 'Creator', fan: 'Member' };

export const CreatorPageView: React.FC<CreatorPageViewProps> = ({ creatorId, onBack, onMessage, onEditOwn }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PublicProfile | null | undefined>(undefined);
  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      const [p, f] = await Promise.all([fetchProfile(creatorId), getFollowState(creatorId, user.id)]);
      setProfile(p);
      setFollowers(f.followers);
      setFollowing(f.following);
      setPosts(await fetchFeed({ userId: user.id, creatorId }));
    } catch (e: any) {
      setError(e.message);
      setProfile((p) => (p === undefined ? null : p));
      setPosts((p) => p ?? []);
    }
  }, [creatorId, user]);

  useEffect(() => { load(); }, [load]);

  if (!user) return null;
  const isMe = creatorId === user.id;

  const toggleFollow = async () => {
    setBusy(true);
    setError(null);
    try {
      await setFollow(creatorId, user.id, !following);
      setFollowing(!following);
      setFollowers((n) => n + (following ? -1 : 1));
      // Followers-only posts appear/disappear.
      setPosts(await fetchFeed({ userId: user.id, creatorId }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (profile === undefined) {
    return <div className="flex items-center justify-center gap-2 py-24 text-zinc-300"><Loader2 className="w-5 h-5 animate-spin" /> Loading…</div>;
  }
  if (profile === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Panel className="p-8 text-center">
          <p className="text-zinc-300">This profile couldn't be found.</p>
          <button onClick={onBack} className="mt-4 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm">Go back</button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={onBack} className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/15 text-white text-sm font-bold">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <Panel className="overflow-hidden">
        <div className="relative h-40 sm:h-56 bg-gradient-to-br from-teal-900 via-zinc-900 to-pink-900">
          {profile.banner_url && <img src={profile.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        </div>
        <div className="px-5 sm:px-7 pb-6 -mt-14 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <Avatar profile={profile} size={112} className="border-4 border-black shadow-2xl" />
            <div className="flex gap-2">
              {isMe ? (
                <button onClick={onEditOwn} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm">
                  Edit profile
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleFollow}
                    disabled={busy}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-60 ${
                      following ? 'bg-white/10 border border-white/20 text-white' : 'bg-teal-500 hover:bg-teal-400 text-black'
                    }`}
                  >
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : following ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {following ? 'Following' : 'Follow'}
                  </button>
                  <button onClick={() => onMessage(creatorId)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm">
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black text-white">{profile.name}</h1>
            <VerifiedCheck show={profile.is_verified} className="w-6 h-6" />
            {(profile.role === 'owner' || profile.role === 'partner') && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-[11px] font-bold uppercase tracking-wider">
                <Shield className="w-3 h-3" /> {ROLE_LABEL[profile.role]}
              </span>
            )}
          </div>
          <p className="text-zinc-400">@{profile.handle}</p>
          {profile.bio && <p className="mt-3 text-zinc-200 whitespace-pre-line leading-relaxed">{profile.bio}</p>}
          <div className="mt-4 flex gap-5 text-sm">
            <span className="text-white"><b>{followers}</b> <span className="text-zinc-400">followers</span></span>
            <span className="text-white"><b>{posts?.length ?? 0}</b> <span className="text-zinc-400">posts</span></span>
          </div>
        </div>
      </Panel>

      <div className="mt-4"><ErrorNote message={error} /></div>

      <div className="mt-5 grid gap-5">
        {posts === null ? (
          <div className="flex items-center justify-center gap-2 py-12 text-zinc-300"><Loader2 className="w-5 h-5 animate-spin" /> Loading posts…</div>
        ) : posts.length === 0 ? (
          <Panel className="p-8 text-center text-zinc-400 text-sm">
            {isMe ? "You haven't posted yet." : following ? 'No posts yet.' : 'No public posts yet. Follow to see followers-only posts.'}
          </Panel>
        ) : (
          posts.map((p) => (
            <PostCard key={p.id} post={p} onDeleted={(id) => setPosts((ps) => (ps || []).filter((x) => x.id !== id))} />
          ))
        )}
      </div>
    </div>
  );
};
