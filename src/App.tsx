import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Compass, MessageSquare, Radio, ShoppingBag, 
  BarChart3, LayoutDashboard, Wallet, 
  CheckCircle,
  Brain, Trophy, Mic, MicOff, Network, Users
} from "lucide-react";

// Views Imports
import { LandingView } from "./components/LandingView";
import { ContentFeed } from "./components/ContentFeed";
import { CreatorProfile } from "./components/CreatorProfile";
import { MessagesView } from "./components/MessagesView";
import { LivestreamView } from "./components/LivestreamView";
import { MarketplaceView } from "./components/MarketplaceView";
import { EarningsDashboard } from "./components/EarningsDashboard";
import { AnalyticsView } from "./components/AnalyticsView";
import { WalletSettingsView } from "./components/WalletSettingsView";
import { AISuiteView } from "./components/AISuiteView";
import { GamificationView } from "./components/GamificationView";
import { ReferralHubView } from "./components/ReferralHubView";
import { CommunityHubView } from "./components/CommunityHubView";
import { ShareEngineModal } from "./components/ShareEngineModal";
import { AuthView } from "./components/AuthView";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import { Creator } from "./types";
import { mockCreators, mockSocialProofEvents } from "./data";

type PageID = 
  | "landing" 
  | "discovery" 
  | "profile" 
  | "messages" 
  | "livestream" 
  | "marketplace" 
  | "dashboard" 
  | "analytics" 
  | "wallet-settings"
  | "ai-suite"
  | "gamification"
  | "referral"
  | "community";

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageID>("landing");
  const [selectedCreatorProfile, setSelectedCreatorProfile] = useState<Creator>(mockCreators[0]);
  
  // Custom notifications alert banner state
  const [tickerNotification, setTickerNotification] = useState<{ title: string; desc: string } | null>(null);

  // Viral Growth States
  const [socialProof, setSocialProof] = useState<any>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareCreator, setShareCreator] = useState<Creator | null>(null);

  // Voice AI State
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  const dispatchNotification = (title: string, desc: string) => {
    setTickerNotification({ title, desc });
    setTimeout(() => {
      setTickerNotification(null);
    }, 4500);
  };

  const selectAndOpenCreator = (creator: Creator) => {
    setSelectedCreatorProfile(creator);
    setCurrentPage("profile");
    dispatchNotification("Ecosystem Transition", `Entering Profile for @${creator.handle}`);
  };

  const handleShare = (creator: Creator) => {
    setShareCreator(creator);
    setIsShareModalOpen(true);
  };

  // Navigation schema
  const navItems = [
    { id: "landing", label: "Pioneer Hub", icon: <Sparkles className="w-5 h-5" /> },
    { id: "discovery", label: "Discovery Matrix", icon: <Compass className="w-5 h-5" /> },
    { id: "messages", label: "Fan Core Chat", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "livestream", label: "Livestream Hub", icon: <Radio className="w-5 h-5" /> },
    { id: "marketplace", label: "Marketplace Node", icon: <ShoppingBag className="w-5 h-5" /> },
    { id: "dashboard", label: "Creator Studio", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "ai-suite", label: "AI Neural Studio", icon: <Brain className="w-5 h-5 text-teal-400" /> },
    { id: "gamification", label: "Milestones & Rewards", icon: <Trophy className="w-5 h-5 text-yellow-400" /> },
    { id: "referral", label: "Growth Hub", icon: <Network className="w-5 h-5 text-pink-400" /> },
    { id: "community", label: "Community Engine", icon: <Users className="w-5 h-5 text-emerald-400" /> },
    { id: "analytics", label: "Ecosystem Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "wallet-settings", label: "Credentials & Ledger", icon: <Wallet className="w-5 h-5" /> }
  ];

  const handleNavClick = (pageId: PageID) => {
    setCurrentPage(pageId);
  };

  // Mock Voice Assistant Logic
  useEffect(() => {
    if (isListening) {
      setVoiceText("Listening for command...");
      const timer = setTimeout(() => {
        setVoiceText("Navigating to Discovery Matrix");
        setTimeout(() => {
          setIsListening(false);
          setVoiceText("");
          handleNavClick("discovery");
        }, 1500);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isListening]);

  // Global Social Proof Logic
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setSocialProof(mockSocialProofEvents[index]);
      index = (index + 1) % mockSocialProofEvents.length;
      setTimeout(() => setSocialProof(null), 4000); // Hide after 4s
    }, 12000); // Show every 12s
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Ecosystem...</div>;
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-[#010a14] text-white selection:bg-teal-500/30 selection:text-teal-200 overflow-hidden flex flex-col relative font-sans">
      
      {/* 2031 Dynamic Spatial Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-container">
        <motion.div 
          animate={{
            rotateZ: [0, 5, 0, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-10%] bg-gradient-to-br from-teal-900/10 via-[#010a14] to-pink-900/10"
        >
          <img 
            src="https://lh3.googleusercontent.com/d/1vt93TCcsOlei75mZUXSo_FingKiGm9et" 
            alt="Ecosystem Background" 
            className="w-full h-full object-cover opacity-[0.15] mix-blend-screen"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        {/* Holographic light beams */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-teal-500/30 to-transparent shadow-[0_0_20px_rgba(20,184,166,0.5)]" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent shadow-[0_0_20px_rgba(236,72,153,0.3)]" />
      </div>

      {/* DYNAMIC ALERT SLIDE-IN */}
      <AnimatePresence>
        {tickerNotification && (
          <motion.div
            initial={{ opacity: 0, y: -80, x: "-50%", rotateX: 45 }}
            animate={{ opacity: 1, y: 0, x: "-50%", rotateX: 0 }}
            exit={{ opacity: 0, y: -80, x: "-50%", rotateX: -45 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] glass-panel-deep border border-teal-500/30 text-white py-3 px-6 rounded-2xl flex items-center gap-4 shadow-[0_20px_40px_rgba(20,184,166,0.2)] max-w-sm sm:max-w-md w-[90%] preserve-3d"
          >
            <div className="w-8 h-8 bg-teal-500/20 rounded-xl flex items-center justify-center text-teal-400 shrink-0 neon-border animate-pulse-ring">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left font-sans select-none truncate">
              <h4 className="text-sm font-bold leading-tight text-white mb-0.5 neon-text">{tickerNotification.title}</h4>
              <p className="text-[11px] text-zinc-300 font-light truncate leading-none">{tickerNotification.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Social Proof Ticker (Bottom Right) */}
      <AnimatePresence>
        {socialProof && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="fixed bottom-32 right-6 z-[60] bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
             <img src={socialProof.userAvatar} className="w-8 h-8 rounded-full border border-teal-500/50 object-cover" />
             <div>
               <div className="text-xs text-white font-bold">{socialProof.actionText}</div>
               <div className="text-[10px] text-zinc-400">{socialProof.timeAgo}</div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Assistant Overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-panel border border-teal-500/40 rounded-full px-6 py-2 flex items-center gap-3 shadow-[0_0_30px_rgba(20,184,166,0.3)]"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["8px", "24px", "8px"] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1 bg-teal-400 rounded-full"
                />
              ))}
            </div>
            <span className="text-sm font-mono text-teal-100">{voiceText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE CONTENT SWITCHBOARD */}
      <main className="flex-grow relative z-10 w-full h-full overflow-y-auto custom-scrollbar pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full min-h-full"
          >
            {currentPage === "landing" && (
              <LandingView 
                onExplore={() => handleNavClick("discovery")}
                onSelectCreator={selectAndOpenCreator}
              />
            )}

            {currentPage === "discovery" && (
              <ContentFeed />
            )}

            {currentPage === "profile" && (
              <CreatorProfile />
            )}

            {currentPage === "messages" && (
              <MessagesView onNotify={dispatchNotification} />
            )}

            {currentPage === "livestream" && (
              <LivestreamView onNotify={dispatchNotification} />
            )}

            {currentPage === "marketplace" && (
              <MarketplaceView onNotify={dispatchNotification} />
            )}

            {currentPage === "dashboard" && (
              <EarningsDashboard />
            )}

            {currentPage === "analytics" && (
              <AnalyticsView />
            )}

            {currentPage === "ai-suite" && (
              <AISuiteView onNotify={dispatchNotification} />
            )}

            {currentPage === "gamification" && (
              <GamificationView onNotify={dispatchNotification} />
            )}

            {currentPage === "referral" && (
              <ReferralHubView />
            )}

            {currentPage === "community" && (
              <CommunityHubView />
            )}

            {currentPage === "wallet-settings" && (
              <WalletSettingsView onNotify={dispatchNotification} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 2031 FLOATING SPATIAL DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 perspective-container pointer-events-none">
        <motion.div 
          className="glass-panel-deep rounded-[2rem] p-3 flex items-center gap-2 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto relative preserve-3d"
          style={{ transform: "rotateX(15deg)" }}
          whileHover={{ transform: "rotateX(0deg) translateY(-5px)", scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Logo Orb */}
          <div className="px-2 pr-4 border-r border-white/10 flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-pink-600 p-[1px] animate-pulse-ring">
               <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                 <img 
                    src="https://lh3.googleusercontent.com/d/1vt93TCcsOlei75mZUXSo_FingKiGm9et" 
                    alt="Logo" 
                    className="w-full h-full object-cover opacity-80"
                 />
               </div>
             </div>
             <div className="hidden sm:block">
               <div className="text-[9px] text-teal-400 font-mono uppercase tracking-[0.2em]">Neural OS</div>
               <div className="font-bold text-white text-sm">WET SPOT</div>
             </div>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar px-2 max-w-[60vw] sm:max-w-none">
            {navItems.map((item) => {
              const isActive = currentPage === item.id || (item.id === "discovery" && currentPage === "profile");
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as PageID)}
                  className={`
                    relative p-3 rounded-2xl transition-all group
                    ${isActive ? "bg-white/10" : "hover:bg-white/5"}
                  `}
                  title={item.label}
                >
                  <div className={`transition-colors duration-300 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                    {item.icon}
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeDockIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.8)]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Voice Command Orb */}
          <div className="pl-4 border-l border-white/10 pr-2">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                isListening 
                  ? "bg-teal-500/20 text-teal-300 neon-border animate-pulse" 
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      <ShareEngineModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        creatorName={shareCreator?.name || ""}
        creatorBanner={shareCreator?.banner || ""}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
