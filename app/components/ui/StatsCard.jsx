import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color, description, className = '' }) => {
  // Define color schemes
  const colorSchemes = {
    blue: {
      bg: 'from-blue-900/40 to-blue-800/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      border: 'border-blue-800/30',
      highlight: 'text-blue-400'
    },
    purple: {
      bg: 'from-purple-900/40 to-purple-800/20',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      border: 'border-purple-800/30',
      highlight: 'text-purple-400'
    },
    green: {
      bg: 'from-green-900/40 to-green-800/20',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      border: 'border-green-800/30',
      highlight: 'text-green-400'
    },
    yellow: {
      bg: 'from-yellow-900/40 to-yellow-800/20',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      border: 'border-yellow-800/30',
      highlight: 'text-yellow-400'
    },
    red: {
      bg: 'from-red-900/40 to-red-800/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      border: 'border-red-800/30',
      highlight: 'text-red-400'
    },
    indigo: {
      bg: 'from-indigo-900/40 to-indigo-800/20',
      iconBg: 'bg-indigo-500/20',
      iconColor: 'text-indigo-400',
      border: 'border-indigo-800/30',
      highlight: 'text-indigo-400'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${scheme.bg} p-6 border ${scheme.border} shadow-lg hover:shadow-xl transition-all ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="relative flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg ${scheme.iconBg} flex items-center justify-center shadow-inner border border-white/5`}>
          {icon}
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <p className="text-2xl font-bold text-white">{value}</p>
          </motion.div>
          {description && (
            <p className={`text-xs mt-1 ${scheme.highlight}`}>{description}</p>
          )}
        </div>
      </div>
      
      <motion.div 
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${color}-500 via-${color}-400 to-${color}-600`}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default StatsCard; 