import React, { useCallback, useEffect, useState } from 'react';
import { Check, Loader2, Sparkles, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { fetchProfiles, PublicProfile, timeAgo } from '../../lib/social';
import { Avatar, ErrorNote, Panel, VerifiedCheck } from './ui';

interface CreatorRequest {
  id: string;
  user_id: string;
  message: string | null;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
  reviewed_at: string | null;
}

/** Shown to fans on their profile: request creator access and see the status. */
export const BecomeCreatorCard: React.FC<{ onNotify: (t: string, d: string) => void }> = ({ onNotify }) => {
  const { user, isCreator } = useAuth();
  const [latest, setLatest] = useState<CreatorRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('creator_requests')
      .select('id, user_id, message, status, created_at, reviewed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    setLatest((data as CreatorRequest) || null);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (!user || isCreator || loading) return null;

  const submit = async () => {
    setSending(true);
    setError(null);
    const { error } = await supabase
      .from('creator_requests')
      .insert({ user_id: user.id, message: message.trim() || null });
    setSending(false);
    if (error) {
      setError(error.code === '23505' ? 'You already have a request waiting for review.' : error.message);
      return;
    }
    setOpen(false);
    setMessage('');
    onNotify('Request sent', "We'll review your creator request soon.");
    load();
  };

  return (
    <Panel className="mt-6 p-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-white">Become a creator</h2>
          {latest?.status === 'pending' ? (
            <p className="text-zinc-300 text-sm mt-1">
              Your request is being reviewed. Sent {timeAgo(latest.created_at)} ago.
            </p>
          ) : (
            <>
              <p className="text-zinc-300 text-sm mt-1">
                Post photos, videos and 360° VR content, and build your following.
                {latest?.status === 'denied' && ' Your last request was not approved, but you can apply again.'}
              </p>
              {open ? (
                <div className="mt-4 grid gap-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                    rows={3}
                    placeholder="Tell us about your content and where your audience is (optional)."
                    className="w-full bg-white/5 border border-white/15 focus:border-teal-400 rounded-xl px-4 py-3 text-white outline-none resize-none placeholder:text-zinc-500 text-sm"
                  />
                  <ErrorNote message={error} />
                  <div className="flex gap-2">
                    <button
                      onClick={submit}
                      disabled={sending}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm disabled:opacity-60"
                    >
                      {sending && <Loader2 className="w-4 h-4 animate-spin" />} Send request
                    </button>
                    <button onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-bold text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setOpen(true)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm"
                >
                  Apply to be a creator
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Panel>
  );
};

/** Owner/partner review queue. */
export const CreatorRequestsPanel: React.FC = () => {
  const [requests, setRequests] = useState<(CreatorRequest & { profile: PublicProfile | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const { data, error } = await supabase
      .from('creator_requests')
      .select('id, user_id, message, status, created_at, reviewed_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const profiles = await fetchProfiles((data || []).map((r) => r.user_id));
    setRequests((data || []).map((r) => ({ ...(r as CreatorRequest), profile: profiles.get(r.user_id) || null })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const review = async (id: string, approve: boolean) => {
    setBusy(id);
    setError(null);
    const { error } = await supabase.rpc('review_creator_request', { request_id: id, approve });
    setBusy(null);
    if (error) {
      setError(error.message);
      return;
    }
    setRequests((rs) => rs.filter((r) => r.id !== id));
  };

  return (
    <Panel className="p-6 mb-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-white">Creator requests</h2>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-zinc-300">{requests.length} waiting</span>
      </div>
      <ErrorNote message={error} />
      {loading ? (
        <div className="text-zinc-400 text-sm flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
      ) : requests.length === 0 ? (
        <p className="text-zinc-400 text-sm">No requests waiting. New ones show up here.</p>
      ) : (
        <ul className="grid gap-3">
          {requests.map((r) => (
            <li key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar profile={r.profile} size={44} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-white font-bold truncate">
                    {r.profile?.name || 'Unknown'} <VerifiedCheck show={!!r.profile?.is_verified} />
                  </div>
                  <div className="text-zinc-400 text-sm">@{r.profile?.handle} · {timeAgo(r.created_at)} ago</div>
                  {r.message && <p className="text-zinc-200 text-sm mt-1 whitespace-pre-line">{r.message}</p>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => review(r.id, true)}
                  disabled={busy === r.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm disabled:opacity-60"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => review(r.id, false)}
                  disabled={busy === r.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/15 text-zinc-200 font-bold text-sm disabled:opacity-60"
                >
                  <X className="w-4 h-4" /> Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};
