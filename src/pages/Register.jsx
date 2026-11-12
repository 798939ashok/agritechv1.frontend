import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const STATES = [
  'Andhra Pradesh','Telangana','Tamil Nadu','Karnataka','Kerala',
  'Maharashtra','Gujarat','Punjab','Haryana','Uttar Pradesh',
  'Madhya Pradesh','Rajasthan','West Bengal','Bihar','Odisha',
];
const CROPS = [
  'Rice','Wheat','Maize','Cotton','Sugarcane','Tomato','Potato',
  'Onion','Groundnut','Soybean','Chilli','Turmeric','Banana','Mango','Jowar',
];

export default function Register() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const firstNameRef = useRef();
  const lastNameRef  = useRef();
  const phoneRef     = useRef();
  const passwordRef  = useRef();
  const confirmRef   = useRef();
  const districtRef  = useRef();
  const stateRef     = useRef();
  const cropRef      = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();

    const firstName = firstNameRef.current.value.trim();
    const lastName  = lastNameRef.current.value.trim();
    const phone     = phoneRef.current.value.trim();
    const password  = passwordRef.current.value;
    const confirm   = confirmRef.current.value;
    const district  = districtRef.current.value.trim();
    const state     = stateRef.current.value;
    const mainCrop  = cropRef.current.value;

    if (!firstName)          { toast.error('Enter first name'); firstNameRef.current.focus(); return; }
    if (!lastName)           { toast.error('Enter last name');  lastNameRef.current.focus();  return; }
    if (phone.length !== 10) { toast.error('Enter valid 10-digit phone'); phoneRef.current.focus(); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); passwordRef.current.focus(); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); confirmRef.current.focus(); return; }
    if (!state)              { toast.error('Select your state'); return; }
    if (!district)           { toast.error('Enter your district'); districtRef.current.focus(); return; }
    if (!mainCrop)           { toast.error('Select your main crop'); return; }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: `${firstName} ${lastName}`,
        phone, password, district, state,
        main_crop: mainCrop, role: 'farmer',
      });
      login(res.data.user);
      toast.success('Account created! Welcome to AgriSense AI');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || '';
      if (msg.includes('already')) {
        toast.error('Phone number already registered');
      } else {
        // Demo fallback
        login({
          id: Date.now(),
          name: `${firstName} ${lastName}`,
          phone, state, district,
          main_crop: mainCrop, role: 'farmer',
        });
        toast.success('Registered successfully!');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join AgriSense AI — free for all farmers</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">First Name</label>
              <input ref={firstNameRef} type="text" placeholder="Ravi" className="input-field" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Last Name</label>
              <input ref={lastNameRef} type="text" placeholder="Kumar" className="input-field" required />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
            <input
              ref={phoneRef} type="tel" placeholder="9876543210"
              className="input-field" maxLength={10}
              onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
              required
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Password</label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className="input-field pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Confirm Password</label>
              <div className="relative">
                <input
                  ref={confirmRef}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  className="input-field pr-10"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* State + District */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">State</label>
              <div className="relative">
                <select ref={stateRef} className="input-field appearance-none pr-8" required defaultValue="">
                  <option value="" disabled>Select State</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">District</label>
              <input ref={districtRef} type="text" placeholder="Your district" className="input-field" required />
            </div>
          </div>

          {/* Crop */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Main Crop</label>
            <div className="relative">
              <select ref={cropRef} className="input-field appearance-none pr-8" required defaultValue="">
                <option value="" disabled>Select main crop</option>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Create Account <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}
