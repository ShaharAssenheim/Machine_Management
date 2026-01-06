import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Server, Settings, Bell, Search, Map } from 'lucide-react';
import { machineApi } from './services/machineApi';
import { Machine } from './types';
import StatCard from './components/StatCard';
import MachineCard from './components/MachineCard';
import DetailView from './components/DetailView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapView from './components/MapView';
import UserManagement from './components/UserManagement';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';
import { ChangePassword } from './components/ChangePassword';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Main App ---
const SIDEBAR_WIDTH = 288; // 72 * 4 = 288px (w-72), collapsed: 80px (w-20)
const SIDEBAR_COLLAPSED_WIDTH = 80;

const AppContent: React.FC = () => {
  const auth = useAuth(); // Get auth context to ensure token is available
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch machines from API on component mount (auth is guaranteed to be ready)
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await machineApi.getAll();
        setMachines(data);
      } catch (err) {
        console.error('Failed to fetch machines:', err);
        setError('Failed to load machines. Please make sure the server is running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachines();

    // Optional: Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchMachines, 30000);
    return () => clearInterval(interval);
  }, []); // Empty dependency - auth is already loaded before AppContent renders

  // Derived Stats
  const stats = useMemo(() => {
    const total = machines.length;
    const running = machines.filter(m => m.status === 'Running').length;
    const error = machines.filter(m => m.status === 'Error').length;
    const avgEfficiency = total > 0 
      ? Math.round(machines.reduce((acc, m) => acc + (m.efficiency ?? 0), 0) / total)
      : 0;
    return { total, running, error, avgEfficiency };
  }, [machines]);

  const filteredMachines = machines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-main transition-colors duration-500">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-80 h-full bg-bg-sidebar/95 backdrop-blur-2xl p-6 border-r border-border-subtle shadow-2xl" 
              onClick={e => e.stopPropagation()}
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 flex items-center justify-center">
                <img src="/src/assets/rigaku_logo.png" alt="Rigaku" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">Machine Control</h2>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left p-4 rounded-xl font-medium flex items-center gap-3 transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                    : 'text-text-muted hover:bg-bg-inset hover:text-text-primary'
                }`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
              <button 
                onClick={() => { setActiveTab('machines'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left p-4 rounded-xl font-medium flex items-center gap-3 transition-all ${
                  activeTab === 'machines' 
                    ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                    : 'text-text-muted hover:bg-bg-inset hover:text-text-primary'
                }`}
              >
                <Server size={18} />
                Machines
              </button>
              <button 
                onClick={() => { setActiveTab('map'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left p-4 rounded-xl font-medium flex items-center gap-3 transition-all ${
                  activeTab === 'map' 
                    ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                    : 'text-text-muted hover:bg-bg-inset hover:text-text-primary'
                }`}
              >
                <Map size={18} />
                Global Map
              </button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className="p-4 md:p-8 lg:p-10 max-w-[1920px] mx-auto min-h-screen transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        }}
      >

        {/* New Header Component */}
        <Header
          title={
            selectedMachine 
              ? 'System Details' 
              : activeTab === 'map' 
                ? 'Global Machine Map' 
                : 'Facility Overview'
          }
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          errorCount={stats.error}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <AnimatePresence mode="wait">
          {selectedMachine ? (
            <DetailView key="detail" machine={selectedMachine} onBack={() => setSelectedMachine(null)} />
          ) : activeTab === 'users' ? (
            <motion.div
              key="users"
              className="space-y-6 pb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserManagement />
            </motion.div>
          ) : activeTab === 'map' ? (
            <motion.div
              key="map"
              className="space-y-6 pb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MapView machines={machines} />
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              className="space-y-10 pb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
            {/* Stats Row */}
            <section>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <StatCard
                  title="Total Machines"
                  value={stats.total}
                  icon={<Server size={24} />}
                  trend="2" trendUp={true}
                />
                <StatCard
                  title="Active Units"
                  value={stats.running}
                  icon={<LayoutDashboard size={24} />}
                  trend="0" trendUp={true}
                />
                <StatCard
                  title="Critical Alerts"
                  value={stats.error}
                  icon={<Bell size={24} />}
                  trend={stats.error > 0 ? "2" : "0"}
                  trendUp={false}
                />
                <StatCard
                  title="Global Efficiency"
                  value={`${stats.avgEfficiency}%`}
                  icon={<Settings size={24} />}
                  trend="1.2%" trendUp={true}
                />
              </motion.div>
            </section>

            {/* Machine Grid */}
            <section>
              <motion.div 
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="relative"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-accent-primary to-accent-secondary blur-md opacity-50"></div>
                    <div className="relative w-1.5 h-10 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-full"></div>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary tracking-tight">Real-time Machine Monitor</h3>
                    <p className="text-sm text-text-muted font-medium mt-0.5">Live telemetry from all production zones</p>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                  {/* Zone Filter Pills */}
                  <div className="flex items-center p-1 bg-bg-card/80 backdrop-blur-xl rounded-xl border border-border-subtle">
                    <motion.button 
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-xs font-semibold shadow-lg shadow-accent-primary/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      All Zones
                    </motion.button>
                    <motion.button 
                      className="px-4 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-inset text-xs font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Zone A
                    </motion.button>
                    <motion.button 
                      className="px-4 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-inset text-xs font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Zone B
                    </motion.button>
                  </div>

                  <div className="h-8 w-px bg-border-subtle mx-1 hidden md:block self-center"></div>

                  {/* Status Filter */}
                  <select className="text-xs font-medium border border-border-subtle rounded-xl px-4 py-2.5 bg-bg-card/80 backdrop-blur-xl text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 transition-all duration-300 cursor-pointer appearance-none pr-8 bg-no-repeat bg-right" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '16px', backgroundPosition: 'right 8px center' }}>
                    <option>All Status</option>
                    <option>Running</option>
                    <option>Maintenance</option>
                    <option>Error</option>
                  </select>
                </div>
              </motion.div>

              {isLoading ? (
                <motion.div 
                  className="text-center py-24 bg-bg-card/50 backdrop-blur-xl rounded-3xl border border-border-subtle flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="w-16 h-16 border-4 border-accent-primary/30 border-t-accent-primary rounded-full mb-6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <h3 className="text-xl font-bold text-text-primary mb-2">Loading machines...</h3>
                  <p className="text-text-muted text-sm max-w-xs">Please wait while we fetch the latest data from the server.</p>
                </motion.div>
              ) : error ? (
                <motion.div 
                  className="text-center py-24 bg-bg-card/50 backdrop-blur-xl rounded-3xl border border-red-500/20 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div 
                    className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 text-red-500 border border-red-500/20"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Bell size={32} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Connection Error</h3>
                  <p className="text-text-muted text-sm max-w-md mb-4">{error}</p>
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl font-semibold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                  >
                    Retry Connection
                  </motion.button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredMachines.map((machine, idx) => (
                    <MachineCard
                      key={machine.name + '-' + idx}
                      machine={machine}
                      onClick={setSelectedMachine}
                    />
                  ))}
                </div>
              )}

              {!isLoading && !error && filteredMachines.length === 0 && (
                <motion.div 
                  className="text-center py-24 bg-bg-card/50 backdrop-blur-xl rounded-3xl border border-dashed border-border-subtle flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div 
                    className="w-20 h-20 rounded-2xl bg-bg-inset flex items-center justify-center mb-6 text-text-muted border border-border-subtle"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Search size={32} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">No units found</h3>
                  <p className="text-text-muted text-sm max-w-xs">Try adjusting your search terms or filters to find what you're looking for.</p>
                </motion.div>
              )}
            </section>
          </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, isLoading, user, token, clearPasswordChangeRequirement } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');

  // Show loading state while auth is initializing from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin" />
          </div>
          <p className="text-text-muted text-sm">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Show password change screen if user needs to change password
  if (isAuthenticated && user?.requirePasswordChange && token) {
    return (
      <ChangePassword
        token={token}
        onPasswordChanged={() => {
          clearPasswordChangeRequirement();
        }}
      />
    );
  }

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    } else if (authView === 'forgot') {
      return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
    } else {
      return (
        <Login 
          onSwitchToRegister={() => setAuthView('register')}
          onSwitchToForgotPassword={() => setAuthView('forgot')}
        />
      );
    }
  }

  return <AppContent />;
};

export default App;