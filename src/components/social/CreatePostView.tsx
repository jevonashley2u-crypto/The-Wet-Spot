import React, { useEffect, useRef, useState } from 'react';
import { Compass, Globe, ImagePlus, Loader2, Lock, Send, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MAX_POST_MEDIA_BYTES, MediaType, POST_MEDIA_BUCKET, POST_MEDIA_TYPES, Visibility } from '../../lib/social';
import { ErrorNote, Panel } from './ui';

interface CreatePostViewProps {
  onPosted: () => void;
  onNotify: (title: string, desc: string) => void;
}

/** 360° media is equirectangular: twice as wide as it is tall. */
const looksLike360 = (w: number, h: number) => h > 0 && Math.abs(w / h - 2) < 0.05;

export const CreatePostView: React.FC<CreatePostViewProps> = ({ onPosted, onNotify }) => {
  const { user, isCreator } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [is360, setIs360] = useState(false);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  if (!user) return null;

  if (!isCreator) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Panel className="p-8 text-center">
          <h1 className="text-xl font-bold text-white">Posting is for creators</h1>
          <p className="text-zinc-300 mt-2">Apply to be a creator from your profile page. Once you're approved you can post here.</p>
        </Panel>
      </div>
    );
  }

  const isVideoFile = !!file && file.type.startsWith('video/');

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    setError(null);
    if (!f) return;
    if (!POST_MEDIA_TYPES.includes(f.type)) {
      setError('Choose a JPG, PNG, WebP or GIF photo, or an MP4, WebM or MOV video.');
      return;
    }
    if (f.size > MAX_POST_MEDIA_BYTES) {
      setError(`That file is ${(f.size / 1024 / 1024).toFixed(0)} MB. The limit is 50 MB per post.`);
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreview(url);
    setIs360(false);
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setIs360(false);
  };

  const submit = async () => {
    setError(null);
    if (!file && !caption.trim()) {
      setError('Add a photo, a video or some text.');
      return;
    }
    setPosting(true);
    let mediaPath: string | null = null;
    let mediaType: MediaType = 'text';
    try {
      if (file) {
        const ext = (file.name.split('.').pop() || (isVideoFile ? 'mp4' : 'jpg')).toLowerCase();
        mediaPath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(POST_MEDIA_BUCKET)
          .upload(mediaPath, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        mediaType = isVideoFile ? (is360 ? 'video360' : 'video') : is360 ? 'image360' : 'image';
      }
      const { error: insErr } = await supabase.from('posts').insert({
        creator_id: user.id,
        caption: caption.trim() || null,
        media_path: mediaPath,
        media_type: mediaType,
        visibility,
      });
      if (insErr) {
        if (mediaPath) await supabase.storage.from(POST_MEDIA_BUCKET).remove([mediaPath]);
        throw insErr;
      }
      onNotify('Posted', visibility === 'followers' ? 'Your followers can see it now.' : 'Your post is live.');
      clearFile();
      setCaption('');
      onPosted();
    } catch (e: any) {
      setError(e.message || 'Something went wrong while posting.');
    } finally {
      setPosting(false);
    }
  };

  const choice = (active: boolean) =>
    `flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-colors ${
      active ? 'bg-teal-500/15 border-teal-400 text-teal-100' : 'bg-white/5 border-white/15 text-zinc-300 hover:bg-white/10'
    }`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Panel className="p-5 sm:p-7">
        <h1 className="text-2xl font-black text-white">Create a post</h1>
        <p className="text-zinc-400 text-sm mt-1">Photos, videos, and 360° photos or videos that fans can view in VR.</p>

        <div className="mt-6">
          {!file ? (
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/20 hover:border-teal-400/60 bg-white/[0.03] flex flex-col items-center justify-center gap-2 text-zinc-300"
            >
              <ImagePlus className="w-9 h-9 text-teal-300" />
              <span className="font-bold">Add a photo or video</span>
              <span className="text-xs text-zinc-500">Up to 50 MB · JPG, PNG, WebP, GIF, MP4, WebM, MOV</span>
            </button>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10">
              {isVideoFile ? (
                <video
                  src={preview!}
                  controls
                  playsInline
                  className="w-full max-h-[50vh]"
                  onLoadedMetadata={(e) => looksLike360(e.currentTarget.videoWidth, e.currentTarget.videoHeight) && setIs360(true)}
                />
              ) : (
                <img
                  src={preview!}
                  alt=""
                  className="w-full max-h-[50vh] object-contain"
                  onLoad={(e) => looksLike360(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight) && setIs360(true)}
                />
              )}
              <button onClick={clearFile} aria-label="Remove file" className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input ref={input} type="file" accept={POST_MEDIA_TYPES.join(',')} className="hidden" onChange={pick} />
        </div>

        {file && (
          <label className="mt-4 flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
            <input type="checkbox" checked={is360} onChange={(e) => setIs360(e.target.checked)} className="mt-1 w-4 h-4 accent-teal-400" />
            <span>
              <span className="flex items-center gap-1.5 font-bold text-white"><Compass className="w-4 h-4 text-teal-300" /> This is a 360° {isVideoFile ? 'video' : 'photo'}</span>
              <span className="block text-xs text-zinc-400 mt-0.5">
                Fans can look around by dragging, moving their phone, or with a VR headset. Use the 2:1 equirectangular export from your 360° camera.
              </span>
            </span>
          </label>
        )}

        <label className="block mt-5">
          <span className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
            Caption <span className="font-normal normal-case tracking-normal">{caption.length}/2200</span>
          </span>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 2200))}
            rows={4}
            placeholder="Say something about this post…"
            className="mt-1.5 w-full bg-white/5 border border-white/15 focus:border-teal-400 rounded-xl px-4 py-3 text-white outline-none resize-none placeholder:text-zinc-600"
          />
        </label>

        <div className="mt-5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Who can see it</span>
          <div className="mt-1.5 flex gap-2">
            <button type="button" onClick={() => setVisibility('public')} className={choice(visibility === 'public')}>
              <Globe className="w-4 h-4" /> Everyone
            </button>
            <button type="button" onClick={() => setVisibility('followers')} className={choice(visibility === 'followers')}>
              <Lock className="w-4 h-4" /> Followers only
            </button>
          </div>
        </div>

        <div className="mt-5"><ErrorNote message={error} /></div>

        <button
          onClick={submit}
          disabled={posting}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold disabled:opacity-60"
        >
          {posting ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading…</> : <><Send className="w-5 h-5" /> Post</>}
        </button>
      </Panel>
    </div>
  );
};
