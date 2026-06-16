import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Users, UserPlus, Search, Trash2, Key, AlertTriangle, RefreshCw } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Bulk Create State
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkPrefix, setBulkPrefix] = useState('VIP_');

  const fetchUsers = async () => {
    if (!adminKey) {
      setError('Please provide your Supabase Service Role Key to authenticate.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/admin/users/', {
        headers: { 'x-admin-key': adminKey }
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users. Ensure your Admin Key is correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!adminKey) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    const newUsers = Array.from({ length: bulkCount }).map((_, i) => {
      const slot = i + 1;
      return {
        email: `${bulkPrefix.toLowerCase()}slot${slot}@thewetspot.space`,
        password: `WetSpotVIP${slot}!`,
        username: `${bulkPrefix}Slot_${slot}`
      };
    });

    try {
      const res = await fetch('/api/v1/admin/users/bulk-create', {
        method: 'POST',
        headers: { 
          'x-admin-key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users: newUsers })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSuccess(`Successfully created ${data.success_count} accounts.`);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to bulk create users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to completely delete this user from Auth and the Database?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess('User deleted successfully.');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAdminKey(val);
    localStorage.setItem('adminKey', val);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/50">
              <Shield className="text-red-500 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Platform Admin</h1>
              <p className="text-zinc-400 text-sm">God-mode User Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-zinc-500" />
            <input 
              type="password"
              placeholder="Supabase Service Role Key"
              value={adminKey}
              onChange={saveKey}
              className="bg-black border border-zinc-800 focus:border-red-500 rounded-lg px-4 py-2 w-64 text-sm outline-none font-mono"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-3">
            <Shield className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Actions Panel */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-emerald-500" />
                Bulk Provision Accounts
              </h2>
              <p className="text-xs text-zinc-400 mb-6">Instantly generate placeholder accounts to distribute to Grandfathered VIPs.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Account Prefix</label>
                  <input 
                    type="text" 
                    value={bulkPrefix}
                    onChange={(e) => setBulkPrefix(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Number of Accounts</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none focus:border-emerald-500"
                  />
                </div>
                <button 
                  onClick={handleBulkCreate}
                  disabled={loading || !adminKey}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Generate Accounts'}
                </button>
              </div>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-blue-500" />
                Directory
              </h2>
              <button 
                onClick={fetchUsers}
                disabled={loading || !adminKey}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Fetch Auth Users
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-hidden flex flex-col">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-zinc-400" />
              Auth Database ({users.length})
            </h2>
            
            <div className="flex-1 overflow-auto border border-zinc-800 rounded-xl bg-black">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Metadata (Handle)</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-600">
                        No users loaded. Click Fetch Auth Users.
                      </td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-zinc-300">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-400 font-mono">
                            {u.user_metadata?.handle || u.user_metadata?.username || 'No Handle'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-500 text-xs">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleDelete(u.id)}
                            className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="Force Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
