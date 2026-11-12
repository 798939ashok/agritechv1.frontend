import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Phone, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Demo admin credentials (frontend fallback when backend offline)
const DEMO_ADMIN_PHONE    = '9999999999';
const DEMO_ADMIN_PASSWORD = 'admin@2026';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const phoneRef    = useRef();
  const passwordRef = useRef();
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const phone    = phoneRef.current.value.trim();
    const password = passwordRef.current.value;

    if (phone.length !== 10) { toast.error('Enter valid 10-digit phone'); phoneRef.current.focus(); return; }
    if (!password)           { toast.error('Enter your password'); passwordRef.current.focus(); return; }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { phone, password });
      const user = res.data.user;
      login(user);
      toast.success(`Welcome back, ${user.name}!`);
      // Role based redirect
      if (user.role === 'admin') {
        localStorage.setItem('agrisense_admin', 'true');
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || '';
      if (msg.includes('Invalid password')) {
        toast.error('Wrong password. Please try again.');
        setLoading(false);
        return;
      }
      // Demo fallback
      if (phone === DEMO_ADMIN_PHONE && password === DEMO_ADMIN_PASSWORD) {
        // Demo admin login
        const adminUser = { id: 0, name: 'Admin', phone, role: 'admin', state: '', district: '', main_crop: '' };
        login(adminUser);
        localStorage.setItem('agrisense_admin', 'true');
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        // Demo farmer login
        const demoUser = { id: Date.now(), name: 'Demo Farmer', phone, role: 'farmer', state: 'Andhra Pradesh', district: 'Guntur', main_crop: 'Rice' };
        login(demoUser);
        toast.success('Logged in (demo mode)');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Login to AgriSense AI</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Phone */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                ref={phoneRef}
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                className="input-field pl-10"
                maxLength={10}
                onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                ref={passwordRef}
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                className="input-field pl-10 pr-10"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Login <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">Register here</Link>
        </p>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-gray-800/60 border border-gray-700/40 rounded-xl space-y-1">
          <p className="text-xs text-gray-500 text-center font-semibold">Demo Credentials</p>
          <p className="text-xs text-gray-500 text-center">Farmer: any 10-digit number + any password</p>
          <p className="text-xs text-primary-400 text-center">Admin: 9999999999 + admin@2026</p>
        </div>
      </motion.div>
    </div>
  );
}
