import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, MapPin, Link as LinkIcon, 
  Lock, Star, DollarSign, Video, Image as ImageIcon, CheckCircle, Pin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

// Mock Data
const MOCK_CREATOR = {
  id: 'creator_1',
  handle: 'foxxangel1',
  name: 'Foxx Angel',
  bio: 'Just a creative soul sharing my digital diary ✨ NYC based. Fashion, lifestyle, and exclusive BTS.',
  location: 'New York, NY',
  socialLink: 'instagram.com/foxxangel1',
  avatarUrl: 'https://i.pravatar.cc/300?u=a042581f4e29026704d',
  bannerUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
  stats: {
    subscribers: '12.4K',
    likes: '450K',
    tips: '$8.2K'
  },
  isVerified: true
};

const MOCK_POSTS = [
  { id: 'p1', type: 'video', isPinned: true, isLocked: false, thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80', likes: '12K', comments: 342 },
  { id: 'p2', type: 'image', isPinned: false, isLocked: true, price: 5.00, thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80', likes: '4K', comments: 112 },
  { id: 'p3', type: 'image', isPinned: false, isLocked: true, price: 10.00, thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', likes: '8K', comments: 201 },
  { id: 'p4', type: 'video', isPinned: false, isLocked: false, thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=600&q=80', likes: '1.2K', comments: 45 },
  { id: 'p5', type: 'image', isPinned: false, isLocked: false, thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', likes: '5.5K', comments: 89 },
  { id: 'p6', type: 'video', isPinned: false, isLocked: true, price: 15.00, thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80', likes: '15K', comments: 900 },
];

export const CreatorProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const [creator, setCreator] = useState<any>(MOCK_CREATOR);
  const [posts, setPosts] = useState<any[]>(MOCK_POSTS);

  React.useEffect(() => {
    const fetchProfile = async () => {
      // 1. Fetch Creator Profile
      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .select('*, users(username, full_name, avatar_url)')
        .limit(1)
        .single();
        
      if (creatorData) {
        setCreator({
          id: creatorData.id,
          handle: creatorData.users?.username || MOCK_CREATOR.handle,
          name: creatorData.users?.full_name || MOCK_CREATOR.name,
          bio: creatorData.bio || MOCK_CREATOR.bio,
          location: MOCK_CREATOR.location,
          socialLink: MOCK_CREATOR.socialLink,
          avatarUrl: creatorData.users?.avatar_url || MOCK_CREATOR.avatarUrl,
          bannerUrl: MOCK_CREATOR.bannerUrl,
          stats: {
            subscribers: creatorData.subscribers_count?.toString() || '0',
            likes: '0',
            tips: '$0'
          },
          isVerified: creatorData.is_verified || false
        });
      }

      // 2. Fetch Creator Posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsData && postsData.length > 0) {
        setPosts(postsData.map(p => ({
          id: p.id,
          type: p.post_type,
          isPinned: p.is_pinned,
          isLocked: p.is_locked,
          price: p.price,
          thumbnail: p.media_url,
          likes: p.likes_count?.toString() || '0',
          comments: p.comments_count?.toString() || '0'
        })));
      }
    };
    fetchProfile();
  }, []);

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'unlocked') return !post.isLocked;
    if (activeTab === 'locked') return post.isLocked;
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-black pb-24">
      {/* Banner */}
      <div className="relative w-full h-64 md:h-80 bg-zinc-900">
        <img src={creator.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Profile Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative inline-block">
              <img 
                src={creator.avatarUrl} 
                alt={creator.handle} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-black shadow-2xl"
              />
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-black rounded-full" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">{creator.name}</h1>
                {creator.isVerified && (
                  <CheckCircle className="w-6 h-6 text-pink-500 fill-pink-500/20" />
                )}
              </div>
              <p className="text-zinc-400 font-medium">@{creator.handle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl font-bold tracking-wide transition-colors flex items-center justify-center gap-2">
              <Star className="w-5 h-5" /> Follow Free
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                isSubscribed 
                  ? 'bg-zinc-800 text-white border border-zinc-700' 
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-500/25'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe $9.99/mo'}
            </motion.button>
            <button className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-pink-500 rounded-xl transition-colors">
              <DollarSign className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bio and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <p className="text-zinc-200 text-lg leading-relaxed">
              {creator.bio}
            </p>
            <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-pink-500" />
                {creator.location}
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-pink-500 transition-colors">
                <LinkIcon className="w-4 h-4 text-pink-500" />
                {creator.socialLink}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start md:justify-end gap-6 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/50">
            <div className="text-center">
              <div className="text-2xl font-black text-white">{creator.stats.subscribers}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Fans</div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-center">
              <div className="text-2xl font-black text-white">{creator.stats.likes}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Likes</div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-center">
              <div className="text-2xl font-black text-pink-500">{creator.stats.tips}</div>
              <div className="text-xs text-pink-500/70 uppercase tracking-wider mt-1">Tips</div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex items-center gap-6 border-b border-zinc-800 mb-8">
          {['all', 'unlocked', 'locked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === tab ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={post.id} 
                className="relative aspect-[4/5] bg-zinc-900 rounded-xl overflow-hidden group cursor-pointer"
              >
                {/* Background Image with blur if locked */}
                <img 
                  src={post.thumbnail} 
                  alt="Post thumbnail" 
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${post.isLocked ? 'blur-xl opacity-60 scale-110' : ''}`}
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Top Right Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {post.isPinned && (
                    <div className="bg-pink-500/90 backdrop-blur-md p-1.5 rounded-full text-white shadow-lg">
                      <Pin className="w-4 h-4" />
                    </div>
                  )}
                  {post.type === 'video' ? (
                    <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white">
                      <Video className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Locked State Overlay */}
                {post.isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 bg-zinc-900/80 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border border-zinc-700">
                      <Lock className="w-5 h-5 text-zinc-300" />
                    </div>
                    <button className="px-6 py-2.5 bg-white text-black font-bold rounded-full text-sm shadow-xl hover:bg-zinc-200 transition-colors">
                      Unlock ${post.price?.toFixed(2)}
                    </button>
                  </div>
                )}

                {/* Bottom Stats (Visible on hover or mobile) */}
                <div className="absolute bottom-0 left-0 w-full p-4 flex items-center justify-between opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-4 text-white font-medium text-sm">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
