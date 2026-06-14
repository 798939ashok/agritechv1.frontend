import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, Tag } from 'lucide-react';

export default function NewsCard({ article, index }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card overflow-hidden hover:border-primary-700/50 transition-all group"
    >
      {/* News image */}
      {article.urlToImage ? (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-primary-900/60 to-gray-800 flex items-center justify-center">
          <span className="text-4xl">🌾</span>
        </div>
      )}

      <div className="p-4">
        {/* Source + time */}
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1 text-xs text-primary-400 font-medium">
            <Tag size={11} />{article.source?.name || 'Agriculture News'}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={11} />{timeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-2">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{article.description}</p>
        )}

        {/* Read More */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
        >
          Read More <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
}
