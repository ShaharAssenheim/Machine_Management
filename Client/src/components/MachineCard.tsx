import React from 'react';
import { motion } from 'framer-motion';
import { Machine } from '../types';
import { Activity, Thermometer, Settings, Zap, Cpu, ArrowUpRight } from 'lucide-react';
import MachineIllustration from './MachineIllustration';

interface MachineCardProps {
  machine: Machine;
  onClick: (machine: Machine) => void;
}

import { MachineStatus } from '../types';

const statusConfig = {
  [MachineStatus.RUNNING]: {
    color: 'text-status-running',
    bg: 'bg-status-running',
    bgLight: 'bg-status-running-bg',
    border: 'border-status-running/30',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    label: 'Operational',
    ring: 'ring-status-running/20'
  },
  [MachineStatus.IDLE]: {
    color: 'text-status-idle',
    bg: 'bg-status-idle',
    bgLight: 'bg-status-idle-bg',
    border: 'border-status-idle/30',
    glow: '',
    label: 'Standby',
    ring: 'ring-status-idle/20'
  },
  [MachineStatus.MAINTENANCE]: {
    color: 'text-status-warning',
    bg: 'bg-status-warning',
    bgLight: 'bg-status-warning-bg',
    border: 'border-status-warning/30',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    label: 'Maintenance',
    ring: 'ring-status-warning/20'
  },
  [MachineStatus.ERROR]: {
    color: 'text-status-error',
    bg: 'bg-status-error',
    bgLight: 'bg-status-error-bg',
    border: 'border-status-error/30',
    glow: 'shadow-[0_0_25px_rgba(239,68,68,0.3)]',
    label: 'Critical',
    ring: 'ring-status-error/30'
  },
};

const MachineCard: React.FC<MachineCardProps> = ({ machine, onClick }) => {
  const config = statusConfig[machine.status] || statusConfig[MachineStatus.RUNNING];

  return (
    <motion.div
      onClick={() => onClick(machine)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 ${
        machine.status === MachineStatus.ERROR 
          ? 'border-status-error/40 shadow-lg shadow-status-error/10' 
          : 'border-border-medium hover:border-accent-primary/50 shadow-lg hover:shadow-accent-primary/10'
      } ${machine.status === MachineStatus.ERROR ? config.glow : 'hover:shadow-glow-md'}`}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Animated border gradient */}
      <motion.div 
        className={`absolute inset-0 rounded-2xl ${machine.status === MachineStatus.ERROR 
        ? 'bg-gradient-to-b from-status-error/20 via-transparent to-transparent' 
        : 'bg-gradient-to-b from-accent-primary/10 via-transparent to-transparent'}`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Main card */}
      <div className="relative glass-card rounded-xl h-full flex flex-col bg-bg-card/95 backdrop-blur-xl">
        {/* Top accent bar */}
        <div className={`h-1 w-full transition-all duration-300 ${machine.status === MachineStatus.ERROR 
          ? 'bg-gradient-to-r from-status-error via-status-error to-status-error' 
          : 'bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent opacity-0 group-hover:opacity-100'}`}></div>

        {/* Header Section */}
        <div className="p-5 pb-3 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-text-primary text-lg tracking-tight group-hover:text-accent-primary transition-colors duration-300">{machine.name}</h3>
                <ArrowUpRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-bg-inset border border-border-subtle text-[10px] text-text-muted font-mono tracking-wide">
                  {machine.id}
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-text-muted/50"></span>
                  {machine.location.city}, {machine.location.country}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgLight} ${config.border} border backdrop-blur-sm transition-all duration-300 group-hover:scale-105`}>
              <div className="relative">
                <div className={`w-2 h-2 rounded-full ${config.bg}`}></div>
                {(machine.status === MachineStatus.RUNNING || machine.status === MachineStatus.ERROR) && (
                  <div className={`absolute inset-0 w-2 h-2 rounded-full ${config.bg} animate-ping`}></div>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
            </div>
          </div>
        </div>

        {/* Machine Visualization */}
        <div className="flex-1 relative py-4 my-2 min-h-[160px]">
          {/* Background grid with mask */}
          <div className="absolute inset-0 grid-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>
          
          {/* Radial glow effect */}
          <div className={`absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500 ${machine.status === MachineStatus.ERROR 
            ? 'bg-[radial-gradient(ellipse_at_center,var(--status-error-bg)_0%,transparent_70%)]' 
            : 'bg-[radial-gradient(ellipse_at_center,var(--accent-glow)_0%,transparent_70%)]'}`}></div>

          <div className="relative z-10 h-full flex items-center justify-center transform transition-all duration-500 group-hover:scale-110">
            <MachineIllustration status={machine.status} imageUrl={machine.image} scale={0.95} />
          </div>
        </div>

        {/* Tech Specs */}
        <div className="px-5 pb-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-bg-inset/50 border border-border-subtle group-hover:border-border-highlight transition-all duration-300">
            <div className="p-1.5 rounded-lg bg-accent-primary/10 text-accent-primary">
              <Settings size={12} />
            </div>
            <div>
              <p className="text-[9px] uppercase text-text-muted font-semibold tracking-wider">Units</p>
              <p className="text-xs text-text-secondary font-mono font-semibold">{machine.xRayCrushers}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-bg-inset/50 border border-border-subtle group-hover:border-border-highlight transition-all duration-300">
            <div className="p-1.5 rounded-lg bg-accent-secondary/10 text-accent-secondary">
              <Cpu size={12} />
            </div>
            <div>
              <p className="text-[9px] uppercase text-text-muted font-semibold tracking-wider">Core</p>
              <p className="text-xs text-text-secondary font-mono font-semibold truncate max-w-[70px]" title={machine.tubeType}>{machine.tubeType}</p>
            </div>
          </div>
        </div>

        {/* Telemetry Footer */}
        <div className="mt-auto border-t border-border-subtle bg-bg-inset/30 backdrop-blur-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Temperature */}
              <div className="flex items-center gap-2" title="Core Temperature">
                <div className={`p-1.5 rounded-lg ${machine.temperature > 75 ? 'bg-status-error-bg' : 'bg-bg-card'}`}>
                  <Thermometer size={14} className={machine.temperature > 75 ? 'text-status-error' : 'text-text-muted'} />
                </div>
                <span className={`text-sm font-mono font-bold ${machine.temperature > 75 ? 'text-status-error' : 'text-text-secondary'}`}>
                  {machine.temperature}°
                </span>
              </div>
              
              <div className="h-4 w-px bg-border-subtle"></div>
              
              {/* Efficiency */}
              <div className="flex items-center gap-2" title="Efficiency">
                <div className="p-1.5 rounded-lg bg-status-running-bg">
                  <Activity size={14} className="text-status-running" />
                </div>
                <span className="text-sm font-mono font-bold text-status-running">{machine.efficiency}%</span>
              </div>
            </div>

            {machine.hasPurging && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
                <Zap size={10} fill="currentColor" className="text-accent-primary" />
                <span className="text-[9px] uppercase font-bold tracking-widest text-accent-primary">Purge</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Critical state overlay */}
      {machine.status === MachineStatus.ERROR && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-status-error/10 to-transparent"></div>
          <div className="absolute top-4 right-4 w-3 h-3">
            <span className="absolute inset-0 rounded-full bg-status-error animate-ping"></span>
            <span className="absolute inset-0 rounded-full bg-status-error"></span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MachineCard;