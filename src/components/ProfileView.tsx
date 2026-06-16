import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CheckCircle, Flame, MessageSquare, DollarSign, Lock, Share2, Layers, Grid3X3, ShoppingBag, Heart, Sparkles, Check, Users, Compass } from "lucide-react";
import { HoloCard } from "./HoloCard";
import { Creator, Post, Product, SubscriptionTier } from "../types";
import { mockFeed, mockProducts } from "../data";

interface ProfileViewProps {
  creator: Creator;
  onBack: () => void;
  onOpenMessages: (creatorHandle: string) => void;
  onOpenLivestream: () => void;
  onNotify: (title: string, desc: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  creator,
  onBack,
  onOpenMessages,
  onOpenLivestream,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<"posts" | "marketplace" | "tiers" | "community" | "mentorship">("posts");
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState("10");

  const creatorPosts = mockFeed.filter(p => p.creatorId === creator.id);
  const creatorProducts = mockProducts.filter(p => p.creatorName === creator.name);

  // Dynamic Theme Generation based on creator (simulated via static colors for demo, but applied dynamically)
  const themeColors = {
    c1: "from-pink-900/40 via-purple-900/40 to-black",
    c2: "from-teal-900/40 via-blue-900/40 to-black",
    c3: "from-amber-900/40 via-red-900/40 to-black",
  };
  const bgTheme = themeColors[creator.id as keyof typeof themeColors] || "from-teal-900/40 via-black to-black";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgTheme} relative overflow-hidden`}>
      
      {/* 3D Background Environment simulation */}
      <div className="absolute inset-0 z-0 pointer-events-none perspective-container opacity-50">
        <motion.div 
          animate={{
            rotateX: [5, -5, 5],
            rotateY: [-5, 5, -5],
            scale: [1.1, 1.15, 1.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full"
        >
           <img 
              src={creator.banner} 
              alt="Environment Map"
              className="w-full h-full object-cover blur-[50px] mix-blend-screen opacity-30" 
           />
        </motion.div>
        {/* Particle/Grid Overlay */}
        <div className="absolute inset-0 holo-mesh opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-32">
        {/* Neural Nav */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-white/10 transition-colors text-sm font-bold text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Environment
          </button>
          
          <div className="flex gap-3">
            {creator.isLive && (
              <button 
                onClick={onOpenLivestream} 
                className="animate-pulse bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                <Flame className="w-4 h-4" /> Live Hologram
              </button>
            )}
          </div>
        </div>

        {/* 3D Hero Profile Plate */}
        <div className="perspective-container w-full h-[400px] mb-12">
          <motion.div 
            initial={{ rotateX: 20, opacity: 0, y: 50 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full h-full relative preserve-3d"
          >
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
               <img src={creator.banner} className="w-full h-full object-cover" alt="Banner" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#010a14] via-[#010a14]/60 to-transparent" />
            </div>

            {/* Floating Creator Data */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row items-end gap-6 preserve-3d" style={{ transform: "translateZ(50px)" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-teal-500 rounded-3xl blur-xl opacity-30 animate-pulse-ring" />
                <img 
                  src={creator.avatar} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-2 border-white/20 shadow-2xl relative z-10" 
                  alt={creator.name} 
                />
              </div>

              <div className="flex-1 pb-2">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 neon-text">
                  {creator.name}
                  <CheckCircle className="w-8 h-8 text-teal-400 fill-teal-400/20" />
                </h1>
                <p className="text-teal-300 font-mono tracking-wider mt-1 mb-4">@{creator.handle}</p>
                <p className="text-sm md:text-base text-zinc-300 max-w-2xl leading-relaxed">
                  {creator.bio}
                </p>
              </div>

              {/* Spatial Actions */}
              <div className="flex flex-col gap-3 min-w-[200px]">
                <button 
                  onClick={() => setShowTipModal(true)}
                  className="w-full py-3 rounded-xl bg-teal-500/20 border border-teal-500/50 text-teal-300 font-bold flex items-center justify-center gap-2 hover:bg-teal-500 hover:text-black transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                >
                  <Sparkles className="w-4 h-4" /> Support Sync
                </button>
                <button 
                  onClick={() => onOpenMessages(creator.handle)}
                  className="w-full py-3 rounded-xl glass-panel text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" /> Neural Link
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Spatial Segment Control */}
        <div className="flex overflow-x-auto custom-scrollbar gap-4 mb-8 bg-black/20 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
          {[
            { id: "posts", icon: <Grid3X3 className="w-4 h-4"/>, label: "Neural Feed" },
            { id: "marketplace", icon: <ShoppingBag className="w-4 h-4"/>, label: "Storefront" },
            { id: "tiers", icon: <Layers className="w-4 h-4"/>, label: "Memberships" },
            { id: "community", icon: <Users className="w-4 h-4"/>, label: "Micro-Hubs" },
            { id: "mentorship", icon: <Compass className="w-4 h-4"/>, label: "Mentorship" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                ${activeTab === tab.id ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]" : "text-zinc-400 hover:text-white hover:bg-white/5"}
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Renderers */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "posts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {creatorPosts.map((post) => (
                  <HoloCard key={post.id} intensity={5}>
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <img src={post.creatorAvatar} className="w-10 h-10 rounded-full border border-teal-500" alt="Avatar" />
                            <div>
                              <div className="font-bold text-white text-sm">{post.creatorName}</div>
                              <div className="text-[10px] text-teal-400 font-mono">{post.timeAgo}</div>
                            </div>
                          </div>
                          {post.isPremium && <Lock className="w-4 h-4 text-pink-400" />}
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed mb-6">{post.content}</p>
                        
                        {post.image && !post.isPremium && (
                          <div className="rounded-xl overflow-hidden border border-white/10 mb-4 h-48">
                            <img src={post.image} className="w-full h-full object-cover" alt="Attachment" />
                          </div>
                        )}
                        {post.isPremium && (
                          <div className="rounded-xl bg-gradient-to-br from-pink-500/10 to-teal-500/10 border border-white/10 h-48 flex flex-col items-center justify-center text-center p-4 mb-4">
                            <Lock className="w-8 h-8 text-pink-400 mb-2" />
                            <div className="text-sm font-bold text-white">Encrypted Hologram</div>
                            <button 
                              onClick={() => onNotify("Unlocked", "Premium content unsealed.")}
                              className="mt-4 px-4 py-2 bg-pink-500 text-white text-xs font-bold rounded-full hover:bg-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                            >
                              Unlock Access (${post.unlockPrice})
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 pt-4 border-t border-white/10">
                         <button className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-teal-400 transition-colors">
                           <Heart className="w-4 h-4" /> {post.likes}
                         </button>
                         <button className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
                           <MessageSquare className="w-4 h-4" /> {post.commentsCount}
                         </button>
                      </div>
                    </div>
                  </HoloCard>
                ))}
              </div>
            )}

            {activeTab === "community" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { name: "General Cyber Chatter", users: 1240, active: 45 },
                   { name: "Asset Creation Tips", users: 890, active: 12 },
                   { name: "Exclusive VIP Node", users: 150, active: 8, locked: true },
                 ].map((hub, i) => (
                   <HoloCard key={i} intensity={8}>
                     <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center border border-teal-500/40">
                             {hub.locked ? <Lock className="w-5 h-5 text-pink-400" /> : <Users className="w-5 h-5 text-teal-400" />}
                          </div>
                          <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded-md text-teal-300">
                             {hub.active} Active
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">{hub.name}</h3>
                        <p className="text-xs text-zinc-400 font-mono mb-6">{hub.users} Connected Nodes</p>
                        <button className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-colors">
                           {hub.locked ? "Requires VIP Access" : "Join Hub"}
                        </button>
                     </div>
                   </HoloCard>
                 ))}
              </div>
            )}

            {activeTab === "mentorship" && (
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <div className="w-20 h-20 bg-teal-500/10 rounded-full mx-auto flex items-center justify-center border border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
                  <Compass className="w-10 h-10 text-teal-400" />
                </div>
                <h2 className="text-3xl font-bold text-white neon-text">1-on-1 Neural Mentorship</h2>
                <p className="text-zinc-400">Book dedicated holographic sessions with {creator.name} to accelerate your own growth in the ecosystem.</p>
                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 max-w-sm mx-auto text-left">
                   <div className="text-sm font-mono text-teal-400 mb-2 uppercase tracking-widest">Available Slot</div>
                   <div className="text-2xl font-bold text-white mb-6">45 Min Sync</div>
                   <div className="flex justify-between items-center mb-6">
                     <span className="text-zinc-500">Rate</span>
                     <span className="text-xl font-bold font-mono text-white">$150.00</span>
                   </div>
                   <button 
                     onClick={() => onNotify("Session Booked", "Awaiting confirmation from creator.")}
                     className="w-full py-3 bg-teal-400 text-black font-bold rounded-xl hover:bg-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all"
                   >
                     Request Sync
                   </button>
                </div>
              </div>
            )}
            
            {/* Tiers / Memberships omitted for brevity in demo, assuming covered similarly */}
            {activeTab === "tiers" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                 {creator.tiers.map((tier) => (
                    <HoloCard key={tier.id}>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                        <div className="text-3xl font-black font-mono text-teal-400 mb-6">${tier.price}<span className="text-sm text-zinc-500">/mo</span></div>
                        <ul className="space-y-3 mb-8">
                          {tier.benefits.map((b, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                              <Check className="w-4 h-4 text-teal-400" /> {b}
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => onNotify("Subscription Active", `Unlocked ${tier.name}`)}
                          className="w-full py-3 bg-white/10 hover:bg-teal-400 hover:text-black transition-all border border-white/20 hover:border-teal-400 rounded-xl font-bold"
                        >
                          Unlock Access
                        </button>
                      </div>
                    </HoloCard>
                 ))}
              </div>
            )}

            {activeTab === "marketplace" && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {creatorProducts.map((prod) => (
                   <HoloCard key={prod.id}>
                     <div className="flex flex-col h-full">
                       <div className="h-48 relative">
                         <img src={prod.image} className="w-full h-full object-cover rounded-t-2xl" alt="Product" />
                         <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-mono text-white">
                           {prod.category}
                         </div>
                       </div>
                       <div className="p-6 flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{prod.title}</h3>
                            <p className="text-sm text-zinc-400 mb-4">{prod.description}</p>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
                             <div className="text-2xl font-bold font-mono text-emerald-400">${prod.price}</div>
                             <button className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                               Acquire
                             </button>
                          </div>
                       </div>
                     </div>
                   </HoloCard>
                 ))}
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tip Modal simplified for demo */}
      <AnimatePresence>
        {showTipModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
             <HoloCard intensity={2} className="max-w-md w-full !h-auto">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Sparkles className="text-teal-400"/> Support Sync</h3>
                  <p className="text-zinc-400 text-sm mb-6">Instantly transfer value to {creator.name} across the network.</p>
                  <div className="flex gap-2 mb-6">
                    {["5", "10", "50", "100"].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => setTipAmount(amt)}
                        className={`flex-1 py-3 rounded-xl font-mono font-bold border transition-colors ${tipAmount === amt ? "bg-teal-500/20 text-teal-300 border-teal-500/50" : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"}`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setShowTipModal(false)} className="flex-1 py-3 bg-white/10 rounded-xl font-bold text-white hover:bg-white/20">Cancel</button>
                    <button 
                      onClick={() => {
                        setShowTipModal(false);
                        onNotify("Transfer Complete", `Sent $${tipAmount} to ${creator.name}`);
                      }} 
                      className="flex-1 py-3 bg-teal-400 text-black rounded-xl font-bold shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                    >
                      Confirm Transfer
                    </button>
                  </div>
                </div>
             </HoloCard>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
