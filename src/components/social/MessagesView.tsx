import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Loader2, MessageSquarePlus, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { fetchProfiles, PublicProfile, timeAgo } from '../../lib/social';
import { Avatar, ErrorNote, Panel, VerifiedCheck } from './ui';

interface DM {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

interface MessagesViewProps {
  /** Open straight into a conversation with this user (e.g. from a creator page). */
  initialPartnerId?: string | null;
  onOpenCreator: (userId: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ initialPartnerId, onOpenCreator }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DM[]>([]);
  const [profiles, setProfiles] = useState<Map<string, PublicProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [partnerId, setPartnerId] = useState<string | null>(initialPartnerId || null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newHandle, setNewHandle] = useState('');
  const [showNew, setShowNew] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const me = user?.id;

  const ensureProfiles = useCallback(async (ids: string[]) => {
    const missing = ids.filter((id) => !profiles.has(id));
    if (missing.length === 0) return;
    const got = await fetchProfiles(missing);
    setProfiles((prev) => new Map([...prev, ...got]));
  }, [profiles]);

  const load = useCallback(async () => {
    if (!me) return;
    const { data, error } = await supabase
      .from('direct_messages')
      .select('id, sender_id, receiver_id, body, read_at, created_at')
      .or(`sender_id.eq.${me},receiver_id.eq.${me}`)
      .order('created_at', { ascending: true })
      .limit(1000);
    if (error) {
      setError(error.message);
    } else {
      setMessages(data || []);
      const ids = new Set<string>();
      for (const m of data || []) ids.add(m.sender_id === me ? m.receiver_id : m.sender_id);
      if (initialPartnerId) ids.add(initialPartnerId);
      const got = await fetchProfiles([...ids]);
      setProfiles(got);
    }
    setLoading(false);
  }, [me, initialPartnerId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (initialPartnerId) setPartnerId(initialPartnerId); }, [initialPartnerId]);

  // Live delivery.
  useEffect(() => {
    if (!me) return;
    const channel = supabase
      .channel(`dm-${me}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, (payload) => {
        const m = payload.new as DM;
        if (m.sender_id !== me && m.receiver_id !== me) return;
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        ensureProfiles([m.sender_id === me ? m.receiver_id : m.sender_id]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [me, ensureProfiles]);

  const conversations = useMemo(() => {
    if (!me) return [];
    const byPartner = new Map<string, { last: DM; unread: number }>();
    for (const m of messages) {
      const other = m.sender_id === me ? m.receiver_id : m.sender_id;
      const entry = byPartner.get(other) || { last: m, unread: 0 };
      entry.last = m;
      if (m.receiver_id === me && !m.read_at) entry.unread += 1;
      byPartner.set(other, entry);
    }
    return [...byPartner.entries()]
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.last.created_at.localeCompare(a.last.created_at));
  }, [messages, me]);

  const thread = useMemo(
    () => (partnerId && me ? messages.filter((m) =>
      (m.sender_id === me && m.receiver_id === partnerId) || (m.sender_id === partnerId && m.receiver_id === me)) : []),
    [messages, partnerId, me],
  );

  // Mark incoming messages read when the thread is open.
  useEffect(() => {
    if (!me || !partnerId) return;
    const unread = thread.filter((m) => m.receiver_id === me && !m.read_at).map((m) => m.id);
    if (unread.length === 0) return;
    const now = new Date().toISOString();
    setMessages((prev) => prev.map((m) => (unread.includes(m.id) ? { ...m, read_at: now } : m)));
    supabase.from('direct_messages').update({ read_at: now }).in('id', unread).then(() => {});
  }, [thread, me, partnerId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ block: 'end' }); }, [thread.length, partnerId]);

  if (!user || !me) return null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !partnerId) return;
    setSending(true);
    setError(null);
    const { data, error } = await supabase
      .from('direct_messages')
      .insert({ sender_id: me, receiver_id: partnerId, body })
      .select('id, sender_id, receiver_id, body, read_at, created_at')
      .single();
    setSending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDraft('');
    setMessages((prev) => (prev.some((x) => x.id === data.id) ? prev : [...prev, data]));
  };

  const startNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const handle = newHandle.trim().replace(/^@/, '').toLowerCase();
    if (!handle) return;
    setError(null);
    const { data } = await supabase.from('public_profiles').select('*').eq('handle', handle).maybeSingle();
    if (!data) {
      setError(`No one found with the username @${handle}.`);
      return;
    }
    if (data.id === me) {
      setError("That's you.");
      return;
    }
    setProfiles((prev) => new Map(prev).set(data.id, data as PublicProfile));
    setPartnerId(data.id);
    setShowNew(false);
    setNewHandle('');
  };

  const partner = partnerId ? profiles.get(partnerId) || null : null;

  const list = (
    <Panel className="p-3 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between px-2 py-2">
        <h1 className="text-xl font-black text-white">Messages</h1>
        <button onClick={() => setShowNew((s) => !s)} aria-label="New message" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
          <MessageSquarePlus className="w-5 h-5" />
        </button>
      </div>
      {showNew && (
        <form onSubmit={startNew} className="flex gap-2 px-2 pb-3">
          <input
            autoFocus
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            placeholder="Username, e.g. @jvnashley"
            className="flex-1 min-w-0 bg-white/5 border border-white/15 focus:border-teal-400 rounded-xl px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
          />
          <button type="submit" className="px-4 rounded-xl bg-teal-500 text-black font-bold text-sm">Start</button>
        </form>
      )}
      <div className="px-2"><ErrorNote message={!partnerId ? error : null} /></div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="flex items-center gap-2 p-4 text-zinc-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
        ) : conversations.length === 0 ? (
          <p className="p-4 text-zinc-400 text-sm">No messages yet. Tap + to message someone by their username, or use Message on a creator's page.</p>
        ) : (
          <ul>
            {conversations.map((c) => {
              const p = profiles.get(c.id) || null;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setPartnerId(c.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left hover:bg-white/5 ${partnerId === c.id ? 'bg-white/10' : ''}`}
                  >
                    <Avatar profile={p} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white truncate">{p?.name || 'User'}</span>
                        <VerifiedCheck show={!!p?.is_verified} />
                        <span className="ml-auto text-xs text-zinc-500 shrink-0">{timeAgo(c.last.created_at)}</span>
                      </div>
                      <div className={`text-sm truncate ${c.unread ? 'text-white font-semibold' : 'text-zinc-400'}`}>
                        {c.last.sender_id === me ? 'You: ' : ''}{c.last.body}
                      </div>
                    </div>
                    {c.unread > 0 && <span className="min-w-5 h-5 px-1.5 rounded-full bg-teal-500 text-black text-xs font-bold flex items-center justify-center">{c.unread}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Panel>
  );

  const chat = partnerId && (
    <Panel className="h-full flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center gap-3 p-3 border-b border-white/10">
        <button onClick={() => setPartnerId(null)} aria-label="Back to conversations" className="md:hidden w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={() => onOpenCreator(partnerId)} className="flex items-center gap-3 min-w-0">
          <Avatar profile={partner} size={38} />
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 font-bold text-white truncate">{partner?.name || 'User'} <VerifiedCheck show={!!partner?.is_verified} /></div>
            <div className="text-xs text-zinc-400">@{partner?.handle}</div>
          </div>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 p-4 grid content-start gap-2">
        {thread.length === 0 && <p className="text-center text-zinc-500 text-sm py-8">Say hi 👋</p>}
        {thread.map((m) => {
          const mine = m.sender_id === me;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line break-words ${mine ? 'bg-teal-500 text-black rounded-br-md' : 'bg-white/10 text-white rounded-bl-md'}`}>
                {m.body}
                <div className={`text-[10px] mt-1 ${mine ? 'text-black/60' : 'text-zinc-400'}`}>
                  {timeAgo(m.created_at)}{mine && m.read_at ? ' · Seen' : ''}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="px-3"><ErrorNote message={error} /></div>
      <form onSubmit={send} className="p-3 flex gap-2 border-t border-white/10">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 2000))}
          placeholder="Message…"
          className="flex-1 min-w-0 bg-white/5 border border-white/15 focus:border-teal-400 rounded-full px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500"
        />
        <button type="submit" disabled={sending || !draft.trim()} aria-label="Send" className="w-11 h-11 rounded-full bg-teal-500 disabled:opacity-40 text-black flex items-center justify-center">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </Panel>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 h-[calc(100vh-9rem)]">
      <div className="h-full grid md:grid-cols-[320px_1fr] gap-4">
        <div className={`${partnerId ? 'hidden md:flex' : 'flex'} flex-col min-h-0`}>{list}</div>
        <div className={`${partnerId ? 'flex' : 'hidden md:flex'} flex-col min-h-0`}>
          {chat || (
            <Panel className="h-full flex items-center justify-center p-8 text-zinc-400 text-sm text-center">
              Pick a conversation, or start a new one with +.
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
};
