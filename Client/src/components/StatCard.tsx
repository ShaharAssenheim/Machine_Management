import React from 'react';
import { motion } from 'framer-motion';
import { StatCardProps } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <motion.div 
      className="group relative rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-transparent to-accent-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      {/* Card content */}
      <div className="relative glass-card rounded-2xl p-6 h-full bg-bg-card/90">
        {/* Subtle gradient overlay */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent-primary/5 via-transparent to-transparent rounded-bl-full z-0 transition-all duration-500 group-hover:w-48 group-hover:h-48"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30 rounded-2xl"></div>

        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-text-muted tracking-wider uppercase">{title}</p>
            
            <motion.h3 
              className="text-4xl font-bold text-text-primary tracking-tighter"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              {value}
            </motion.h3>

            {trend && (
              <div className={`inline-flex items-center gap-2 text-xs font-semibold py-1.5 px-3 rounded-full ${trendUp
                  ? 'text-status-running bg-status-running-bg border border-status-running/20'
                  : 'text-status-error bg-status-error-bg border border-status-error/20'
                }`}>
                {trendUp ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{trend}</span>
                <span className="text-text-muted font-normal">vs last period</span>
              </div>
            )}
          </div>

          <motion.div 
            className="relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Icon glow effect */}
            <div className="absolute inset-0 bg-accent-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-bg-inset to-bg-card text-accent-primary border border-border-subtle group-hover:border-border-highlight group-hover:shadow-glow-sm transition-all duration-300">
              {icon}
            </div>
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  );
};

export default StatCard;