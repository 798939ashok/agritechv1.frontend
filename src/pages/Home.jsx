import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Microscope, CloudSun, Newspaper, Sprout, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from '../context/AppContext';

export default function Home() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const features = [
    { icon: Microscope, title: 'Disease Detection',    desc: 'AI-powered crop disease identification with 95%+ accuracy using CNN deep learning model.',  color: 'text-red-400',    bg: 'bg-red-900/20 border-red-800/30' },
    { icon: Sprout,     title: 'Plant Identification', desc: 'Instantly identify unknown plants, weeds and invasive species from a photo.',                 color: 'text-green-400',  bg: 'bg-green-900/20 border-green-800/30' },
    { icon: CloudSun,   title: 'Weather Monitoring',   desc: 'Live weather data with AI farming advice — when to irrigate, spray, harvest.',               color: 'text-blue-400',   bg: 'bg-blue-900/20 border-blue-800/30' },
    { icon: Newspaper,  title: 'Government Alerts',    desc: 'PM Kisan, MSP announcements, subsidies and agriculture scheme notifications.',                color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/30' },
  ];

  const stats = [
    { value: '50K+', label: 'Farmers Served' },
    { value: '200+', label: 'Crop Diseases' },
    { value: '95%',  label: 'AI Accuracy' },
    { value: '6',    label: 'Indian Languages' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Farmer background image
            👉 Own image use cheyyadaniki: farmers.jpeg ni /frontend/public/ lo petti
               src ni "/farmers.jpeg" ga change cheyyi */}
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80"
          alt="Farmer in field"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Light overlay — image clearly visible */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.45) 100%)' }} />

        {/* Bottom wave */}
        <svg className="absolute bottom-0 left-0 right-0 w-full opacity-40" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#16a34a" d="M0,60L48,52C96,44,192,28,288,32C384,36,480,60,576,66C672,72,768,60,864,52C960,44,1056,40,1152,46C1248,52,1344,68,1392,76L1440,84L1440,120L0,120Z"/>
        </svg>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/20 text-green-300 text-xs font-semibold px-4 py-2 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {t('badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg"
          >
            {t('heroTitle1')}{' '}
            <span className="gradient-text">{t('heroTitle2')}</span>
            {' '}{t('heroTitle3')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/90 text-lg max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow"
          >
            {t('heroDesc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4">
              {t('getStarted')} <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="flex items-center justify-center gap-2 text-base px-8 py-4 rounded-xl font-semibold border-2 border-white/60 text-white hover:bg-white/10 backdrop-blur-sm transition-all">
              {t('loginDashboard')}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            {[t('trustFree'), t('trustOffline'), t('trustLang'), t('trustFarmers')].map(txt => (
              <span key={txt} className="flex items-center gap-1.5 text-xs text-white/80">
                <CheckCircle size={13} className="text-green-400" />{txt}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
              <p className="text-4xl font-bold gradient-text">{value}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">{t('featuresTitle')}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t('featuresDesc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className={`glass-card p-6 border ${bg} hover:scale-[1.02] transition-transform`}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}><Icon size={24} className={color} /></div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-900/60 to-primary-800/40 border border-primary-700/40 rounded-2xl p-10 text-center"
        >
          <Leaf size={40} className="text-primary-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">{t('ctaTitle')}</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">{t('ctaDesc')}</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
            {t('createAccount')} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
