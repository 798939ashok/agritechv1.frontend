import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, RefreshCw, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsCard from '../components/NewsCard';
import { useTranslation } from '../context/AppContext';
import toast from 'react-hot-toast';

// NEWS API INTEGRATION START
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || '';
const NEWS_BASE = 'https://newsapi.org/v2/everything';
const AGR_Q = 'agriculture OR farming OR farmer OR crop OR "PM Kisan" OR subsidy OR MSP';
// NEWS API INTEGRATION END

const DEMO_ARTICLES = [
  { title:'PM-KISAN 17th Instalment Released: ₹20,000 Crore Transferred to 10 Crore Farmers', description:'The government has released the 17th instalment under PM-KISAN scheme, transferring ₹2,000 each to over 10 crore eligible farmer families.', url:'#', urlToImage:null, source:{name:'Agriculture Ministry'}, publishedAt:new Date(Date.now()-3600000*2).toISOString() },
  { title:'New MSP for Kharif Crops 2026: Paddy MSP Raised to ₹2,450 per Quintal', description:'Cabinet approved MSP for 14 Kharif crops. Paddy MSP raised by 5.35%, highest increase in 5 years.', url:'#', urlToImage:null, source:{name:'PIB India'}, publishedAt:new Date(Date.now()-3600000*5).toISOString() },
  { title:'AI-Powered Crop Disease Detection App Launched for Andhra Pradesh Farmers', description:'AP government partnered with ICAR to launch a mobile-based AI tool for crop disease identification, reducing chemical usage by 30%.', url:'#', urlToImage:null, source:{name:'Deccan Chronicle'}, publishedAt:new Date(Date.now()-3600000*8).toISOString() },
  { title:'Monsoon 2026 Forecast: IMD Predicts Above-Normal Rainfall in Kharif Season', description:'India Meteorological Department forecasts above-normal southwest monsoon rainfall benefiting rice, cotton, and soybean crops.', url:'#', urlToImage:null, source:{name:'IMD India'}, publishedAt:new Date(Date.now()-3600000*12).toISOString() },
  { title:'Drone-Based Pesticide Spraying Subsidy: Apply Under National Agriculture Scheme', description:'Government announces 50% subsidy on agricultural drones for farmers with holdings above 2 acres.', url:'#', urlToImage:null, source:{name:'Krishi Jagran'}, publishedAt:new Date(Date.now()-3600000*24).toISOString() },
  { title:'Tomato Prices Crash: Government Announces Emergency Procurement Scheme', description:'Farmers face crisis as tomato prices drop to ₹2/kg. Government announces emergency procurement and cold storage subsidy.', url:'#', urlToImage:null, source:{name:'The Hindu'}, publishedAt:new Date(Date.now()-3600000*30).toISOString() },
];

export default function News() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    if (!NEWS_API_KEY || NEWS_API_KEY === 'YOUR_NEWSAPI_KEY') {
      await new Promise(r => setTimeout(r, 700));
      setArticles(DEMO_ARTICLES); setFiltered(DEMO_ARTICLES);
    } else {
      try {
        const res = await fetch(`${NEWS_BASE}?q=${encodeURIComponent(AGR_Q)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`);
        const data = await res.json();
        if (data.status === 'ok') { const valid = data.articles.filter(a => a.title && a.title !== '[Removed]'); setArticles(valid); setFiltered(valid); }
        else throw new Error(data.message);
      } catch { toast.error('Could not fetch news — showing demo articles'); setArticles(DEMO_ARTICLES); setFiltered(DEMO_ARTICLES); }
    }
    setLoading(false);
  };

  useEffect(() => { fetchNews(); }, []);
  useEffect(() => { setFiltered(search ? articles.filter(a => a.title?.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase())) : articles); }, [search, articles]);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-900/40 border border-yellow-800/40 rounded-xl flex items-center justify-center"><Newspaper size={20} className="text-yellow-400" /></div>
            <div><h1 className="text-2xl font-bold text-white">{t('newsTitle')}</h1><p className="text-gray-500 text-sm">{t('newsDesc')}</p></div>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input className="input-field pl-9 text-sm" placeholder={t('searchNews')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={fetchNews} disabled={loading} className="btn-secondary flex items-center gap-1.5 text-sm px-4 py-2.5">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />{t('refresh')}
            </button>
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">{filtered.length} articles found</p>
          <p className="text-xs text-gray-600">Updated {new Date().toLocaleTimeString('en-IN')}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="glass-card overflow-hidden"><div className="skeleton h-44 w-full" /><div className="p-4 space-y-3"><div className="skeleton h-3 w-24 rounded" /><div className="skeleton h-4 w-full rounded" /><div className="skeleton h-3 w-20 rounded" /></div></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-16 text-center"><Newspaper size={48} className="text-gray-700 mx-auto mb-4" /><p className="text-gray-500">No articles found.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((article, i) => <NewsCard key={i} article={article} index={i} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
