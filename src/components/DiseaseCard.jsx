import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ShoppingCart } from 'lucide-react';

const severityColor = {
  Low:      'text-green-400 bg-green-900/30 border-green-800/50',
  Moderate: 'text-yellow-400 bg-yellow-900/30 border-yellow-800/50',
  High:     'text-red-400 bg-red-900/30 border-red-800/50',
};

export default function DiseaseCard({ result }) {
  if (!result) return null;
  const { diseaseName, confidence, symptoms, cause, severity, fertilizer, pesticide, prevention, productLink } = result;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{diseaseName}</h2>
          <p className="text-gray-400 text-sm mt-0.5">AI Confidence: <span className="text-primary-400 font-semibold">{confidence}%</span></p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${severityColor[severity] || severityColor['Moderate']}`}>
          {severity} Severity
        </span>
      </div>

      {/* Cause & Symptoms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900/60 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-semibold mb-1">CAUSE</p>
          <p className="text-sm text-gray-300">{cause}</p>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-semibold mb-1">SYMPTOMS</p>
          <p className="text-sm text-gray-300">{symptoms}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary-900/30 border border-primary-800/40 rounded-xl p-4">
          <p className="text-xs text-primary-400 font-semibold mb-2">✅ RECOMMENDED FERTILIZER</p>
          <p className="text-sm text-white font-medium">{fertilizer}</p>
        </div>
        <div className="bg-orange-900/20 border border-orange-800/40 rounded-xl p-4">
          <p className="text-xs text-orange-400 font-semibold mb-2">🧪 RECOMMENDED PESTICIDE</p>
          <p className="text-sm text-white font-medium">{pesticide}</p>
        </div>
      </div>

      {/* Prevention */}
      <div className="bg-gray-900/60 rounded-xl p-4">
        <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1">
          <CheckCircle size={12} className="text-green-400" /> PREVENTION TIPS
        </p>
        <ul className="space-y-1">
          {(Array.isArray(prevention) ? prevention : [prevention]).map((tip, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-primary-500 mt-1">•</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Product buy button */}
      {/* PRODUCT RECOMMENDATION */}
      {productLink && (
        <a
          href={productLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full btn-primary"
        >
          <ShoppingCart size={16} /> Buy Recommended Product
        </a>
      )}
    </motion.div>
  );
}
