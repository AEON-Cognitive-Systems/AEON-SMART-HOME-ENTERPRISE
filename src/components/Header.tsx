import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Clock, 
  Wifi, 
  Lock, 
  AlertTriangle, 
  Cpu, 
  Eye, 
  Layers, 
  Sliders, 
  ShieldAlert, 
  KeyRound,
  Sparkles,
  Zap
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'vision' | 'devices' | 'automations' | 'energy' | 'emergency' | 'privacy';
  setActiveTab: (tab: 'overview' | 'vision' | 'devices' | 'automations' | 'energy' | 'emergency' | 'privacy') => void;
  systemThreatLevel: 'low' | 'elevated' | 'critical';
  isLockdown: boolean;
  onEmergencyLockdownClick: () => void;
  unresolvedAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  systemThreatLevel,
  isLockdown,
  onEmergencyLockdownClick,
  unresolvedAlertCount
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  interface NavItem {
    id: 'overview' | 'vision' | 'devices' | 'automations' | 'energy' | 'emergency' | 'privacy';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Guardian Core', icon: Sparkles },
    { id: 'vision', label: 'Edge Vision', icon: Eye },
    { id: 'devices', label: 'Device Matrix', icon: Layers },
    { id: 'automations', label: 'Automations', icon: Cpu },
    { id: 'energy', label: 'Energy Grid', icon: Zap },
    { id: 'emergency', label: 'Emergency Hub', icon: ShieldAlert, badge: unresolvedAlertCount > 0 ? unresolvedAlertCount : undefined },
    { id: 'privacy', label: 'Privacy Enclave', icon: KeyRound },
  ];

  return (
    <header className="sticky top-0 z-30 glass-panel-elevated border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top telemetry and branding bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2.5 border-b border-slate-800/80">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/25">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-wider text-slate-100 font-mono">
                  AEON<span className="text-cyan-400">.ENTERPRISE</span>
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  SMART HOME GUARDIAN
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span>ESTATE DOMAIN: <strong>SOVEREIGN VILLA 01</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">ZERO-CLOUD ENCLAVE</span>
              </p>
            </div>
          </div>

          {/* Real-time Telemetry Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            {/* Clock */}
            <div className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{time || '10:14:00'} UTC</span>
            </div>

            {/* Defense condition */}
            <div className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
              isLockdown
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse'
                : systemThreatLevel === 'elevated'
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
            }`}>
              <Activity className="w-3.5 h-3.5" />
              <span className="font-semibold">
                {isLockdown ? 'DEFCON 1 LOCKDOWN' : systemThreatLevel === 'elevated' ? 'DEFCON 3 CAUTION' : 'DEFCON 5 NOMINAL'}
              </span>
            </div>

            {/* Emergency Action Quick Button */}
            <button
              onClick={onEmergencyLockdownClick}
              className={`px-3 py-1 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                isLockdown
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40 animate-pulse'
                  : 'bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isLockdown ? 'LOCKDOWN ACTIVE' : 'EMERGENCY LOCKDOWN'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 pt-2.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 whitespace-nowrap relative ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
