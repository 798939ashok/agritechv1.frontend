import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Eye, Thermometer } from 'lucide-react';

export default function WeatherCard({ weather, loading }) {
  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="skeleton h-6 w-32 mb-4 rounded" />
        <div className="skeleton h-16 w-full rounded mb-3" />
        <div className="skeleton h-4 w-48 rounded" />
      </div>
    );
  }
  if (!weather) return null;

  const stats = [
    { icon: Droplets,    label: 'Humidity',  value: `${weather.humidity}%`,       color: 'text-blue-400' },
    { icon: Wind,        label: 'Wind',      value: `${weather.windSpeed} km/h`,  color: 'text-cyan-400' },
    { icon: Eye,         label: 'Visibility',value: `${weather.visibility} km`,   color: 'text-purple-400' },
    { icon: Thermometer, label: 'Feels Like',value: `${weather.feelsLike}°C`,     color: 'text-orange-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm">{weather.location}</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-white">{weather.temp}°</span>
            <span className="text-lg text-gray-400 mb-2">C</span>
          </div>
          <p className="text-primary-400 font-medium capitalize">{weather.description}</p>
        </div>
        <div className="text-6xl">{weather.icon}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-gray-900/60 rounded-xl p-3 flex items-center gap-3">
            <Icon size={16} className={color} />
            <div>
              <p className="text-[11px] text-gray-500">{label}</p>
              <p className="text-sm font-semibold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Farming Suggestion */}
      {weather.suggestion && (
        <div className="mt-4 bg-primary-900/30 border border-primary-800/50 rounded-xl p-3">
          <p className="text-xs text-primary-300 font-semibold mb-1">🌱 AI Farming Advice</p>
          <p className="text-sm text-gray-300">{weather.suggestion}</p>
        </div>
      )}
    </motion.div>
  );
}
