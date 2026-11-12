import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Admin credentials (change in production) ──
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'agrisense@2026';

export default function AdminLogin() {
  const navigate = useNavigate();
  const userRef = useRef();
  const passRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    const u = userRef.current.value.trim();
    const p = passRef.current.value.trim();

    setTimeout(() => {
      if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
        localStorage.setItem('agrisense_admin', 'true');
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid admin credentials');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600/20 border border-red-700/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">AgriSense AI — Administrator Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Username</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input ref={userRef} type="text" placeholder="admin" className="input-field pl-10" required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input ref={passRef} type="password" placeholder="••••••••" className="input-field pl-10" required />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95"
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <> Login as Admin <ArrowRight size={16} /> </>
            }
          </button>
        </form>

        <div className="mt-6 p-3 bg-red-900/20 border border-red-800/30 rounded-xl">
          <p className="text-xs text-red-300 text-center">
            🔒 Restricted area — Admin only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
