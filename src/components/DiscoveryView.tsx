import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, CheckCircle, Volume2, VolumeX, Heart, Share2, MessageCircle, Info, TrendingUp, Flame, Zap, MapPin } from "lucide-react";
import { Creator } from "../types";
import { mockCreators } from "../data";
import { HoloCard } from "./HoloCard";

interface DiscoveryViewProps {
  onSelectCreator: (creator: Creator) => void;
  onShare: (creator: Creator) => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onSelectCreator, onShare }) => {
  const [activeSegment, setActiveSegment] = useState("for-you");
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sorting feed based on segment
  const feedItems = [...mockCreators].sort((a, b) => {
    if (activeSegment === "trending") return (b.momentumScore || 0) - (a.momentumScore || 0);
    if (activeSegment === "rising") return (b.streakCount || 0) - (a.streakCount || 0);
    return 0; // For you / local (randomized or default for simulation)
  });

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  };

  const segments = [
    { id: "following", label: "Following" },
    { id: "for-you", label: "For You" },
    { id: "trending", label: "Trending", icon: <TrendingUp className="w-3 h-3 text-orange-400" /> },
    { id: "rising", label: "Rising", icon: <Flame className="w-3 h-3 text-red-400" /> },
    { id: "local", label: "Local", icon: <MapPin className="w-3 h-3 text-teal-400" /> },
  ];

  return (
    <div className="absolute inset-0 bg-black overflow-hidden flex flex-col">
      {/* Neural Interface Overlay Top Nav */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <h1 className="text-xl font-bold tracking-widest text-white flex items-center gap-2 neon-text">
          <Compass className="w-5 h-5 text-teal-400" />
          VIRAL ENGINE
        </h1>

        {/* Neural Feed Switcher */}
        <div className="flex gap-2 pointer-events-auto bg-black/40 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/10 overflow-x-auto custom-scrollbar max-w-full">
          {segments.map((segment) => (
            <button
              key={segment.id}
              onClick={() => setActiveSegment(segment.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeSegment === segment.id ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "text-white/50 hover:text-white"
              }`}
            >
              {segment.icon} {segment.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Infinite Scroll Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth custom-scrollbar"
      >
        {feedItems.map((creator, idx) => (
          <div key={creator.id} className="w-full h-[100dvh] snap-start snap-always relative flex items-center justify-center p-4 md:p-12 perspective-container">
            
            {/* Background Cinematic Video/Image Simulation */}
            <div className="absolute inset-0 z-0">
              <img 
                src={creator.banner} 
                alt="Cinematic Background"
                className="w-full h-full object-cover filter brightness-[0.3] scale-110 blur-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#010a14] via-transparent to-transparent" />
            </div>

            {/* Central HoloCard for Creator Trailer */}
            <div className="relative z-10 w-full max-w-4xl aspect-[9/16] md:aspect-video mx-auto">
              <HoloCard intensity={5} className="bg-black/40 border-teal-500/20">
                {/* Simulated Video Feed inside HoloCard */}
                <div className="absolute inset-0 z-0">
                  <img src={creator.banner} className="w-full h-full object-cover opacity-80" alt="Trailer" />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* AI Scanline effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div 
                      animate={{ y: ["-10%", "110%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-full h-1 bg-teal-400/50 shadow-[0_0_20px_rgba(20,184,166,1)]"
                    />
                  </div>
                </div>

                {/* Creator Data Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  
                  {/* Viral Momentum Indicator */}
                  {(creator.momentumScore || 0) > 80 && (
                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                       <Zap className="w-4 h-4 fill-orange-400" />
                       <span className="text-xs font-bold font-mono">Viral Momentum: {creator.momentumScore}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-end">
                    {/* Left side: Info */}
                    <div className="max-w-xl preserve-3d">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img src={creator.avatar} className="w-12 h-12 rounded-full border-2 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.5)] object-cover" alt="Avatar" />
                          <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2 neon-text">
                              {creator.name}
                              <CheckCircle className="w-5 h-5 text-teal-400 fill-teal-400/20" />
                            </h2>
                            <span className="text-teal-300 font-mono text-xs">@{creator.handle}</span>
                          </div>
                        </div>

                        <p className="text-sm text-zinc-300 font-light leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                          {creator.bio}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {creator.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] text-white uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button 
                          onClick={() => onSelectCreator(creator)}
                          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-teal-400 hover:text-black transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)]"
                        >
                          Enter Environment
                        </button>
                      </motion.div>
                    </div>

                    {/* Right side: Spatial Actions */}
                    <div className="flex flex-col gap-4 items-center">
                      {[
                        { icon: <Heart className="w-6 h-6" />, label: "Like" },
                        { icon: <MessageCircle className="w-6 h-6" />, label: "Echo" },
                        { icon: <Share2 className="w-6 h-6" />, label: "Viral Share", action: () => onShare(creator) },
                        { icon: <Info className="w-6 h-6" />, label: "Intel" },
                      ].map((action, i) => (
                        <button key={i} onClick={action.action} className="group flex flex-col items-center gap-1">
                          <div className={`w-12 h-12 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all
                            ${action.label === "Viral Share" ? "bg-pink-500/20 border-pink-500/50 group-hover:bg-pink-500 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] animate-pulse-ring" : "bg-black/40 group-hover:bg-white/20 group-hover:border-teal-400"}`
                          }>
                            {action.icon}
                          </div>
                          <span className={`text-[10px] font-mono group-hover:text-teal-300 ${action.label === "Viral Share" ? "text-pink-300 font-bold" : "text-zinc-400"}`}>{action.label}</span>
                        </button>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Top Right: Sound toggle */}
                <button 
                  onClick={() => setMuted(!muted)}
                  className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20"
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

              </HoloCard>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
