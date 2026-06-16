import React, { useState } from 'react';
import { Send, Lock, Image as ImageIcon, Mic, Unlock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock types
interface Message {
  id: string;
  senderId: string;
  content: string | null;
  mediaUrl: string | null;
  isLocked: boolean;
  price: number;
  isPaid: boolean;
  createdAt: string;
}

export const MessagesView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedThread, setSelectedThread] = useState<string>('creator_1');
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  const currentUserId = 'user_123'; // Mock

  // Mock Data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: 'creator_1',
      content: 'Hey thanks for subscribing! Here is a special behind the scenes photo just for you ❤️',
      mediaUrl: null,
      isLocked: false,
      price: 0,
      isPaid: true,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'm2',
      senderId: 'creator_1',
      content: null,
      mediaUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      isLocked: true,
      price: 15.00,
      isPaid: false,
      createdAt: new Date(Date.now() - 3500000).toISOString()
    }
  ]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      senderId: currentUserId,
      content: inputText,
      mediaUrl: null,
      isLocked: false,
      price: 0,
      isPaid: true,
      createdAt: new Date().toISOString()
    };
    
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const handleUnlock = (msgId: string, price: number) => {
    setUnlockingId(msgId);
    
    // Simulate backend payment / unlock request
    setTimeout(() => {
      setMessages(messages.map(m => m.id === msgId ? { ...m, isLocked: false, isPaid: true } : m));
      setUnlockingId(null);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-black max-w-6xl mx-auto rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl mt-4">
      {/* Sidebar - Conversation List */}
      <div className="w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* Mock Conversation Item */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 cursor-pointer border border-zinc-800">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Creator" className="w-12 h-12 rounded-full object-cover border-2 border-pink-500" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
            </div>
            <div>
              <div className="text-white font-bold text-sm">@foxxangel1</div>
              <div className="text-zinc-400 text-xs truncate w-40">Sent a locked message</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black">
        {/* Chat Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Creator" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-white font-bold">Foxx Angel</div>
              <div className="text-green-500 text-xs font-medium">Online now</div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => {
            const isMe = msg.senderId === currentUserId;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                  
                  {/* Text Content */}
                  {msg.content && (
                    <div className={`p-4 rounded-2xl ${
                      isMe 
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-tr-sm' 
                        : 'bg-zinc-900 text-zinc-100 rounded-tl-sm border border-zinc-800'
                    }`}>
                      {msg.content}
                    </div>
                  )}

                  {/* PPV / Locked Media Content */}
                  {msg.mediaUrl && (
                    <div className={`relative mt-2 rounded-2xl overflow-hidden border border-zinc-800 ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'} max-w-sm`}>
                      {msg.isLocked ? (
                        // Locked State
                        <div className="relative aspect-square bg-zinc-900 overflow-hidden group">
                          {/* Strongly blurred background */}
                          <div 
                            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                            style={{ backgroundImage: `url(${msg.mediaUrl})` }}
                          />
                          <div className="absolute inset-0 bg-black/50" />
                          
                          {/* Unlock UI */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                            <div className="w-16 h-16 bg-pink-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                              <Lock className="w-8 h-8 text-pink-500" />
                            </div>
                            <div className="text-white font-bold text-lg mb-1">Locked Content</div>
                            <div className="text-zinc-400 text-sm mb-6">Pay to unlock this photo</div>
                            
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleUnlock(msg.id, msg.price)}
                              disabled={unlockingId === msg.id}
                              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                              {unlockingId === msg.id ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              ) : (
                                <>
                                  <Unlock className="w-4 h-4" />
                                  Unlock for ${msg.price.toFixed(2)}
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        // Unlocked State
                        <div className="relative">
                          <img src={msg.mediaUrl} alt="Unlocked media" className="w-full h-auto object-cover" />
                          {!isMe && msg.price > 0 && (
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-xs font-bold text-white">Purchased</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`text-[10px] text-zinc-600 mt-1.5 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
          <div className="flex items-end gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-zinc-700 transition-colors">
            <button className="p-3 text-zinc-400 hover:text-pink-500 transition-colors rounded-xl hover:bg-zinc-800">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button className="p-3 text-zinc-400 hover:text-pink-500 transition-colors rounded-xl hover:bg-zinc-800">
              <Mic className="w-5 h-5" />
            </button>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white resize-none max-h-32 min-h-[44px] py-3 placeholder:text-zinc-600"
              rows={1}
            />
            
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={`p-3 rounded-xl transition-all ${
                inputText.trim() 
                  ? 'bg-pink-600 text-white shadow-lg hover:bg-pink-500' 
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
