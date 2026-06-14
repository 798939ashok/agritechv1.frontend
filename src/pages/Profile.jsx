import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Sprout, Edit3, Save, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp, useTranslation } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useApp();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });

  const save = () => { login(form); setEditing(false); toast.success('Profile updated'); };

  const stats = [
    { label: t('diseasesDetected'), value: '12' },
    { label: t('plantsIdentified'), value: '7' },
    { label: t('weatherChecks'), value: '34' },
    { label: t('daysActive'), value: '18' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-700 to-primary-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'F'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                  <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1.5"><MapPin size={12} />{user?.district}, {user?.state}</p>
                  <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-primary-900/40 border border-primary-700/40 rounded-full text-xs text-primary-300"><Sprout size={11} />{user?.main_crop} Farmer</span>
                </div>
              </div>
              {!editing
                ? <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white text-sm transition-all"><Edit3 size={14} />{t('editProfile')}</button>
                : <div className="flex gap-2">
                    <button onClick={save} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-600 text-white text-sm"><Save size={14} />{t('saveProfile')}</button>
                    <button onClick={() => { setEditing(false); setForm({...user}); }} className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"><X size={14} /></button>
                  </div>
              }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: User,   label: t('firstName') + ' ' + t('lastName'), key: 'name' },
                { icon: Phone,  label: t('phoneNumber'), key: 'phone' },
                { icon: MapPin, label: t('state'), key: 'state' },
                { icon: MapPin, label: t('district'), key: 'district' },
                { icon: Sprout, label: t('mainCrop'), key: 'main_crop' },
              ].map(({ icon: Icon, label, key }) => (
                <div key={key} className="bg-gray-900/60 rounded-xl p-4">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2"><Icon size={11} />{label}</p>
                  {editing
                    ? <input type="text" value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-field text-sm py-2" />
                    : <p className="text-white font-medium">{user?.[key] || '—'}</p>
                  }
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">{t('activitySummary')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(({ label, value }) => (
                <div key={label} className="bg-gray-900/60 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold gradient-text">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
