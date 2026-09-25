import { supabase } from './supabase';
import type { SocialLinks } from '../contexts/AuthContext';

export type MediaType = 'text' | 'image' | 'video' | 'image360' | 'video360';
export type Visibility = 'public' | 'followers';

export interface PublicProfile {
  id: string;
  handle: string;
  name: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  social_links: SocialLinks;
  role: 'owner' | 'partner' | 'creator' | 'fan';
  created_at: string | null;
  is_verified: boolean;
}

export interface FeedPost {
  id: string;
  creator_id: string;
  caption: string | null;
  media_path: string | null;
  media_type: MediaType;
  visibility: Visibility;
  likes_count: number;
  comments_count: number;
  created_at: string;
  creator: PublicProfile | null;
  mediaUrl: string | null;
  likedByMe: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
  author: PublicProfile | null;
}

export const POST_MEDIA_BUCKET = 'post-media';
export const MAX_POST_MEDIA_BYTES = 50 * 1024 * 1024;
export const POST_MEDIA_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/quicktime',
];

export const isVideo = (t: MediaType) => t === 'video' || t === 'video360';
export const is360 = (t: MediaType) => t === 'image360' || t === 'video360';

/** Load public profile info for a set of user ids. */
export async function fetchProfiles(ids: string[]): Promise<Map<string, PublicProfile>> {
  const unique = [...new Set(ids.filter(Boolean))];
  const map = new Map<string, PublicProfile>();
  if (unique.length === 0) return map;
  const { data, error } = await supabase.from('public_profiles').select('*').in('id', unique);
  if (error) throw error;
  for (const p of data || []) {
    map.set(p.id, { ...p, social_links: (p.social_links as SocialLinks) || {} } as PublicProfile);
  }
  return map;
}

export async function fetchProfile(id: string): Promise<PublicProfile | null> {
  const map = await fetchProfiles([id]);
  return map.get(id) || null;
}

/** Short-lived links for private post media (1 hour). */
async function signMedia(paths: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return map;
  const { data, error } = await supabase.storage.from(POST_MEDIA_BUCKET).createSignedUrls(unique, 3600);
  if (error) throw error;
  for (const item of data || []) {
    if (item.path && item.signedUrl) map.set(item.path, item.signedUrl);
  }
  return map;
}

/** Posts the current user is allowed to see, newest first. */
export async function fetchFeed(opts: { userId: string; creatorId?: string; limit?: number }): Promise<FeedPost[]> {
  let q = supabase
    .from('posts')
    .select('id, creator_id, caption, media_path, media_type, visibility, likes_count, comments_count, created_at')
    .order('created_at', { ascending: false })
    .limit(opts.limit ?? 50);
  if (opts.creatorId) q = q.eq('creator_id', opts.creatorId);
  const { data: posts, error } = await q;
  if (error) throw error;
  if (!posts || posts.length === 0) return [];

  const ids = posts.map((p) => p.id);
  const [profiles, media, likes] = await Promise.all([
    fetchProfiles(posts.map((p) => p.creator_id)),
    signMedia(posts.map((p) => p.media_path).filter((x): x is string => !!x)),
    supabase.from('post_likes').select('post_id').eq('user_id', opts.userId).in('post_id', ids),
  ]);
  const liked = new Set((likes.data || []).map((l) => l.post_id));

  return posts.map((p) => ({
    ...(p as Omit<FeedPost, 'creator' | 'mediaUrl' | 'likedByMe'>),
    creator: profiles.get(p.creator_id) || null,
    mediaUrl: p.media_path ? media.get(p.media_path) || null : null,
    likedByMe: liked.has(p.id),
  }));
}

export async function setLike(postId: string, userId: string, like: boolean) {
  if (like) {
    const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
    if (error && error.code !== '23505') throw error;
  } else {
    const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
    if (error) throw error;
  }
}

export async function fetchComments(postId: string): Promise<PostComment[]> {
  const { data, error } = await supabase
    .from('post_comments')
    .select('id, post_id, user_id, body, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
    .limit(200);
  if (error) throw error;
  const profiles = await fetchProfiles((data || []).map((c) => c.user_id));
  return (data || []).map((c) => ({ ...c, author: profiles.get(c.user_id) || null }));
}

export async function addComment(postId: string, userId: string, body: string) {
  const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: userId, body });
  if (error) throw error;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase.from('post_comments').delete().eq('id', commentId);
  if (error) throw error;
}

export async function deletePost(post: Pick<FeedPost, 'id' | 'media_path'>) {
  const { error } = await supabase.from('posts').delete().eq('id', post.id);
  if (error) throw error;
  if (post.media_path) {
    await supabase.storage.from(POST_MEDIA_BUCKET).remove([post.media_path]);
  }
}

export async function getFollowState(creatorId: string, userId: string) {
  const [count, mine] = await Promise.all([
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('creator_id', creatorId),
    supabase.from('follows').select('creator_id').eq('creator_id', creatorId).eq('follower_id', userId).maybeSingle(),
  ]);
  return { followers: count.count ?? 0, following: !!mine.data };
}

export async function setFollow(creatorId: string, userId: string, follow: boolean) {
  if (follow) {
    const { error } = await supabase.from('follows').insert({ creator_id: creatorId, follower_id: userId });
    if (error && error.code !== '23505') throw error;
  } else {
    const { error } = await supabase.from('follows').delete().eq('creator_id', creatorId).eq('follower_id', userId);
    if (error) throw error;
  }
}

export const timeAgo = (iso: string) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
