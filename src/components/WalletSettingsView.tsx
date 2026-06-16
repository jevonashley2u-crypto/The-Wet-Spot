import React, { useState } from "react";
import { Settings, Wallet, Bell, ShieldCheck, CreditCard, ArrowRight, ShieldAlert, Check, Sparkles, CheckCircle, RefreshCw, HelpCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { NeonButton } from "./NeonButton";
import { NotificationItem } from "../types";
import { mockNotifications } from "../data";

interface WalletSettingsProps {
  onNotify: (title: string, desc: string) => void;
}

export const WalletSettingsView: React.FC<WalletSettingsProps> = ({ onNotify }) => {
  const [innerTab, setInnerTab] = useState<"wallet" | "settings" | "notifications" | "admin">("wallet");
  
  // Wallet states
  const [balance, setBalance] = useState(4820.50);
  const [coinCount, setCoinCount] = useState(250);
  const [stripeConnected, setStripeConnected] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  // Notifications states
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(mockNotifications);

  // Admin state
  const [commissionPct, setCommissionPct] = useState(10);
  const [creatorApprovals, setCreatorApprovals] = useState([
    { name: "Sola_Visualist", bio: "Generative 3D modifiers designer", rating: 4.8, status: "pending" },
    { name: "AudioFreq", bio: "Stereo spatial wave synthesizer developer", rating: 4.75, status: "pending" }
  ]);

  const handleWithdrawal = () => {
    if (balance <= 0) return;
    setWithdrawing(true);
    setTimeout(() => {
      onNotify("Stripe Withdrawal Dispatched!", `Withdrawal of $${balance.toFixed(2)} has been funneled securely to your connected Stripe account.`);
      setBalance(0);
      setWithdrawing(false);
    }, 1500);
  };

  const handleBuyCoins = (coinsAmt: number, priceAmt: number) => {
    setCoinCount(prev => prev + coinsAmt);
    onNotify("Coins Credited Successfully!", `Purchased ${coinsAmt} Ecosystem Coins. Balance updated instantly!`);
  };

  const handleApproveCreator = (creatorName: string) => {
    setCreatorApprovals(prev => prev.map(c => c.name === creatorName ? { ...c, status: "approved" } : c));
    onNotify("Creator Approved!", `User @${creatorName} is now authorized as a verified Wet Spot creator!`);
  };

  const handleClearNotifications = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    onNotify("Feeds Read Status updated", "All items marked as read.");
  };

  return (
    <div className="w-full text-white max-w-5xl mx-auto px-4 sm:px-6 py-4">
      
      {/* Sub-navigation pill menu */}
      <div className="flex flex-wrap gap-2.5 pb-6 border-b border-white/5 mb-8">
        {[
          { id: "wallet", label: "Ledger & Wallet", icon: <Wallet className="w-4 h-4" /> },
          { id: "settings", label: "Account Options", icon: <Settings className="w-4 h-4" /> },
          { id: "notifications", label: "System Events", icon: <Bell className="w-4 h-4" /> },
          { id: "admin", label: "Admin Telemetry", icon: <ShieldAlert className="w-4 h-4" /> }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setInnerTab(btn.id as any)}
            className={`
              px-4 py-2 rounded-xl text-xs font-sans font-semibold flex items-center gap-2 cursor-pointer transition-all
              ${innerTab === btn.id 
                ? "bg-teal-500/15 text-teal-400 border border-teal-400/20" 
                : "bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border border-transparent"
              }
            `}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      {/* RENDER INNER ACTIVE COMPONENT */}
      {innerTab === "wallet" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Main balance card */}
          <GlassCard glowColor="green" hoverEffect={false} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Net Accrued Balance</span>
                  <h2 className="text-3xl sm:text-4xl font-mono font-bold text-white mt-1">
                    ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </h2>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-xl uppercase font-mono">
                  Wallet Clean
                </div>
              </div>

              {/* Stripe Connection module */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4 mt-6 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-teal-400" />
                  <div className="text-left font-sans">
                    <h4 className="font-bold text-white leading-tight">Connected Stripe Express Ledger</h4>
                    <span className="text-[9px] text-zinc-500">Scheduled: Payout immediately on request</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono uppercase font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Checked
                </div>
              </div>
            </div>

            {/* Withdrawal trigger */}
            <div className="mt-8 border-t border-white/5 pt-4">
              <NeonButton
                variant="white"
                className="w-full flex items-center justify-center gap-1.5"
                disabled={balance <= 0 || withdrawing}
                onClick={handleWithdrawal}
              >
                {withdrawing ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-1 text-black" />
                ) : null}
                {withdrawing ? "Processing securely..." : "Payout Entire Balance via Stripe"}
              </NeonButton>
            </div>
          </GlassCard>

          {/* Quick Coin replenishment */}
          <GlassCard glowColor="blue" hoverEffect={false} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Quick Tip Coins</span>
                  <h2 className="text-3xl sm:text-4xl font-mono font-bold text-white mt-1 flex items-center gap-2">
                    {coinCount.toLocaleString()}
                    <span className="text-xs text-yellow-400 font-sans tracking-tight font-light font-medium">(Ecosystem Credits)</span>
                  </h2>
                </div>
                <div className="p-2 bg-yellow-400/5 border border-yellow-400/10 rounded-xl text-yellow-400 text-xs">
                  ★ Level 3
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-6 text-xs text-center">
                {[
                  { count: 100, price: 9.99, desc: "Standard Pack" },
                  { count: 500, price: 39.99, desc: "Platinum Stack" }
                ].map((pack, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBuyCoins(pack.count, pack.price)}
                    className="p-3 bg-zinc-950/60 border border-white/5 rounded-2xl hover:border-teal-400/30 transition-all text-left flex flex-col justify-between h-24"
                  >
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">{pack.desc}</span>
                      <h4 className="font-bold text-white mt-0.5">+{pack.count} Coins</h4>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono font-bold">${pack.price}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed font-light text-center">
              *Coins permit zero-latency micro-tipping inside streaming chats and private messaging pipelines.
            </p>
          </GlassCard>

        </div>
      )}

      {innerTab === "settings" && (
        <div className="max-w-xl mx-auto">
          <GlassCard hoverEffect={false} className="p-5.5 space-y-6">
            <h3 className="text-sm font-bold tracking-wide text-zinc-200 uppercase font-mono">Account Preferences</h3>
            
            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-1.5">Registered Identity Handle</label>
                <input
                  type="text"
                  defaultValue="SilverFoxx"
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                  readOnly
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-1.5">Registered Email</label>
                <input
                  type="email"
                  defaultValue="silverfoxx@gmail.com"
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                  readOnly
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-1.5">Ecosystem Role switcher</label>
                <div className="flex gap-2.5 mt-1.5">
                  <div className="flex-1 bg-teal-500/10 text-teal-400 border border-teal-500/25 rounded-xl p-3.5 text-left cursor-pointer font-bold">
                    🛡 Creator Node Active
                  </div>
                  <div className="flex-1 bg-zinc-900/60 text-zinc-500 border border-transparent rounded-xl p-3.5 text-left cursor-not-allowed">
                    Subscriber Fan
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <NeonButton variant="teal" size="sm" onClick={() => onNotify("Profile Saved", "Your account values are secured.")}>
                Apply Settings Changes
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}

      {innerTab === "notifications" && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex justify-between items-center pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-white font-sans">System Notification Logs</h3>
            <button onClick={handleClearNotifications} className="text-[10px] font-mono text-teal-400 hover:underline cursor-pointer">
              Mark all read
            </button>
          </div>

          <div className="space-y-3">
            {notificationsList.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-colors flex items-start gap-3.5
                  ${item.read ? "bg-zinc-950/20 border-white/5" : "bg-teal-500/5 border-teal-500/10"}
                `}
              >
                <span className="text-lg">
                  {item.type === "live" ? "📡" : item.type === "tip" ? "💰" : "🔔"}
                </span>

                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <span className="text-[9px] text-zinc-550 font-mono">{item.timeAgo}</span>
                  </div>
                  <p className="text-zinc-400 mt-1 font-sans font-light leading-normal">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {innerTab === "admin" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* System variables */}
            <GlassCard hoverEffect={false} className="p-5.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-teal-400 uppercase tracking-widest font-mono">Commission Control Sliders</span>
                <h3 className="text-sm font-bold text-white mt-1 mb-2">Platform Treasury share</h3>
                <p className="text-[11px] text-zinc-500 leading-normal mb-5">
                  Toggle platform commission. Retain more system validators dynamically.
                </p>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-zinc-400">Current Wet Spot Cut</span>
                    <span className="text-teal-400 font-bold">{commissionPct}% commission</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={commissionPct}
                    onChange={(e) => setCommissionPct(parseInt(e.target.value))}
                    className="w-full accent-teal-500 h-1.5 bg-zinc-850 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-6 flex justify-between items-center text-xs">
                <span className="text-zinc-500">Security audits status:</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1 uppercase">
                  <CheckCircle className="w-3.5 h-3.5" /> standard green
                </span>
              </div>
            </GlassCard>

            {/* Application Queue review lists */}
            <GlassCard hoverEffect={false}>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Creator Approval Matrix</span>
              <h3 className="text-sm font-bold text-white mt-1 mb-5">Creator Applications</h3>
              
              <div className="space-y-3.5 text-xs font-sans">
                {creatorApprovals.map((appl, idx) => (
                  <div key={idx} className="p-3 bg-zinc-950/40 border border-zinc-90 w-full rounded-xl flex justify-between items-center gap-3">
                    <div className="text-left">
                      <h4 className="font-bold text-white">@{appl.name}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 truncate max-w-[170px]">{appl.bio}</p>
                    </div>

                    {appl.status === "approved" ? (
                      <span className="text-[10px] text-zinc-500 bg-zinc-950 border border-white/5 rounded-lg px-2.5 py-1 flex items-center gap-1">
                        <Check className="w-3 h-3 text-teal-400" /> Authorized
                      </span>
                    ) : (
                      <NeonButton variant="teal" size="sm" className="text-[10px] py-1.5 px-2.5 rounded-lg" onClick={() => handleApproveCreator(appl.name)}>
                        Approve Partner
                      </NeonButton>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>
        </div>
      )}

    </div>
  );
};
