import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building2, Globe, Activity, Thermometer, Clock, Wrench } from 'lucide-react';
import { Machine } from '../types';

interface MachinePopupProps {
  machine: Machine;
  onClose: () => void;
  onViewDetails: () => void;
}

const MachinePopup: React.FC<MachinePopupProps> = ({ machine, onClose, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'idle':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'maintenance':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return '●';
      case 'idle':
        return '◐';
      case 'maintenance':
        return '◆';
      case 'error':
        return '✕';
      default:
        return '○';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-2xl bg-gradient-to-br from-bg-sidebar via-bg-main to-bg-sidebar border border-border-subtle rounded-3xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient overlay */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-accent-secondary/10 to-transparent" />
            <img
              src={machine.image}
              alt={machine.name}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent" />
            
            {/* New fields display */}
            <div className="p-4">
              <div className="font-bold text-lg text-text-primary">{machine.name}</div>
              <div className="text-xs text-text-muted">Model: {machine.model}</div>
              <div className="text-xs text-text-muted">Location: {machine.location.city}, {machine.location.country}</div>
              <div className="text-xs text-text-muted">Owner: {machine.owner}</div>
              <div className="text-xs text-text-muted">TeamViewer: {machine.teamviewer_name}</div>
              <div className="text-xs text-text-muted">PLC: {machine.plc_version}</div>
              <div className="text-xs text-text-muted">ACS: {machine.acs_version}</div>
              <div className="text-xs text-text-muted">Tubes: {machine.tubes_number}</div>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-bg-main/80 hover:bg-bg-main backdrop-blur-sm border border-border-subtle hover:border-accent-primary/50 transition-all duration-300 group"
            >
              <X size={20} className="text-text-muted group-hover:text-accent-primary transition-colors" />
            </button>

            {/* Status badge */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute top-4 left-4"
            >
              <div className={`px-4 py-2 rounded-full border backdrop-blur-md ${getStatusColor(machine.status)} font-medium text-sm flex items-center gap-2`}>
                <span className="text-lg leading-none">{getStatusIcon(machine.status)}</span>
                {machine.status}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Machine name and ID */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-3xl font-bold text-text-primary mb-1">{machine.name}</h2>
              <p className="text-text-muted font-mono text-sm">{machine.id}</p>
            </motion.div>

            {/* Location info grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-inset border border-border-subtle hover:border-accent-primary/30 transition-colors">
                <div className="p-2 rounded-lg bg-accent-primary/10">
                  <MapPin size={18} className="text-accent-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">City</p>
                  <p className="text-text-primary font-semibold">{machine.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-inset border border-border-subtle hover:border-accent-primary/30 transition-colors">
                <div className="p-2 rounded-lg bg-accent-secondary/10">
                  <Globe size={18} className="text-accent-secondary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Country</p>
                  <p className="text-text-primary font-semibold">{machine.country}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-inset border border-border-subtle hover:border-accent-primary/30 transition-colors">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Building2 size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Site Group</p>
                  <p className="text-text-primary font-semibold">{machine.siteGroup}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-inset border border-border-subtle hover:border-accent-primary/30 transition-colors">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Activity size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Location</p>
                  <p className="text-text-primary font-semibold">{machine.location}</p>
                </div>
              </div>
            </motion.div>

            {/* Performance metrics */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-gradient-to-br from-bg-inset to-bg-main border border-border-subtle"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Activity size={16} className="text-accent-primary" />
                  <p className="text-xs text-text-muted uppercase tracking-wide">Efficiency</p>
                </div>
                <p className="text-2xl font-bold text-text-primary">{machine.efficiency}%</p>
              </div>

              <div className="text-center border-l border-r border-border-subtle">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Thermometer size={16} className="text-orange-400" />
                  <p className="text-xs text-text-muted uppercase tracking-wide">Temp</p>
                </div>
                <p className="text-2xl font-bold text-text-primary">{machine.temperature}°C</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock size={16} className="text-blue-400" />
                  <p className="text-xs text-text-muted uppercase tracking-wide">Uptime</p>
                </div>
                <p className="text-2xl font-bold text-text-primary">{machine.uptime}h</p>
              </div>
            </motion.div>

            {/* Last maintenance */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-bg-inset border border-border-subtle"
            >
              <div className="p-2 rounded-lg bg-green-500/10">
                <Wrench size={18} className="text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Last Maintenance</p>
                <p className="text-text-primary font-semibold">{new Date(machine.lastMaintenance).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </motion.div>

            {/* Action button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              onClick={onViewDetails}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold hover:shadow-lg hover:shadow-accent-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              View Full Details
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MachinePopup;
