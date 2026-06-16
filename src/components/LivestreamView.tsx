import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Radio, Users, Heart, Share2, DollarSign, MessageSquare, Maximize, Settings, Ghost, Sparkles, Gem } from "lucide-react";
import { HoloCard } from "./HoloCard";

interface LivestreamViewProps {
  onNotify: (title: string, desc: string) => void;
}

export const LivestreamView: React.FC<LivestreamViewProps> = ({ onNotify }) => {
  const [messages, setMessages] = useState([
    { id: 1, user: "NeoFan", text: "This lighting is insane. Are you using the new 3D shader?" },
    { id: 2, user: "CyberPunk99", text: "Dropping a tip! 💎", isTip: true, amount: 50 },
    { id: 3, user: "GlitchBoi", text: "W when does the merch drop?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showGifts, setShowGifts] = useState(false);
  const [activeGift, setActiveGift] = useState<{ id: number, x: number, y: number, type: string } | null>(null);

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), user: "You", text: chatInput }]);
    setChatInput("");
  };

  const sendGift = (giftType: string, cost: number) => {
    setShowGifts(false);
    onNotify("Virtual Asset Sent", `You transferred $${cost} for a ${giftType} hologram!`);
    
    // Trigger 3D Particle overlay
    const newGift = { id: Date.now(), x: Math.random() * 60 + 20, y: Math.random() * 40 + 30, type: giftType };
    setActiveGift(newGift);
    setTimeout(() => setActiveGift(null), 3000);
    
    setMessages(prev => [...prev, { id: Date.now(), user: "You", text: `Sent a ${giftType}! 🎁`, isTip: true, amount: cost }]);
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden flex flex-col md:flex-row">
      
      {/* 3D Particle Gift Overlay */}
      <AnimatePresence>
        {activeGift && (
          <motion.div 
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.5, 2, 1.5], y: [100, 0, -50, -100] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute z-50 pointer-events-none perspective-container"
            style={{ left: `${activeGift.x}%`, top: `${activeGift.y}%` }}
          >
            <div className="text-8xl filter drop-shadow-[0_0_30px_rgba(20,184,166,0.8)] preserve-3d animate-pulse-ring">
               {activeGift.type === "Diamond" ? "💎" : activeGift.type === "Rocket" ? "🚀" : "✨"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Stage */}
      <div className="flex-1 relative perspective-container">
        {/* Video simulation */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516280440502-861614e7a77e?q=80&w=2070&auto=format&fit=crop" 
            alt="Stream" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Spatial Vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />
          <div className="absolute inset-0 holo-mesh pointer-events-none opacity-30" />
        </div>

        {/* Floating Top Controls */}
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto flex gap-4">
             <div className="bg-red-500/80 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold text-sm flex items-center gap-2 border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
               <span className="w-2 h-2 bg-white rounded-full animate-ping" />
               LIVE INTERACTION
             </div>
             <div className="glass-panel px-4 py-2 rounded-full text-white font-mono text-sm flex items-center gap-2">
               <Users className="w-4 h-4 text-teal-400" /> 14,208
             </div>
          </div>
          <div className="pointer-events-auto flex gap-2">
             <button className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
               <Share2 className="w-4 h-4 text-white" />
             </button>
             <button className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
               <Maximize className="w-4 h-4 text-white" />
             </button>
          </div>
        </div>

        {/* Drag-and-drop Spatial Widget (Simulated visually) */}
        <motion.div 
          drag
          dragConstraints={{ left: 0, right: 500, top: 0, bottom: 500 }}
          className="absolute top-24 left-6 z-20 cursor-move"
        >
          <HoloCard intensity={10} className="w-64 !bg-black/40 backdrop-blur-xl border border-teal-500/30">
            <div className="p-4">
              <div className="text-[10px] text-teal-400 font-mono uppercase tracking-widest mb-2 flex items-center gap-1">
                <Settings className="w-3 h-3" /> Live Telemetry Widget
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-white mb-1">
                <span>Heart Rate</span>
                <span className="text-pink-400">112 BPM</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full mb-3 overflow-hidden">
                 <motion.div 
                   animate={{ width: ["60%", "70%", "65%", "80%", "60%"] }} 
                   transition={{ duration: 2, repeat: Infinity }}
                   className="h-full bg-pink-400" 
                 />
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>Network Stability</span>
                <span className="text-teal-400">99.8%</span>
              </div>
            </div>
          </HoloCard>
        </motion.div>

        {/* Bottom Actions */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end pointer-events-none">
           <div className="pointer-events-auto">
             {/* Virtual Gifts Launcher Button */}
             <button 
               onClick={() => setShowGifts(!showGifts)}
               className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-400 to-pink-500 p-[2px] shadow-[0_0_30px_rgba(20,184,166,0.6)] hover:scale-110 transition-transform"
             >
               <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                 <Gem className="w-6 h-6 text-white" />
               </div>
             </button>
           </div>
        </div>

        {/* Gift Selection Panel */}
        <AnimatePresence>
          {showGifts && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-24 left-6 z-30"
            >
              <HoloCard className="p-4 border-teal-500/30 flex gap-4 bg-black/60 backdrop-blur-2xl">
                {[
                  { icon: "✨", name: "Spark", cost: 5 },
                  { icon: "💎", name: "Diamond", cost: 50 },
                  { icon: "🚀", name: "Rocket", cost: 100 },
                ].map(gift => (
                  <button 
                    key={gift.name}
                    onClick={() => sendGift(gift.name, gift.cost)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-teal-500/50"
                  >
                    <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">{gift.icon}</span>
                    <span className="text-xs font-bold text-white">{gift.name}</span>
                    <span className="text-[10px] text-teal-400 font-mono">${gift.cost}</span>
                  </button>
                ))}
              </HoloCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cyber Chat Panel */}
      <div className="w-full md:w-80 lg:w-96 bg-zinc-950/80 border-l border-white/10 backdrop-blur-xl flex flex-col relative z-20">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-400" />
          <span className="font-bold text-white tracking-widest text-sm uppercase">Neural Chat Hub</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-3 rounded-xl text-sm ${msg.isTip ? "bg-gradient-to-r from-teal-900/40 to-black border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]" : "bg-white/5 border border-white/5"}`}>
               <div className="flex justify-between items-start mb-1">
                 <span className={`font-bold font-mono text-xs ${msg.user === "You" ? "text-pink-400" : "text-teal-400"}`}>{msg.user}</span>
                 {msg.isTip && <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 rounded-full border border-teal-500/30">${msg.amount}</span>}
               </div>
               <p className={`font-light leading-relaxed ${msg.isTip ? "text-white" : "text-zinc-300"}`}>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40">
          <form onSubmit={sendChat} className="flex gap-2 relative">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Inject message to stream..."
              className="flex-1 bg-zinc-900 border border-white/10 focus:border-teal-400/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
            />
            <button 
              type="submit"
              className="w-12 flex-shrink-0 bg-teal-500/20 border border-teal-500/50 hover:bg-teal-500 hover:text-black rounded-xl flex items-center justify-center text-teal-300 transition-colors"
            >
              <Ghost className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};
