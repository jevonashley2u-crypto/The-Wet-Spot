import React, { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { Compass, Glasses, Heart, Loader2, Lock, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  addComment, deleteComment, deletePost, FeedPost, fetchComments, is360, isVideo, PostComment, setLike, timeAgo,
} from '../../lib/social';
import { Avatar, VerifiedCheck } from './ui';

const VRViewer = lazy(() => import('./VRViewer'));

interface PostCardProps {
  post: FeedPost;
  onOpenCreator?: (creatorId: string) => void;
  onDeleted?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenCreator, onDeleted }) => {
  const { user, isStaff } = useAuth();
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[] | null>(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [vrOpen, setVrOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;
  const mine = post.creator_id === user.id;
  const canDelete = mine || isStaff;

  const toggleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    try {
      await setLike(post.id, user.id, next);
    } catch {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
    }
  };

  const openComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments === null) {
      try {
        setComments(await fetchComments(post.id));
      } catch (e: any) {
        setError(e.message);
      }
    }
  };

  const sendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setBusy(true);
    try {
      await addComment(post.id, user.id, body);
      setDraft('');
      setComments(await fetchComments(post.id));
      setCommentsCount((n) => n + 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const removeComment = async (id: string) => {
    try {
      await deleteComment(id);
      setComments((cs) => (cs || []).filter((c) => c.id !== id));
      setCommentsCount((n) => Math.max(0, n - 1));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await deletePost(post);
      onDeleted?.(post.id);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const vr = is360(post.media_type);

  return (
    <article className="rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl overflow-hidden">
      <header className="flex items-center gap-3 p-4">
        <button onClick={() => onOpenCreator?.(post.creator_id)} className="flex items-center gap-3 min-w-0 text-left">
          <Avatar profile={post.creator} size={42} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-white truncate">
              {post.creator?.name || 'Creator'} <VerifiedCheck show={!!post.creator?.is_verified} />
            </div>
            <div className="text-xs text-zinc-400">@{post.creator?.handle} · {timeAgo(post.created_at)}</div>
          </div>
        </button>
        <div className="ml-auto flex items-center gap-2">
          {post.visibility === 'followers' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-pink-500/15 text-pink-200 border border-pink-400/30">
              <Lock className="w-3 h-3" /> Followers
            </span>
          )}
          {canDelete && (
            <button onClick={remove} aria-label="Delete post" className="p-2 rounded-full text-zinc-500 hover:text-red-300 hover:bg-white/5">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {post.media_type !== 'text' && (
        <div className="relative bg-zinc-950">
          {!post.mediaUrl ? (
            <div className="aspect-video flex items-center justify-center text-zinc-500 text-sm">Media unavailable</div>
          ) : isVideo(post.media_type) ? (
            <video src={post.mediaUrl} controls playsInline preload="metadata" className="w-full max-h-[70vh] bg-black" />
          ) : (
            <img src={post.mediaUrl} alt={post.caption || ''} loading="lazy" className="w-full max-h-[70vh] object-contain bg-black" />
          )}
          {vr && post.mediaUrl && (
            <button
              onClick={() => setVrOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors group"
            >
              <span className="flex items-center gap-2 px-5 py-3 rounded-full bg-teal-500 text-black font-bold shadow-[0_0_30px_rgba(20,184,166,0.5)] group-hover:scale-105 transition-transform">
                <Glasses className="w-5 h-5" /> View in 360° / VR
              </span>
            </button>
          )}
          {vr && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-black/70 text-teal-200 border border-teal-400/40 pointer-events-none">
              <Compass className="w-3 h-3" /> 360°
            </span>
          )}
        </div>
      )}

      {post.caption && <p className="px-4 pt-4 text-zinc-100 whitespace-pre-line leading-relaxed">{post.caption}</p>}

      <footer className="flex items-center gap-1 px-2 py-2">
        <button
          onClick={toggleLike}
          aria-pressed={liked}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/5 text-sm font-bold ${liked ? 'text-pink-400' : 'text-zinc-300'}`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-pink-400' : ''}`} /> {likes}
        </button>
        <button onClick={openComments} className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/5 text-sm font-bold text-zinc-300">
          <MessageCircle className="w-5 h-5" /> {commentsCount}
        </button>
      </footer>

      {error && <p className="px-4 pb-3 text-sm text-red-300">{error}</p>}

      {showComments && (
        <div className="border-t border-white/10 px-4 py-3">
          {comments === null ? (
            <div className="text-zinc-400 text-sm flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading comments…</div>
          ) : comments.length === 0 ? (
            <p className="text-zinc-500 text-sm">No comments yet.</p>
          ) : (
            <ul className="grid gap-3 max-h-72 overflow-y-auto pr-1">
              {comments.map((c) => (
                <li key={c.id} className="flex gap-2.5">
                  <Avatar profile={c.author} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">
                      <span className="font-bold text-white">{c.author?.name || 'User'}</span>{' '}
                      <span className="text-zinc-500 text-xs">{timeAgo(c.created_at)}</span>
                    </div>
                    <p className="text-sm text-zinc-200 whitespace-pre-line break-words">{c.body}</p>
                  </div>
                  {(c.user_id === user.id || mine || isStaff) && (
                    <button onClick={() => removeComment(c.id)} aria-label="Delete comment" className="self-start p-1 text-zinc-600 hover:text-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={sendComment} className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 1000))}
              placeholder="Add a comment…"
              className="flex-1 min-w-0 bg-white/5 border border-white/15 focus:border-teal-400 rounded-full px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
            />
            <button type="submit" disabled={busy || !draft.trim()} aria-label="Post comment" className="w-10 h-10 rounded-full bg-teal-500 disabled:opacity-40 text-black flex items-center justify-center">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}

      {vrOpen && post.mediaUrl && createPortal(
        <Suspense fallback={<div className="fixed inset-0 z-[200] bg-black flex items-center justify-center text-zinc-300">Loading 360° view…</div>}>
          <VRViewer
            url={post.mediaUrl}
            kind={post.media_type === 'video360' ? 'video' : 'image'}
            title={post.caption || `${post.creator?.name || 'Creator'}'s 360° post`}
            onClose={() => setVrOpen(false)}
          />
        </Suspense>,
        document.body,
      )}
    </article>
  );
};
