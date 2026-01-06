import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Server, Settings, User, Moon, Sun, Activity, ChevronRight, Map, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


interface SidebarProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed: collapsedProp, setCollapsed: setCollapsedProp }) => {
  const { user, logout } = useAuth();
  
  // Theme context removed; always light mode
  // Use controlled collapsed state if provided, else fallback to local state
  const [internalCollapsed, internalSetCollapsed] = useState(false);
  const collapsed = typeof collapsedProp === 'boolean' ? collapsedProp : internalCollapsed;
  const setCollapsed = setCollapsedProp || internalSetCollapsed;

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview', badge: null },
    { id: 'map', icon: <Map size={18} />, label: 'Global Map', badge: null },
  ];

  // Add admin-only menu item
  if (user?.isAdmin) {
    menuItems.push({ id: 'users', icon: <Users size={18} />, label: 'User Management', badge: null });
  }

  return (
    <motion.aside
      className={`fixed left-0 top-0 h-full ${collapsed ? 'w-20' : 'w-72'} bg-bg-sidebar/95 backdrop-blur-2xl border-r border-border-subtle text-text-secondary z-50 hidden lg:flex flex-col transition-all duration-300`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Logo Section */}
      <div className={`flex flex-col items-center justify-center p-6 pb-4 relative h-[110px]`}> 
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className={`relative flex items-center transition-all duration-300`}>
            {/* Animated glow ring */}
            <div className="absolute inset-0 rounded-xl bg-accent-primary/20 blur-xl opacity-60 animate-pulse-slow"></div>
            <div className="relative w-12 h-12 flex items-center justify-center transition-all duration-300">
              <img src="/src/assets/rigaku_logo.png" alt="Rigaku" className="w-full h-full object-contain drop-shadow-lg transition-all duration-300" />
            </div>
          </div>
          {!collapsed && (
            <div className="mt-2 flex flex-col items-center w-full">
              <h1 className="text-lg font-bold tracking-tight text-text-primary text-center w-full">
                Machine Control
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5 justify-center w-full">
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse shadow-sm shadow-accent-primary"></div>
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-accent-primary animate-ping"></div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium">Live System</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className={`mx-${collapsed ? '2' : '6'} h-px bg-gradient-to-r from-transparent via-border-medium to-transparent`}></div>

      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'px-1 py-4' : 'px-4 py-6'} space-y-1.5`}>
        {!collapsed && (
          <p className="px-4 mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted/70">Main Menu</p>
        )}
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`group w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl relative overflow-hidden ${activeTab === item.id
                ? 'bg-accent-primary/10 text-accent-primary'
                : 'text-text-secondary hover:bg-bg-inset hover:text-text-primary'
              }`}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active indicator bar */}
            {activeTab === item.id && (
              <motion.div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-r-full shadow-glow-sm"
                layoutId="activeIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            <span className={`transition-colors duration-200 ${activeTab === item.id ? 'text-accent-primary' : 'text-text-muted group-hover:text-text-primary'}`}>{item.icon}</span>
            {!collapsed && (
              <>
                <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === item.id 
                    ? 'bg-accent-primary/20 text-accent-primary' 
                    : 'bg-bg-inset text-text-muted'}`}>
                    {item.badge}
                  </span>
                )}
                {activeTab === item.id && (
                  <ChevronRight size={14} className="text-accent-primary" />
                )}
              </>
            )}
          </motion.button>
        ))}
      </nav>







      {/* User Profile - Logout Button */}
      <motion.div
        className={`p-4 ${collapsed ? 'mx-1' : 'mx-4'} mb-2 rounded-2xl bg-gradient-to-br from-bg-card to-bg-inset border border-border-subtle relative overflow-hidden group cursor-pointer hover:border-border-highlight flex items-center ${collapsed ? 'justify-center' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="flex items-center gap-3 relative z-10 w-full">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-border-subtle flex items-center justify-center">
              <LogOut size={18} className="text-text-muted group-hover:text-accent-primary transition-colors" />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-status-running border-2 border-bg-sidebar shadow-[0_0_8px_var(--status-running)]"></div>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{user?.username || 'User'}</p>
                <p className="text-[10px] text-text-muted truncate">Click for logout</p>
              </div>
              <LogOut size={14} className="text-text-muted group-hover:text-accent-primary transition-colors" />
            </>
          )}
        </div>
      </motion.div>

      {/* Collapse/Expand Button under User Profile */}
      <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'} px-2 mb-4`}>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className={`p-2 rounded-lg hover:bg-bg-inset transition-colors ${collapsed ? '' : 'mr-2'}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight size={22} className={`transition-transform ${!collapsed ? '-rotate-180' : ''}`} />
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
