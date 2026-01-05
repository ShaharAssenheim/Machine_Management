import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Menu, Sparkles, Command } from 'lucide-react';

interface HeaderProps {
    title: string;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    errorCount: number;
    onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, searchTerm, setSearchTerm, errorCount, onMobileMenuToggle }) => {
    return (
        <motion.header 
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sticky top-0 z-40 py-4 md:py-6 bg-bg-header/80 backdrop-blur-2xl md:static md:bg-transparent border-b border-border-subtle md:border-none"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMobileMenuToggle} 
                    className="lg:hidden p-2.5 rounded-xl bg-bg-card border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-elevated hover:border-border-highlight transition-all duration-200"
                >
                    <Menu size={20} />
                </button>
                
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                            {title}
                        </h2>
                        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-primary/15 border border-accent-primary/30 shadow-sm shadow-accent-primary/10">
                            <Sparkles size={12} className="text-accent-primary animate-pulse" />
                            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                    <p className="text-text-muted text-sm mt-1.5 font-medium flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-secondary"></span>
                        </span>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Premium Search Input */}
                <div className="relative hidden md:block group">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 text-text-muted w-4 h-4 group-focus-within:text-accent-primary transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="Search machine..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="relative pl-11 pr-20 py-3 bg-bg-card/80 backdrop-blur-xl border border-border-subtle rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 w-72 transition-all duration-300 shadow-sm"
                        />
                        <div className="absolute right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-bg-inset border border-border-subtle text-text-muted text-[10px] font-medium">
                            <Command size={10} />
                            <span>K</span>
                        </div>
                    </div>
                </div>

                {/* Notification Button */}
                <motion.button 
                    className="relative p-3 rounded-xl bg-bg-card/80 backdrop-blur-xl border border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-elevated hover:border-border-highlight group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Bell size={18} className="relative z-10" />
                    {errorCount > 0 && (
                        <>
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-status-error rounded-full z-20 animate-pulse"></span>
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-status-error rounded-full z-10 animate-ping"></span>
                        </>
                    )}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.button>

                {/* Quick Actions */}
                <div className="hidden lg:flex items-center gap-2 pl-3 ml-1 border-l border-border-subtle">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 cursor-pointer hover:from-accent-primary/20 hover:to-accent-secondary/20 transition-all duration-300 group">
                        <div className="w-2 h-2 rounded-full bg-status-running animate-pulse"></div>
                        <span className="text-xs font-semibold text-accent-primary">12 Active</span>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
