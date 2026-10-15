import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Zap, 
  Sun, 
  BatteryCharging, 
  Layers, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  Download, 
  Play, 
  Pause, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  AlertCircle 
} from 'lucide-react';
import { Device, EnergyDataPoint, ZoneId } from '../types';

interface EnergyDashboardProps {
  devices: Device[];
  onTriggerEcoMode?: () => void;
}

// Initial historical data points (last 12 intervals)
const INITIAL_ENERGY_SERIES: EnergyDataPoint[] = [
  { time: '10:00', totalLoadWatts: 1180, solarGenerationWatts: 1420, batteryDrawWatts: -240, gridDrawWatts: 0, hvacWatts: 580, lightingWatts: 180, vaultWatts: 340, defenseWatts: 80 },
  { time: '10:05', totalLoadWatts: 1240, solarGenerationWatts: 1490, batteryDrawWatts: -250, gridDrawWatts: 0, hvacWatts: 610, lightingWatts: 190, vaultWatts: 360, defenseWatts: 80 },
  { time: '10:10', totalLoadWatts: 1390, solarGenerationWatts: 1610, batteryDrawWatts: -220, gridDrawWatts: 0, hvacWatts: 720, lightingWatts: 210, vaultWatts: 380, defenseWatts: 80 },
  { time: '10:15', totalLoadWatts: 1310, solarGenerationWatts: 1580, batteryDrawWatts: -270, gridDrawWatts: 0, hvacWatts: 660, lightingWatts: 190, vaultWatts: 380, defenseWatts: 80 },
  { time: '10:20', totalLoadWatts: 1260, solarGenerationWatts: 1650, batteryDrawWatts: -390, gridDrawWatts: 0, hvacWatts: 620, lightingWatts: 180, vaultWatts: 380, defenseWatts: 80 },
  { time: '10:25', totalLoadWatts: 1410, solarGenerationWatts: 1720, batteryDrawWatts: -310, gridDrawWatts: 0, hvacWatts: 740, lightingWatts: 200, vaultWatts: 390, defenseWatts: 80 },
  { time: '10:30', totalLoadWatts: 1350, solarGenerationWatts: 1780, batteryDrawWatts: -430, gridDrawWatts: 0, hvacWatts: 690, lightingWatts: 190, vaultWatts: 390, defenseWatts: 80 },
  { time: '10:35', totalLoadWatts: 1290, solarGenerationWatts: 1810, batteryDrawWatts: -520, gridDrawWatts: 0, hvacWatts: 630, lightingWatts: 185, vaultWatts: 395, defenseWatts: 80 },
  { time: '10:40', totalLoadWatts: 1380, solarGenerationWatts: 1790, batteryDrawWatts: -410, gridDrawWatts: 0, hvacWatts: 700, lightingWatts: 195, vaultWatts: 405, defenseWatts: 80 },
  { time: '10:45', totalLoadWatts: 1420, solarGenerationWatts: 1850, batteryDrawWatts: -430, gridDrawWatts: 0, hvacWatts: 730, lightingWatts: 205, vaultWatts: 405, defenseWatts: 80 },
  { time: '10:50', totalLoadWatts: 1360, solarGenerationWatts: 1820, batteryDrawWatts: -460, gridDrawWatts: 0, hvacWatts: 680, lightingWatts: 195, vaultWatts: 405, defenseWatts: 80 },
  { time: '10:55', totalLoadWatts: 1315, solarGenerationWatts: 1860, batteryDrawWatts: -545, gridDrawWatts: 0, hvacWatts: 640, lightingWatts: 190, vaultWatts: 405, defenseWatts: 80 },
];

export const EnergyDashboard: React.FC<EnergyDashboardProps> = ({ devices, onTriggerEcoMode }) => {
  const [dataSeries, setDataSeries] = useState<EnergyDataPoint[]>(INITIAL_ENERGY_SERIES);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [timeRange, setTimeRange] = useState<'live' | '1h' | '24h'>('live');
  const [powerMode, setPowerMode] = useState<'eco' | 'island' | 'performance' | 'cryo'>('eco');

  // Interactive series visibility toggles
  const [visibleSeries, setVisibleSeries] = useState({
    totalLoad: true,
    solar: true,
    hvac: true,
    vault: true,
    lighting: false,
    defense: false,
  });

  // Calculate current real-time load from devices state
  const currentActualWatts = devices.reduce((sum, d) => sum + (d.state ? d.powerWatts : 0), 0);
  const activeDeviceCount = devices.filter(d => d.state).length;

  // Real-time ticking simulation effect
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setDataSeries((prev) => {
        const last = prev[prev.length - 1];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });

        // Jitter based on active devices
        const delta = (Math.random() - 0.48) * 45;
        const baseDeviceWatts = Math.max(900, currentActualWatts + Math.round(delta));
        const solarBase = 1850 + Math.round((Math.random() - 0.5) * 80);
        const hvacWatts = Math.round(baseDeviceWatts * 0.48 + (Math.random() - 0.5) * 20);
        const vaultWatts = Math.round(baseDeviceWatts * 0.32 + (Math.random() - 0.5) * 10);
        const lightingWatts = Math.round(baseDeviceWatts * 0.14 + (Math.random() - 0.5) * 10);
        const defenseWatts = Math.round(baseDeviceWatts - hvacWatts - vaultWatts - lightingWatts);

        const newPoint: EnergyDataPoint = {
          time: timeStr,
          totalLoadWatts: baseDeviceWatts,
          solarGenerationWatts: solarBase,
          batteryDrawWatts: baseDeviceWatts - solarBase, // negative means charging battery
          gridDrawWatts: 0, // sovereign zero-grid draw
          hvacWatts,
          vaultWatts,
          lightingWatts,
          defenseWatts: Math.max(20, defenseWatts)
        };

        const updated = [...prev.slice(1), newPoint];
        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreaming, currentActualWatts]);

  // Aggregate Zone/Sector Data for Recharts Bar Chart
  const zoneBreakdown = React.useMemo(() => {
    const zones: Record<ZoneId, { name: string; watts: number; activeNodes: number }> = {
      atrium: { name: 'Atrium', watts: 0, activeNodes: 0 },
      penthouse: { name: 'Penthouse', watts: 0, activeNodes: 0 },
      office: { name: 'Executive Office', watts: 0, activeNodes: 0 },
      vault: { name: 'Server Vault', watts: 0, activeNodes: 0 },
      perimeter: { name: 'Perimeter', watts: 0, activeNodes: 0 },
    };

    devices.forEach((d) => {
      if (d.state) {
        zones[d.zone].watts += d.powerWatts;
        zones[d.zone].activeNodes += 1;
      }
    });

    return Object.values(zones);
  }, [devices]);

  // Energy Source Generation Mix (Pie Chart)
  const sourceMixData = [
    { name: 'Rooftop Solar Array', value: 1850, color: '#06b6d4' },
    { name: 'Solid-State Battery Storage', value: 450, color: '#10b981' },
    { name: 'Geothermal Loop', value: 180, color: '#8b5cf6' },
    { name: 'Public Grid Backup', value: 0, color: '#64748b' },
  ];

  const currentLatest = dataSeries[dataSeries.length - 1] || INITIAL_ENERGY_SERIES[0];
  const netSurplusWatts = currentLatest.solarGenerationWatts - currentLatest.totalLoadWatts;
  const isNetPositive = netSurplusWatts >= 0;

  const handleExportData = () => {
    const exportBlob = new Blob([JSON.stringify(dataSeries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(exportBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AEON_ENERGY_TELEMETRY_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-5 border border-cyan-500/20 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shadow-sm shadow-cyan-500/20">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wider">
                Real-Time Energy Telemetry Grid
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SOVEREIGN MICRO-GRID ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live power distribution trends, solar harvesting efficiency, and decentralized IoT load-balancing.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume Live Stream */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isLiveStreaming
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'Live (2.5s)' : 'Paused'}</span>
          </button>

          {/* Export Telemetry */}
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export Audit</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Estate Power Draw */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TOTAL LOAD</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 flex items-baseline gap-1">
            {(currentLatest.totalLoadWatts / 1000).toFixed(2)}
            <span className="text-xs font-normal text-slate-400 font-sans">kW</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 pt-0.5">
            <span className="text-cyan-400 font-semibold">{activeDeviceCount}</span> nodes actively drawing power
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Solar Generation */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SOLAR HARVEST</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 flex items-baseline gap-1">
            {(currentLatest.solarGenerationWatts / 1000).toFixed(2)}
            <span className="text-xs font-normal text-slate-400 font-sans">kW</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>+100% Zero-Carbon Harvest</span>
          </div>
        </div>

        {/* Net Battery Storage Flux */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>BATTERY BANK (120kWh)</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 flex items-baseline gap-1">
            92.4%
            <span className="text-xs font-normal text-slate-400 font-sans">SoC</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 pt-0.5">
            {isNetPositive ? (
              <span className="text-emerald-400 font-semibold">
                Charging at +{(netSurplusWatts / 1000).toFixed(2)} kW
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">
                Discharging -{(Math.abs(netSurplusWatts) / 1000).toFixed(2)} kW
              </span>
            )}
          </div>
        </div>

        {/* Grid Independence & Carbon Offset */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>GRID INDEPENDENCE</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 flex items-baseline gap-1">
            100.0%
            <span className="text-xs font-normal text-emerald-400 font-sans">Sovereign</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 pt-0.5">
            <span className="text-emerald-400 font-semibold">18.4 kg</span> CO₂ avoided today
          </div>
        </div>
      </div>

      {/* Main Real-Time Recharts Area Chart: Power Usage Trends */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100 font-mono tracking-wide">
              Power Consumption & Generation Trends (Watts)
            </h3>
          </div>

          {/* Interactive Metric Filter Checkboxes */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setVisibleSeries(s => ({ ...s, totalLoad: !s.totalLoad }))}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                visibleSeries.totalLoad
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Total Load</span>
            </button>

            <button
              onClick={() => setVisibleSeries(s => ({ ...s, solar: !s.solar }))}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                visibleSeries.solar
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Solar Harvest</span>
            </button>

            <button
              onClick={() => setVisibleSeries(s => ({ ...s, hvac: !s.hvac }))}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                visibleSeries.hvac
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>HVAC</span>
            </button>

            <button
              onClick={() => setVisibleSeries(s => ({ ...s, vault: !s.vault }))}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                visibleSeries.vault
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Cryo Vault</span>
            </button>

            <button
              onClick={() => setVisibleSeries(s => ({ ...s, lighting: !s.lighting }))}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                visibleSeries.lighting
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Lighting</span>
            </button>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataSeries} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorHvac" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorVault" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                fontFamily="JetBrains Mono, monospace" 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                fontFamily="JetBrains Mono, monospace" 
                unit="W" 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  borderColor: 'rgba(56, 189, 248, 0.3)', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#f1f5f9' }}
                labelStyle={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '4px' }}
              />

              {visibleSeries.solar && (
                <Area 
                  type="monotone" 
                  dataKey="solarGenerationWatts" 
                  name="Solar Harvest" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorSolar)" 
                />
              )}

              {visibleSeries.totalLoad && (
                <Area 
                  type="monotone" 
                  dataKey="totalLoadWatts" 
                  name="Total Load" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              )}

              {visibleSeries.hvac && (
                <Area 
                  type="monotone" 
                  dataKey="hvacWatts" 
                  name="Microclimate HVAC" 
                  stroke="#10b981" 
                  strokeWidth={1.8} 
                  fillOpacity={1} 
                  fill="url(#colorHvac)" 
                />
              )}

              {visibleSeries.vault && (
                <Area 
                  type="monotone" 
                  dataKey="vaultWatts" 
                  name="Cryo Vault Cooling" 
                  stroke="#a855f7" 
                  strokeWidth={1.8} 
                  fillOpacity={1} 
                  fill="url(#colorVault)" 
                />
              )}

              {visibleSeries.lighting && (
                <Area 
                  type="monotone" 
                  dataKey="lightingWatts" 
                  name="Bioluminescent Lighting" 
                  stroke="#38bdf8" 
                  strokeWidth={1.5} 
                  fillOpacity={1} 
                  fill="url(#colorLight)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Analytics: Zone Breakdown BarChart & Source Mix PieChart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recharts Bar Chart: Zone Node Power Usage */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-100 font-mono tracking-wide">
                Sector Power Draw Distribution (Watts)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              5 ESTATE SECTORS
            </span>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  fontFamily="JetBrains Mono, monospace" 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  fontFamily="JetBrains Mono, monospace" 
                  unit="W" 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: 'rgba(56, 189, 248, 0.3)', 
                    borderRadius: '10px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px'
                  }}
                  formatter={(val: any) => [`${val} Watts`, 'Active Load']}
                />
                <Bar 
                  dataKey="watts" 
                  name="Power Draw" 
                  fill="#06b6d4" 
                  radius={[6, 6, 0, 0]} 
                >
                  {zoneBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name === 'Server Vault' ? '#a855f7' :
                        entry.name === 'Atrium' ? '#06b6d4' :
                        entry.name === 'Perimeter' ? '#f43f5e' : '#3b82f6'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Highest Draw: <strong className="text-purple-300">Server Vault ({zoneBreakdown.find(z => z.name === 'Server Vault')?.watts || 0}W)</strong></span>
            <span>Efficiency Rating: <strong className="text-emerald-400">96.8%</strong></span>
          </div>
        </div>

        {/* Recharts Pie Chart: Energy Generation Origin Mix */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-slate-100 font-mono tracking-wide">
                Micro-Grid Energy Supply Generation Mix
              </h4>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              ZERO GRID INFLOW
            </span>
          </div>

          <div className="w-full h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: 'rgba(56, 189, 248, 0.3)', 
                    borderRadius: '10px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px'
                  }}
                  formatter={(value: any) => [`${value} Watts`, 'Supply Output']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
            {sourceMixData.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-300 truncate">{s.name}</span>
                <span className="text-slate-500 ml-auto">{s.value}W</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Autonomous Energy Profile Modes & Anomaly Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-slate-200 block mb-1">
            AUTONOMOUS LOAD-BALANCING PROFILE:
          </span>
          <p className="text-[11px] text-slate-400 font-sans">
            AI dynamic power shaper automatically minimizes peak surges and prioritizes mission-critical life support and server cooling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'eco', label: 'Eco Sovereign', desc: 'Solar surplus buffer' },
            { id: 'island', label: 'Island Mode', desc: '100% self-reliance' },
            { id: 'performance', label: 'Max Compute', desc: 'Zero throttle' },
            { id: 'cryo', label: 'Cryo Priority', desc: 'Vault prioritized' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setPowerMode(mode.id as any);
                if (mode.id === 'eco' && onTriggerEcoMode) onTriggerEcoMode();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all font-medium ${
                powerMode === mode.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
