import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface HoloCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  key?: React.Key;
}

export function HoloCard({ children, className = "", intensity = 15, ...props }: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on cursor distance from center
    const rx = ((y - centerY) / centerY) * -intensity;
    const ry = ((x - centerX) / centerX) * intensity;
    
    setRotateX(rx);
    setRotateY(ry);
    
    // Calculate glare position
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <div className="perspective-container group w-full h-full">
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
        className={`relative glass-panel-deep rounded-2xl overflow-hidden preserve-3d transition-shadow duration-300 ${className}`}
        style={
          {
            "--mouse-x": `${glarePosition.x}%`,
            "--mouse-y": `${glarePosition.y}%`,
          } as React.CSSProperties
        }
      >
        <div className="holo-glare transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
        <div className="holo-mesh" />
        
        {/* Inner content layer floated forward slightly for true 3D pop */}
        <div className="relative z-20 w-full h-full preserve-3d" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
