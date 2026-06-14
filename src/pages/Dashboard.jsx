import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Microscope, Sprout, CloudSun, Bell, Newspaper, Activity, TrendingUp, Calendar, ArrowRight, Clock } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotificationCard from '../components/NotificationCard';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../context/AppContext';

const healthData = [
  { name: 'Jan', score: 72 }, { name: 'Feb', score: 68 }, { name: 'Mar', score: 75 },
  { name: 'Apr', score: 80 }, { name: 'May', score: 77 }, { name: 'Jun', score: 85 },
];
const radialData = [{ name: 'Health', value: 85, fill: '#22c55e' }];
const recentAnalyses = [
  { id: 1, type: 'Disease', name: 'Rice Blast',      crop: 'Rice',   date: '2 hrs ago',  result: 'High',     color: 'text-red-400' },
  { id: 2, type: 'Plant',   name: 'Parthenium Weed', crop: 'Field',  date: '1 day ago',  result: 'Invasive', color: 'text-orange-400' },
  { id: 3, type: 'Disease', name: 'Leaf Blight',     crop: 'Wheat',  date: '2 days ago', result: 'Moderate', color: 'text-yellow-400' },
  { id: 4, type: 'Plant',   name: 'Tomato Plant',    crop: 'Garden', date: '3 days ago', result: 'Healthy',  color: 'text-green-400' },
];

export default function Dashboard() {
  const { user, notifications, markAllRead } = useApp();
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? t('goodMorning') : h < 17 ? t('goodAfternoon') : t('goodEvening'));
  }, [t]);

  const quickCards = [
    { title: t('disease'),   desc: 'Upload crop image for AI diagnosis', icon: Microscope, path: '/disease-detection', color: 'text-red-400',    bg: 'from-red-900/40 to-red-900/10',       border: 'border-red-800/40' },
    { title: t('plantId'),   desc: 'Identify unknown plants & weeds',    icon: Sprout,     path: '/plant-id',          color: 'text-green-400',  bg: 'from-green-900/40 to-green-900/10',   border: 'border-green-800/40' },
    { title: t('weather'),   desc: 'Live forecast & farming advice',     icon: CloudSun,   path: '/weather',            color: 'text-blue-400',   bg: 'from-blue-900/40 to-blue-900/10',    border: 'border-blue-800/40' },
    { title: t('govtNews'),  desc: 'Schemes, subsidies & MSP alerts',   icon: Newspaper,  path: '/news',               color: 'text-yellow-400', bg: 'from-yellow-900/40 to-yellow-900/10', border: 'border-yellow-800/40' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            <Calendar size={13} />{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </p>
          <h1 className="text-3xl font-bold text-white mt-1">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Farmer'}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1">
            {t('monitoring')} <span className="text-primary-400 font-medium">{user?.main_crop || 'your crops'}</span> · {user?.district}, {user?.state}
          </p>
        </motion.div>

        {/* Quick cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickCards.map(({ title, desc, icon: Icon, path, color, bg, border }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={path} className={`glass-card p-5 border ${border} bg-gradient-to-br ${bg} flex flex-col gap-3 hover:scale-[1.03] transition-transform group block`}>
                <div className={`w-10 h-10 rounded-xl bg-gray-900/60 flex items-center justify-center ${color}`}><Icon size={20} /></div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-snug">{desc}</p>
                </div>
                <ArrowRight size={14} className={`${color} group-hover:translate-x-1 transition-transform`} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-semibold flex items-center gap-2"><TrendingUp size={16} className="text-primary-400" />{t('cropHealthTrend')}</p>
                <p className="text-gray-500 text-xs mt-0.5">{t('last6Months')}</p>
              </div>
              <span className="text-primary-400 text-sm font-bold">85 / 100</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50,100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#f9fafb' }} />
                <Area type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} fill="url(#hg)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 flex flex-col items-center justify-center">
            <p className="text-white font-semibold mb-4 flex items-center gap-2"><Activity size={16} className="text-primary-400" />{t('overallHealth')}</p>
            <ResponsiveContainer width="100%" height={140}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-2">
              <p className="text-4xl font-bold gradient-text">85%</p>
              <p className="text-gray-500 text-xs">{t('cropHealthScore')}</p>
            </div>
          </motion.div>
        </div>

        {/* Recent + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-semibold flex items-center gap-2"><Clock size={16} className="text-primary-400" />{t('recentAnalyses')}</p>
              <Link to="/disease-detection" className="text-xs text-primary-400 hover:text-primary-300">{t('viewAll')} →</Link>
            </div>
            <div className="space-y-3">
              {recentAnalyses.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-900/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center ${item.color}`}>
                      {item.type === 'Disease' ? <Microscope size={14} /> : <Sprout size={14} />}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.crop} · {item.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-800 ${item.color}`}>{item.result}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-semibold flex items-center gap-2"><Bell size={16} className="text-primary-400" />{t('notifications')}</p>
              <button onClick={markAllRead} className="text-xs text-gray-500 hover:text-primary-400 transition-colors">{t('markAllRead')}</button>
            </div>
            <div className="space-y-3">
              {notifications.map((n, i) => <NotificationCard key={n.id} notification={n} index={i} />)}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
