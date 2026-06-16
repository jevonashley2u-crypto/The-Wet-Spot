import React, { useState, useEffect } from "react";
import { 
  Sparkles, MessageSquare, Flame, TrendingUp, Users, DollarSign, 
  Calendar, Award, Copy, CheckCircle, Brain, ChevronRight, Zap, 
  ArrowRight, Heart, RefreshCw, BarChart3, AlertTriangle, Play,
  Send, Pocket, ShieldCheck, Dumbbell, Star, HelpCircle
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { NeonButton } from "./NeonButton";

interface AISuiteViewProps {
  onNotify: (title: string, desc: string) => void;
}

export const AISuiteView: React.FC<AISuiteViewProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<"content" | "optimization" | "audience" | "coach">("content");

  // ---- AI Content Suite State ----
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);

  const [captionTone, setCaptionTone] = useState("spicy");
  const [captionTopic, setCaptionTopic] = useState("");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [captionLoading, setCaptionLoading] = useState(false);

  // ---- AI Pricing & Optimization Engine State ----
  const [currentPrice, setCurrentPrice] = useState(15);
  const [calculatedOptimal, setCalculatedOptimal] = useState({ price: 19.99, revenueIncrease: "34%", confidence: "94%" });
  const [targetCategory, setTargetCategory] = useState("exclusive_presets");
  const [digitalPriceRecommendation, setDigitalPriceRecommendation] = useState({ price: "24.50", volumeEst: "140 units", isOptimal: true });

  // ---- Schedule state ----
  const [selectedDay, setSelectedDay] = useState("Friday");

  // ---- Churn Prediction List State ----
  const [churnFans, setChurnFans] = useState([
    { id: "fan_1", username: "DegenDave", tier: "Platinum VIP", score: "High Risk (87%)", reason: "Zero DM interactions for 21 days", avatar: "https://lh3.googleusercontent.com/d/1S_8Wr2Du1ufSvqKuASbP75kbPRktP1KG" },
    { id: "fan_2", username: "Sara_Visualist", tier: "Ultimate Backstage", score: "Medium Risk (54%)", reason: "Logged in only twice this week", avatar: "https://lh3.googleusercontent.com/d/1S_8Wr2Du1ufSvqKuASbP75kbPRktP1KG" },
    { id: "fan_3", username: "LofiSola", tier: "Standard", score: "Low Risk (28%)", reason: "High like ratio, but payment card expires", avatar: "https://lh3.googleusercontent.com/d/1S_8Wr2Du1ufSvqKuASbP75kbPRktP1KG" }
  ]);

  // ---- AI DM Suggestions ----
  const [activeDMQuery, setActiveDMQuery] = useState({
    fanName: "AestheticCrypto",
    msg: "Hey, are you releasing any behind-the-scenes video loops for your latest preset? I enjoyed the 3D modifier teaser!",
    suggestions: [
      "Hey AestheticCrypto! Absolutely, I am deploying a VIP video loop behind the paywall tonight. Unlock standard DM for standard access!",
      "I appreciate your eye! Yes, the 3D raw render source files are dropping in the Marketplace Node tomorrow morning. Want a preview link?",
      "Thank you! I can generate a custom spatial render preset just for you. Shall we unlock a bespoke request?"
    ]
  });
  const [selectedDMSuggestion, setSelectedDMSuggestion] = useState("");

  // ---- AI Creator Coach State ----
  const [coachChat, setCoachChat] = useState<Array<{ sender: "user" | "coach", text: string }>>([
    { sender: "coach", text: "Welcome SilverFoxx. I am your active AI Creator Growth Coach. I have analyzed your recent profile telemetry, tips volume, and active renewal rates to generate immediate action protocols. Ask me anything, or run a diagnostic." }
  ]);
  const [coachInput, setCoachInput] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);

  // ---- Helper generator logic (simulation with deep context) ----
  const handleGenerateCaption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captionTopic) {
      onNotify("Input Required", "Please specify a topic or photo idea first.");
      return;
    }
    setCaptionLoading(true);
    setTimeout(() => {
      let cap = "";
      let tags: string[] = [];
      if (captionTone === "spicy") {
        cap = `Locked VIP Preview: Unveiling the source nodes behind my new spatial 3D modifier project. You'll find things other platforms censor. Wet spot verified and ready for deep exploration. Link in bio to access raw render layers! 🤫✨`;
        tags = ["#TheWetSpot", "#ExclusiveRenders", "#RenderGods", "#VIPTiers", "#UnlockedAccess"];
      } else if (captionTone === "elegant") {
        cap = `An exclusive study in mathematical symmetry and visual depth. I'm broadcasting the raw presets and configuration layouts directly to our Verified Core community. Thank you for making independent monetization so powerful. 🥂🔮`;
        tags = ["#AestheticEvolution", "#DigitalExclusives", "#SymmetryLab", "#PioneerArt"];
      } else {
        cap = `Just finished compiling the new lofi audio synthesis modules. It feels amazing keeping 90% of aggregate tips directly on-chain here. Drop a comment with your preset requests. 🎛️🎧`;
        tags = ["#CreatorEconomy", "#SynthGeek", "#DirectSupport", "#IndependentMusic"];
      }
      setGeneratedCaption(cap);
      setGeneratedHashtags(tags);
      setCaptionLoading(false);
      onNotify("AI Copy Complete", "Highly optimized captions and high-conversion hashtags deployed!");
    }, 1200);
  };

  const handleAISuggestPrompt = (prompt: string) => {
    setAssistantPrompt(prompt);
  };

  const handleRunAIChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantPrompt.trim()) return;
    setAssistantLoading(true);
    setTimeout(() => {
      const respText = `Based on current real-time trending metrics on alternative networks, here is your specialized content protocol:\n\n` +
        `1. **Content Hook**: Highlight the raw developer presets behind your visuals. The audience is highly receptive to tools rather than polished videos.\n` +
        `2. **Engagement Blueprint**: Issue a high-contrast challenge: have fans vote on the next preset style. Lock the final project source code at $9.99.\n` +
        `3. **Conversion Catalyst**: Provide standard core members direct message priorities. One personalized message increases standard lock conversion rate by 340% within 48 hours.`;
      setAssistantResponse(respText);
      setAssistantLoading(false);
      onNotify("AI Engine Finished", "Custom intelligence generated based on platform parameters.");
    }, 1500);
  };

  const handleSendToCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;
    const userMsg = coachInput;
    setCoachChat(prev => [...prev, { sender: "user", text: userMsg }]);
    setCoachInput("");
    setCoachLoading(true);
    
    setTimeout(() => {
      let replyText = "";
      if (userMsg.toLowerCase().includes("price") || userMsg.toLowerCase().includes("pricing")) {
        replyText = "Analyzing your subscriber pool: keeping standard levels at $15 is excellent for retention. However, your top 10% premium core group is currently begging for bespoke presets. I advise establishing a 'VIP Backstage pass' tier priced at exactly $45.00 within your Credentials Hub. This will unlock a secondary revenue tier instantly.";
      } else if (userMsg.toLowerCase().includes("trend") || userMsg.toLowerCase().includes("viral")) {
        replyText = "Trend scan complete: 'Ambient shader parameters' and 'WebGL real-time generators' are seeing a 180% surge in viewer retention metrics. If you schedule a livestream with standard WebGL presets, your target tip capture will likely exceed $120.00.";
      } else {
        replyText = "Telemetry report logged, SilverFoxx. I suggest optimizing your direct message delivery speed. Fans who purchase premium locked content average 80% higher retention when you respond to their premium unlock notification within 8 minutes. Try applying our AI-generated automated reply suggestion templates.";
      }
      setCoachChat(prev => [...prev, { sender: "coach", text: replyText }]);
      setCoachLoading(false);
      onNotify("AI Coach Replied", "New tactical growth suggestions have been added.");
    }, 1400);
  };

  const triggerOutreachRescue = (username: string) => {
    onNotify(
      "Rescue Stream Active", 
      `Sent custom high-incentive direct message to @${username} with custom 50% discount voucher.`
    );
    setChurnFans(prev => prev.filter(f => f.username !== username));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onNotify("Copied to Clipboard", "Text has been stored successfully.");
  };

  useEffect(() => {
    // Pricing recommendation optimization matrix calculations
    const multiplier = 1 + (20 - currentPrice) * 0.04;
    const revInc = `${Math.max(12, Math.round((20 - currentPrice) * 6 + 15))}%`;
    const reco = Math.max(9.99, currentPrice * 1.25);
    setCalculatedOptimal({
      price: parseFloat(reco.toFixed(2)),
      revenueIncrease: revInc,
      confidence: `${Math.min(98, 88 + Math.round(currentPrice % 10))}%`
    });
  }, [currentPrice]);

  return (
    <div className="w-full text-white max-w-5xl mx-auto px-4 sm:px-6 py-6 font-sans">
      
      {/* Header section with telemetry tags */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-white/5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-teal-400 bg-teal-400/5 px-2.5 py-1 rounded-full border border-teal-400/10">
              ⚡ Multi-Agent Coprocessor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Brain className="w-8 h-8 text-teal-400 animate-pulse" />
            AI Creator Optimization Suite
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Activate premium neural optimization agents to scale audience conversion metrics, predict churn risks, and maximize digital output.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950/40 border border-white/5 px-4 py-2 rounded-xl text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-zinc-400">Models: <span className="text-white font-bold">Gemini 3.5 Pro</span></span>
        </div>
      </div>

      {/* Main Page Tabs */}
      <div className="flex border-b border-white/5 gap-4 mt-8 overflow-x-auto pb-px scrollbar-none">
        {[
          { id: "content", label: "Neural Content Lab", desc: "GenAI & Captions", icon: <Sparkles className="w-4 h-4" /> },
          { id: "optimization", label: "Smart Monetization Engine", desc: "Pricing & Logic", icon: <DollarSign className="w-4 h-4" /> },
          { id: "audience", label: "Audience & Fan Intel", desc: "Churn Prediction", icon: <Users className="w-4 h-4" /> },
          { id: "coach", label: "Ecosystem AI Coach", desc: "Digital Strategist", icon: <Dumbbell className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2.5 pb-4 px-1 text-xs text-left cursor-pointer transition-all border-b-2 font-sans relative shrink-0 min-w-[150px]
              ${activeTab === tab.id 
                ? "border-teal-400 text-teal-400 font-bold" 
                : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
          >
            <div className={`p-1.5 rounded-lg border transition-colors
              ${activeTab === tab.id 
                ? "bg-teal-500/10 border-teal-500/20 text-teal-400" 
                : "bg-zinc-950/20 border-white/5"
              }`}>
              {tab.icon}
            </div>
            <div>
              <span className="block font-semibold">{tab.label}</span>
              <span className="text-[10px] text-zinc-500 font-light mt-0.5 block">{tab.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {/* VIEWPORTS */}
      <div className="mt-8">
        
        {/* TAB 1: NEURAL CONTENT LAB */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Box: Prompts Content Assistant */}
            <div className="md:col-span-7 space-y-6">
              <GlassCard hoverEffect={false}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-teal-400" />
                    <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-white">AI Content Assistant & Strategy Generator</h3>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Live Sync</span>
                </div>

                <form onSubmit={handleRunAIChat} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-2">Configure target topic / goal</label>
                    <textarea
                      placeholder="e.g. Give me 3 high-performance content ideas targeting the platinum tier standard using custom lofi audio loops..."
                      value={assistantPrompt}
                      onChange={(e) => setAssistantPrompt(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-950/60 border border-white/5 focus:border-teal-500/35 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center flex-wrap gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono">Presets:</span>
                      {[
                        "VIP Preset lock ideas",
                        "Livestream blueprint",
                        "Caption booster"
                      ].map((preset, pidx) => (
                        <button
                          key={pidx}
                          type="button"
                          onClick={() => handleAISuggestPrompt(preset === "VIP Preset lock ideas" ? "Design an exclusive digital downloadable preset that can be unlocked in DMs for $15, explain the hook." : preset === "Livestream blueprint" ? "Outline a structure for a visual live-stream event that generates continuous direct tips" : "Compose a short promotional narrative optimized for high subscription conversion")}
                          className="bg-zinc-900 border border-white/5 hover:border-teal-500/20 rounded-lg text-[9px] text-zinc-400 px-2.5 py-1 text-left cursor-pointer transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <NeonButton type="submit" variant="teal" size="sm" disabled={assistantLoading} className="flex items-center gap-1">
                      {assistantLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing feeds...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> Initialize AI Assistant
                        </>
                      )}
                    </NeonButton>
                  </div>
                </form>

                {assistantResponse && (
                  <div className="mt-6 border-t border-white/5 pt-5 text-left">
                    <span className="text-[10px] text-teal-400 font-mono font-bold block mb-2">⚡ AI Engine Recommendation Output</span>
                    <div className="p-4 bg-teal-950/5 border border-teal-500/10 rounded-xl text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-line relative group">
                      {assistantResponse}
                      <button 
                        onClick={() => copyToClipboard(assistantResponse)}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 bg-zinc-950/80 border border-white/10 rounded text-zinc-400 hover:text-white transition-all cursor-pointer"
                        title="Copy text"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* Caption and hashtag generator card */}
              <GlassCard hoverEffect={false}>
                <div className="flex items-center gap-2 mb-4.5">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-white">AI Caption & Hashtag Multiplier</h3>
                </div>

                <form onSubmit={handleGenerateCaption} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-2">What are you publishing?</label>
                      <input
                        type="text"
                        placeholder="e.g. drop of premium audio wave filters or 3D setup"
                        value={captionTopic}
                        onChange={(e) => setCaptionTopic(e.target.value)}
                        className="w-full bg-zinc-950/60 border border-white/5 focus:border-teal-500/35 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-2">Target Expression</label>
                      <select
                        value={captionTone}
                        onChange={(e) => setCaptionTone(e.target.value)}
                        className="w-full bg-zinc-950/60 border border-white/5 focus:border-teal-500/35 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-colors"
                      >
                        <option value="spicy">Spicy & Locked paywall</option>
                        <option value="elegant">Elegant & Conceptual</option>
                        <option value="casual">Casual & Interactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <NeonButton type="submit" variant="glass" size="sm" disabled={captionLoading}>
                      {captionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Deploy Writing Protocols"}
                    </NeonButton>
                  </div>
                </form>

                {generatedCaption && (
                  <div className="mt-5 space-y-4 text-left border-t border-white/5 pt-4">
                    <div className="relative p-3.5 bg-zinc-950/40 rounded-xl border border-zinc-900 group">
                      <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block mb-2">Ready to broadcast text block</span>
                      <p className="text-xs text-zinc-200 leading-relaxed font-sans font-light">{generatedCaption}</p>
                      <button 
                        onClick={() => copyToClipboard(generatedCaption)}
                        className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 bg-zinc-950/80 border border-white/10 rounded text-zinc-400 hover:text-white transition-all cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest block mb-2">High Conversion Hashtags</span>
                      <div className="flex flex-wrap gap-2">
                        {generatedHashtags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            onClick={() => copyToClipboard(tag)}
                            className="bg-teal-500/5 hover:bg-teal-500/10 cursor-pointer border border-teal-500/10 rounded-full px-2.5 py-1 text-[10px] font-mono font-medium text-teal-400 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Right Box: Viral Trends & Interactive Timeline scheduler */}
            <div className="md:col-span-5 space-y-6">
              
              {/* Viral Trend Detector */}
              <GlassCard hoverEffect={false}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold tracking-wide uppercase font-mono text-zinc-200">Viral Trend Detector</h3>
                  </div>
                  <span className="text-[8px] bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20 font-mono">Live feeds</span>
                </div>

                <div className="space-y-3.5 text-left text-xs">
                  {[
                    { topic: "Spatial Audio Synth presets", volume: "+240% reach", score: "96 pts", trend: "explosive", color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
                    { topic: "Mathematical GLSL Shader shaders", volume: "+125% renews", score: "88 pts", trend: "high", color: "text-teal-400 bg-teal-500/5 border-teal-500/10" },
                    { topic: "Bespoke DM response customizer", volume: "+88% tip boost", score: "74 pts", trend: "modest", color: "text-zinc-400 bg-zinc-950 border-white/5" }
                  ].map((tr, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950/30 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white mb-0.5">{tr.topic}</h4>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-sans">
                          {tr.volume} • <span className="text-zinc-400 font-mono">{tr.score}</span>
                        </span>
                      </div>
                      <span className={`text-[9px] uppercase font-mono tracking-wider font-extrabold border px-2 py-0.5 rounded ${tr.color}`}>
                        {tr.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Content Scheduling Assistant */}
              <GlassCard hoverEffect={false}>
                <div className="flex items-center gap-1.5 mb-4">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <h3 className="text-xs font-bold tracking-wide uppercase font-mono text-zinc-200 font-bold">Scheduling Optimization</h3>
                </div>
                
                <p className="text-[11px] text-zinc-450 leading-relaxed font-sans mb-4">
                  Neural scheduling engine analyzes active checkout hours based on standard subscriber geographies. Target pricing peaks during late hours.
                </p>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {["Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`text-[10px] py-2 rounded-xl border text-center transition-all cursor-pointer font-sans
                        ${selectedDay === day 
                          ? "bg-teal-500/10 border-teal-500/20 text-teal-400 font-bold" 
                          : "bg-zinc-950/40 border-white/5 text-zinc-500 hover:text-white"
                        }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-xl text-left text-xs font-sans">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-550">Recommended Target Span</span>
                    <span className="text-emerald-400 text-[10px] font-mono leading-none">94% Affinity Score</span>
                  </div>
                  <h4 className="font-bold text-white">
                    {selectedDay === "Friday" ? "6:30 PM - 8:45 PM EST" : 
                     selectedDay === "Saturday" ? "4:15 PM - 7:00 PM EST" : "8:00 PM - 10:15 PM EST"}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal italic font-light">
                    Why? Spatial synth adapters drop active wallets during direct Friday checkout cycles.
                  </p>
                </div>
              </GlassCard>
            </div>

          </div>
        )}

        {/* TAB 2: SMART MONETIZATION ENGINE */}
        {activeTab === "optimization" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
            
            {/* Left pricing Optimization */}
            <div className="md:col-span-6 space-y-6">
              <GlassCard hoverEffect={false}>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-white">AI Subscription Pricing Advisor</h3>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light mb-6">
                  Adjust your active base subscription price indicator below. The pricing matrix computes maximum volume elasticities instantly.
                </p>

                <div className="space-y-4 bg-zinc-900/30 p-4 rounded-xl border border-white/5 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Current Base Price:</span>
                    <span className="font-mono text-lg font-bold text-teal-400">${currentPrice}.00/mo</span>
                  </div>
                  
                  {/* Custom Slider */}
                  <div className="space-y-1">
                    <input 
                      type="range" 
                      min="4.99" 
                      max="49.99" 
                      step="1"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                      <span>$4.99</span>
                      <span>$25.00</span>
                      <span>$49.99</span>
                    </div>
                  </div>
                </div>

                {/* AI pricing output recommendations */}
                <div className="border border-teal-500/10 bg-teal-950/5 p-4 rounded-xl">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-teal-400 block mb-2.5">Neural Pricing Recommendation Matrix</span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center border-b border-white/5 pb-3">
                    <div>
                      <span className="text-[9px] text-zinc-500 block uppercase font-mono">Target Price</span>
                      <span className="text-sm font-mono font-bold text-white">${calculatedOptimal.price}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-550 block uppercase font-mono">Est Revenue Growth</span>
                      <span className="text-sm font-mono font-bold text-emerald-450 text-emerald-400">+{calculatedOptimal.revenueIncrease}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-550 block uppercase font-mono">Confidence Level</span>
                      <span className="text-xs font-mono font-semibold text-zinc-300">{calculatedOptimal.confidence}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-sans font-light leading-relaxed mt-3 flex items-start gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>
                      Increasing standard fees modestly captures consumer surplus with zero churn impact, as your engagement score dominates 95% of equivalent tier designs.
                    </span>
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Right: Revenue Optimization Engine for digital products */}
            <div className="md:col-span-6 space-y-6">
              <GlassCard hoverEffect={false}>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-teal-400" />
                  <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-white">AI Revenue Optimization Engine</h3>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Manage lock parameters for custom-built presets, software bundles, or spatial wav files to trigger high-probability digital downloads.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono block mb-2">Configure target digital good type</label>
                    <select
                      value={targetCategory}
                      onChange={(e) => {
                        setTargetCategory(e.target.value);
                        if (e.target.value === "exclusive_presets") {
                          setDigitalPriceRecommendation({ price: "24.50", volumeEst: "140 units", isOptimal: true });
                        } else if (e.target.value === "glsl_shaders") {
                          setDigitalPriceRecommendation({ price: "18.00", volumeEst: "220 units", isOptimal: true });
                        } else {
                          setDigitalPriceRecommendation({ price: "49.00", volumeEst: "65 units", isOptimal: false });
                        }
                      }}
                      className="w-full bg-zinc-950/60 border border-white/5 focus:border-teal-500/35 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                    >
                      <option value="exclusive_presets">Lightroom Preset Packs</option>
                      <option value="glsl_shaders">WebGL / Custom Canvas Shader source files</option>
                      <option value="wav_synthesizers">Modular Wav Loops synthesizer presets</option>
                    </select>
                  </div>

                  <div className="p-4 bg-zinc-950/60 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500">Rec. Market Unlock Price</span>
                      <h4 className="text-xl font-mono font-black text-emerald-450 text-emerald-400 mt-1">${digitalPriceRecommendation.price}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-sans">Predicted Month 1 volume: {digitalPriceRecommendation.volumeEst}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full px-2.5 py-0.5 font-mono">
                        Optimal
                      </span>
                    </div>
                  </div>

                  <NeonButton 
                    variant="teal" 
                    className="w-full justify-center"
                    onClick={() => onNotify("Strategy Deployed", `Setting recommended target limits block for ${targetCategory.replace('_', ' ')}`)}
                  >
                    Deploy Strategy to Marketplace Node
                  </NeonButton>
                </div>
              </GlassCard>
            </div>

          </div>
        )}

        {/* TAB 3: AUDIENCE & FAN INTEL (Churn, DMs, Retention) */}
        {activeTab === "audience" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
            
            {/* Churn Prediction & automated outreach rescue list */}
            <div className="md:col-span-7 space-y-6">
              <GlassCard hoverEffect={false}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                    <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-white">Audience Retention Scoring & Churn Predictor</h3>
                  </div>
                  <span className="text-[9px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded font-mono">RISK RADAR</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light mb-5">
                  Our algorithm runs active background tracking on subscriber renewal records, login indexes, and feedback loops to forecast cancellations.
                </p>

                {churnFans.length === 0 ? (
                  <div className="text-center py-10 bg-teal-950/5 border border-teal-500/10 rounded-2xl">
                    <CheckCircle className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-white">Full Platform Safety Captured!</h4>
                    <span className="text-[10px] text-zinc-500">All risk levels mitigated on-schedule.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {churnFans.map((fan) => (
                      <div key={fan.id} className="p-3.5 bg-zinc-950/40 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-teal-500/15 transition-colors">
                        <div className="flex items-start gap-3">
                          <img
                            src={fan.avatar}
                            alt="avatar"
                            className="w-9 h-9 rounded-xl object-cover bg-zinc-900 border border-white/5"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-xs font-bold text-white">@{fan.username}</span>
                            <span className="text-[9px] text-zinc-500 ml-1.5 font-mono">({fan.tier})</span>
                            <p className="text-[10px] text-rose-400 font-mono mt-0.5 font-bold">{fan.score} • <span className="text-zinc-500 font-sans font-light">{fan.reason}</span></p>
                          </div>
                        </div>

                        <NeonButton 
                          variant="glass" 
                          size="sm" 
                          className="w-full sm:w-auto text-[10px] py-1.5 px-3"
                          onClick={() => triggerOutreachRescue(fan.username)}
                        >
                          Send Automated Rescue DM
                        </NeonButton>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* AI DM Reply suggestions */}
            <div className="md:col-span-5 space-y-6">
              <GlassCard hoverEffect={false}>
                <div className="flex items-center gap-1.5 mb-4">
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <h3 className="text-xs font-bold tracking-wide uppercase font-mono text-zinc-200">AI DM Reply Suggestions</h3>
                </div>

                <div className="p-3.5 bg-zinc-950/50 rounded-xl border border-zinc-900 text-xs text-left mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-teal-400 bg-teal-500/5 px-2 py-0.5 rounded">Incoming Core Fan message</span>
                  </div>
                  <h4 className="font-bold text-white mb-1">@{activeDMQuery.fanName}:</h4>
                  <p className="text-zinc-400 leading-normal font-sans font-light italic">"{activeDMQuery.msg}"</p>
                </div>

                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block mb-3">AI Powered Responses</span>

                <div className="space-y-2.5">
                  {activeDMQuery.suggestions.map((sug, idx) => {
                    const isSelected = selectedDMSuggestion === sug;
                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectedDMSuggestion(sug)}
                        className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all leading-relaxed font-sans
                          ${isSelected 
                            ? "bg-teal-500/10 border-teal-500/25 text-white font-medium" 
                            : "bg-zinc-950/30 border-white/5 text-zinc-400 hover:text-zinc-200"
                          }`}
                      >
                        {sug}
                      </div>
                    );
                  })}
                </div>

                {selectedDMSuggestion && (
                  <div className="mt-5">
                    <NeonButton 
                      variant="teal" 
                      className="w-full justify-center text-xs"
                      onClick={() => {
                        onNotify("Message Sent", `Selected suggestion deployed immediately to @${activeDMQuery.fanName}.`);
                        setSelectedDMSuggestion("");
                      }}
                    >
                      Approve & Dispatch Response
                    </NeonButton>
                  </div>
                )}
              </GlassCard>
            </div>

          </div>
        )}

        {/* TAB 4: CREATOR LANDSCAPE AI COACH */}
        {activeTab === "coach" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Interactive Coach interface */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <GlassCard hoverEffect={false} className="flex-grow flex flex-col justify-between h-[450px]">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-teal-400" />
                      <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-white">Ecosystem Creator AI Coach</h3>
                    </div>
                    <span className="text-[9px] bg-teal-500/10 text-teal-400 px-2.5 py-0.5 rounded border border-teal-500/20 font-mono">Agent Terminal</span>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 text-left text-xs mb-4 scrollbar-thin">
                    {coachChat.map((msg, idx) => (
                      <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                        <div className={`p-1.5 rounded-lg border h-fit shrink-0
                          ${msg.sender === "user" 
                            ? "bg-teal-500/10 border-teal-500/20 text-teal-400" 
                            : "bg-zinc-900 border-white/5 text-white"
                          }`}>
                          {msg.sender === "user" ? <Heart className="w-3.5 h-3.5 fill-current" /> : <Brain className="w-3.5 h-3.5" />}
                        </div>
                        <div className={`p-3 rounded-2xl border text-xs leading-relaxed font-sans
                          ${msg.sender === "user" 
                            ? "bg-teal-950/20 border-teal-500/10 text-white" 
                            : "bg-zinc-950/40 border-white/5 text-zinc-300"
                          }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {coachLoading && (
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 h-fit text-white shrink-0 antialiased">
                          <Brain className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                        <div className="p-3 rounded-2xl border border-dashed border-zinc-800 text-xs text-zinc-500 block leading-none font-sans flex items-center gap-2">
                          <RefreshCw className="w-3 h-3 animate-spin text-teal-450" /> Thinking...
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSendToCoach} className="flex gap-2 border-t border-white/5 pt-4">
                  <input
                    type="text"
                    value={coachInput}
                    onChange={(e) => setCoachInput(e.target.value)}
                    placeholder="Ask standard tips, price strategy setup, or trend scans..."
                    className="flex-grow bg-zinc-950 border border-white/5 focus:border-teal-500/35 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                  <NeonButton type="submit" variant="teal" size="sm" className="shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </NeonButton>
                </form>
              </GlassCard>
            </div>

            {/* Quick Diagnostic Insights coach summary */}
            <div className="md:col-span-4 text-left">
              <GlassCard hoverEffect={false} className="h-full flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">Daily Coach Directives</span>
                  <h3 className="text-xs font-bold text-white mt-1 mb-5">SilverFoxx Diagnostics Checks</h3>
                  
                  <div className="space-y-4 text-xs font-sans">
                    {[
                      { directive: "Define premium VIP Pass level ($45+)", status: "Pending", action: "Establish in credentials hub modal", style: "border-teal-400/20 bg-teal-400/5 text-teal-350" },
                      { directive: "Trigger Live Shader synthesizing Livestream", status: "High Demand", action: "Launch livestream broadcast tonight", style: "border-amber-400/20 bg-amber-400/5 text-amber-350" },
                      { directive: "Respond to @AestheticCrypto locked query", status: "Suggested", action: "Apply automated DM suggestions", style: "border-white/5 bg-zinc-950/20 text-zinc-450" }
                    ].map((dir, idx) => (
                      <div key={idx} className="p-3 bg-zinc-950/30 border border-white/5 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-white leading-tight font-sans text-xs">{dir.directive}</h4>
                          <span className={`text-[8px] font-mono font-bold uppercase rounded px-1.5 py-0.5 border ${dir.style}`}>
                            {dir.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 block font-sans font-light italic">{dir.action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 mt-6">
                  <NeonButton 
                    variant="glass" 
                    className="w-full justify-center flex items-center gap-1 text-[11px]"
                    onClick={() => {
                      onNotify("Diagnostic Sweep Completed", "Profile status score verified. Core credentials are safe.");
                      setCoachChat(prev => [...prev, { sender: "coach", text: "Diagnostics verify: you are trending 20% higher than equivalent creators. Lock custom files inside active streams to maintain standard conversions!" }]);
                    }}
                  >
                    Analyze Profile Analytics Telemetry
                  </NeonButton>
                </div>
              </GlassCard>
            </div>

          </div>
        )}

      </div>
      
    </div>
  );
};
