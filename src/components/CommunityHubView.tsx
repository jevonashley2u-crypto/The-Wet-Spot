import React, { useState } from "react";
import { Users, Hash, Trophy, Radio, MessageSquare, ChevronRight, Swords } from "lucide-react";
import { HoloCard } from "./HoloCard";
import { mockCreators } from "../data";

export const CommunityHubView: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<"clubs" | "challenges">("clubs");

  return (
    <div className="w-full text-white max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 neon-text">
            <Users className="w-8 h-8 text-pink-400" />
            Community Engine
          </h1>
          <p className="text-zinc-400 mt-2 max-w-xl">
            Join private Fan Clubs, participate in real-time discussion rooms, and compete in ecosystem-wide creator challenges.
          </p>
        </div>
        <div className="flex gap-2 bg-black/40 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
           <button onClick={() => setActiveSegment("clubs")} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeSegment === "clubs" ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}>Fan Clubs</button>
           <button onClick={() => setActiveSegment("challenges")} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeSegment === "challenges" ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}>Challenges</button>
        </div>
      </div>

      {activeSegment === "clubs" && (
        <div className="space-y-8">
           <h2 className="text-xl font-bold flex items-center gap-2"><Hash className="w-5 h-5 text-teal-400" /> Your Active Clubs</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCreators.slice(0, 3).map(creator => (
                <HoloCard key={creator.id} intensity={8} className="border-teal-500/20 bg-gradient-to-t from-black to-zinc-900/50">
                  <div className="p-6 relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 right-0 p-4">
                       <span className="flex h-3 w-3 relative">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                       </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <img src={creator.avatar} className="w-16 h-16 rounded-2xl border border-white/20 object-cover" alt="Club" />
                      <div>
                        <h3 className="font-bold text-lg text-white">{creator.name} Inner Circle</h3>
                        <p className="text-zinc-400 text-xs font-mono">{creator.subscribersCount} Members</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 flex-1">
                       <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-sm text-zinc-300 flex items-center justify-between group cursor-pointer hover:border-teal-500/50 transition-colors">
                         <div className="flex items-center gap-2"><Radio className="w-4 h-4 text-orange-400" /> Live Voice Chat</div>
                         <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-black" />
                            <div className="w-6 h-6 rounded-full bg-zinc-700 border border-black" />
                            <div className="w-6 h-6 rounded-full bg-teal-900 border border-black text-[8px] flex items-center justify-center">+42</div>
                         </div>
                       </div>
                       <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-sm text-zinc-300 flex items-center justify-between group cursor-pointer hover:border-pink-500/50 transition-colors">
                         <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-pink-400" /> General Discussion</div>
                         <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                       </div>
                    </div>
                    
                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
                      Enter Hub
                    </button>
                  </div>
                </HoloCard>
              ))}
           </div>
        </div>
      )}

      {activeSegment === "challenges" && (
        <div className="space-y-8">
           <h2 className="text-xl font-bold flex items-center gap-2"><Swords className="w-5 h-5 text-pink-400" /> Ecosystem Competitions</h2>
           
           <HoloCard intensity={15} className="border-pink-500/30 bg-gradient-to-br from-pink-900/20 to-black">
              <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                 <div className="w-48 h-48 shrink-0 relative perspective-container">
                    <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full" />
                    <div className="w-full h-full preserve-3d animate-pulse-ring border-4 border-pink-500/50 rounded-full flex flex-col items-center justify-center bg-black/60 backdrop-blur-md" style={{ transform: "translateZ(20px)" }}>
                      <Trophy className="w-12 h-12 text-pink-400 mb-2" />
                      <div className="font-mono text-xs text-white">Ends in:</div>
                      <div className="font-black text-xl neon-text text-white">12:45:00</div>
                    </div>
                 </div>
                 
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2 py-1 bg-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-widest rounded">Global Event</span>
                    </div>
                    <h2 className="text-3xl font-black mb-4">The Viral Vanguard</h2>
                    <p className="text-zinc-400 mb-6 max-w-lg leading-relaxed">
                      Compete to drive the most organic traffic to The Wet Spot via your referral links. Top 10 users share a prize pool of $50,000 in ecosystem credits and unlock the "Vanguard" Diamond Badge.
                    </p>
                    
                    <div className="bg-zinc-950 p-4 rounded-xl border border-white/10 mb-6">
                      <div className="flex justify-between text-sm mb-2 font-bold">
                        <span className="text-zinc-400">Your Current Rank: <span className="text-white">#142</span></span>
                        <span className="text-teal-400">Top 10 Threshold: 2,400 pts</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-orange-400 w-[65%]" />
                      </div>
                    </div>

                    <button className="px-8 py-3 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-colors">
                      View Leaderboard
                    </button>
                 </div>
              </div>
           </HoloCard>
        </div>
      )}
    </div>
  );
};
