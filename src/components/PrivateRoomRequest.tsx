import React, { useState } from 'react';
import { Video, Clock, CreditCard, CheckCircle2, X } from 'lucide-react';
import { motion } from 'motion/react';

interface PrivateRoomRequestProps {
  creatorName: string;
  pricePerMinute: number;
  onClose: () => void;
  onRequestSent: () => void;
}

export const PrivateRoomRequest: React.FC<PrivateRoomRequestProps> = ({ 
  creatorName, 
  pricePerMinute, 
  onClose,
  onRequestSent 
}) => {
  const [requestedMinutes, setRequestedMinutes] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalEstimatedCost = requestedMinutes * pricePerMinute;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Connect to backend to place authorization hold on Stripe card
    // and insert row into private_rooms table.
    setTimeout(() => {
      setIsSubmitting(false);
      onRequestSent();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20">
            <Video className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Private Session</h2>
          <p className="text-zinc-400 mb-8">Request a 1-on-1 private video room with <span className="text-white font-medium">@{creatorName}</span>.</p>

          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-300">
                <Clock className="w-5 h-5 text-pink-500" />
                <span>Requested Duration</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setRequestedMinutes(Math.max(5, requestedMinutes - 5))}
                  className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700"
                >
                  -
                </button>
                <span className="text-xl font-bold text-white w-12 text-center">{requestedMinutes}m</span>
                <button 
                  onClick={() => setRequestedMinutes(Math.min(60, requestedMinutes + 5))}
                  className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-3">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Rate per minute</span>
                <span>${pricePerMinute.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg border-t border-zinc-800 pt-3">
                <span>Estimated Total</span>
                <span className="text-pink-500">${totalEstimatedCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-950/30 border border-blue-900/50 rounded-2xl">
              <CreditCard className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200/70 leading-relaxed">
                A temporary hold of ${totalEstimatedCost.toFixed(2)} will be placed on your card. You will only be charged for the exact minutes the session lasts.
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full mt-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(219,39,119,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Send Request
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
