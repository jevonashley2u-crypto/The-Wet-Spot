import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const mockData = [
  { name: 'Mon', revenue: 4000, tips: 2400 },
  { name: 'Tue', revenue: 3000, tips: 1398 },
  { name: 'Wed', revenue: 2000, tips: 9800 },
  { name: 'Thu', revenue: 2780, tips: 3908 },
  { name: 'Fri', revenue: 1890, tips: 4800 },
  { name: 'Sat', revenue: 2390, tips: 3800 },
  { name: 'Sun', revenue: 3490, tips: 4300 },
];

export const EarningsDashboard: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-black p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Earnings Dashboard</h1>
            <p className="text-zinc-400">Track your monetization across subscriptions, tips, and PPV.</p>
          </div>
          
          <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(219,39,119,0.3)] flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Request Payout
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-24 h-24 text-pink-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-zinc-400 font-medium mb-2">
                <DollarSign className="w-5 h-5 text-pink-500" /> Total Balance
              </div>
              <div className="text-4xl font-black text-white mb-4">$24,592.00</div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-500 bg-green-500/10 w-fit px-2 py-1 rounded-full">
                <ArrowUpRight className="w-4 h-4" /> +12.5% this week
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-24 h-24 text-purple-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-zinc-400 font-medium mb-2">
                <TrendingUp className="w-5 h-5 text-purple-500" /> PPV & Tips
              </div>
              <div className="text-4xl font-black text-white mb-4">$8,240.50</div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-500 bg-green-500/10 w-fit px-2 py-1 rounded-full">
                <ArrowUpRight className="w-4 h-4" /> +4.2% this week
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="w-24 h-24 text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-zinc-400 font-medium mb-2">
                <Users className="w-5 h-5 text-blue-500" /> Active Subscribers
              </div>
              <div className="text-4xl font-black text-white mb-4">1,492</div>
              <div className="flex items-center gap-1 text-sm font-medium text-red-500 bg-red-500/10 w-fit px-2 py-1 rounded-full">
                <ArrowDownRight className="w-4 h-4" /> -1.2% this week
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6">Revenue Breakdown (7 Days)</h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" tick={{fill: '#71717a'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" tick={{fill: '#71717a'}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="tips" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTips)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
