import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera, CheckCircle, Edit3, Globe, Instagram, Loader2, LogOut, Save,
  Shield, X as XIcon, Youtube, Music2, Twitter,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { hasVerifiedBadge, SocialLinks, useAuth } from '../contexts/AuthContext';

interface MyProfileViewProps {
  onNotify: (title: string, desc: string) => void;
}

const HANDLE_RE = /^[a-z0-9_]{3,30}$/;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const ROLE_LABEL: Record<string, string> = {
  owner: 'Founder',
  partner: 'Founding Partner',
  creator: 'Creator',
  fan: 'Member',
};

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; placeholder: string; icon: React.ReactNode }[] = [
  { key: 'instagram', label: 'Instagram', placeholder: 'yourhandle', icon: <Instagram className="w-4 h-4" /> },
  { key: 'tiktok', label: 'TikTok', placeholder: 'yourhandle', icon: <Music2 className="w-4 h-4" /> },
  { key: 'x', label: 'X', placeholder: 'yourhandle', icon: <Twitter className="w-4 h-4" /> },
  { key: 'youtube', label: 'YouTube', placeholder: '@yourchannel', icon: <Youtube className="w-4 h-4" /> },
  { key: 'website', label: 'Website', placeholder: 'https://yoursite.com', icon: <Globe className="w-4 h-4" /> },
];

const socialUrl = (key: keyof SocialLinks, value: string) => {
  const v = value.trim().replace(/^@/, '');
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  switch (key) {
    case 'instagram': return `https://instagram.com/${v}`;
    case 'tiktok': return `https://tiktok.com/@${v}`;
    case 'x': return `https://x.com/${v}`;
    case 'youtube': return `https://youtube.com/@${v}`;
    default: return `https://${v}`;
  }
};

export const MyProfileView: React.FC<MyProfileViewProps> = ({ onNotify }) => {
  const { user, profile, refreshProfile, signOut } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<SocialLinks>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<'avatar' | 'banner' | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName(profile?.name || '');
    setHandle(profile?.handle || '');
    setBio(profile?.bio || '');
    setLinks(profile?.social_links || {});
    setAvatarUrl(profile?.avatar_url || null);
    setBannerUrl(profile?.banner_url || null);
    setError(null);
  };

  useEffect(resetForm, [profile]);

  // A brand-new profile (no bio, no photo) opens straight into edit mode.
  useEffect(() => {
    if (profile && !profile.bio && !profile.avatar_url) setIsEditing(true);
  }, [profile?.id]);

  if (!user) return null;

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-zinc-300">We couldn't load your profile.</p>
        <button
          onClick={refreshProfile}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold"
        >
          Try again
        </button>
      </div>
    );
  }

  const uploadImage = async (kind: 'avatar' | 'banner', file: File) => {
    setError(null);
    if (!IMAGE_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG, WebP or GIF image.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Images must be 5 MB or smaller.');
      return;
    }
    setUploading(kind);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/${kind}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('profile-media')
      .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (upErr) {
      setUploading(null);
      setError(`Upload failed: ${upErr.message}`);
      return;
    }
    const { data } = supabase.storage.from('profile-media').getPublicUrl(path);
    if (kind === 'avatar') setAvatarUrl(data.publicUrl);
    else setBannerUrl(data.publicUrl);
    setUploading(null);
  };

  const onPick = (kind: 'avatar' | 'banner') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) uploadImage(kind, file);
  };

  const handleSave = async () => {
    setError(null);
    const cleanHandle = handle.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      setError('Display name is required.');
      return;
    }
    if (!HANDLE_RE.test(cleanHandle)) {
      setError('Username must be 3–30 characters: lowercase letters, numbers or underscores.');
      return;
    }

    const cleanLinks: SocialLinks = {};
    for (const f of SOCIAL_FIELDS) {
      const v = (links[f.key] || '').trim();
      if (v) cleanLinks[f.key] = v;
    }

    setSaving(true);
    const { error: saveErr } = await supabase
      .from('users')
      .update({
        name: cleanName,
        handle: cleanHandle,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        social_links: cleanLinks,
      })
      .eq('id', user.id);
    setSaving(false);

    if (saveErr) {
      if (saveErr.code === '23505') setError(`@${cleanHandle} is already taken. Try another username.`);
      else setError(saveErr.message);
      return;
    }

    await refreshProfile();
    setIsEditing(false);
    onNotify('Profile saved', 'Your profile is live.');
  };

  const shown = isEditing
    ? { name, handle, bio, avatar_url: avatarUrl, banner_url: bannerUrl, social_links: links }
    : profile;

  const verified = hasVerifiedBadge(profile);
  const initials = (shown.name || shown.handle || '?').trim().slice(0, 1).toUpperCase();
  const linkEntries = SOCIAL_FIELDS
    .map((f) => ({ ...f, url: socialUrl(f.key, shown.social_links?.[f.key] || '') }))
    .filter((f) => f.url);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/70 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
      >
        {/* Banner */}
        <div className="relative h-44 sm:h-64 bg-gradient-to-br from-teal-900 via-zinc-900 to-pink-900">
          {shown.banner_url && (
            <img src={shown.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
          {isEditing && (
            <button
              type="button"
              onClick={() => bannerInput.current?.click()}
              disabled={uploading !== null}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white text-sm font-bold backdrop-blur-md disabled:opacity-60"
            >
              {uploading === 'banner' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              {shown.banner_url ? 'Change banner' : 'Add banner'}
            </button>
          )}
          <input ref={bannerInput} type="file" accept={IMAGE_TYPES.join(',')} className="hidden" onChange={onPick('banner')} />
        </div>

        <div className="px-5 sm:px-8 pb-8 -mt-16 relative">
          {/* Avatar + actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36">
              {shown.avatar_url ? (
                <img
                  src={shown.avatar_url}
                  alt=""
                  className="w-full h-full rounded-full object-cover border-4 border-black shadow-2xl"
                />
              ) : (
                <div className="w-full h-full rounded-full border-4 border-black bg-gradient-to-tr from-teal-600 to-pink-600 flex items-center justify-center text-4xl font-black text-white">
                  {initials}
                </div>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => avatarInput.current?.click()}
                  disabled={uploading !== null}
                  aria-label="Change profile photo"
                  className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-400 border-4 border-black flex items-center justify-center text-black disabled:opacity-60"
                >
                  {uploading === 'avatar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
              )}
              <input ref={avatarInput} type="file" accept={IMAGE_TYPES.join(',')} className="hidden" onChange={onPick('avatar')} />
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => { resetForm(); setIsEditing(false); }}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm"
                  >
                    <XIcon className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || uploading !== null}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm"
                  >
                    <Edit3 className="w-4 h-4" /> Edit profile
                  </button>
                  <button
                    type="button"
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/15 text-zinc-300 hover:text-red-300 font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </>
              )}
            </div>
          </div>

          {error && (
            <div role="alert" className="mt-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {isEditing ? (
            <div className="mt-6 grid gap-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Display name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    className="mt-1.5 w-full bg-white/5 border border-white/15 focus:border-teal-400 rounded-xl px-4 py-3 text-white outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Username</span>
                  <div className="mt-1.5 flex items-center bg-white/5 border border-white/15 focus-within:border-teal-400 rounded-xl px-4">
                    <span className="text-zinc-500">@</span>
                    <input
                      value={handle}
                      onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      maxLength={30}
                      className="w-full bg-transparent py-3 pl-1 text-white outline-none"
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Bio <span className="font-normal normal-case tracking-normal">{bio.length}/300</span>
                </span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 300))}
                  rows={4}
                  placeholder="Tell fans who you are and what they get when they follow you."
                  className="mt-1.5 w-full bg-white/5 border border-white/15 focus:border-teal-400 rounded-xl px-4 py-3 text-white outline-none resize-none placeholder:text-zinc-600"
                />
              </label>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Links</span>
                <div className="mt-1.5 grid sm:grid-cols-2 gap-3">
                  {SOCIAL_FIELDS.map((f) => (
                    <label key={f.key} className="flex items-center gap-3 bg-white/5 border border-white/15 focus-within:border-teal-400 rounded-xl px-4">
                      <span className="text-zinc-400" title={f.label}>{f.icon}</span>
                      <input
                        value={links[f.key] || ''}
                        onChange={(e) => setLinks({ ...links, [f.key]: e.target.value })}
                        placeholder={`${f.label}: ${f.placeholder}`}
                        className="w-full bg-transparent py-3 text-white outline-none placeholder:text-zinc-600 text-sm"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{profile.name}</h1>
                {verified && (
                  <CheckCircle aria-label="Verified" className="w-6 h-6 text-teal-400 fill-teal-400/20" />
                )}
                {(profile.role === 'owner' || profile.role === 'partner') && (
                  <span className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-[11px] font-bold uppercase tracking-wider">
                    <Shield className="w-3 h-3" /> {ROLE_LABEL[profile.role]}
                  </span>
                )}
              </div>
              <p className="text-zinc-400 font-medium">@{profile.handle}</p>

              {profile.bio ? (
                <p className="mt-4 text-zinc-200 leading-relaxed whitespace-pre-line max-w-2xl">{profile.bio}</p>
              ) : (
                <p className="mt-4 text-zinc-500 italic">No bio yet. Tap Edit profile to add one.</p>
              )}

              {linkEntries.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {linkEntries.map((l) => (
                    <a
                      key={l.key}
                      href={l.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 text-sm"
                    >
                      {l.icon} {l.label}
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
                <span>{ROLE_LABEL[profile.role] || 'Member'}</span>
                {profile.created_at && (
                  <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                )}
                <span>{user.email}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
