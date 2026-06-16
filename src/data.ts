import { Creator, Post, Product, ChatThread, NotificationItem, CreatorGoal, SocialProofEvent, UserStats } from "./types";

export const mockCreators: Creator[] = [
  {
    id: "c1",
    name: "Aura Vibe",
    handle: "auravibe",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    bio: "Multi-disciplinary physical artist and premium ambient audio producer. Helping you find flow states & custom aesthetic presets.",
    subscribersCount: 14200,
    rating: 4.9,
    tags: ["Ambient Beats", "Photo Presets", "Flow State", "Live Q&A"],
    subscriptionPrice: 15.0,
    isLive: true,
    liveViewers: 842,
    monthlyEarnings: 31250,
    momentumScore: 98,
    streakCount: 14,
    referralCode: "AURA-VIP",
    ambassadorLevel: "Diamond",
    tiers: [
      {
        id: "t1-1",
        name: "Standard VIP",
        price: 15.00,
        benefits: [
          "Access to daily exclusive BTS feed",
          "Unlock 10+ standard Lightroom presets",
          "Priority in general live stream chat",
          "Weekly exclusive audio download"
        ]
      },
      {
        id: "t1-2",
        name: "Platinum Access",
        price: 39.00,
        benefits: [
          "Everything in VIP Access",
          "Unlock ALL master presets and production packs",
          "Access to private 1-on-1 monthly streaming event",
          "Custom audio sample request once a month"
        ],
        popular: true
      },
      {
        id: "t1-3",
        name: "Ultimate Backstage",
        price: 99.00,
        benefits: [
          "Everything in Platinum Access",
          "Direct DM responses prioritized within 24 hours",
          "Special 'Co-Producer' credit on major audio launches",
          "Monthly collectible digital goods delivered directly to your wallet"
        ]
      }
    ]
  },
  {
    id: "c2",
    name: "Kaelen Tech FX",
    handle: "kaelentech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    banner: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=600",
    bio: "Creating immersive 3D shaders, visual templates, and digital artifacts for forward-thinking developers and visual artists.",
    subscribersCount: 8900,
    rating: 4.8,
    tags: ["3D Shaders", "Blender Modifiers", "Live Design", "UI Kits"],
    subscriptionPrice: 8.99,
    isLive: false,
    monthlyEarnings: 15400,
    momentumScore: 72,
    streakCount: 3,
    referralCode: "KAELEN-3D",
    ambassadorLevel: "Gold",
    tiers: [
      {
        id: "t2-1",
        name: "Digital Hobbyist",
        price: 8.99,
        benefits: [
          "Access to weekly shader tutorials",
          "Monthly open-source Blender setup downloads",
          "Monthly interactive build webinars"
        ]
      },
      {
        id: "t2-2",
        name: "Professional Studio",
        price: 24.99,
        benefits: [
          "Everything in Hobbyist tier",
          "Commercial license for ALL assets & Blender Modifiers",
          "Uncensored access to full project source code repositories",
          "Behind-the-scenes alpha launches & dev logs"
        ],
        popular: true
      }
    ]
  },
  {
    id: "c3",
    name: "Luna Noir",
    handle: "lunanoir",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    banner: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600",
    bio: "Late-night cyber-noir music producer & ASMR modular synth sculptor. Designing audio journeys for code marathons.",
    subscribersCount: 22400,
    rating: 4.95,
    tags: ["Modular Synth", "Cyber Noir", "FL Studio Packs", "Exclusive Sets"],
    subscriptionPrice: 19.99,
    isLive: true,
    liveViewers: 1240,
    monthlyEarnings: 51200,
    momentumScore: 99,
    streakCount: 42,
    referralCode: "NOIR-SYS",
    ambassadorLevel: "Diamond",
    tiers: [
      {
        id: "t3-1",
        name: "Silver Listener",
        price: 19.99,
        benefits: [
          "Interactive monthly modular synth streams",
          "Direct audio downloads of all sets (FLAC quality)",
          "Member role in our exclusive cyber Discord"
        ],
        popular: true
      },
      {
        id: "t3-2",
        name: "Gold Synthesist",
        price: 49.99,
        benefits: [
          "Everything in Silver Listener",
          "Unlock raw STEM files of all tracks for remixing",
          "Guaranteed requests answered on our modular live streams",
          "Monthly exclusive vinyl giveaway entry"
        ]
      }
    ]
  },
  {
    id: "c4",
    name: "Zephyr Peak Athletics",
    handle: "zephyrpeak",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    banner: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
    bio: "High-performance human analytics. Offering hyper-focused physical workout blueprints, biometric deep dives, and macro calculators.",
    subscribersCount: 5400,
    rating: 4.7,
    tags: ["Athletics", "Biohacking", "Custom Planners", "Interactive Video"],
    subscriptionPrice: 12.50,
    isLive: false,
    monthlyEarnings: 9300,
    momentumScore: 85,
    streakCount: 12,
    referralCode: "ZEPHYR-FIT",
    ambassadorLevel: "Platinum",
    tiers: [
      {
        id: "t4-1",
        name: "Performance Plan",
        price: 12.50,
        benefits: [
          "Monthly adaptive training sheets",
          "Exclusive video tutorials demonstrating biomechanics",
          "Nutrition macros helper blueprint"
        ],
        popular: true
      }
    ]
  }
];

export const mockFeed: Post[] = [
  {
    id: "f1",
    creatorId: "c1",
    creatorName: "Aura Vibe",
    creatorHandle: "auravibe",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    content: "Just uploaded the official Summer Dream preset pack. It adds ambient warmth and retro grain to low-contrast golden hour photography. Let me know what you think under this post! ✨ Here is a sneak preview:",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600",
    likes: 1240,
    commentsCount: 84,
    hasLiked: true,
    timeAgo: "2 hours ago",
    momentumScore: 95,
    isTrending: true,
    comments: [
      {
        id: "co1",
        userName: "CryptoKev",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        text: "Just downloaded this, the color grading looks incredible! Absolute game changer.",
        timeAgo: "1 hour ago"
      },
      {
        id: "co2",
        userName: "Sara_Visuals",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
        text: "Using these preset values in Photoshop, the dynamic range levels are outstanding.",
        timeAgo: "45 mins ago"
      }
    ]
  },
  {
    id: "f2",
    creatorId: "c3",
    creatorName: "Luna Noir",
    creatorHandle: "lunanoir",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    content: "🔒 MYSTERY AUDIO EXCLUSIVE: I designed an 8-minute modular synth flow explicitly programmed to sync your brainwave frequencies for intense coding focus. Subscribing to any tier unlocks this and 50+ other tracks instantly.",
    likes: 4522,
    commentsCount: 203,
    isPremium: true,
    unlockPrice: 9.99,
    isUnlocked: false,
    timeAgo: "1 day ago",
    momentumScore: 88,
    isTrending: true,
    comments: []
  },
  {
    id: "f3",
    creatorId: "c2",
    creatorName: "Kaelen Tech FX",
    creatorHandle: "kaelentech",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    content: "Blender rendering secret: If your volume scatter shaders look noisy, bypass the standard light-path integrations and use my vector custom modifiers. Free download available in my dashboard marketplace for all subscribers!",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=600",
    likes: 830,
    commentsCount: 41,
    hasLiked: false,
    timeAgo: "2 days ago",
    comments: []
  },
  {
    id: "f4",
    creatorId: "c1",
    creatorName: "Aura Vibe",
    creatorHandle: "auravibe",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    content: "🔒 Behind-the-scenes video from our latest desert photography journey. Unlock this preview to see the setup gear & high-end lighting techniques we used to capture those rare dunes.",
    likes: 312,
    commentsCount: 18,
    isPremium: true,
    unlockPrice: 5.00,
    isUnlocked: false,
    timeAgo: "3 days ago"
  }
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    title: "Celestial Wave Preset Master Pack",
    creatorName: "Aura Vibe",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    price: 29.00,
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=400",
    category: "preset",
    rating: 4.9,
    downloads: 1240,
    description: "Includes 12 signature Lightroom presets fine-tuned for high contrast nighttime landscapes, cyber neon scenes, and vaporwave color grading."
  },
  {
    id: "p2",
    title: "Interactive WebGL Glassmorphic Shader Kit",
    creatorName: "Kaelen Tech FX",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400",
    category: "course",
    rating: 4.85,
    downloads: 720,
    description: "Production ready WebGL / Three.js templates. Build responsive glass cards that refract live canvas elements with Apple-level performance."
  },
  {
    id: "p3",
    title: "Cyber Noir Modular Synth STEMS & MIDI Packs",
    creatorName: "Luna Noir",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400",
    category: "audio",
    rating: 4.97,
    downloads: 1890,
    description: "2.4 GB of uncompressed WAV files, MIDI tracks, and instrument presets tailored for cyber synthwave & ambient programming tracks."
  },
  {
    id: "p4",
    title: "12-Week Biohacking Macro & Planner Sheet",
    creatorName: "Zephyr Peak Athletics",
    creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    price: 19.00,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
    category: "preset",
    rating: 4.65,
    downloads: 430,
    description: "An adaptive metabolic calculator loaded directly in Google Sheets. Automatically scales protein, carbohydrate, and lipid limits based on continuous heart rate and dynamic strain charts."
  }
];

export const mockChatThreads: ChatThread[] = [
  {
    id: "t1",
    creatorName: "Aura Vibe",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    creatorHandle: "auravibe",
    lastMessage: "Let me check on those raw files for you!",
    unreadCount: 2,
    messages: [
      {
        id: "m1_1",
        senderId: "u",
        senderName: "Me",
        senderAvatar: "",
        text: "Hey Aura! Really loved your latest synth soundscape. What oscillators did you use?",
        timestamp: "10:24 AM",
        isFromMe: true
      },
      {
        id: "m1_2",
        senderId: "c1",
        senderName: "Aura Vibe",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        text: "Thank you so much! I actually used a dual analog sawtooth model coupled with a lowpass ladder filter.",
        timestamp: "10:28 AM",
        isFromMe: false
      },
      {
        id: "m1_3",
        senderId: "c1",
        senderName: "Aura Vibe",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        text: "🔒 Custom filter settings (.png mockup file with my physical synth configurations)",
        timestamp: "10:29 AM",
        isFromMe: false,
        isLocked: true,
        unlockPrice: 5.00,
        isUnlocked: false
      },
      {
        id: "m1_4",
        senderId: "c1",
        senderName: "Aura Vibe",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        text: "Let me check on those raw files for you!",
        timestamp: "10:30 AM",
        isFromMe: false
      }
    ]
  },
  {
    id: "t2",
    creatorName: "Luna Noir",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    creatorHandle: "lunanoir",
    lastMessage: "Unlock the exclusive track elements anytime!",
    unreadCount: 0,
    messages: [
      {
        id: "m2_1",
        senderId: "c3",
        senderName: "Luna Noir",
        senderAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
        text: "Welcome to the Silver tier! Check your notifications for the cyber discord join invitation! 🛸",
        timestamp: "Yesterday",
        isFromMe: false
      },
      {
        id: "m2_2",
        senderId: "u",
        senderName: "Me",
        senderAvatar: "",
        text: "So hyped to be here! Can't wait for the live synth flow tomorrow afternoon.",
        timestamp: "Yesterday",
        isFromMe: true
      }
    ]
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "live",
    title: "Luna Noir went LIVE!",
    description: "⚡ Late-Night Cyber Modular Synthesizers are flowing right now! Tap to tune in.",
    timeAgo: "Just now",
    read: false
  },
  {
    id: "n2",
    type: "tip",
    title: "Tipping Match Triggered",
    description: "An anonymous fan just tipped Kaelen Tech $50.00! Global multiplier is ACTIVE.",
    timeAgo: "15 mins ago",
    amount: 50.00,
    read: false
  },
  {
    id: "n3",
    type: "sub",
    title: "New Premium Subscriber!",
    description: "User @cyber_fanatic has subscribed to your Ultimate Backstage tier ($99/mo).",
    timeAgo: "2 hours ago",
    read: true
  },
  {
    id: "n4",
    type: "unlock",
    title: "Premium Post unlocked!",
    description: "Your post 'Mystery Audio Focus flow' was unlocked for $9.99.",
    timeAgo: "5 hours ago",
    amount: 9.99,
    read: true
  },
  {
    id: "n5",
    type: "system",
    title: "Payout Completed Successfully",
    description: "Your weekly wallet withdrawal of $3,450.00 has cleared to your external Stripe bank link.",
    timeAgo: "1 day ago",
    read: true
  }
];

export const mockGoals: CreatorGoal[] = [
  { title: "Monthly Subscription Recurring Revenue", current: 31250, target: 50000, unit: "$" },
  { title: "Active Super Fan Community Members", current: 14200, target: 20000, unit: "fans" },
  { title: "Digital Presets & Shaders Unlocked", current: 480, target: 800, unit: "items" },
  { title: "Aggregate Live Tip Event Volume", current: 4210, target: 10000, unit: "$" }
];

export const mockTestimonials = [
  {
    quote: "Standard platforms take 20% and hide my data. With The Wet Spot, I retain 90% of my tips and get native AI insights that tripled my direct message conversions within two months.",
    author: "Aura Vibe",
    role: "Ambient Artist & Preset Designer"
  },
  {
    quote: "I launched my WebGL course as an exclusive digital product locked behind subscription levels. Seamless Stripe-style checkouts and native glass interfaces make this feel like a premier luxury brand.",
    author: "Kaelen Tech FX",
    role: "3D Shader & UI Developer"
  },
  {
    quote: "My late night modular synth flows are heavily dependent on immediate, non-latency feedback. Tipping triggers sound visualizers and keeps my active chat buzzing in real-time.",
    author: "Luna Noir",
    role: "Cyber ASMR Synth Sculptor"
  }
];

export const mockSocialProofEvents: SocialProofEvent[] = [
  {
    id: "sp1",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    actionText: "CryptoKev unlocked Ultimate Backstage",
    timeAgo: "12s ago",
    type: "subscribe"
  },
  {
    id: "sp2",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    actionText: "Sara_Visuals tipped $50",
    timeAgo: "45s ago",
    type: "tip"
  },
  {
    id: "sp3",
    userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
    actionText: "NeonNomad joined Cyber Chat",
    timeAgo: "1m ago",
    type: "join"
  },
  {
    id: "sp4",
    userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100",
    actionText: "Alex bought Shaders Kit",
    timeAgo: "3m ago",
    type: "purchase"
  }
];

export const mockUserStats: UserStats = {
  level: 42,
  xp: 8450,
  nextLevelXp: 10000,
  rank: "Diamond Pioneer",
  dailyStreak: 14,
  watchStreak: 5,
  engagementStreak: 28
};
