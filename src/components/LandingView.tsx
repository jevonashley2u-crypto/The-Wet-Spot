import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, DollarSign, Users, Shield, Zap, TrendingUp, ChevronRight, Check, ArrowRight, Video, Flame, Star, StarOff } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { NeonButton } from "./NeonButton";
import { Creator } from "../types";
import { mockCreators, mockTestimonials } from "../data";

interface LandingViewProps {
  onExplore: () => void;
  onSelectCreator: (creator: Creator) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onExplore, onSelectCreator }) => {
  // Earnings Calculator State
  const [subscribers, setSubscribers] = useState(2500);
  const [subPrice, setSubPrice] = useState(15.0);
  const [tipFactor, setTipFactor] = useState(1.5); // Multiplier for digital sales/tips
  
  // Live Ticker State
  const [globalEarnings, setGlobalEarnings] = useState(12845210.45);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalEarnings(prev => prev + parseFloat((Math.random() * 4.25).toFixed(2)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const calculateEarnings = () => {
    const monthlySubSum = subscribers * subPrice;
    const monthlyTipsSum = monthlySubSum * (tipFactor - 1);
    const platformCutFactor = 0.90; // 10% Cut vs OF's 20%
    return Math.round((monthlySubSum + monthlyTipsSum) * platformCutFactor);
  };

  const getLegacyEarnings = () => {
    const monthlySubSum = subscribers * subPrice;
    const monthlyTipsSum = monthlySubSum * (tipFactor - 1);
    const platformCutFactor = 0.80; // 20% Cut
    return Math.round((monthlySubSum + monthlyTipsSum) * platformCutFactor);
  };

  return (
    <div className="w-full text-white">
      {/* Background Cinematic FX */}
      <div className="relative overflow-hidden pt-12 pb-24 md:py-32">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-teal-950/20 via-sky-950/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[120px] h-[120px] bg-sky-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-[10%] left-[5%] w-[150px] h-[150px] bg-teal-500/5 rounded-full blur-2xl animate-pulse" />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          {/* Tag Line */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1.5 px-4 mb-8 text-xs backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-sky-200 font-medium tracking-wide uppercase">AI-Inundated Premium Creator Ecosystem</span>
          </motion.div>

          {/* Main Cinematic Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-sans tracking-tight leading-[1.1] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-100 to-sky-400"
          >
            Where Creators <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-450 to-sky-400">
              Own Their Audience.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans font-light leading-relaxed"
          >
            Say goodbye to restrictive algorithmic feeds and unfair 20% platform cuts. 
            Host live streams, monetize smart modular digital assets, and use state-of-the-art AI fan insights.
          </motion.p>

          {/* Action CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <NeonButton variant="blue" size="lg" className="w-full sm:w-auto" onClick={onExplore}>
              Unlock Creator Space <ArrowRight className="w-4 h-4 ml-2" />
            </NeonButton>
            <NeonButton variant="ghost" size="lg" className="w-full sm:w-auto" onClick={onExplore}>
              Browse Exclusive Tech
            </NeonButton>
          </motion.div>

          {/* Realtime platform ledger ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 inline-flex flex-col items-center bg-zinc-950/40 border border-zinc-900 rounded-2xl py-3.5 px-8 backdrop-blur"
          >
            <span className="text-[10px] uppercase text-zinc-500 tracking-widest font-mono">Total Cumulative Platform Creator Earnings</span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              ${globalEarnings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Featured Creators Showcase */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Trending Wet Spot Pioneers
            </h2>
            <p className="text-sm text-zinc-400 mt-1 font-sans">
              Discover visual designers, immersive sound producers, and tech minds owning their spaces.
            </p>
          </div>
          <NeonButton variant="ghost" size="sm" className="mt-4 md:mt-0" onClick={onExplore}>
            View All Pioneers <ChevronRight className="w-4 h-4 ml-1" />
          </NeonButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCreators.map((creator, idx) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-lg overflow-hidden cursor-pointer"
              onClick={() => onSelectCreator(creator)}
            >
              {/* Banner Image */}
              <div className="h-28 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
                <img
                  src={creator.banner}
                  alt={creator.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {creator.isLive && (
                  <span className="absolute top-3 left-3 bg-red-500 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full z-20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    LIVE
                  </span>
                )}
              </div>

              {/* Avatar position offset */}
              <div className="px-5 pb-5 relative mt-[-30px] z-20">
                <div className="flex justify-between items-end">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-16 h-16 rounded-xl border-2 border-zinc-950 object-cover bg-zinc-900 shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-[10px] text-zinc-300 font-mono">
                    <Star className="w-3 h-3 text-teal-400 fill-teal-400" />
                    {creator.rating}
                  </div>
                </div>

                <h3 className="mt-3.5 font-bold text-base text-white group-hover:text-teal-400 transition-colors">
                  {creator.name}
                </h3>
                <span className="text-xs text-zinc-500 font-sans font-medium">@{creator.handle}</span>

                <p className="mt-2.5 text-xs text-zinc-400 line-clamp-2 h-8 font-light">
                  {creator.bio}
                </p>

                {/* Tags preview */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {creator.tags.slice(0, 2).map((t, tid) => (
                    <span key={tid} className="bg-zinc-900 text-zinc-500 text-[10px] py-0.5 px-2 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase text-zinc-500 tracking-wider font-mono">Tier From</span>
                  <span className="text-sm font-sans font-bold text-teal-400">${creator.subscriptionPrice}/mo</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic Interactive Earnings Calculator */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <GlassCard glowColor="green" className="relative">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Scale Your Earnings Multiplier
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              See what you earn keeping 90% of sub values versus OnlyFans standard cuts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            {/* Control Form sliders */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Sliders 1 */}
              <div>
                <div className="flex justify-between items-center text-xs font-sans mb-2.5">
                  <span className="text-zinc-400 font-medium">Active Subscriber Community</span>
                  <span className="font-mono text-teal-400 text-sm font-semibold">{subscribers.toLocaleString()} Fans</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={subscribers}
                  onChange={(e) => setSubscribers(parseInt(e.target.value))}
                  className="w-full accent-teal-550 h-1.5 bg-zinc-850 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sliders 2 */}
              <div>
                <div className="flex justify-between items-center text-xs font-sans mb-2.5">
                  <span className="text-zinc-400 font-medium">Average Tier Ticket Price</span>
                  <span className="font-mono text-teal-400 text-sm font-semibold">${subPrice.toFixed(2)}/mo</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="1"
                  value={subPrice}
                  onChange={(e) => setSubPrice(parseInt(e.target.value))}
                  className="w-full accent-teal-550 h-1.5 bg-zinc-850 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sliders 3 */}
              <div>
                <div className="flex justify-between items-center text-xs font-sans mb-2.5">
                  <span className="text-zinc-400 font-medium">Digital Downloads & Tips Add-On</span>
                  <span className="font-mono text-teal-400 text-sm font-semibold">+{Math.round((tipFactor - 1) * 100)}% extra</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={tipFactor}
                  onChange={(e) => setTipFactor(parseFloat(e.target.value))}
                  className="w-full accent-teal-550 h-1.5 bg-zinc-855 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Results comparative box */}
            <div className="bg-zinc-950/30 backdrop-blur-md border border-white/5 rounded-2xl p-6.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Your The Wet Spot Earnings</span>
                <div className="text-4xl sm:text-5xl font-mono font-bold text-emerald-400 mt-2">
                  ${calculateEarnings().toLocaleString()}/mo
                </div>
                <span className="text-[11px] text-zinc-500 block mt-1.5 italic font-sans font-light">
                  *Based on 90% creator payout share (industry-leading standard).
                </span>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6 space-y-3.5">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-sans">
                  <span>OnlyFans Core Payout (80% cut)</span>
                  <span className="font-mono text-pink-400/80">${getLegacyEarnings().toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between items-center text-xs text-zinc-400 font-sans">
                  <span>Patreon Pro Cut (approx. 88%)</span>
                  <span className="font-mono text-orange-400/80">${Math.round(getLegacyEarnings() * 1.1).toLocaleString()}/mo</span>
                </div>
                
                {/* Net Difference alert banner */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300 font-sans font-medium flex items-center gap-2.5 mt-2">
                  <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce" />
                  <span>You retain an extra <b className="font-mono font-bold">${(calculateEarnings() - getLegacyEarnings()).toLocaleString()}</b> every month with us!</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Feature Comparison Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            How The Wet Spot Redefines Creators Autonomy
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            A quick visual guide to how we compare to traditional silo systems.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] border border-white/5 rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-zinc-950/80 text-zinc-400 text-xs tracking-wider uppercase font-mono">
                <th className="p-5 border-b border-white/5">Features & Royalties</th>
                <th className="p-5 border-b border-white/5 text-teal-400 bg-teal-950/20">The Wet Spot</th>
                <th className="p-5 border-b border-white/5">OnlyFans</th>
                <th className="p-5 border-b border-white/5">Twitch</th>
                <th className="p-5 border-b border-white/5">Patreon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-sans">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-5 font-medium">Platform Fee Commission</td>
                <td className="p-5 font-bold text-emerald-400 bg-teal-950/20 font-mono">10%</td>
                <td className="p-5 font-mono text-zinc-500">20%</td>
                <td className="p-5 font-mono text-zinc-500">30% - 50%</td>
                <td className="p-5 font-mono text-zinc-500">8% - 12%</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-5 font-medium">AI Custom Fans Direct Recommendations</td>
                <td className="p-5 text-emerald-400 bg-teal-950/20"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="p-5 text-zinc-600">-</td>
                <td className="p-5 text-zinc-600">-</td>
                <td className="p-5 text-zinc-600">-</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-5 font-medium">Modular Digital Downloads Marketplace</td>
                <td className="p-5 text-emerald-400 bg-teal-950/20"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="p-5 text-zinc-600">-</td>
                <td className="p-5 text-zinc-600">-</td>
                <td className="p-5 text-zinc-600">Basic Lock</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-5 font-medium">Instant Stripe Wallet Pay-outs</td>
                <td className="p-5 text-emerald-400 bg-teal-950/20"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="p-5 text-zinc-600">Manual (up to 7 days)</td>
                <td className="p-5 text-zinc-600">Net 15-30</td>
                <td className="p-5 text-zinc-600">Patreon Sweep (Weekly)</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-5 font-medium">Dynamic Live Tipping sound FX sync</td>
                <td className="p-5 text-emerald-400 bg-teal-950/20"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="p-5 text-zinc-600">-</td>
                <td className="p-5 text-zinc-500">Requires 3rd party overlay</td>
                <td className="p-5 text-zinc-600">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Testimonials */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Validated by Visual Leaders
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Read stories of artists shifting away from mainstream systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTestimonials.map((t, tid) => (
            <div key={tid} className="border border-white/5 bg-zinc-950/40 rounded-2xl p-6 backdrop-blur flex flex-col justify-between">
              <p className="text-zinc-300 text-xs sm:text-sm italic font-sans font-light leading-relaxed">
                "{t.quote}"
              </p>
              <div className="mt-6">
                <h4 className="font-bold text-white text-sm">{t.author}</h4>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Plans (Pricing Section) */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Completely Free To Launch
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            No upfront deposits, monthly charges, or activation hurdles. Choose your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Base Tier Card */}
          <div className="border border-white/5 bg-zinc-950/40 p-8 rounded-2xl text-left relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Standard Creator</span>
              <h3 className="text-xl font-bold mt-2 text-white">Classic Setup</h3>
              <p className="text-xs text-zinc-400 mt-2 font-sans font-light">Perfect for creators transitioning from OnlyFans & Patreon.</p>
              <div className="my-6">
                <span className="text-3xl sm:text-4xl font-bold text-white">10%</span>
                <span className="text-zinc-500 text-xs ml-1">platform commission</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-sans border-t border-white/5 pt-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Standard subscription tiers setup</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Integrated Digital Marketplace access</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Basic analytics summary</li>
              </ul>
            </div>
            <NeonButton variant="ghost" size="md" className="w-full mt-8" onClick={onExplore}>
              Establish Free Account
            </NeonButton>
          </div>

          {/* Premium Tier Card */}
          <div className="border border-teal-500/20 bg-teal-950/5 p-8 rounded-2xl text-left relative overflow-hidden flex flex-col justify-between shadow-[0_0_30px_rgba(20,184,166,0.1)]">
            <div className="absolute top-3 right-3 bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Popular Pro
            </div>
            <div>
              <span className="text-[10px] text-teal-400 uppercase tracking-widest font-mono">Wet Spot Elite</span>
              <h3 className="text-xl font-bold mt-2 text-white">Enterprise White-glove</h3>
              <p className="text-xs text-zinc-400 mt-2 font-sans font-light">Custom tailored assistance for high-revenue teams & visual stars.</p>
              <div className="my-6">
                <span className="text-3xl sm:text-4xl font-bold text-white">8%</span>
                <span className="text-zinc-500 text-xs ml-1">for earnings &gt;$50k/mo</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-sans border-t border-white/5 pt-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Full-fledged customizable branding color palettes</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Direct priority live stream pipelines (Ultra HD)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Dedicated account management expert</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Custom payouts routing APIs</li>
              </ul>
            </div>
            <NeonButton variant="blue" size="md" className="w-full mt-8" onClick={onExplore}>
              Apply For Elite Access
            </NeonButton>
          </div>
        </div>
      </div>

      {/* Styled Footer */}
      <footer className="border-t border-white/5 bg-zinc-950/40 py-12 mt-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <div className="text-lg font-bold tracking-wider text-white font-mono flex items-center gap-2">
              <img 
                src="https://lh3.googleusercontent.com/d/1vt93TCcsOlei75mZUXSo_FingKiGm9et" 
                alt="The Wet Spot Logo" 
                className="w-5.5 h-5.5 rounded-md object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
              THE WET SPOT
            </div>
            <span className="text-xs text-zinc-500 font-sans font-light">Premium Creator Monetization Platform. © 2026. All rights secured.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-400 font-sans">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Operations</span>
            <span className="hover:text-white cursor-pointer transition-colors">Stripe Compliance Guidelines</span>
            <span className="hover:text-white cursor-pointer transition-colors">DMCA Notice</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
