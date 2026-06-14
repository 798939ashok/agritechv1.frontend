import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Globe } from 'lucide-react';

// ============================================================
// Convert AI response text to speech using Web Speech API
// Supports: Telugu, English, Hindi, Tamil, Kannada, Malayalam
// ============================================================

const LANGUAGES = [
  { code: 'en-IN',  label: 'English',   flag: '🇬🇧' },
  { code: 'te-IN',  label: 'Telugu',    flag: '🇮🇳' },
  { code: 'hi-IN',  label: 'Hindi',     flag: '🇮🇳' },
  { code: 'ta-IN',  label: 'Tamil',     flag: '🇮🇳' },
  { code: 'kn-IN',  label: 'Kannada',   flag: '🇮🇳' },
  { code: 'ml-IN',  label: 'Malayalam', flag: '🇮🇳' },
];

export default function VoiceAssistant({ text, label = 'Read Analysis Aloud' }) {
  const [playing, setPlaying] = useState(false);
  const [lang, setLang] = useState('en-IN');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const utterRef = useRef(null);

  // Bug Fix 1: Wait for voices to load, then pick the best matching voice
  const getBestVoice = (targetLang) => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Try exact match first (e.g. te-IN)
    let voice = voices.find(v => v.lang === targetLang);
    if (voice) return voice;

    // Try language prefix match (e.g. 'te' for 'te-IN')
    const prefix = targetLang.split('-')[0];
    voice = voices.find(v => v.lang.startsWith(prefix));
    if (voice) return voice;

    // Fallback: return null (browser will use default, but lang tag still set)
    return null;
  };

  const speak = () => {
    if (!window.speechSynthesis) {
      alert('Voice output not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();

    const doSpeak = () => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang  = lang;           // Always set lang tag
      utter.rate  = 0.92;
      utter.pitch = 1;

      // Explicitly assign a matching voice so browser doesn't ignore lang
      const voice = getBestVoice(lang);
      if (voice) utter.voice = voice;

      utter.onstart = () => setPlaying(true);
      utter.onend   = () => setPlaying(false);
      utter.onerror = () => setPlaying(false);
      utterRef.current = utter;
      window.speechSynthesis.speak(utter);
    };

    // Voices may not be loaded yet on first call
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      // Wait for voices to load then speak
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const selectedLang = LANGUAGES.find(l => l.code === lang);

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        {/* Play / Stop button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={playing ? stop : speak}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            playing
              ? 'bg-red-600/20 border border-red-600/50 text-red-400 hover:bg-red-600/30'
              : 'bg-primary-600/20 border border-primary-600/50 text-primary-400 hover:bg-primary-600/30'
          }`}
        >
          {playing ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {playing ? 'Stop Voice' : label}
        </motion.button>

        {/* Language picker */}
        <div className="relative">
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 transition-all"
          >
            <Globe size={14} />
            <span>{selectedLang?.flag} {selectedLang?.label}</span>
          </button>
          {showLangPicker && (
            <div className="absolute bottom-full mb-2 left-0 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 min-w-[160px] overflow-hidden">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left hover:bg-gray-800 transition-colors ${
                    lang === l.code ? 'text-primary-400 bg-gray-800' : 'text-gray-300'
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Playing indicator */}
        {playing && (
          <motion.div className="flex items-center gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="w-1 bg-primary-500 rounded-full"
                animate={{ height: [4, 16, 4] }}
                transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.7 }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
