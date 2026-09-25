import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, PlusCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { FeedPost, fetchFeed } from '../../lib/social';
import { PostCard } from './PostCard';
import { ErrorNote, Panel } from './ui';

interface FeedViewProps {
  onOpenCreator: (creatorId: string) => void;
  onCreatePost: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ onOpenCreator, onCreatePost }) => {
  const { user, isCreator } = useAuth();
  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    setError(null);
    try {
      setPosts(await fetchFeed({ userId: user.id }));
    } catch (e: any) {
      setError(e.message || "Couldn't load the feed.");
      setPosts((p) => p ?? []);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-black text-white drop-shadow">Feed</h1>
        <div className="flex gap-2">
          <button onClick={load} disabled={refreshing} aria-label="Refresh" className="w-10 h-10 rounded-full bg-black/60 border border-white/15 text-zinc-200 flex items-center justify-center">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          {isCreator && (
            <button onClick={onCreatePost} className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm">
              <PlusCircle className="w-4 h-4" /> New post
            </button>
          )}
        </div>
      </div>

      <ErrorNote message={error} />

      {posts === null ? (
        <div className="flex items-center justify-center gap-2 py-20 text-zinc-300"><Loader2 className="w-5 h-5 animate-spin" /> Loading…</div>
      ) : posts.length === 0 ? (
        <Panel className="p-8 text-center">
          <h2 className="text-lg font-bold text-white">No posts yet</h2>
          <p className="text-zinc-400 mt-1 text-sm">
            {isCreator ? 'Be the first. Your posts show up here for everyone.' : 'When creators post, it shows up here.'}
          </p>
          {isCreator && (
            <button onClick={onCreatePost} className="mt-4 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm">
              Create your first post
            </button>
          )}
        </Panel>
      ) : (
        <div className="grid gap-5">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onOpenCreator={onOpenCreator} onDeleted={(id) => setPosts((ps) => (ps || []).filter((x) => x.id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
};
