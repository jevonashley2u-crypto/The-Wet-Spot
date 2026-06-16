import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, Link as LinkIcon, Gift, ArrowRight, ShieldCheck, Crown, Hexagon } from "lucide-react";
import { HoloCard } from "./HoloCard";

export const ReferralHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"fan" | "creator">("fan");

  const fanMilestones = [
    { target: 5, reward: "$10 Platform Credit", current: 5, unlocked: true },
    { target: 10, reward: "Exclusive Profile Badge", current: 7, unlocked: false },
    { target: 50, reward: "Ambassador Status & 1% rev-share", current: 7, unlocked: false },
  ];

  return (
    <div className="w-full text-white max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-white flex items-center justify-center gap-3 neon-text">
          <Users className="w-8 h-8 text-teal-400" />
          Growth & Referral Hub
        </h1>
        <p className="text-zinc-400 mt-2 max-w-xl mx-auto">
          The Wet Spot ecosystem grows through you. Invite friends or migrate other creators to earn compounding rewards, exclusive badges, and rev-share.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab("fan")}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            activeTab === "fan" ? "bg-teal-500 text-black shadow-[0_0_20px_rgba(20,184,166,0.4)]" : "glass-panel text-zinc-400 hover:text-white"
          }`}
        >
          Fan Ambassador Program
        </button>
        <button
          onClick={() => setActiveTab("creator")}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            activeTab === "creator" ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]" : "glass-panel text-zinc-400 hover:text-white"
          }`}
        >
          Creator Migration Program
        </button>
      </div>

      {activeTab === "fan" && (
        <div className="space-y-8">
          <HoloCard intensity={5} className="border-teal-500/20">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-teal-900/10 to-black">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Your Unique Invite Node</h2>
                <p className="text-zinc-400 text-sm mb-6">Share this link. When someone joins and makes a purchase, you both get rewarded.</p>
                
                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-white/10">
                  <div className="flex-1 font-mono text-teal-300 text-sm pl-4">wetspot.app/join/neo-00492-x</div>
                  <button className="bg-white text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-teal-400 transition-colors">
                    <LinkIcon className="w-4 h-4" /> Copy Link
                  </button>
                </div>
              </div>
              <div className="w-32 h-32 shrink-0 rounded-full border-4 border-teal-500/30 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full" />
                 <div className="text-center relative z-10">
                   <div className="text-3xl font-black text-white">7</div>
                   <div className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">Invited</div>
                 </div>
              </div>
            </div>
          </HoloCard>

          <div>
            <h3 className="text-xl font-bold mb-6">Milestones & Unlocks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fanMilestones.map((m, i) => (
                <HoloCard key={i} className={m.unlocked ? "border-emerald-500/40" : "border-white/5 opacity-60"}>
                  <div className={`p-6 bg-gradient-to-b ${m.unlocked ? "from-emerald-900/20" : "from-zinc-900/20"} to-transparent h-full`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                        {m.unlocked ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <Gift className="w-5 h-5 text-zinc-500" />}
                      </div>
                      <span className="font-mono text-xs text-zinc-400">{m.current} / {m.target}</span>
                    </div>
                    <h4 className="font-bold text-white mb-2">{m.reward}</h4>
                    <div className="w-full h-1 bg-zinc-800 rounded-full mt-4">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }} />
                    </div>
                  </div>
                </HoloCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "creator" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <HoloCard intensity={10} className="border-pink-500/30 bg-gradient-to-br from-pink-900/20 to-black">
              <div className="p-8">
                <Crown className="w-10 h-10 text-pink-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Migrate Your Peers</h2>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Bring creators from legacy platforms (OnlyFans, Patreon) to The Wet Spot. You earn a permanent 1% rev-share of their earnings, paid out daily via smart contracts.
                </p>
                <button className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:bg-pink-400 transition-colors flex justify-center items-center gap-2">
                  Generate Migration Link <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </HoloCard>

            <HoloCard intensity={5} className="border-white/10">
              <div className="p-8">
                <Hexagon className="w-10 h-10 text-teal-400 mb-4" />
                <h2 className="text-xl font-bold mb-2">Automated Import Tool</h2>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Migrating creators can sync their existing follower lists and content libraries directly via our API bridges.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-zinc-300">Patreon Bridge</span>
                    <span className="text-teal-400 font-bold">Active</span>
                  </div>
                  <div className="flex justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-zinc-300">OF Bridge</span>
                    <span className="text-teal-400 font-bold">Active</span>
                  </div>
                </div>
              </div>
            </HoloCard>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Top Referrers Leaderboard</h3>
            <div className="bg-zinc-950/80 border border-white/5 rounded-2xl p-2">
               {[
                 { rank: 1, name: "Aura Vibe", referred: 14, earned: "$4,250" },
                 { rank: 2, name: "Luna Noir", referred: 8, earned: "$1,890" },
                 { rank: 3, name: "Zephyr Peak", referred: 3, earned: "$420" },
               ].map((c, i) => (
                 <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors rounded-xl">
                   <div className="flex items-center gap-4">
                     <span className={`font-black font-mono ${i === 0 ? "text-yellow-400 text-xl" : "text-zinc-500"}`}>#{c.rank}</span>
                     <span className="font-bold text-white">{c.name}</span>
                   </div>
                   <div className="flex items-center gap-6">
                     <span className="text-zinc-400 text-sm">{c.referred} Creators</span>
                     <span className="text-pink-400 font-mono font-bold">{c.earned}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
