import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImageIcon, Microscope, Users, ShoppingCart, RefreshCw, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DiseaseCard from '../components/DiseaseCard';
import VoiceAssistant from '../components/VoiceAssistant';
import { useTranslation } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DEMO_RESULT = {
  diseaseName: 'Rice Blast (Magnaporthe oryzae)',
  confidence: 94.7, severity: 'High',
  cause: 'Fungal infection caused by Magnaporthe oryzae. Spreads through air-borne spores and is favoured by high humidity and temperatures between 24–28°C.',
  symptoms: 'Diamond-shaped lesions with grey centre and brown border on leaves. Neck rot causes "deadheart" in tillers.',
  fertilizer: 'Calcium Silicate 200 kg/ha — strengthens cell walls against blast.',
  pesticide: 'Tricyclazole 75% WP @ 0.6 g/L — spray twice at 10-day intervals.',
  prevention: ['Use blast-resistant rice varieties.','Avoid excess nitrogen.','Drain fields during tillering.','Remove infected debris after harvest.'],
  productLink: 'https://www.amazon.in/s?k=tricyclazole+fungicide',
  farmerCases: { total: 1247, successRate: 87, bestSolution: 'Tricyclazole 75% WP', crop: 'Rice' },
  similarImages: ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Rice_blast_fungus.jpg/320px-Rice_blast_fungus.jpg'],
};

export default function DiseaseDetection() {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    setImage(file); setPreview(URL.createObjectURL(file)); setResult(null);
  };

  const analyze = async () => {
    if (!image) { toast.error('Upload a crop image first'); return; }
    setLoading(true);
    // AI MODEL START
    try {
      const fd = new FormData(); fd.append('image', image);
      const res = await axios.post(`${API_URL}/api/disease/predict`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
      setHistory(h => [{ id: Date.now(), preview, date: new Date().toLocaleTimeString() }, ...h.slice(0, 4)]);
      toast.success('Analysis complete!');
    } catch {
      await new Promise(r => setTimeout(r, 1800));
      setResult(DEMO_RESULT);
      setHistory(h => [{ id: Date.now(), preview, date: new Date().toLocaleTimeString() }, ...h.slice(0, 4)]);
      toast.success('Analysis complete (demo mode)');
    }
    // AI MODEL END
    setLoading(false);
  };

  const reset = () => { setImage(null); setPreview(null); setResult(null); };

  const voiceText = result
    ? `${t('diseaseDetection')}: ${result.diseaseName}. Confidence: ${result.confidence} percent. Severity: ${result.severity}. ${result.cause}. ${t('pesticide')}: ${result.pesticide}.`
    : '';

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-900/40 border border-red-800/40 rounded-xl flex items-center justify-center">
              <Microscope size={20} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('diseaseDetection')}</h1>
              <p className="text-gray-500 text-sm">{t('diseaseDesc')}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4">
              <p className="text-sm font-semibold text-white mb-3">{t('uploadImage')}</p>
              {!preview ? (
                <div className="upload-zone" onClick={() => fileRef.current.click()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }} onDragOver={e => e.preventDefault()}>
                  <Upload size={32} className="text-primary-600 mb-3" />
                  <p className="text-sm text-gray-400 text-center">{t('clickOrDrag')}</p>
                  <p className="text-xs text-gray-600 mt-1">{t('imageFormats')}</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={preview} alt="crop" className="w-full h-52 object-cover rounded-xl" />
                  <button onClick={reset} className="absolute top-2 right-2 w-7 h-7 bg-gray-900/80 rounded-lg flex items-center justify-center text-gray-400 hover:text-white"><X size={14} /></button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <button onClick={analyze} disabled={!image || loading} className="btn-primary w-full mt-3 flex items-center justify-center gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('analyzing')}</> : <><Microscope size={15} />{t('detectDisease')}</>}
              </button>
            </motion.div>

            {history.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4">
                <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><ImageIcon size={14} className="text-primary-400" />{t('previousScans')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {history.map(h => (
                    <div key={h.id} className="cursor-pointer group" onClick={() => setPreview(h.preview)}>
                      <img src={h.preview} alt="" className="w-full h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity" />
                      <p className="text-[10px] text-gray-500 mt-1">{h.date}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-5">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-10 flex flex-col items-center gap-4">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-primary-900 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <Microscope size={24} className="text-primary-400 absolute inset-0 m-auto" />
                  </div>
                  <p className="text-white font-semibold">{t('analyzing')}</p>
                  <p className="text-gray-500 text-sm text-center">AI model is examining disease patterns and severity</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <DiseaseCard result={result} />
                  <VoiceAssistant text={voiceText} label="Read Diagnosis Aloud" />

                  {result.farmerCases && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                      <p className="text-white font-semibold flex items-center gap-2 mb-4"><Users size={16} className="text-primary-400" />{t('farmerCases')}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-900/60 rounded-xl p-4 text-center">
                          <p className="text-2xl font-bold text-white">{result.farmerCases.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-1">{t('reportedCases')}</p>
                        </div>
                        <div className="bg-primary-900/30 border border-primary-800/40 rounded-xl p-4 text-center">
                          <p className="text-2xl font-bold text-primary-400">{result.farmerCases.successRate}%</p>
                          <p className="text-xs text-gray-500 mt-1">{t('successRate')}</p>
                        </div>
                        <div className="bg-gray-900/60 rounded-xl p-4 text-center">
                          <p className="text-lg font-bold text-white">{result.farmerCases.crop}</p>
                          <p className="text-xs text-gray-500 mt-1">{t('primaryCrop')}</p>
                        </div>
                      </div>
                      <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-3">
                        <p className="text-sm text-gray-300">📊 <strong className="text-white">{result.farmerCases.total.toLocaleString()} farmers</strong> faced this disease. <strong className="text-primary-400">{result.farmerCases.successRate}%</strong> solved using <strong className="text-white">{result.farmerCases.bestSolution}</strong>.</p>
                      </div>
                    </motion.div>
                  )}

                  {result.similarImages?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                      <p className="text-white font-semibold mb-3 flex items-center gap-2"><ImageIcon size={15} className="text-primary-400" />{t('similarImages')}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {result.similarImages.map((src, i) => <img key={i} src={src} alt="" className="w-full h-36 object-cover rounded-xl" onError={e => e.target.style.display='none'} />)}
                      </div>
                    </motion.div>
                  )}

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                    <p className="text-white font-semibold mb-3 flex items-center gap-2"><ShoppingCart size={15} className="text-primary-400" />{t('recommendedProducts')}</p>
                    <div className="space-y-3">
                      {[{ name: result.pesticide, type: t('pesticide') }, { name: result.fertilizer, type: t('fertilizer') }].map(p => (
                        <div key={p.type} className="flex items-start justify-between gap-3 bg-gray-900/60 rounded-xl p-4">
                          <div>
                            <span className="text-xs text-primary-400 font-semibold">{p.type}</span>
                            <p className="text-sm text-white font-medium mt-0.5">{p.name}</p>
                          </div>
                          <a href={result.productLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 btn-primary text-xs px-3 py-2 flex items-center gap-1">
                            <ShoppingCart size={12} />{t('buyNow')}
                          </a>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <button onClick={reset} className="btn-secondary w-full flex items-center justify-center gap-2"><RefreshCw size={14} />{t('analyzeAnother')}</button>
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 flex flex-col items-center text-center">
                  <Microscope size={48} className="text-gray-700 mb-4" />
                  <p className="text-gray-500 font-medium">Upload a crop image to begin</p>
                  <p className="text-gray-600 text-sm mt-1">Supports rice, wheat, cotton, tomato and more</p>
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
