import React, { useState } from "react";
import { CheckSquare, Film, Sparkles, Calendar, PlusCircle, ArrowRight, TrendingUp, Users, ShieldAlert, FileText, Send, Zap, Brain, Trophy } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { NeonButton } from "./NeonButton";

interface DashboardProps {
  onNotify: (title: string, desc: string) => void;
  onPostCreated?: (newPostContent: string, isPremium: boolean, price: number) => void;
}

export const CreatorDashboardView: React.FC<DashboardProps> = ({ onNotify, onPostCreated }) => {
  const [draftText, setDraftText] = useState("");
  const [isPremiumDraft, setIsPremiumDraft] = useState(false);
  const [draftUnlockPrice, setDraftUnlockPrice] = useState("4.99");
  
  // Growth tracking goals
  const creatorGrowthChecklist = [
    { id: "tk1", label: "Establish Premium Platinum Access subscription tier", done: true },
    { id: "tk2", label: "Launch initial Lightroom or WebGL digital download items", done: true },
    { id: "tk3", label: "Publish a locked behind-the-scenes premium preview post", done: false },
    { id: "tk4", label: "Trigger modular synthesizer or visual live-streaming broadcast event", done: false },
    { id: "tk5", label: "Collect average direct tips from fans above $50 total", done: false }
  ];

  const handleCreatePostDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftText.trim()) return;

    if (onPostCreated) {
      onPostCreated(draftText, isPremiumDraft, parseFloat(draftUnlockPrice) || 0);
    }

    onNotify(
      "Content Broadcasted!", 
      `Your brand new ${isPremiumDraft ? 'Premium ($' + draftUnlockPrice + ')' : 'Standard'} post is live in feeds!`
    );

    setDraftText("");
    setIsPremiumDraft(false);
  };

  return (
    <div className="w-full text-white max-w-5xl mx-auto px-4 sm:px-6 py-6 font-sans">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-white/5 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-teal-400" />
            System Creator Workstation
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Access creator growth modules, publish direct-to-feed artifacts, and audit fan interactions.
          </p>
        </div>

        <div className="bg-teal-950/20 border border-teal-500/10 rounded-xl py-2 px-4.5 text-xs text-teal-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>90% of aggregate earnings are credited instantly to your wallet.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 items-start">
        
        {/* Left Column: Post Composer form */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard hoverEffect={false} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 shrink-0 text-teal-400/15">
              <PlusCircle className="w-12 h-12" />
            </div>

            <h3 className="text-sm font-bold tracking-wide text-zinc-200 uppercase font-mono mb-4">
              Deploy Artifact Direct to Feed
            </h3>

            <form onSubmit={handleCreatePostDraft} className="space-y-4">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-2">Write Post Body Content</label>
                <textarea
                  placeholder="Share a BTS sneak peak, sample synth configurations, shader mathematical code, or athletics macros..."
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-900 border border-white/5 focus:border-teal-500/30 rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                  required
                />
              </div>

              {/* Toggles for premium content */}
              <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4.5">
                <div className="select-none.5 text-left">
                  <span className="text-[10px] text-teal-400 font-mono font-bold uppercase tracking-wider block">Lock Post Media?</span>
                  <p className="text-[11px] text-zinc-500 font-light mt-0.5 leading-normal">Require fans to pay a customized unlock price to render this message.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                  <label className="text-xs text-zinc-400 cursor-pointer flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5">
                    <input
                      type="checkbox"
                      checked={isPremiumDraft}
                      onChange={(e) => setIsPremiumDraft(e.target.checked)}
                      className="accent-teal-500"
                    />
                    <span>Locked Paywall</span>
                  </label>

                  {isPremiumDraft && (
                    <div className="flex items-center bg-zinc-950 border border-white/5 rounded-lg px-2.5 py-1">
                      <span className="text-zinc-500 text-xs font-mono">$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="4.99"
                        value={draftUnlockPrice}
                        onChange={(e) => setDraftUnlockPrice(e.target.value)}
                        className="w-15 bg-transparent border-none text-xs text-white outline-none pl-1 text-center font-mono font-bold"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <NeonButton type="submit" variant="teal" className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Broadcast to Live Feeds
                </NeonButton>
              </div>
            </form>
          </GlassCard>

          {/* Guidelines box */}
          <GlassCard hoverEffect={false}>
            <h3 className="text-sm font-bold tracking-wide text-zinc-200 uppercase font-mono mb-4 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-400" /> Creators Direct Growth Blueprint
            </h3>
            <div className="divide-y divide-white/5 text-xs text-zinc-300 font-sans font-light leading-relaxed">
              <div className="py-3">
                <h4 className="font-bold text-white mb-1">💡 Diversify your Subscription levels</h4>
                <p className="text-zinc-400">Offer both a standard tier ($15/mo) and an exclusive executive access tier ($99+/mo) containing custom feedback loops and file templates.</p>
              </div>
              <div className="py-3">
                <h4 className="font-bold text-white mb-1">🔥 Hook up Google Drive attachments</h4>
                <p className="text-zinc-400">Lock design presets and premium video loops behind checkout walls inside active DMs to incentivize fans to communicate directly.</p>
              </div>
              <div className="py-3">
                <h4 className="font-bold text-white mb-1">💡 Maintain 95% retention ratings</h4>
                <p className="text-zinc-400">Respond within 24 hours to high-tier member subscribers. Our AI messaging optimizer tracks conversion speeds automatic levels.</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Growth checklist */}
        <div className="space-y-6">
          <GlassCard hoverEffect={false}>
            <h3 className="text-sm font-bold tracking-wide text-zinc-200 uppercase font-mono mb-4 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-400" />
              Ecosystem Checklist
            </h3>
            <div className="space-y-3">
              {creatorGrowthChecklist.map((task, idx) => (
                <div key={task.id} className="flex items-start gap-3 p-2.5 bg-zinc-950/40 rounded-xl border border-zinc-900">
                  <input
                    type="checkbox"
                    defaultChecked={task.done}
                    className="accent-teal-400 mt-0.5"
                    disabled
                  />
                  <div className="text-left font-sans select-none.5">
                    <p className={`text-xs font-medium text-white ${task.done ? "line-through text-zinc-500" : ""}`}>
                      {task.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Gamification Core Indicator */}
          <GlassCard hoverEffect={true} className="bg-zinc-950/20 text-left">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono block">Active Creator Rank</span>
                <span className="text-xl font-mono font-black text-white flex items-center gap-1.5 mt-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Level 14 elite
                </span>
              </div>
              <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded font-mono font-bold">4,850 XP</span>
            </div>

            <p className="text-[10px] text-zinc-400 leading-normal font-sans font-light">
              Complete weekly revenue challenges and publish direct artifacts in the **Milestones & Rewards** section to level up!
            </p>

            <div className="w-full bg-zinc-900 border border-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-400 to-sky-400 h-full rounded-full" style={{ width: "97%" }} />
            </div>
            <span className="text-[8px] text-zinc-550 block mt-1 font-mono text-right">97% path to level 15</span>
          </GlassCard>

          {/* AI Strategy Hub Indicator */}
          <GlassCard hoverEffect={true} className="bg-zinc-950/20 text-left">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[9px] text-teal-400 uppercase tracking-widest font-mono block font-bold">Neural Strategy copilot</span>
                <span className="text-xl font-mono font-black text-white flex items-center gap-1.5 mt-1">
                  <Brain className="w-5 h-5 text-teal-400 animate-pulse" />
                  ACTIVE SIGNALS
                </span>
              </div>
              <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded font-mono font-bold">94% Confidence</span>
            </div>

            <p className="text-[10px] text-zinc-400 leading-normal font-sans font-light">
              Our live Pricing Advisor detects a potentials 34% subscriber revenue expand. Activate caption, hashtag and churn outreach builders inside **AI Neural Studio**.
            </p>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
