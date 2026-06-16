import React, { useEffect, useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';

interface LiveRoomProps {
  roomName: string;
  participantName: string;
  isCreator: boolean;
  onLeave: () => void;
}

export const LiveRoom: React.FC<LiveRoomProps> = ({ roomName, participantName, isCreator, onLeave }) => {
  const [token, setToken] = useState<string | null>(null);
  
  // Use VITE_LIVEKIT_URL from environment variables, fallback for safety
  const liveKitUrl = import.meta.env.VITE_LIVEKIT_URL || 'wss://your-project.livekit.cloud';

  useEffect(() => {
    // Fetch token from our FastAPI backend
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/live/token?room_name=${roomName}&participant_name=${participantName}&is_creator=${isCreator}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Failed to fetch LiveKit token", error);
      }
    };

    fetchToken();
  }, [roomName, participantName, isCreator]);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950 text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-pink-500 border-zinc-800 rounded-full animate-spin mb-4"></div>
          Connecting to LiveKit...
        </div>
      </div>
    );
  }

  return (
    <div className="h-[80vh] w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 relative shadow-2xl">
      <LiveKitRoom
        video={isCreator} // Creators auto-publish video
        audio={isCreator} // Creators auto-publish audio
        token={token}
        serverUrl={liveKitUrl}
        onDisconnected={onLeave}
        // Use the default VideoConference UI provided by LiveKit
        // In a production app, we would build a custom TikTok-style overlay
        data-lk-theme="default"
        style={{ height: '100%' }}
      >
        <VideoConference />
        <RoomAudioRenderer />
        
        {/* Custom Overlay Logic could go here (Tips, Chat, Viewer Count) */}
        <div className="absolute top-4 left-4 bg-red-500/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          LIVE
        </div>
      </LiveKitRoom>
    </div>
  );
};
