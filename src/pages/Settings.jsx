import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Globe, Bell, Volume2, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'Telugu — తెలుగు' },
  { code: 'hi', label: 'Hindi — हिंदी' },
  { code: 'ta', label: 'Tamil — தமிழ்' },
  { code: 'kn', label: 'Kannada — ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam — മലയാളം' },
];

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${value ? 'bg-primary-600' : 'bg-gray-600'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div className="glass-card p-5 mb-4">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{title}</h2>
      <div className="divide-y divide-gray-800">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, right }) {
  return (
    <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
          <Icon size={15} className="text-gray-400" />
        </div>
        <span className="text-sm text-white">{label}</span>
      </div>
      <div className="flex-shrink-0">{right}</div>
    </div>
  );
}

export default function Settings() {
  const { darkMode, setDarkMode, language, setLanguage, logout } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifWeather,  setNotifWeather]  = useState(true);
  const [notifGovt,     setNotifGovt]     = useState(true);
  const [notifTips,     setNotifTips]     = useState(true);
  const [notifDisease,  setNotifDisease]  = useState(true);
  const [voiceEnabled,  setVoiceEnabled]  = useState(true);
  const [voiceRate,     setVoiceRate]     = useState('normal');

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  const handleLangChange = (e) => {
    const code = e.target.value;
    setLanguage(code);
    const label = LANGUAGES.find(l => l.code === code)?.label;
    toast.success(`Language: ${label}`);
  };

  const handleDarkMode = (val) => {
    setDarkMode(val);
    toast.success(val ? 'Dark mode ON' : 'Light mode ON');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-6">{t('settingsTitle')}</h1>

          <Section title={t('appearance')}>
            <Row icon={darkMode ? Moon : Sun} label={darkMode ? t('darkModeOn') : t('lightModeOn')}
              right={<Toggle value={darkMode} onChange={handleDarkMode} />} />
          </Section>

          <Section title={t('language')}>
            <Row icon={Globe} label={t('appLanguage')}
              right={
                <select value={language} onChange={handleLangChange}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              }
            />
          </Section>

          {/* FIREBASE NOTIFICATION START */}
          <Section title={t('notificationsTitle')}>
            <Row icon={Bell} label={t('weatherAlerts')}   right={<Toggle value={notifWeather}  onChange={setNotifWeather} />} />
            <Row icon={Bell} label={t('govtSchemes')}     right={<Toggle value={notifGovt}     onChange={setNotifGovt} />} />
            <Row icon={Bell} label={t('dailyTips')}       right={<Toggle value={notifTips}     onChange={setNotifTips} />} />
            <Row icon={Bell} label={t('diseaseAlerts')}   right={<Toggle value={notifDisease}  onChange={setNotifDisease} />} />
          </Section>
          {/* FIREBASE NOTIFICATION END */}

          <Section title={t('voiceTitle')}>
            <Row icon={Volume2} label={t('enableVoice')} right={<Toggle value={voiceEnabled} onChange={setVoiceEnabled} />} />
            {voiceEnabled && (
              <Row icon={Volume2} label={t('speechRate')}
                right={
                  <div className="flex gap-2">
                    {[['slow', t('slow')], ['normal', t('normal')], ['fast', t('fast')]].map(([val, label]) => (
                      <button key={val} onClick={() => setVoiceRate(val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${voiceRate === val ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                      >{label}</button>
                    ))}
                  </div>
                }
              />
            )}
          </Section>

          <Section title={t('account')}>
            <button onClick={handleLogout} className="flex items-center gap-3 w-full py-2 text-red-400 hover:text-red-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-red-900/30 flex items-center justify-center">
                <LogOut size={15} className="text-red-400" />
              </div>
              <span className="text-sm font-medium">{t('logoutBtn')}</span>
            </button>
          </Section>

          <div className="text-center mt-8 text-gray-600 text-xs">AgriSense AI v1.0.0 · Final Year CSE Project · Amrita Sai Institute</div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
