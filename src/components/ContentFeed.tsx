import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, DollarSign, Lock, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

// Mock Data
const FEED_ITEMS = [
  {
    id: 'f1',
    creator: { handle: 'foxxangel1', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', isVerified: true },
    videoUrl: 'https://cdn.coverr.co/videos/coverr-skateboarding-on-the-street-2679/1080p.mp4',
    caption: 'Sunset vibes at the park ✨ #skate #sunset',
    likes: '124K',
    comments: '1,204',
    shares: '45K',
    isLocked: false
  },
  {
    id: 'f2',
    creator: { handle: 'elite2', avatar: 'https://i.pravatar.cc/150?u=b042581f4e29026704d', isVerified: false },
    videoUrl: 'https://cdn.coverr.co/videos/coverr-surfing-in-the-ocean-1563/1080p.mp4',
    caption: 'Exclusive beach shoot behind the scenes! 🌊',
    likes: '89K',
    comments: '402',
    shares: '12K',
    isLocked: true,
    price: 15.00
  }
];

export const ContentFeed: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState('f1');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [posts, setPosts] = useState<any[]>(FEED_ITEMS);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          creator:creators(id, tier, is_verified, users(username, full_name))
        `)
        .eq('post_type', 'video')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        // Map Supabase data to our UI format
        const formattedPosts = data.map(p => ({
          id: p.id,
          creator: {
            handle: p.creator?.users?.username || 'creator',
            avatar: 'https://i.pravatar.cc/150', // Mock avatar for now
            isVerified: p.creator?.is_verified
          },
          videoUrl: p.media_url,
          caption: p.caption,
          likes: p.likes_count?.toString() || '0',
          comments: p.comments_count?.toString() || '0',
          shares: '0',
          isLocked: p.is_locked,
          price: p.price
        }));
        setPosts(formattedPosts);
        if (formattedPosts.length > 0) setActiveVideo(formattedPosts[0].id);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative max-w-md mx-auto rounded-3xl border border-zinc-800 shadow-2xl mt-4">
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full z-20 p-6 flex justify-center gap-6 bg-gradient-to-b from-black/80 to-transparent">
        <button className="text-white font-bold text-lg drop-shadow-md relative">
          Following
        </button>
        <button className="text-zinc-400 font-bold text-lg drop-shadow-md">
          Discover
        </button>
      </div>

      {posts.map((item) => (
        <div key={item.id} className="relative w-full h-full snap-start snap-always bg-zinc-900 overflow-hidden">
          
          {/* Video / Background */}
          {item.isLocked ? (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80)` }}
              />
              <div className="absolute inset-0 bg-black/60" />
              
              <div className="relative z-10 flex flex-col items-center p-6 text-center">
                <div className="w-20 h-20 bg-pink-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-pink-500/50 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                  <Lock className="w-10 h-10 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium Video</h3>
                <p className="text-zinc-400 mb-8 max-w-xs">Subscribe to @{item.creator.handle} to unlock this exclusive content.</p>
                
                <button className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-transform hover:scale-105 active:scale-95">
                  Unlock for ${item.price?.toFixed(2)}
                </button>
              </div>
            </div>
          ) : (
            <video 
              src={item.videoUrl}
              className="w-full h-full object-cover"
              loop
              muted
              autoPlay={activeVideo === item.id}
            />
          )}

          {/* Overlays (Only if unlocked or partial locked) */}
          {!item.isLocked && (
            <>
              {/* Bottom Info Area */}
              <div className="absolute bottom-0 left-0 w-full p-6 pb-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10">
                <div className="flex items-center gap-3 mb-3">
                  <img src={item.creator.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover" />
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-1">
                      @{item.creator.handle}
                      {item.creator.isVerified && <span className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-[10px]">✓</span>}
                    </h3>
                  </div>
                </div>
                <p className="text-white/90 text-sm">{item.caption}</p>
              </div>

              {/* Right Sidebar Controls */}
              <div className="absolute bottom-24 right-4 flex flex-col gap-6 z-10 items-center">
                
                {/* Avatar with Follow button */}
                <div className="relative mb-4 cursor-pointer">
                  <img src={item.creator.avatar} className="w-12 h-12 rounded-full border border-white" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                    +
                  </div>
                </div>

                {/* Like */}
                <button 
                  onClick={() => setLiked({ ...liked, [item.id]: !liked[item.id] })}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
                    <Heart className={`w-6 h-6 ${liked[item.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-xs font-bold drop-shadow-md">{item.likes}</span>
                </button>

                {/* Comment */}
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-bold drop-shadow-md">{item.comments}</span>
                </button>

                {/* Tip */}
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-pink-500/80 backdrop-blur-md flex items-center justify-center group-hover:bg-pink-500 transition-colors border border-pink-400">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-bold drop-shadow-md">Tip</span>
                </button>

                {/* Share */}
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-bold drop-shadow-md">{item.shares}</span>
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
