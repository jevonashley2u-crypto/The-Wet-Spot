export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  bio: string;
  subscribersCount: number;
  rating: number;
  tags: string[];
  subscriptionPrice: number;
  tiers: SubscriptionTier[];
  isLive?: boolean;
  liveViewers?: number;
  monthlyEarnings?: number;
  momentumScore?: number;
  streakCount?: number;
  referralCode?: string;
  ambassadorLevel?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  popular?: boolean;
}

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  hasLiked?: boolean;
  isPremium?: boolean;
  unlockPrice?: number;
  isUnlocked?: boolean;
  timeAgo: string;
  comments?: Comment[];
  momentumScore?: number;
  isTrending?: boolean;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  timeAgo: string;
}

export interface Product {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  price: number;
  image: string;
  category: "preset" | "course" | "video" | "audio" | "photo";
  rating: number;
  downloads: number;
  description: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isFromMe: boolean;
  mediaUrl?: string;
  isLocked?: boolean;
  unlockPrice?: number;
  isUnlocked?: boolean;
}

export interface ChatThread {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}

export interface NotificationItem {
  id: string;
  type: "sub" | "tip" | "unlock" | "live" | "system";
  title: string;
  description: string;
  timeAgo: string;
  amount?: number;
  read: boolean;
}

export interface CreatorGoal {
  title: string;
  current: number;
  target: number;
  unit: string;
}

export interface SocialProofEvent {
  id: string;
  userAvatar: string;
  actionText: string;
  timeAgo: string;
  type: "purchase" | "subscribe" | "tip" | "join";
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
  dailyStreak: number;
  watchStreak: number;
  engagementStreak: number;
}
