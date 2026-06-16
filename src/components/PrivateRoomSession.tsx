import React, { useState, useEffect } from 'react';
import { Timer, StopCircle, User } from 'lucide-react';
import { LiveRoom } from './LiveRoom';

interface PrivateRoomSessionProps {
  roomName: string;
  participantName: string;
  isCreator: boolean;
  pricePerMinute: number;
  onEndSession: () => void;
}

export const PrivateRoomSession: React.FC<PrivateRoomSessionProps> = ({
  roomName,
  participantName,
  isCreator,
  pricePerMinute,
  onEndSession
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const currentCost = ((secondsElapsed / 60) * pricePerMinute).toFixed(2);

  const handleEnd = () => {
    // TODO: Send backend API call to finalize Stripe capture for `currentCost`
    onEndSession();
  };

  return (
    <div className="w-full h-[85vh] bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden relative flex flex-col">
      {/* Session Header overlaying the video */}
      <div className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-full font-mono text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            PRIVATE REC
          </div>
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white font-mono text-sm">
            <Timer className="w-4 h-4 text-zinc-400" />
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {!isCreator && (
            <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-right">
              <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Current Cost</div>
              <div className="text-xl font-bold text-pink-500">${currentCost}</div>
            </div>
          )}
          <button 
            onClick={handleEnd}
            className="mt-2 flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg"
          >
            <StopCircle className="w-5 h-5" />
            End Session
          </button>
        </div>
      </div>

      {/* The LiveKit Room handles the actual WebRTC rendering */}
      <div className="flex-1 w-full bg-black">
        <LiveRoom 
          roomName={roomName}
          participantName={participantName}
          isCreator={isCreator}
          onLeave={onEndSession}
        />
      </div>
    </div>
  );
};
