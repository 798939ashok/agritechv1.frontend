import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Login() {
  const { login } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const phoneRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const phone = phoneRef.current.value.trim();
    if (phone.length !== 10) { toast.error('Enter valid 10-digit phone'); phoneRef.current.focus(); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { phone });
      login(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch {
      const demoUser = { id: 1, name: 'Demo Farmer', phone, state: 'Andhra Pradesh', district: 'Guntur', main_crop: 'Rice' };
      login(demoUser);
      toast.success('Logged in (demo mode)');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[100px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('welcomeBack')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('loginTitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">{t('phoneNumber')}</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                ref={phoneRef}
                type="tel"
                placeholder={t('enterPhone')}
                className="input-field pl-10"
                maxLength={10}
                onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{t('login')} <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('noAccount')}{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">{t('registerHere')}</Link>
        </p>
        <div className="mt-4 p-3 bg-primary-900/20 border border-primary-800/30 rounded-xl">
          <p className="text-xs text-primary-300 text-center">💡 Demo: enter any 10-digit number</p>
        </div>
      </motion.div>
    </div>
  );
}
