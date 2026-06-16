import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Star, Target, Shield, Zap, Award, Crown, Hexagon, Flame, Eye, MessageCircle } from "lucide-react";
import { HoloCard } from "./HoloCard";
import { mockUserStats } from "../data";

interface GamificationViewProps {
  onNotify: (title: string, desc: string) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({ onNotify }) => {
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const stats = mockUserStats;

  const badges = [
    { id: 1, name: "First Blood", desc: "Acquired your first digital asset.", icon: <Target className="w-8 h-8 text-white" />, color: "from-red-500 to-orange-500", unlocked: true, rarity: "Common" },
    { id: 2, name: "Whale Mode", desc: "Tipped over $500 total in one month.", icon: <Crown className="w-8 h-8 text-white" />, color: "from-yellow-400 to-amber-600", unlocked: true, rarity: "Epic" },
    { id: 3, name: "Early Adopter", desc: "Joined during the beta phase.", icon: <Star className="w-8 h-8 text-white" />, color: "from-purple-500 to-pink-500", unlocked: true, rarity: "Legendary" },
    { id: 4, name: "Cyber Guardian", desc: "Moderated a chat for 10+ hours.", icon: <Shield className="w-8 h-8 text-white" />, color: "from-blue-500 to-cyan-500", unlocked: false, rarity: "Rare" },
    { id: 5, name: "Speed Demon", desc: "Unlocked a post within 60s of upload.", icon: <Zap className="w-8 h-8 text-white" />, color: "from-green-400 to-emerald-600", unlocked: false, rarity: "Rare" },
    { id: 6, name: "Ecosystem Builder", desc: "Referred 5 active paying users.", icon: <Hexagon className="w-8 h-8 text-white" />, color: "from-teal-400 to-blue-500", unlocked: false, rarity: "Epic" },
  ];

  const streaks = [
    { name: "Daily Login Streak", value: stats.dailyStreak, icon: <Flame className="w-5 h-5 text-orange-400" />, color: "orange" },
    { name: "Watch Streak", value: stats.watchStreak, icon: <Eye className="w-5 h-5 text-teal-400" />, color: "teal" },
    { name: "Engagement Streak", value: stats.engagementStreak, icon: <MessageCircle className="w-5 h-5 text-pink-400" />, color: "pink" },
  ];

  return (
    <div className="w-full text-white max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 neon-text">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Identity & Progression
          </h1>
          <p className="text-zinc-400 mt-2">Your verified identity, gamified engagement, and ecosystem rank.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Col: Hero Stats Panel */}
        <div className="lg:col-span-2">
          <HoloCard intensity={5} className="h-full border-yellow-500/20 bg-gradient-to-br from-yellow-900/10 to-black">
            <div className="p-8 flex flex-col md:flex-row items-center gap-8 relative z-20 h-full">
               
               {/* 3D Level Indicator */}
               <div className="perspective-container w-40 h-40 shrink-0">
                  <motion.div 
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full relative preserve-3d"
                  >
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse-ring" />
                    <div className="absolute inset-2 border-4 border-yellow-400/50 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-md" style={{ transform: "translateZ(30px)" }}>
                       <div className="text-center">
                         <div className="text-[10px] text-yellow-400 font-mono uppercase tracking-widest">Level</div>
                         <div className="text-5xl font-black text-white neon-text">{stats.level}</div>
                       </div>
                    </div>
                  </motion.div>
               </div>

               <div className="flex-1 w-full">
                 <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">{stats.rank}</div>
                      <div className="text-sm text-zinc-400 font-mono">ID: NEO-00492-X</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-yellow-400 font-bold">{stats.xp} / {stats.nextLevelXp} XP</div>
                    </div>
                 </div>
                 
                 {/* Progress Bar */}
                 <div className="h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/10 relative">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
                     transition={{ duration: 2, ease: "easeOut" }}
                     className="h-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.8)]"
                   />
                   <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] animate-[pulse_2s_infinite]" />
                 </div>
               </div>
            </div>
          </HoloCard>
        </div>

        {/* Right Col: Streaks Panel */}
        <div className="lg:col-span-1">
          <HoloCard intensity={5} className="h-full border-white/10 bg-zinc-950/80">
            <div className="p-6">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Flame className="w-5 h-5 text-orange-400" /> Active Streaks
               </h3>
               
               <div className="space-y-4">
                 {streaks.map((streak, i) => (
                   <div key={i} className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                     <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-lg bg-${streak.color}-500/20`}>
                         {streak.icon}
                       </div>
                       <span className="text-sm font-bold text-zinc-300">{streak.name}</span>
                     </div>
                     <div className="flex items-baseline gap-1">
                       <span className={`text-xl font-black font-mono text-${streak.color}-400`}>{streak.value}</span>
                       <span className="text-[10px] text-zinc-500 uppercase">Days</span>
                     </div>
                   </div>
                 ))}
               </div>

               <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                 Claim Daily Reward
               </button>
            </div>
          </HoloCard>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Award className="text-yellow-400" /> Digital Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {badges.map(badge => (
             <button 
               key={badge.id}
               onClick={() => setSelectedBadge(badge)}
               className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                 badge.unlocked 
                   ? "bg-zinc-900/50 hover:bg-zinc-800 border border-white/10 cursor-pointer group" 
                   : "bg-zinc-950 border border-zinc-900 opacity-50 cursor-not-allowed grayscale"
               }`}
             >
                {/* Spinning 3D icon on hover */}
                <div className="perspective-container w-16 h-16 mb-3">
                  <motion.div
                    whileHover={badge.unlocked ? { rotateY: 180, scale: 1.1 } : {}}
                    transition={{ type: "spring" }}
                    className={`w-full h-full rounded-full bg-gradient-to-br ${badge.color} p-1 shadow-lg flex items-center justify-center preserve-3d`}
                  >
                    <div className="w-full h-full bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ transform: "translateZ(10px)" }}>
                      {badge.icon}
                    </div>
                  </motion.div>
                </div>
                <div className="text-xs font-bold text-center text-white">{badge.name}</div>
             </button>
           ))}
        </div>
      </div>

      {/* Badge Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, rotateX: 45 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.8, rotateX: -45 }}
              transition={{ type: "spring", damping: 15 }}
              className="perspective-container max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <HoloCard intensity={20} className="!bg-zinc-950 border-white/20 relative overflow-visible">
                 <div className="absolute -top-16 left-1/2 -translate-x-1/2 perspective-container w-32 h-32 z-30">
                    <motion.div
                      animate={{ rotateY: 360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className={`w-full h-full rounded-full bg-gradient-to-br ${selectedBadge.color} p-1 shadow-[0_0_40px_rgba(255,255,255,0.2)] preserve-3d`}
                    >
                      <div className="w-full h-full bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20" style={{ transform: "translateZ(20px)" }}>
                        {selectedBadge.icon}
                      </div>
                    </motion.div>
                 </div>
                 
                 <div className="pt-20 pb-8 px-8 text-center relative z-20">
                    <div className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${
                      selectedBadge.rarity === 'Legendary' ? 'text-orange-400' :
                      selectedBadge.rarity === 'Epic' ? 'text-purple-400' :
                      selectedBadge.rarity === 'Rare' ? 'text-blue-400' : 'text-zinc-400'
                    }`}>
                      {selectedBadge.rarity} Badge
                    </div>
                    <h2 className="text-2xl font-black text-white mb-4 neon-text">{selectedBadge.name}</h2>
                    <p className="text-zinc-400 text-sm mb-8">{selectedBadge.desc}</p>
                    
                    {selectedBadge.unlocked ? (
                      <div className="bg-emerald-500/10 text-emerald-400 text-xs py-2 px-4 rounded-xl border border-emerald-500/20 font-bold font-mono">
                        Acquired: Oct 12, 2030
                      </div>
                    ) : (
                      <div className="bg-zinc-900 text-zinc-500 text-xs py-2 px-4 rounded-xl border border-zinc-800 font-bold font-mono">
                        Locked
                      </div>
                    )}
                 </div>
              </HoloCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
