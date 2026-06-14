import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, MapPin, RefreshCw, Droplets, Umbrella, Thermometer } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WeatherCard from '../components/WeatherCard';
import VoiceAssistant from '../components/VoiceAssistant';
import { useApp, useTranslation } from '../context/AppContext';
import toast from 'react-hot-toast';

// WEATHER API INTEGRATION START
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '';
const WEATHER_BASE = 'https://api.openweathermap.org/data/2.5';
// WEATHER API INTEGRATION END

const DEMO_WEATHER = { location:'Guntur, Andhra Pradesh', temp:32, feelsLike:36, humidity:74, windSpeed:18, visibility:8, description:'Partly Cloudy', icon:'⛅', rainChance:65, suggestion:'Heavy rain expected tomorrow. Avoid spraying fertilizers today. Irrigate before evening.' };
const DEMO_FORECAST = [
  { day:'Today', high:32, low:24, icon:'⛅', rain:65 }, { day:'Tue', high:28, low:22, icon:'🌧️', rain:85 },
  { day:'Wed', high:26, low:21, icon:'🌧️', rain:90 }, { day:'Thu', high:30, low:23, icon:'🌤️', rain:30 },
  { day:'Fri', high:33, low:25, icon:'☀️', rain:10 }, { day:'Sat', high:34, low:26, icon:'☀️', rain:5 },
  { day:'Sun', high:31, low:24, icon:'⛅', rain:40 },
];
const HOURLY = [{ time:'6AM', temp:27 },{ time:'9AM', temp:30 },{ time:'12PM', temp:33 },{ time:'3PM', temp:32 },{ time:'6PM', temp:29 },{ time:'9PM', temp:26 }];

export default function Weather() {
  const { user } = useApp();
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState(user?.district || 'Guntur');

  const fetchWeather = async (cityName) => {
    setLoading(true);
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
      await new Promise(r => setTimeout(r, 800));
      setWeather({ ...DEMO_WEATHER, location: `${cityName}, India` });
      setForecast(DEMO_FORECAST);
    } else {
      try {
        const curr = await fetch(`${WEATHER_BASE}/weather?q=${cityName},IN&appid=${WEATHER_API_KEY}&units=metric`);
        const cd = await curr.json();
        const fore = await fetch(`${WEATHER_BASE}/forecast?q=${cityName},IN&appid=${WEATHER_API_KEY}&units=metric`);
        const fd = await fore.json();
        setWeather({ location:`${cd.name}, ${cd.sys.country}`, temp:Math.round(cd.main.temp), feelsLike:Math.round(cd.main.feels_like), humidity:cd.main.humidity, windSpeed:Math.round(cd.wind.speed*3.6), visibility:Math.round((cd.visibility||10000)/1000), description:cd.weather[0].description, icon:'🌤️', rainChance:Math.round((cd.rain?.['1h']||0)*10), suggestion:DEMO_WEATHER.suggestion });
        const days = {};
        fd.list.forEach(item => { const d = new Date(item.dt*1000).toLocaleDateString('en-IN',{weekday:'short'}); if (!days[d]) days[d]={day:d,high:item.main.temp_max,low:item.main.temp_min,icon:'⛅',rain:Math.round((item.pop||0)*100)}; else { days[d].high=Math.max(days[d].high,item.main.temp_max); days[d].low=Math.min(days[d].low,item.main.temp_min); } });
        setForecast(Object.values(days).slice(0,7).map(d=>({...d,high:Math.round(d.high),low:Math.round(d.low)})));
      } catch { toast.error('Could not fetch weather. Showing demo data.'); setWeather({...DEMO_WEATHER,location:`${cityName}, India`}); setForecast(DEMO_FORECAST); }
    }
    setLoading(false);
  };

  useEffect(() => { fetchWeather(city); }, []);

  const tips = weather ? [
    weather.rainChance > 70 && { icon:'🚫', text:'Avoid pesticide/fertilizer spraying — rain will wash it away.' },
    weather.humidity > 70 && { icon:'🍄', text:'High humidity — watch for fungal disease.' },
    weather.temp > 35 && { icon:'💧', text:'Heat stress risk. Irrigate in early morning or after sunset.' },
    weather.windSpeed > 25 && { icon:'💨', text:'High winds — avoid aerial spraying.' },
  ].filter(Boolean) : [];
  if (tips.length === 0 && weather) tips.push({ icon:'✅', text:'Conditions look good for field activities today.' });

  const voiceText = weather ? `${t('weatherTitle')} in ${weather.location}: ${weather.temp} degrees Celsius, ${weather.description}. Humidity ${weather.humidity}%. ${weather.suggestion}` : '';

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-900/40 border border-blue-800/40 rounded-xl flex items-center justify-center"><CloudSun size={20} className="text-blue-400" /></div>
            <div><h1 className="text-2xl font-bold text-white">{t('weatherTitle')}</h1><p className="text-gray-500 text-sm">{t('weatherDesc')}</p></div>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-sm">
              <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input className="input-field pl-9 text-sm" value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key==='Enter' && fetchWeather(city)} placeholder={t('enterCity')} />
            </div>
            <button onClick={() => fetchWeather(city)} className="btn-primary flex items-center gap-1.5 text-sm px-4 py-2.5"><RefreshCw size={14} />{t('update')}</button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <WeatherCard weather={weather} loading={loading} />
            {weather && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                <p className="text-sm font-semibold text-white mb-3">{t('farmingAdvice')}</p>
                <div className="space-y-2">
                  {tips.map((tip, i) => <div key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-gray-900/60 rounded-lg p-2.5"><span>{tip.icon}</span><span>{tip.text}</span></div>)}
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-5">
            {weather && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                <p className="text-white font-semibold mb-4 flex items-center gap-2"><Thermometer size={15} className="text-orange-400" />{t('hourlyTemp')}</p>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={HOURLY}>
                    <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs>
                    <XAxis dataKey="time" tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[20,40]} tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background:'#1f2937', border:'1px solid #374151', borderRadius:8, color:'#f9fafb' }} formatter={v=>[`${v}°C`,'Temp']} />
                    <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} fill="url(#tg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {forecast.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                <p className="text-white font-semibold mb-4 flex items-center gap-2"><Umbrella size={15} className="text-blue-400" />{t('rainProb')}</p>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={forecast}>
                    <XAxis dataKey="day" tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0,100]} tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ background:'#1f2937', border:'1px solid #374151', borderRadius:8, color:'#f9fafb' }} formatter={v=>[`${v}%`,'Rain']} />
                    <Bar dataKey="rain" fill="#3b82f6" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {forecast.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
                <p className="text-white font-semibold mb-4 flex items-center gap-2"><CloudSun size={15} className="text-blue-400" />{t('forecast')}</p>
                <div className="grid grid-cols-7 gap-2">
                  {forecast.map((f, i) => (
                    <div key={i} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${i===0?'bg-primary-900/40 border border-primary-700/40':'bg-gray-900/60'}`}>
                      <p className="text-xs text-gray-500 font-medium">{f.day}</p>
                      <span className="text-xl">{f.icon}</span>
                      <p className="text-xs font-bold text-white">{f.high}°</p>
                      <p className="text-xs text-gray-500">{f.low}°</p>
                      <div className="flex items-center gap-0.5"><Droplets size={9} className="text-blue-400" /><span className="text-[10px] text-blue-400">{f.rain}%</span></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {weather && <VoiceAssistant text={voiceText} label="Read Weather Update" />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
