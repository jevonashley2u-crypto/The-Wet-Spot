import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface DigitalMembershipCardProps {
  creatorName: string;
  creatorAvatar: string;
  tierName: string;
  memberSince: string;
  cardNumber: string;
}

export function DigitalMembershipCard({ 
  creatorName, 
  creatorAvatar, 
  tierName, 
  memberSince, 
  cardNumber 
}: DigitalMembershipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rx = ((y - centerY) / centerY) * -15;
    const ry = ((x - centerX) / centerX) * 15;
    
    setRotateX(rx);
    setRotateY(ry);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="perspective-container w-full max-w-sm mx-auto">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
          transformPerspective: 1200
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden preserve-3d shadow-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-950"
      >
        {/* Holographic shifting background */}
        <motion.div 
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
          className="absolute inset-0 opacity-40 mix-blend-color-dodge pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(45deg, rgba(20,184,166,0) 0%, rgba(20,184,166,0.3) 50%, rgba(236,72,153,0.3) 100%)",
            backgroundSize: "200% 200%"
          }}
        />

        {/* Card Content - elevated for 3D effect */}
        <div className="relative z-20 w-full h-full p-6 flex flex-col justify-between preserve-3d" style={{ transform: "translateZ(40px)" }}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img src={creatorAvatar} alt={creatorName} className="w-10 h-10 rounded-full border-2 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] object-cover" />
              <div>
                <p className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">Verified Access</p>
                <h3 className="text-white font-bold text-lg leading-tight neon-text">{creatorName}</h3>
              </div>
            </div>
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-xs font-bold text-white uppercase tracking-wider">{tierName}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="font-mono text-zinc-300 text-sm tracking-[0.25em] tabular-nums">
              {cardNumber}
            </div>
            
            <div className="flex justify-between items-end border-t border-white/10 pt-3">
              <div>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-0.5">Member Since</p>
                <p className="text-xs text-zinc-300 font-mono">{memberSince}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 opacity-80 flex items-center justify-center">
                 <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
