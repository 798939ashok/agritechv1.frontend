import React from 'react';
import { motion } from 'framer-motion';
import { CloudLightning, Landmark, Leaf, Bell } from 'lucide-react';

const typeConfig = {
  weather: { icon: CloudLightning, color: 'text-blue-400',   bg: 'bg-blue-900/20 border-blue-800/30' },
  govt:    { icon: Landmark,       color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/30' },
  tip:     { icon: Leaf,           color: 'text-green-400',  bg: 'bg-green-900/20 border-green-800/30' },
  default: { icon: Bell,           color: 'text-gray-400',   bg: 'bg-gray-800/40 border-gray-700/30' },
};

export default function NotificationCard({ notification, index }) {
  const { icon: Icon, color, bg } = typeConfig[notification.type] || typeConfig.default;
  const timeAgo = (d) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-start gap-3 p-4 rounded-xl border ${bg} ${!notification.read ? 'ring-1 ring-primary-700/30' : ''}`}
    >
      <div className={`p-2 rounded-lg bg-gray-900/60 ${color} flex-shrink-0`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-white">{notification.title}</p>
          {!notification.read && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{notification.message}</p>
        <p className="text-xs text-gray-600 mt-1">{timeAgo(notification.date)}</p>
      </div>
    </motion.div>
  );
}
