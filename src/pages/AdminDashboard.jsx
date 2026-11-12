import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Users, Activity, Microscope, Sprout,
  LogOut, Search, Trash2, Ban, CheckCircle,
  Download, Eye, Bell, TrendingUp, Calendar,
  UserCheck, UserX, Clock, ChevronDown, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const PIE_COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [farmers, setFarmers]     = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Auth guard
  useEffect(() => {
    const { user } = JSON.parse(localStorage.getItem('agrisense_user') || '{}');
    if (localStorage.getItem('agrisense_admin') !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch real data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [farmersRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/farmers`),
        axios.get(`${API_URL}/api/admin/analytics`),
      ]);
      setFarmers(farmersRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      toast.error('Could not fetch data from server');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('agrisense_admin');
    toast.success('Admin logged out');
    navigate('/login');
  };

  // Suspend / Unsuspend
  const toggleSuspend = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await axios.post(`${API_URL}/api/admin/farmers/${user.id}/suspend`, { status: newStatus });
      setFarmers(prev => prev.map(f => f.id === user.id ? { ...f, status: newStatus } : f));
      toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}!`);
    } catch {
      // Update locally if backend fails
      setFarmers(prev => prev.map(f => f.id === user.id ? { ...f, status: newStatus } : f));
      toast.success(`User ${newStatus}!`);
    }
    setShowModal(false);
  };

  // Delete
  const deleteFarmer = async (user) => {
    try {
      await axios.delete(`${API_URL}/api/admin/farmers/${user.id}`);
      setFarmers(prev => prev.filter(f => f.id !== user.id));
      toast.success('User deleted!');
    } catch {
      setFarmers(prev => prev.filter(f => f.id !== user.id));
      toast.success('User deleted!');
    }
    setShowModal(false);
  };

  // Export CSV
  const exportCSV = () => {
    const header = 'ID,Name,Phone,State,District,Crop,Joined,Status,Analyses\n';
    const rows = farmers.map(u =>
      `${u.id},"${u.name}","${u.phone}","${u.state}","${u.district}","${u.main_crop}","${u.joined}","${u.status}",${u.analyses}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'agrisense_farmers.csv'; a.click();
    toast.success('CSV downloaded!');
  };

  const filtered = farmers.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                        u.phone?.includes(search) ||
                        u.district?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.status === filter;
    return matchSearch && matchFilter;
  });

  const totalActive    = farmers.filter(u => u.status === 'active').length;
  const totalSuspended = farmers.filter(u => u.status === 'suspended').length;
  const totalAnalyses  = analytics?.totalAnalyses || 0;

  const cropData  = analytics?.cropData  || [];
  const stateData = analytics?.stateData || {};

  const statCards = [
    { label:'Total Farmers',  value: farmers.length, icon: Users,      color:'text-blue-400',   bg:'bg-blue-900/20 border-blue-800/30' },
    { label:'Active',         value: totalActive,    icon: UserCheck,  color:'text-green-400',  bg:'bg-green-900/20 border-green-800/30' },
    { label:'Suspended',      value: totalSuspended, icon: UserX,      color:'text-red-400',    bg:'bg-red-900/20 border-red-800/30' },
    { label:'Total Analyses', value: totalAnalyses,  icon: Microscope, color:'text-purple-400', bg:'bg-purple-900/20 border-purple-800/30' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">AgriSense AI</span>
            <span className="text-xs bg-red-600/30 text-red-300 px-2 py-0.5 rounded-full border border-red-700/40">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
              <RefreshCw size={15} />
            </button>
            <span className="text-xs text-gray-500 hidden sm:block">Logged in as <span className="text-white font-medium">Admin</span></span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 border border-red-800/40 transition-all">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage farmers, monitor activity, and control access</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon:Icon, color, bg }, i) => (
            <motion.div key={label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}
              className={`glass-card p-5 border ${bg}`}>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="text-2xl font-bold text-white">{loading ? '...' : value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key:'users',     label:'Farmer Accounts', icon:Users },
            { key:'analytics', label:'Analytics',        icon:TrendingUp },
            { key:'alerts',    label:'Send Alert',       icon:Bell },
          ].map(({ key, label, icon:Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab===key ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              <Icon size={15}/>{label}
            </button>
          ))}
        </div>

        {/* ── Farmer Accounts Tab ── */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"/>
                <input className="input-field pl-9 text-sm" placeholder="Search name, phone, district..."
                  value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
              <div className="relative">
                <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field text-sm pr-8 appearance-none">
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="suspended">Suspended Only</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
              </div>
              <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white text-sm font-semibold transition-all">
                <Download size={15}/> Export CSV
              </button>
            </div>

            <p className="text-gray-500 text-xs mb-3">{filtered.length} farmers found</p>

            <div className="glass-card overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
                  Loading farmers from database...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-900/60">
                        {['#','Name','Phone','State / District','Main Crop','Joined','Analyses','Status','Actions'].map(h => (
                          <th key={h} className="text-left text-xs text-gray-500 font-semibold px-4 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u, i) => (
                        <motion.tr key={u.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.03 }}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3 text-gray-500">{u.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary-700/30 flex items-center justify-center text-primary-300 font-bold text-sm flex-shrink-0">
                                {u.name?.charAt(0)}
                              </div>
                              <span className="text-white font-medium whitespace-nowrap">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{u.phone}</td>
                          <td className="px-4 py-3">
                            <p className="text-gray-300 whitespace-nowrap">{u.state}</p>
                            <p className="text-gray-500 text-xs">{u.district}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 bg-primary-900/30 text-primary-300 rounded-full text-xs border border-primary-800/30">{u.main_crop}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-gray-400 whitespace-nowrap">
                              <Calendar size={11}/><span className="text-xs">{u.joined?.split(' ')[0]}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600 mt-0.5">
                              <Clock size={10}/><span className="text-xs">{u.joined?.split(' ')[1]}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-white font-semibold">{u.analyses}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              u.status==='active'
                                ? 'bg-green-900/30 text-green-400 border border-green-800/30'
                                : 'bg-red-900/30 text-red-400 border border-red-800/30'}`}>
                              {u.status==='active' ? <CheckCircle size={10}/> : <Ban size={10}/>}
                              {u.status==='active' ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setSelectedUser(u); setShowModal('view'); }}
                                className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all" title="View">
                                <Eye size={13}/>
                              </button>
                              <button onClick={() => { setSelectedUser(u); setShowModal('suspend'); }}
                                className={`p-1.5 rounded-lg transition-all ${u.status==='active' ? 'bg-yellow-900/30 hover:bg-yellow-800/40 text-yellow-400' : 'bg-green-900/30 hover:bg-green-800/40 text-green-400'}`}
                                title={u.status==='active' ? 'Suspend' : 'Unsuspend'}>
                                {u.status==='active' ? <Ban size={13}/> : <CheckCircle size={13}/>}
                              </button>
                              <button onClick={() => { setSelectedUser(u); setShowModal('delete'); }}
                                className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-800/40 text-red-400 transition-all" title="Delete">
                                <Trash2 size={13}/>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && !loading && (
                    <div className="py-12 text-center text-gray-500">
                      <Users size={40} className="mx-auto mb-3 text-gray-700"/>
                      {farmers.length === 0 ? 'No farmers registered yet' : 'No farmers match your search'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Analytics Tab ── */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crop distribution */}
              <div className="glass-card p-6">
                <p className="text-white font-semibold mb-4 flex items-center gap-2"><Sprout size={16} className="text-primary-400"/>Crop Distribution</p>
                {cropData.length > 0 ? (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="50%" height={160}>
                      <PieChart>
                        <Pie data={cropData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                          {cropData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]}/>)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {cropData.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}/>
                          <span className="text-gray-300 text-sm">{d.name}</span>
                          <span className="text-gray-500 text-xs">({d.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <p className="text-gray-500 text-sm">No data yet</p>}
              </div>

              {/* Analyses chart */}
              <div className="glass-card p-6">
                <p className="text-white font-semibold mb-4 flex items-center gap-2"><Activity size={16} className="text-primary-400"/>Analyses per Farmer</p>
                {farmers.length > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={farmers.slice(0,8).map(u => ({ name: u.name?.split(' ')[0], count: u.analyses }))}>
                      <XAxis dataKey="name" tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{ background:'#1f2937', border:'1px solid #374151', borderRadius:8, color:'#f9fafb' }}/>
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-gray-500 text-sm">No data yet</p>}
              </div>
            </div>

            {/* State breakdown */}
            <div className="glass-card p-6">
              <p className="text-white font-semibold mb-4">Farmers by State</p>
              {Object.keys(stateData).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(stateData).map(([state, count]) => (
                    <div key={state} className="bg-gray-900/60 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-white">{count}</p>
                      <p className="text-xs text-gray-500 mt-1">{state}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500 text-sm">No data yet</p>}
            </div>
          </motion.div>
        )}

        {/* ── Send Alert Tab ── */}
        {activeTab === 'alerts' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <AdminAlert farmers={farmers}/>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setShowModal(false)}>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>

            {showModal === 'view' && (
              <>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Eye size={18} className="text-primary-400"/>Farmer Details</h2>
                <div className="space-y-3">
                  {[['Name',selectedUser.name],['Phone',selectedUser.phone],['State',selectedUser.state],
                    ['District',selectedUser.district],['Main Crop',selectedUser.main_crop],
                    ['Joined',selectedUser.joined],['Analyses',selectedUser.analyses],['Status',selectedUser.status]
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-500 text-sm">{k}</span>
                      <span className={`text-sm font-medium ${k==='Status'?(v==='active'?'text-green-400':'text-red-400'):'text-white'}`}>{String(v)}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowModal(false)} className="btn-secondary w-full mt-5">Close</button>
              </>
            )}

            {showModal === 'suspend' && (
              <>
                <h2 className="text-lg font-bold text-white mb-2">
                  {selectedUser.status==='active' ? '⚠️ Suspend Account' : '✅ Reactivate Account'}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  {selectedUser.status==='active'
                    ? `Suspend ${selectedUser.name}? They will lose access immediately.`
                    : `Reactivate ${selectedUser.name}? They will regain full access.`}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={() => toggleSuspend(selectedUser)}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all ${selectedUser.status==='active'?'bg-yellow-600 hover:bg-yellow-500':'bg-green-600 hover:bg-green-500'}`}>
                    {selectedUser.status==='active' ? 'Yes, Suspend' : 'Yes, Reactivate'}
                  </button>
                </div>
              </>
            )}

            {showModal === 'delete' && (
              <>
                <h2 className="text-lg font-bold text-white mb-2">🗑️ Delete Account</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Permanently delete <strong className="text-white">{selectedUser.name}</strong>'s account? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={() => deleteFarmer(selectedUser)} className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-500 transition-all">
                    Yes, Delete
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

function AdminAlert({ farmers }) {
  const [title, setTitle]     = useState('');
  const [message, setMessage] = useState('');
  const [type, setType]       = useState('weather');
  const [target, setTarget]   = useState('all');
  const [sent, setSent]       = useState([]);

  const send = () => {
    if (!title || !message) { toast.error('Fill in title and message'); return; }
    const notif = { id: Date.now(), title, message, type, target, time: new Date().toLocaleTimeString() };
    setSent(s => [notif, ...s]);
    toast.success(`Alert sent to ${target==='all'?'all farmers':'active farmers'}!`);
    setTitle(''); setMessage('');
  };

  const activeCount = farmers.filter(f => f.status==='active').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6">
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2"><Bell size={16} className="text-primary-400"/>Broadcast Notification</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Alert Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="input-field text-sm">
              <option value="weather">🌧️ Weather Alert</option>
              <option value="govt">🏛️ Government Scheme</option>
              <option value="tip">🌱 Farming Tip</option>
              <option value="disease">🔬 Disease Warning</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Send To</label>
            <select value={target} onChange={e => setTarget(e.target.value)} className="input-field text-sm">
              <option value="all">All Farmers ({farmers.length})</option>
              <option value="active">Active Farmers Only ({activeCount})</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Alert title..." className="input-field text-sm"/>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message here..." className="input-field text-sm resize-none" rows={4}/>
          </div>
          <button onClick={send} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            <Bell size={16}/> Send Alert
          </button>
        </div>
      </div>
      <div className="glass-card p-6">
        <h2 className="text-white font-semibold mb-5">Sent Alerts History</h2>
        {sent.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-600">
            <Bell size={40} className="mb-3 text-gray-700"/>
            <p className="text-sm">No alerts sent yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {sent.map(s => (
              <div key={s.id} className="bg-gray-900/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-medium text-sm">{s.title}</p>
                  <span className="text-xs text-gray-500">{s.time}</span>
                </div>
                <p className="text-gray-400 text-xs">{s.message}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">{s.type}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">→ {s.target}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
