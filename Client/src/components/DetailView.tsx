import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Machine, MachineStatus } from '../types';
import { ArrowLeft, Sparkles, CheckCircle, AlertTriangle, Activity, Thermometer, Clock, ShieldCheck, Zap, Gauge, TrendingUp } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
// ...existing code...
import MachineIllustration from './MachineIllustration';

interface DetailViewProps {
    machine: Machine;
    onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ machine, onBack }) => {
    // ...existing code...

        // Efficiency and loss are not in new format, so use history or tubes for stats
        const efficiencyData = machine.history
            ? machine.history.map((h) => ({ name: h.time, value: h.value }))
            : [];

    // Status colors for new status string
    const statusColors = {
        operational: { primary: 'var(--status-running)', bg: 'var(--status-running-bg)' },
        maintenance: { primary: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
        error: { primary: 'var(--status-error)', bg: 'var(--status-error-bg)' },
        idle: { primary: 'var(--status-idle)', bg: 'var(--status-idle-bg)' },
    };

    return (
        <motion.div 
            className="flex flex-col min-h-[calc(100vh-180px)] gap-6 pb-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >

            {/* Top Header */}
            <motion.div 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center gap-4">
                    <motion.button 
                        onClick={onBack} 
                        className="p-2.5 rounded-xl bg-bg-inset hover:bg-bg-card border border-border-subtle hover:border-border-highlight text-text-muted hover:text-text-primary transition-all duration-300"
                        whileHover={{ scale: 1.05, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft size={18} />
                    </motion.button>
                    <div className="h-8 w-px bg-border-subtle hidden sm:block"></div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                                {machine.name}
                            </h1>
                            <span className="px-2.5 py-1 rounded-lg bg-bg-inset border border-border-subtle text-[10px] text-text-muted font-mono uppercase tracking-wider">
                                {machine.model}
                            </span>
                        </div>
                        <p className="text-sm text-text-muted mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-text-muted/50"></span>
                            {machine.location.city}, {machine.location.country}
                        </p>
                    </div>
                </div>

                {/* ...existing code... */}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">

                {/* Left Column: KPI & Stats */}
                <div className="lg:col-span-3 flex flex-col gap-5 overflow-y-auto custom-scrollbar">

                    {/* Efficiency Gauge */}
                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-status-running/10 to-transparent rounded-bl-full"></div>
                        <h3 className="text-text-muted text-[10px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                            <Gauge size={12} className="text-accent-primary" />
                            Efficiency Index
                        </h3>
                        <div className="w-full aspect-square max-w-[200px] mx-auto relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={efficiencyData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="70%"
                                        outerRadius="90%"
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={8}
                                        paddingAngle={3}
                                    >
                                        <Cell fill="var(--status-running)" />
                                        <Cell fill="var(--border-subtle)" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-text-primary tracking-tighter">{machine.efficiency}%</span>
                                <span className="text-[10px] text-status-running font-bold uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full bg-status-running-bg">Optimal</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats - new fields */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-border-subtle bg-bg-inset/50">
                            <h3 className="text-text-secondary font-semibold flex items-center gap-2 text-sm">
                                <Activity size={14} className="text-accent-primary" /> Machine Info
                            </h3>
                        </div>
                        <div className="divide-y divide-border-subtle">
                            {[ 
                                { label: 'PLC Version', value: machine.plc_version },
                                { label: 'ACS Version', value: machine.acs_version },
                                { label: 'Owner', value: machine.owner },
                                { label: 'TeamViewer', value: machine.teamviewer_name },
                                { label: 'Tubes', value: machine.tubes_number },
                            ].map((stat, idx) => (
                                <div key={idx} className="p-4 flex justify-between items-center hover:bg-bg-inset/30 transition-colors group">
                                    <span className="text-sm text-text-muted">{stat.label}</span>
                                    <span className="font-mono font-bold text-sm text-text-primary">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tubes Config - new format */}
                    <div className="glass-card rounded-2xl p-5">
                        <h3 className="text-text-muted text-[10px] uppercase tracking-widest font-bold mb-4">Tubes Configuration</h3>
                        <div className="space-y-3">
                            {machine.tubes.map((tube, idx) => (
                                <div key={idx} className="flex flex-col p-3 rounded-xl bg-bg-inset/50 border border-border-subtle">
                                    <span className="text-sm text-text-muted">Tube #{tube.tube_index}</span>
                                    <span className="text-xs font-mono font-semibold text-accent-secondary">{tube.tube_type}</span>
                                    <span className="text-xs text-text-muted">Purging: {tube.purging_connected ? 'Connected' : 'Not Connected'}</span>
                                    <span className="text-xs text-text-muted">Shutter: {tube.shutter_exists ? 'Exists' : 'None'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center Column: Machine Visual */}
                <div className="lg:col-span-6 flex flex-col gap-5">
                    <div className="flex-1 glass-card rounded-2xl relative overflow-hidden min-h-[350px] group">
                        {/* Grid background */}
                        <div className="absolute inset-0 grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
                        
                        {/* Ambient glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full transition-opacity duration-700" style={{ background: `radial-gradient(circle, ${statusColors[machine.status]?.bg ?? 'var(--bg-card)'} 0%, transparent 70%)` }}></div>

                        <div className="relative z-10 w-full h-full flex items-center justify-center p-8 transform group-hover:scale-105 transition-transform duration-700">
                            <MachineIllustration status={machine.status} imageUrl={machine.image} scale={1.2} />
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-5 left-5 z-20">
                            <div className={`px-4 py-2.5 rounded-xl backdrop-blur-2xl border shadow-lg flex items-center gap-3 ${
                                machine.status === MachineStatus.RUNNING ? 'bg-status-running-bg border-status-running/30 text-status-running' :
                                machine.status === MachineStatus.ERROR ? 'bg-status-error-bg border-status-error/30 text-status-error' :
                                machine.status === MachineStatus.MAINTENANCE ? 'bg-status-warning-bg border-status-warning/30 text-status-warning' :
                                'bg-bg-card border-border-subtle text-text-muted'
                            }`}>
                                <div className="relative">
                                    <div className={`w-2.5 h-2.5 rounded-full ${
                                        machine.status === MachineStatus.RUNNING ? 'bg-status-running' :
                                        machine.status === MachineStatus.ERROR ? 'bg-status-error' :
                                        machine.status === MachineStatus.MAINTENANCE ? 'bg-status-warning' :
                                        'bg-status-idle'
                                    }`}></div>
                                    {(machine.status === MachineStatus.RUNNING || machine.status === MachineStatus.ERROR) && (
                                        <div className={`absolute inset-0 rounded-full animate-ping ${
                                            machine.status === MachineStatus.RUNNING ? 'bg-status-running' : 'bg-status-error'
                                        }`}></div>
                                    )}
                                </div>
                                <span className="font-bold tracking-widest uppercase text-xs">{machine.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="h-72 glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-accent-primary" />
                                <h3 className="text-text-muted text-[10px] uppercase tracking-widest font-bold">Performance Trend</h3>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-accent-primary/10 text-accent-primary border border-accent-primary/20 transition-all">7D</button>
                                <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-bg-inset text-text-muted transition-all">30D</button>
                                <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-bg-inset text-text-muted transition-all">90D</button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={machine.history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}
                                    itemStyle={{ color: 'var(--accent-primary)', fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'var(--text-muted)', fontSize: '10px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={2.5} fill="url(#colorTrend)" activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent-primary)' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: System Health */}
                <div className="lg:col-span-3 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
                    <div className="glass-card rounded-2xl flex-1 overflow-hidden">
                        <div className="p-4 border-b border-border-subtle bg-bg-inset/50">
                            <h3 className="text-text-secondary font-semibold flex items-center gap-2 text-sm">
                                <ShieldCheck size={14} className="text-status-running" /> System Health
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {[
                                { title: 'Safety Interlocks', desc: 'All gates secured', ok: true },
                                { title: 'Cooling System', desc: 'Flow rate nominal', ok: true },
                                { title: 'Power Supply', desc: 'Voltage stable at 240V', ok: true },
                                { title: 'Calibration', desc: machine.status === MachineStatus.MAINTENANCE ? 'Due for check' : 'Valid until next month', ok: machine.status !== MachineStatus.MAINTENANCE },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 group">
                                    <div className="mt-0.5">
                                        {item.ok ? (
                                            <CheckCircle size={16} className="text-status-running" />
                                        ) : (
                                            <AlertTriangle size={16} className="text-status-warning" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors">{item.title}</div>
                                        <div className="text-[10px] text-text-muted mt-0.5">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DetailView;