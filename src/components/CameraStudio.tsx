import React, { useRef, useState, useEffect } from 'react';
import { Camera, Video, Mic, MicOff, Settings, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface CameraStudioProps {
  onStartLive: (stream: MediaStream) => void;
}

export const CameraStudio: React.FC<CameraStudioProps> = ({ onStartLive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      // Cleanup stream tracks on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error("Camera permission denied", error);
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleGoLive = () => {
    if (stream) {
      onStartLive(stream);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl aspect-[9/16] border border-zinc-800">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
        <button className="p-3 rounded-full bg-zinc-900/50 backdrop-blur-md text-white hover:bg-zinc-800/50 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={toggleCamera}
          className="p-3 rounded-full bg-zinc-900/50 backdrop-blur-md text-white hover:bg-zinc-800/50 transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Controls Overlay */}
      <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleMic}
            className={`p-4 rounded-full backdrop-blur-md transition-colors ${
              isMicMuted ? 'bg-red-500/20 text-red-500' : 'bg-zinc-900/50 text-white'
            }`}
          >
            {isMicMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <button className="p-4 rounded-full bg-zinc-900/50 backdrop-blur-md text-white">
            <Camera className="w-6 h-6" />
          </button>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoLive}
          className="w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
        >
          <span className="flex items-center justify-center gap-2">
            <Video className="w-5 h-5" />
            Go Live
          </span>
        </motion.button>
      </div>
    </div>
  );
};
