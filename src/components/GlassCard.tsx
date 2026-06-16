import React from "react";
import { motion } from "motion/react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "neutral" | "green";
  onClick?: () => void;
  hoverEffect?: boolean;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glowColor = "neutral",
  onClick,
  hoverEffect = true,
  id
}) => {
  const getGlowStyles = () => {
    switch (glowColor) {
      case "blue":
        return "shadow-[0_0_25px_rgba(14,165,233,0.18)] hover:shadow-[0_0_35px_rgba(14,165,233,0.3)] border-sky-500/20";
      case "purple":
        // Alternate deep ocean twilight blue glow
        return "shadow-[0_0_25px_rgba(56,189,248,0.12)] hover:shadow-[0_0_35px_rgba(56,189,248,0.22)] border-sky-500/15";
      case "green":
        return "shadow-[0_0_25px_rgba(20,184,166,0.2)] hover:shadow-[0_0_35px_rgba(20,184,166,0.3)] border-teal-500/20";
      default:
        return "shadow-[0_12px_40px_0_rgba(0,0,0,0.8)] border-zinc-800/80";
    }
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverEffect && onClick ? { scale: 1.01, y: -2 } : {}}
      onClick={onClick}
      className={`
        relative backdrop-blur-xl bg-zinc-950/25 border rounded-2xl p-6 overflow-hidden
        transition-all duration-300 ease-out
        ${getGlowStyles()}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {/* Premium ambient light reflections */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/0 pointer-events-none" />
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      
      {/* Active content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </motion.div>
  );
};
