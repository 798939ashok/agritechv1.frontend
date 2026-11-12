import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, RefreshCw, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsCard from '../components/NewsCard';
import { useTranslation } from '../context/AppContext';
import toast from 'react-hot-toast';

// ── NEWS API INTEGRATION START ──────────────────────────────
// Store key in frontend/.env as REACT_APP_NEWS_API_KEY
// Get free key at: https://newsapi.org/
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || '';
const NEWS_BASE    = 'https://newsapi.org/v2/everything';

// Strict India agriculture query
const AGR_Q = '"India" AND ("agriculture" OR "farmer" OR "farming" OR "crop" OR "kisan" OR "MSP" OR "PM Kisan" OR "krishi")';
// ── NEWS API INTEGRATION END ────────────────────────────────

// Agriculture-related keywords to filter irrelevant articles
const AGR_KEYWORDS = [
  'agriculture','farmer','farming','crop','kisan','msp','pm kisan',
  'krishi','fasal','seed','fertilizer','pesticide','irrigation',
  'harvest','paddy','rice','wheat','cotton','sugarcane','soil',
  'monsoon rain','agri','horticulture','livestock','subsidy',
];

const isAgricultureArticle = (article) => {
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  return AGR_KEYWORDS.some(kw => text.includes(kw));
};

const DEMO_ARTICLES = [
  { title:'PM-KISAN 17th Instalment: ₹20,000 Crore Transferred to 10 Crore Farmers', description:'Government released the 17th instalment under PM-KISAN scheme, transferring ₹2,000 each to over 10 crore eligible farmer families directly into their bank accounts.', url:'https://pib.gov.in', urlToImage:null, source:{name:'PIB India'}, publishedAt:new Date(Date.now()-3600000*1).toISOString() },
  { title:'New MSP for Kharif 2026: Paddy MSP Raised to ₹2,450 per Quintal', description:'Cabinet approved Minimum Support Price for 14 Kharif crops. Paddy MSP raised by 5.35% — highest in 5 years, benefitting millions of rice farmers.', url:'https://agricoop.nic.in', urlToImage:null, source:{name:'Agriculture Ministry'}, publishedAt:new Date(Date.now()-3600000*3).toISOString() },
  { title:'IMD Predicts Above-Normal Monsoon 2026: Good News for Kharif Season', description:'India Meteorological Department forecasts above-normal southwest monsoon rainfall, expected to benefit rice, cotton, soybean and sugarcane crops across India.', url:'https://imd.gov.in', urlToImage:null, source:{name:'IMD India'}, publishedAt:new Date(Date.now()-3600000*6).toISOString() },
  { title:'AI Crop Disease Detection App Launched for Andhra Pradesh Farmers', description:'AP government and ICAR launch mobile AI tool for crop disease identification. Reduces chemical usage by 30% and expert visit dependency.', url:'#', urlToImage:null, source:{name:'Deccan Chronicle'}, publishedAt:new Date(Date.now()-3600000*8).toISOString() },
  { title:'50% Subsidy on Agricultural Drones: Apply via PM-KISAN Portal', description:'Government announces 50% subsidy on agricultural drones for farmers with holdings above 2 acres. Applications open till July 31.', url:'#', urlToImage:null, source:{name:'Krishi Jagran'}, publishedAt:new Date(Date.now()-3600000*12).toISOString() },
  { title:'Tomato Price Crisis: Government Announces Emergency Procurement at ₹8/kg', description:'Amid tomato price crash to ₹2/kg at farm gate, government launches emergency procurement and cold storage subsidy for distressed farmers.', url:'#', urlToImage:null, source:{name:'The Hindu'}, publishedAt:new Date(Date.now()-3600000*18).toISOString() },
  { title:'Nano Urea Success: IFFCO Reports 40% Higher Yield in Pilot Districts', description:'IFFCO Nano Urea liquid fertilizer shows 40% better crop yield in pilot districts. Government plans to scale distribution to all districts by 2027.', url:'#', urlToImage:null, source:{name:'Business Line'}, publishedAt:new Date(Date.now()-3600000*24).toISOString() },
  { title:'Free Soil Health Cards for All Farmers Under National Scheme', description:'Ministry of Agriculture announces free soil health cards for all registered farmers. Cards help farmers apply correct fertilizers and improve crop productivity.', url:'#', urlToImage:null, source:{name:'Hindustan Times'}, publishedAt:new Date(Date.now()-3600000*30).toISOString() },
];

export default function News() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setSearch(''); // clear search on refresh

    // No API key — show demo
    if (!NEWS_API_KEY || NEWS_API_KEY === 'YOUR_NEWSAPI_KEY') {
      await new Promise(r => setTimeout(r, 600));
      setArticles(DEMO_ARTICLES);
      setFiltered(DEMO_ARTICLES);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
      setLoading(false);
      return;
    }

    try {
      // Add timestamp to bust cache and force fresh results
      const ts = Date.now();
      const url = `${NEWS_BASE}?q=${encodeURIComponent(AGR_Q)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${NEWS_API_KEY}&_=${ts}`;
      const res  = await fetch(url);
      const data = await res.json();

      if (data.status === 'ok' && data.articles?.length > 0) {
        // Filter only agriculture-related articles
        const agriArticles = data.articles.filter(a =>
          a.title &&
          a.title !== '[Removed]' &&
          isAgricultureArticle(a)
        );

        // If filtered result is too small, use all results
        const finalArticles = agriArticles.length >= 3 ? agriArticles : data.articles.filter(a => a.title && a.title !== '[Removed]');

        setArticles(finalArticles);
        setFiltered(finalArticles);
        setLastUpdated(new Date().toLocaleTimeString('en-IN'));
        toast.success(`${finalArticles.length} agriculture articles loaded!`);
      } else if (data.status === 'error') {
        throw new Error(data.message || 'API error');
      } else {
        // API returned 0 results — show demo
        setArticles(DEMO_ARTICLES);
        setFiltered(DEMO_ARTICLES);
        setLastUpdated(new Date().toLocaleTimeString('en-IN'));
        toast('Showing latest agriculture news');
      }
    } catch (err) {
      console.error('News fetch error:', err);
      toast.error('Could not fetch live news — showing demo articles');
      setArticles(DEMO_ARTICLES);
      setFiltered(DEMO_ARTICLES);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  // Client-side search filter
  useEffect(() => {
    if (!search) {
      setFiltered(articles);
    } else {
      setFiltered(articles.filter(a =>
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, articles]);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-900/40 border border-yellow-800/40 rounded-xl flex items-center justify-center">
              <Newspaper size={20} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('newsTitle')}</h1>
              <p className="text-gray-500 text-sm">{t('newsDesc')}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                className="input-field pl-9 text-sm"
                placeholder={t('searchNews')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={fetchNews}
              disabled={loading}
              className="btn-secondary flex items-center gap-1.5 text-sm px-4 py-2.5"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {t('refresh')}
            </button>
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">{filtered.length} articles found</p>
          {lastUpdated && <p className="text-xs text-gray-600">Updated {lastUpdated}</p>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="skeleton h-44 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-3 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Newspaper size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No articles found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((article, i) => (
              <NewsCard key={`${article.url}-${i}`} article={article} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
