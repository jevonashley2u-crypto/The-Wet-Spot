import React from "react";
import { motion } from "motion/react";

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "blue" | "purple" | "ghost" | "danger" | "glass" | "white" | "teal";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  id?: string;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  variant = "teal",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  id
}) => {
  const getVariantStyles = () => {
    if (disabled) {
      return "bg-zinc-800 text-zinc-500 border-zinc-700 pointer-events-none opacity-50";
    }

    switch (variant) {
      case "purple":
      case "blue":
        return "bg-sky-500 hover:bg-sky-400 text-white border-sky-400/20 shadow-[0_0_15px_rgba(14,165,233,0.35)] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]";
      case "white":
        return "bg-white hover:bg-sky-50 text-black border-transparent font-medium shadow-[0_0_20px_rgba(14,165,233,0.3)]";
      case "ghost":
        return "bg-transparent hover:bg-sky-950/20 text-sky-200 hover:text-sky-300 border-zinc-800 hover:border-sky-900/30";
      case "danger":
        return "bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/20";
      case "glass":
        return "bg-sky-950/10 hover:bg-sky-950/25 text-white border-white/5 hover:border-sky-500/15 backdrop-blur-md";
      case "teal":
      default:
        return "bg-teal-600 hover:bg-teal-500 text-white border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.35)] hover:shadow-[0_0_25px_rgba(20,184,166,0.6)]";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-xs px-3 py-1.5 rounded-lg";
      case "lg":
        return "text-base px-6 py-3 rounded-2xl font-medium tracking-wide";
      case "md":
      default:
        return "text-sm px-4.5 py-2.5 rounded-xl";
    }
  };

  return (
    <motion.button
      id={id}
      type={type}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.96 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center border font-sans font-medium text-center transition-all duration-300 ease-out cursor-pointer
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};
