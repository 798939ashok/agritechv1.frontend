import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, LayoutDashboard, CloudSun, Newspaper, Settings, Menu, X, Bell, User, Microscope, Sprout, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, unreadCount } = useApp();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { path: '/',                  label: t('home'),     icon: Leaf },
    { path: '/disease-detection', label: t('disease'),  icon: Microscope },
    { path: '/plant-id',          label: t('plantId'),  icon: Sprout },
    { path: '/weather',           label: t('weather'),  icon: CloudSun },
    { path: '/news',              label: t('govtNews'), icon: Newspaper },
    { path: '/dashboard',         label: t('dashboard'),icon: LayoutDashboard },
    { path: '/settings',          label: t('settings'), icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg gradient-text hidden sm:block">AgriSense AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={15} />{label}
              </Link>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              <Link to="/dashboard" className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <User size={18} />
              </Link>
              <button onClick={handleLogout} className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all">
                <LogOut size={15} />{t('logout')}
              </button>
            </>
          )}
          {!user && (
            <Link to="/login" className="btn-primary text-sm px-4 py-2">{t('login')}</Link>
          )}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-800 px-4 pb-4 bg-gray-950/95"
          >
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium mt-1 transition-all ${
                  location.pathname === path ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={16} />{label}
              </Link>
            ))}
            {user && (
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium mt-1 text-red-400 hover:bg-gray-800 w-full">
                <LogOut size={16} />{t('logout')}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
