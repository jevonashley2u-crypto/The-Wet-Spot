import React, { useState } from "react";
import { motion } from "motion/react";
import { ShoppingBag, Search, Filter, Box } from "lucide-react";
import { HoloCard } from "./HoloCard";
import { mockProducts } from "../data";

interface MarketplaceViewProps {
  onNotify: (title: string, desc: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onNotify }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Assets" },
    { id: "preset", label: "Presets" },
    { id: "video", label: "Neural Video" },
    { id: "audio", label: "Audio Stems" },
  ];

  const filteredProducts = mockProducts.filter(p => activeCategory === "all" || p.category === activeCategory);

  return (
    <div className="w-full text-white max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 neon-text">
            <ShoppingBag className="w-8 h-8 text-pink-400" />
            Creator Storefronts
          </h1>
          <p className="text-zinc-400 mt-2">Acquire digital assets, presets, and 3D primitives directly from creators.</p>
        </div>
        
        <div className="flex gap-2 bg-black/40 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {categories.map(c => (
            <button 
              key={c.id} 
              onClick={() => setActiveCategory(c.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeCategory === c.id ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProducts.map(prod => (
          <HoloCard key={prod.id} intensity={12}>
             <div className="flex flex-col h-full bg-zinc-950/50">
               {/* 3D Mockup Container */}
               <div className="relative h-64 border-b border-white/10 overflow-hidden perspective-container flex items-center justify-center group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/20 to-teal-900/20" />
                  <motion.div 
                    whileHover={{ rotateY: 180, scale: 1.1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative z-10 w-40 h-40 preserve-3d"
                  >
                    {/* Simulated 3D Box for product */}
                    <div className="absolute inset-0 bg-black/80 border border-teal-500/50 rounded-xl shadow-[0_0_30px_rgba(20,184,166,0.3)] flex items-center justify-center" style={{ transform: "translateZ(20px)" }}>
                       <img src={prod.image} className="w-full h-full object-cover rounded-xl opacity-60" alt="Item preview" />
                       <Box className="absolute w-12 h-12 text-teal-400 animate-pulse" />
                    </div>
                  </motion.div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-mono text-white">
                    {prod.category}
                  </div>
               </div>
               
               <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={prod.creatorAvatar} className="w-6 h-6 rounded-full border border-white/20" alt="Creator" />
                      <span className="text-xs text-zinc-400 font-mono">{prod.creatorName}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{prod.title}</h3>
                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{prod.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
                     <div className="text-2xl font-bold font-mono text-pink-400">${prod.price}</div>
                     <button 
                       onClick={() => onNotify("Asset Acquired", `${prod.title} has been transferred to your vault.`)}
                       className="px-6 py-2 bg-pink-500/20 text-pink-300 border border-pink-500/50 font-bold rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)]"
                     >
                       Acquire Asset
                     </button>
                  </div>
               </div>
             </div>
          </HoloCard>
        ))}
      </div>
    </div>
  );
};
