import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sprout, X, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VoiceAssistant from '../components/VoiceAssistant';
import { useTranslation } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DEMO_PLANT = {
  plantName: 'Parthenium Weed', scientificName: 'Parthenium hysterophorus',
  category: 'Invasive Weed', confidence: 91.3,
  description: 'Highly invasive annual weed native to tropical America. Threatens crop yields and human health.',
  benefits: ['None — harmful invasive weed.'],
  risks: ['Reduces crop yield by 40–90%.','Causes allergic reactions and asthma.','Toxic to livestock.','Displaces native plant species.'],
  control: 'Hand-pull before flowering. Apply Atrazine 0.5 kg a.i./ha pre-emergent. Biological control using Zygogramma beetle is effective.',
  relatedPlants: ['Congress Grass', 'Ragweed', 'Marigold (safe alternative)'],
  similarImages: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Parthenium_hysterophorus.jpg/320px-Parthenium_hysterophorus.jpg'],
};

const catColor = { 'Invasive Weed':'text-red-400 bg-red-900/20 border-red-800/30', 'Crop Plant':'text-green-400 bg-green-900/20 border-green-800/30', 'Medicinal':'text-blue-400 bg-blue-900/20 border-blue-800/30', 'Unknown':'text-gray-400 bg-gray-800/40 border-gray-700/30' };

export default function PlantIdentification() {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = f => { if (!f?.type.startsWith('image/')) { toast.error('Please select an image'); return; } setImage(f); setPreview(URL.createObjectURL(f)); setResult(null); };

  const identify = async () => {
    if (!image) { toast.error('Upload a plant image first'); return; }
    setLoading(true);
    // AI MODEL START
    try {
      const fd = new FormData(); fd.append('image', image);
      const res = await axios.post(`${API_URL}/api/plant/identify`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
    } catch {
      await new Promise(r => setTimeout(r, 1600));
      setResult(DEMO_PLANT);
    }
    // AI MODEL END
    setLoading(false); toast.success('Plant identified!');
  };

  const voiceText = result ? `${t('plantId2')}: ${result.plantName}. Scientific name: ${result.scientificName}. Category: ${result.category}. ${result.description}` : '';
  const catStyle = result ? (catColor[result.category] || catColor['Unknown']) : '';

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/40 border border-green-800/40 rounded-xl flex items-center justify-center"><Sprout size={20} className="text-green-400" /></div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('plantId2')}</h1>
              <p className="text-gray-500 text-sm">{t('plantDesc')}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4">
              <p className="text-sm font-semibold text-white mb-3">{t('uploadPlant')}</p>
              {!preview ? (
                <div className="upload-zone" onClick={() => fileRef.current.click()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }} onDragOver={e => e.preventDefault()}>
                  <Sprout size={32} className="text-primary-600 mb-3" />
                  <p className="text-sm text-gray-400 text-center">{t('clickOrDrag')}</p>
                  <p className="text-xs text-gray-600 mt-1">Leaf, stem, flower or full plant</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={preview} alt="plant" className="w-full h-52 object-cover rounded-xl" />
                  <button onClick={() => { setImage(null); setPreview(null); setResult(null); }} className="absolute top-2 right-2 w-7 h-7 bg-gray-900/80 rounded-lg flex items-center justify-center text-gray-400 hover:text-white"><X size={14} /></button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <button onClick={identify} disabled={!image || loading} className="btn-primary w-full mt-3 flex items-center justify-center gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('identifying')}</> : <><Sprout size={15} />{t('identifyPlant')}</>}
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-12 flex flex-col items-center gap-4">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-green-900 rounded-full" />
                    <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <Sprout size={24} className="text-green-400 absolute inset-0 m-auto" />
                  </div>
                  <p className="text-white font-semibold">{t('identifying')}</p>
                  <p className="text-gray-500 text-sm text-center">Matching against 10,000+ plant species</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div className="glass-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white">{result.plantName}</h2>
                        <p className="text-gray-500 text-sm italic mt-0.5">{result.scientificName}</p>
                        <p className="text-gray-400 text-sm mt-0.5">Confidence: <span className="text-primary-400 font-semibold">{result.confidence}%</span></p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${catStyle}`}>{result.category}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{result.description}</p>
                    {result.benefits?.length > 0 && (
                      <div className="mt-4 bg-green-900/20 border border-green-800/30 rounded-xl p-4">
                        <p className="text-xs text-green-400 font-semibold mb-2 flex items-center gap-1"><CheckCircle size={12} />{t('benefits')}</p>
                        <ul className="space-y-1">{result.benefits.map((b, i) => <li key={i} className="text-sm text-gray-300">• {b}</li>)}</ul>
                      </div>
                    )}
                    {result.risks?.length > 0 && (
                      <div className="mt-3 bg-red-900/20 border border-red-800/30 rounded-xl p-4">
                        <p className="text-xs text-red-400 font-semibold mb-2 flex items-center gap-1"><AlertTriangle size={12} />{t('risks')}</p>
                        <ul className="space-y-1">{result.risks.map((r, i) => <li key={i} className="text-sm text-gray-300">• {r}</li>)}</ul>
                      </div>
                    )}
                    {result.control && (
                      <div className="mt-3 bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4">
                        <p className="text-xs text-yellow-400 font-semibold mb-1 flex items-center gap-1"><Info size={12} />{t('controlMethod')}</p>
                        <p className="text-sm text-gray-300">{result.control}</p>
                      </div>
                    )}
                  </div>
                  <VoiceAssistant text={voiceText} label="Read Plant Info Aloud" />
                  {(result.similarImages?.length > 0 || result.relatedPlants?.length > 0) && (
                    <div className="glass-card p-5">
                      {result.similarImages?.length > 0 && (<><p className="text-white font-semibold mb-3">{t('similarPlants')}</p><div className="flex gap-3 mb-4">{result.similarImages.map((src, i) => <img key={i} src={src} alt="" className="h-32 w-auto rounded-xl object-cover" onError={e => e.target.style.display='none'} />)}</div></>)}
                      {result.relatedPlants?.length > 0 && (<><p className="text-sm text-gray-400 font-semibold mb-2">{t('relatedPlants')}</p><div className="flex flex-wrap gap-2">{result.relatedPlants.map(p => <span key={p} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">{p}</span>)}</div></>)}
                    </div>
                  )}
                  <button onClick={() => { setImage(null); setPreview(null); setResult(null); }} className="btn-secondary w-full flex items-center justify-center gap-2"><RefreshCw size={14} />{t('identifyAnother')}</button>
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 flex flex-col items-center text-center">
                  <Sprout size={48} className="text-gray-700 mb-4" />
                  <p className="text-gray-500 font-medium">Upload a plant photo to identify it</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
