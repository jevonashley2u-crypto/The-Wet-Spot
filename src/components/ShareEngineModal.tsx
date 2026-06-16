import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Share2, Download, Copy, Instagram, Twitter, Sparkles, Check } from "lucide-react";
import { HoloCard } from "./HoloCard";

interface ShareEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  creatorBanner: string;
}

export const ShareEngineModal: React.FC<ShareEngineModalProps> = ({ isOpen, onClose, creatorName, creatorBanner }) => {
  const [activePlatform, setActivePlatform] = useState<"tiktok" | "ig" | "x" | "snap">("tiktok");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      setGenerated(false);
      const timer = setTimeout(() => {
        setIsGenerating(false);
        setGenerated(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activePlatform]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
             <div className="flex items-center gap-2 text-white font-bold">
               <Share2 className="w-5 h-5 text-teal-400" /> Viral Distribution Engine
             </div>
             <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
               <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
             
             {/* Preview Pane (Left) */}
             <div className="flex-1 bg-black p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 holo-mesh opacity-20 pointer-events-none" />
                
                {isGenerating ? (
                   <div className="flex flex-col items-center gap-4 text-teal-400">
                     <Sparkles className="w-8 h-8 animate-spin" />
                     <span className="font-mono text-sm tracking-widest animate-pulse">AI GENERATING TEASER REEL...</span>
                     <div className="w-48 h-1 bg-zinc-900 overflow-hidden rounded-full mt-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.5, ease: "linear" }}
                          className="h-full bg-teal-400"
                        />
                     </div>
                   </div>
                ) : generated ? (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={`relative border border-white/20 shadow-2xl overflow-hidden bg-zinc-900 transition-all duration-500
                        ${activePlatform === "tiktok" || activePlatform === "snap" || activePlatform === "ig" 
                          ? "w-[280px] h-[500px] rounded-[2rem]" // Vertical 9:16
                          : "w-[400px] h-[225px] rounded-xl" // Landscape 16:9 for X
                        }
                     `}
                   >
                      <img src={creatorBanner} className="absolute inset-0 w-full h-full object-cover filter brightness-[0.6]" alt="Background" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                      
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                         <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
                           <h3 className="text-white font-black text-lg neon-text mb-1">{creatorName}</h3>
                           <p className="text-zinc-300 text-xs line-clamp-2">Exclusive content. Tap to enter the environment via my invite link. 🛸</p>
                           <div className="mt-3 text-[10px] text-teal-400 font-mono font-bold bg-teal-500/20 py-1 px-2 rounded w-fit border border-teal-500/30">wetspot.app/join/neo-00492</div>
                         </div>
                      </div>

                      {/* Fake Platform UI Overlay to make it feel real */}
                      {(activePlatform === "tiktok" || activePlatform === "ig") && (
                        <div className="absolute right-4 bottom-24 flex flex-col gap-4 items-center opacity-80">
                           <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
                           <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
                           <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
                        </div>
                      )}
                   </motion.div>
                ) : null}
             </div>

             {/* Controls Pane (Right) */}
             <div className="w-80 bg-zinc-950/80 border-l border-white/10 p-6 flex flex-col">
                <h3 className="text-white font-bold mb-4">Export Target</h3>
                <div className="grid grid-cols-2 gap-3 mb-8">
                   {[
                     { id: "tiktok", label: "TikTok", aspect: "9:16" },
                     { id: "ig", label: "IG Story", aspect: "9:16" },
                     { id: "x", label: "X / Twitter", aspect: "16:9" },
                     { id: "snap", label: "Snapchat", aspect: "9:16" },
                   ].map(platform => (
                     <button
                       key={platform.id}
                       onClick={() => setActivePlatform(platform.id as any)}
                       className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all
                          ${activePlatform === platform.id ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"}
                       `}
                     >
                       <span className="font-bold text-sm">{platform.label}</span>
                       <span className="text-[9px] font-mono opacity-50">{platform.aspect}</span>
                     </button>
                   ))}
                </div>

                <h3 className="text-white font-bold mb-4">Export Options</h3>
                <div className="space-y-3 mb-8">
                   <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                     <input type="checkbox" defaultChecked className="accent-teal-400" />
                     Embed Tracking Referral Link
                   </label>
                   <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                     <input type="checkbox" defaultChecked className="accent-teal-400" />
                     Include AI Highlight Reel
                   </label>
                   <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
                     <input type="checkbox" defaultChecked className="accent-teal-400" />
                     Auto-copy caption to clipboard
                   </label>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                   <button 
                     disabled={isGenerating}
                     className="w-full py-3 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     <Share2 className="w-4 h-4" /> 1-Click Share to App
                   </button>
                   <button 
                     disabled={isGenerating}
                     className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     <Download className="w-4 h-4" /> Download Asset
                   </button>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
