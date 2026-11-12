import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sprout, X, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VoiceAssistant from '../components/VoiceAssistant';
import { useTranslation } from '../context/AppContext';
import toast from 'react-hot-toast';

// ── PLANT.ID API INTEGRATION START ─────────────────────────
const PLANTID_API_KEY = 'ZnUkCO5kjtkeu9qZuMf9MuBZTlrLWDvF5KFTF15rLczhxLtsqh';
const PLANTID_URL     = 'https://plant.id/api/v3/identification';
// ── PLANT.ID API INTEGRATION END ───────────────────────────

// Scientific → Common name mapping for popular plants
const COMMON_NAME_MAP = {
  'solanum lycopersicum': 'Tomato', 'solanum tuberosum': 'Potato',
  'oryza sativa': 'Rice', 'triticum aestivum': 'Wheat',
  'zea mays': 'Maize / Corn', 'gossypium': 'Cotton',
  'saccharum officinarum': 'Sugarcane', 'capsicum annuum': 'Chilli Pepper',
  'capsicum': 'Chilli / Pepper', 'allium cepa': 'Onion',
  'mangifera indica': 'Mango', 'musa': 'Banana',
  'arachis hypogaea': 'Groundnut', 'glycine max': 'Soybean',
  'curcuma longa': 'Turmeric', 'zingiber officinale': 'Ginger',
  'azadirachta indica': 'Neem', 'ocimum tenuiflorum': 'Tulsi / Holy Basil',
  'aloe vera': 'Aloe Vera', 'parthenium hysterophorus': 'Congress Grass (Parthenium)',
  'rosa': 'Rose', 'hibiscus': 'Hibiscus', 'jasminum': 'Jasmine',
  'helianthus annuus': 'Sunflower', 'tagetes': 'Marigold',
  'coriandrum sativum': 'Coriander', 'spinacia oleracea': 'Spinach',
  'brassica': 'Cabbage / Mustard', 'lycopersicon': 'Tomato',
  'phaseolus': 'Beans', 'vigna': 'Cowpea / Black-eyed Pea',
  'citrullus lanatus': 'Watermelon', 'cucumis sativus': 'Cucumber',
  'abelmoschus esculentus': 'Okra / Bhindi', 'colocasia': 'Taro / Arbi',
};

const getCommonName = (scientificName, apiCommonNames) => {
  // First use API common names if available
  if (apiCommonNames && apiCommonNames.length > 0) return apiCommonNames[0];
  // Then try our mapping
  const lower = (scientificName || '').toLowerCase();
  for (const [sci, common] of Object.entries(COMMON_NAME_MAP)) {
    if (lower.includes(sci)) return common;
  }
  // Return scientific name as fallback
  return scientificName;
};

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload  = () => resolve(reader.result.split(',')[1]);
  reader.onerror = reject;
});

const catColor = {
  'Invasive Weed':    'text-red-400 bg-red-900/20 border-red-800/30',
  'Crop Plant':       'text-green-400 bg-green-900/20 border-green-800/30',
  'Medicinal':        'text-blue-400 bg-blue-900/20 border-blue-800/30',
  'Ornamental Plant': 'text-purple-400 bg-purple-900/20 border-purple-800/30',
  'Unknown':          'text-gray-400 bg-gray-800/40 border-gray-700/30',
};

const parseResult = (data) => {
  const suggestion = data.result?.classification?.suggestions?.[0];
  const isPlant    = data.result?.is_plant?.binary;
  const plantProb  = data.result?.is_plant?.probability || 0;

  if (!isPlant || plantProb < 0.3) {
    return {
      plantName: 'Not a Plant', scientificName: 'N/A', category: 'Unknown',
      confidence: Math.round(plantProb * 100),
      description: 'The uploaded image does not appear to contain a plant. Please upload a clear photo of a plant, leaf, or crop.',
      benefits: [], risks: [], control: null, relatedPlants: [], similarImages: [],
    };
  }

  const scientificName = suggestion?.name || 'Unknown Plant';
  const confidence     = Math.round((suggestion?.probability || 0) * 100);
  const details        = suggestion?.details || {};
  const apiCommonNames = details.common_names || [];

  // ✅ Get proper common name
  const plantName = getCommonName(scientificName, apiCommonNames);

  const allText = `${scientificName} ${apiCommonNames.join(' ')} ${details.description?.value || ''}`.toLowerCase();

  let category = 'Crop Plant';
  if (['weed','invasive','parthenium','lantana','cyperus'].some(k => allText.includes(k))) category = 'Invasive Weed';
  else if (['rose','hibiscus','jasmine','sunflower','marigold','lotus','lily','orchid','bougainvillea'].some(k => allText.includes(k))) category = 'Ornamental Plant';
  else if (['neem','tulsi','aloe','basil','mint','ginger','turmeric','medicinal'].some(k => allText.includes(k))) category = 'Medicinal';

  const similarImages = (suggestion?.similar_images || []).slice(0, 2).map(i => i.url).filter(Boolean);

  const desc = details.description?.value
    ? details.description.value.slice(0, 350)
    : `${plantName} (${scientificName}) — identified with ${confidence}% confidence.${apiCommonNames.length > 1 ? ' Also known as: ' + apiCommonNames.slice(1, 4).join(', ') + '.' : ''}`;

  const benefits =
    category === 'Crop Plant'       ? [`${plantName} is an important agricultural crop.`, 'Provides food and income for farmers.', 'Widely cultivated across India.']
    : category === 'Medicinal'      ? [`${plantName} has medicinal and therapeutic properties.`, 'Used in Ayurveda and traditional medicine.', 'Contains beneficial bioactive compounds.']
    : category === 'Ornamental Plant' ? [`${plantName} is valued for ornamental purposes.`, 'Used in gardens and floral arrangements.']
    : ['No significant agricultural benefits.'];

  const risks =
    category === 'Invasive Weed'    ? [`${plantName} competes aggressively with crops.`, 'Can reduce crop yield by 30–90%.', 'Causes allergic reactions in humans.', 'Very difficult to eradicate once established.']
    : category === 'Crop Plant'     ? [`${plantName} is susceptible to fungal diseases and pests.`, 'Requires regular monitoring and preventive spraying.', 'Over-irrigation can cause root rot.']
    : category === 'Ornamental Plant' ? [`${plantName} may have thorns or irritating sap.`, 'Some varieties can be toxic if ingested.']
    : ['Consult local agricultural officer for risk assessment.'];

  const control = category === 'Invasive Weed'
    ? `Hand-pull ${plantName} before it flowers. Apply selective herbicide as recommended. Practice regular field inspection.`
    : null;

  return {
    plantName, scientificName, category, confidence, description: desc,
    benefits, risks, control,
    relatedPlants: apiCommonNames.slice(1, 5),
    similarImages,
  };
};

export default function PlantIdentification() {
  const { t } = useTranslation();
  const [image,   setImage]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f?.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    setImage(f); setPreview(URL.createObjectURL(f)); setResult(null);
  };

  const identify = async () => {
    if (!image) { toast.error('Upload a plant image first'); return; }
    setLoading(true);
    try {
      const base64   = await toBase64(image);
      const response = await fetch(PLANTID_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Api-Key': PLANTID_API_KEY },
        body: JSON.stringify({ images: [base64], similar_images: true, classification_level: 'species' }),
      });
      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data   = await response.json();
      const parsed = parseResult(data);
      setResult(parsed);
      toast.success(`${t('plantId2')}: ${parsed.plantName}`);
    } catch (err) {
      console.error(err);
      toast.error('Could not identify. Please try again.');
    }
    setLoading(false);
  };

  const reset = () => { setImage(null); setPreview(null); setResult(null); };

  const voiceText = result
    ? `${t('plantId2')}: ${result.plantName}. Scientific name: ${result.scientificName}. Category: ${result.category}. ${result.description}`
    : '';

  const catStyle = result ? (catColor[result.category] || catColor['Unknown']) : '';

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/40 border border-green-800/40 rounded-xl flex items-center justify-center">
              <Sprout size={20} className="text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('plantId2')}</h1>
              <p className="text-gray-500 text-sm">{t('plantDesc')}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} className="glass-card p-4">
              <p className="text-sm font-semibold text-white mb-3">{t('uploadPlant')}</p>
              {!preview ? (
                <div className="upload-zone"
                  onClick={() => fileRef.current.click()}
                  onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                  onDragOver={e => e.preventDefault()}>
                  <Sprout size={32} className="text-primary-600 mb-3" />
                  <p className="text-sm text-gray-400 text-center">{t('clickOrDrag')}</p>
                  <p className="text-xs text-gray-600 mt-1">Leaf, stem, flower or full plant</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={preview} alt="plant" className="w-full h-52 object-cover rounded-xl" />
                  <button onClick={reset} className="absolute top-2 right-2 w-7 h-7 bg-gray-900/80 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <button onClick={identify} disabled={!image || loading} className="btn-primary w-full mt-3 flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('identifying')}</>
                  : <><Sprout size={15} />{t('identifyPlant')}</>}
              </button>
              <p className="text-xs text-gray-600 text-center mt-2">🤖 Powered by Plant.id AI</p>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="glass-card p-12 flex flex-col items-center gap-4">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-green-900 rounded-full" />
                    <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <Sprout size={24} className="text-green-400 absolute inset-0 m-auto" />
                  </div>
                  <p className="text-white font-semibold">{t('identifying')}</p>
                  <p className="text-gray-500 text-sm">Plant.id AI is analysing your image...</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div key="result" initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-5">
                  <div className="glass-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white">{result.plantName}</h2>
                        <p className="text-gray-500 text-sm italic mt-0.5">{result.scientificName}</p>
                        <p className="text-gray-400 text-sm mt-0.5">
                          Confidence: <span className="text-primary-400 font-semibold">{result.confidence}%</span>
                        </p>
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
                      {result.similarImages?.length > 0 && (
                        <>
                          <p className="text-white font-semibold mb-3">{t('similarPlants')}</p>
                          <div className="flex gap-3 mb-4 flex-wrap">
                            {result.similarImages.map((src, i) => (
                              <img key={i} src={src} alt="" className="h-32 w-auto rounded-xl object-cover" onError={e => e.target.style.display='none'} />
                            ))}
                          </div>
                        </>
                      )}
                      {result.relatedPlants?.length > 0 && (
                        <>
                          <p className="text-sm text-gray-400 font-semibold mb-2">{t('relatedPlants')}</p>
                          <div className="flex flex-wrap gap-2">
                            {result.relatedPlants.map(p => <span key={p} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">{p}</span>)}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <button onClick={reset} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <RefreshCw size={14} />{t('identifyAnother')}
                  </button>
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="glass-card p-16 flex flex-col items-center text-center">
                  <Sprout size={48} className="text-gray-700 mb-4" />
                  <p className="text-gray-500 font-medium">Upload a plant photo to identify it</p>
                  <p className="text-gray-600 text-sm mt-1">Works for crops, weeds, medicinal plants</p>
                  <p className="text-xs text-primary-600 mt-2">🤖 Powered by Plant.id Real AI</p>
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
