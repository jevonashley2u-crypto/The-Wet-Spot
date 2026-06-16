import React from "react";
import { TrendingUp, Users, DollarSign, Award, Target, BarChart3, ChevronDown, CheckCircle, Flame } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { NeonButton } from "./NeonButton";

export const AnalyticsView: React.FC = () => {
  // Mock monthly transactions
  const premiumTransactions = [
    { id: "tx_124", user: "CryptoKev", event: "Standard Tier Sub", amount: 15.00, date: "Just now", status: "completed" },
    { id: "tx_123", user: "Sara_Visuals", event: "Shader Master bundle", amount: 45.00, date: "2 hours ago", status: "completed" },
    { id: "tx_122", user: "AestheticMax", event: "DM Video unlocked", amount: 9.99, date: "5 hours ago", status: "completed" },
    { id: "tx_121", user: "LofiPioneer", event: "Modular synth tip", amount: 50.00, date: "Yesterday", status: "completed" }
  ];

  return (
    <div className="w-full text-white max-w-5xl mx-auto px-4 sm:px-6 py-6 font-sans">
      
      {/* Header telemetry blocks */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-white/5 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-teal-400" />
            Ecosystem Analytics Node
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Analyze sub conversion telemetry, monthly transactions, and digital goods distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NeonButton variant="ghost" size="sm" className="hidden sm:inline-flex">
            Download CSV Report
          </NeonButton>
          <NeonButton variant="glass" size="sm" className="flex items-center gap-1">
            Last Month <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </NeonButton>
        </div>
      </div>

      {/* Main KPI widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {[
          { title: "Net platform revenue", val: "$31,250.00", change: "+14.5% vs avg", desc: "Total unlocked & sub value stream", icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
          { title: "Registered fan base", val: "14,200", change: "+8.2% this month", desc: "Interactive community accounts", icon: <Users className="w-4 h-4 text-teal-400" /> },
          { title: "Avg subscription price", val: "$15.00", change: "Stable", desc: "Weighted subscription levels", icon: <Award className="w-4 h-4 text-teal-500" /> },
          { title: "Retention score metric", val: "98.4%", change: "Ranked Top 5%", desc: "Ratio of sub renew rates", icon: <Target className="w-4 h-4 text-teal-500" /> }
        ].map((kpi, idx) => (
          <GlassCard key={idx} hoverEffect={false} className="p-4.5">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="text-[10px] uppercase font-mono tracking-widest">{kpi.title}</span>
              <div className="p-1.5 bg-zinc-950/60 border border-zinc-900 rounded-lg">
                {kpi.icon}
              </div>
            </div>

            <div className="mt-3.5">
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-white">{kpi.val}</h2>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">{kpi.change}</span>
                <span className="text-[9px] text-zinc-500 text-right leading-none font-sans font-light truncate max-w-[130px]">{kpi.desc}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Structured Vector Graphics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5 mt-8">
        
        {/* SVG Area graph for financial progress */}
        <div className="md:col-span-2">
          <GlassCard hoverEffect={false} className="p-5 h-full">
            <div className="flex justify-between items-baseline mb-6.5">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Continuous Net Revenue Streams ($)</span>
                <h3 className="text-sm font-bold text-white mt-1">Earnings Expansion Progress</h3>
              </div>
              <span className="text-xs text-teal-400 font-mono font-bold flex items-center gap-1.5 bg-teal-400/5 px-2.5 py-1 rounded-full border border-teal-400/10">
                <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                90% payout retain
              </span>
            </div>

            {/* Custom SVG Drawing curve mimicking Stripe style */}
            <div className="h-60 relative w-full pt-4">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                {/* Visual grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="160" x2="500" y2="160" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Ambient dynamic glow path */}
                <path
                  d="M 0 180 Q 80 140 160 110 T 320 80 T 420 50 T 500 20 L 500 200 L 0 200 Z"
                  fill="url(#areaGlow)"
                  opacity="0.15"
                />

                {/* Core curve path */}
                <path
                  d="M 0 180 Q 80 140 160 110 T 320 80 T 420 50 T 500 20"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Graph Dots */}
                <circle cx="160" cy="110" r="5" fill="#14b8a6" stroke="#000" strokeWidth="2" />
                <circle cx="320" cy="80" r="5" fill="#0d9488" stroke="#000" strokeWidth="2" />
                <circle cx="500" cy="20" r="5" fill="#0f766e" stroke="#000" strokeWidth="2" />

                {/* Gradient declarations */}
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="50%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                  
                  <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Graph axis indices labels */}
              <div className="absolute inset-x-0 bottom-[-24px] flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4 (Peak)</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Vertical stats: Sub tier distribution */}
        <div>
          <GlassCard hoverEffect={false} className="p-5 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Tier Conversion Metrics</span>
              <h3 className="text-sm font-bold text-white mt-1 mb-5">Subscription Layout</h3>
              
              <div className="space-y-4">
                {[
                  { name: "Platinum VIP Access ($39)", count: "124 subscribers", ratio: "75%", style: "bg-teal-500" },
                  { name: "Standard Level ($15)", count: "214 subscribers", ratio: "55%", style: "bg-zinc-650" },
                  { name: "Ultimate Backstage ($99)", count: "42 subscribers", ratio: "25%", style: "bg-teal-700" }
                ].map((tier, tid) => (
                  <div key={tid} className="space-y-2.5">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-zinc-300 font-bold">{tier.name}</span>
                      <span className="text-zinc-500 font-mono">{tier.count}</span>
                    </div>
                    {/* Visual Bar scale */}
                    <div className="w-full bg-zinc-900 border border-white/5 rounded-full h-2 overflow-hidden">
                      <div className={`${tier.style} h-full rounded-full`} style={{ width: tier.ratio }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI warning note */}
            <div className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-3 text-xs text-teal-300 font-light mt-6.5 flex gap-2 leading-relaxed">
              <Flame className="w-5 h-5 text-teal-400 flex-shrink-0 animate-bounce" />
              <span>Convert an extra 4% of visitors by updating draft video locks.</span>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Transaction Feed */}
      <div className="mt-10">
        <GlassCard hoverEffect={false} className="p-5">
          <div className="flex justify-between items-baseline mb-5.5">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Aggregate Receipts ledger</span>
              <h3 className="text-sm font-bold text-white mt-1">Transaction History logs</h3>
            </div>
            <span className="text-xs text-zinc-500 font-sans">Showing last 4 transactions</span>
          </div>

          <div className="divide-y divide-white/5 font-sans leading-normal">
            {premiumTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                    deposit
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{tx.user} <span className="font-light text-zinc-500 font-mono">({tx.id})</span></h4>
                    <span className="text-[10px] text-zinc-500 mt-0.5 block font-mono">{tx.event} • {tx.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">+${tx.amount.toFixed(2)}</span>
                  <div className="text-[9px] text-zinc-500 font-mono uppercase mt-0.5 flex items-center justify-end gap-1 font-semibold">
                    <CheckCircle className="w-3 h-3 text-emerald-400 fill-emerald-500/10" />
                    <span>stripe cleared</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
