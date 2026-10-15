import React, { useState } from 'react';
import { 
  Zap, 
  Lock, 
  Unlock, 
  Lightbulb, 
  Thermometer, 
  ShieldCheck, 
  Sliders, 
  Power, 
  Layers, 
  Sun, 
  Eye, 
  Wind,
  CheckCircle,
  Radio
} from 'lucide-react';
import { Device, ZoneId } from '../types';

interface DeviceMatrixProps {
  devices: Device[];
  onToggleDevice: (deviceId: string) => void;
  onUpdateDeviceValue: (deviceId: string, value: number) => void;
  onUpdateDeviceColor?: (deviceId: string, color: string) => void;
}

const ZONE_LABELS: Record<ZoneId | 'all', string> = {
  all: 'All Sectors',
  atrium: 'Grand Atrium',
  penthouse: 'Master Penthouse',
  office: 'Executive Office',
  vault: 'Vault & Data Core',
  perimeter: 'Perimeter Grounds'
};

export const DeviceMatrix: React.FC<DeviceMatrixProps> = ({
  devices,
  onToggleDevice,
  onUpdateDeviceValue,
  onUpdateDeviceColor
}) => {
  const [activeZone, setActiveZone] = useState<ZoneId | 'all'>('all');

  const filteredDevices = activeZone === 'all' 
    ? devices 
    : devices.filter(d => d.zone === activeZone);

  // Compute aggregate stats
  const activeCount = devices.filter(d => d.state).length;
  const totalPowerWatts = devices.reduce((sum, d) => sum + (d.state ? d.powerWatts : 0), 0);
  const lockedCount = devices.filter(d => d.type === 'lock' && d.state).length;
  const totalLocks = devices.filter(d => d.type === 'lock').length;

  return (
    <div className="glass-panel-elevated rounded-2xl p-5 border border-cyan-500/20 space-y-5">
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100 font-mono tracking-wide">
              Enterprise IoT Device Matrix
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              {devices.length} NODES MESHED
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Decentralized Matter & Thread encrypted hardware mesh running on local gateways.
          </p>
        </div>

        {/* Global telemetry pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="text-xs font-mono">
              <span className="text-slate-400">Total Draw: </span>
              <span className="text-amber-300 font-semibold">{(totalPowerWatts / 1000).toFixed(2)} kW</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <div className="text-xs font-mono">
              <span className="text-slate-400">Security Seals: </span>
              <span className="text-cyan-300 font-semibold">{lockedCount}/{totalLocks} SECURED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sector filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(ZONE_LABELS) as Array<ZoneId | 'all'>).map((zoneKey) => (
          <button
            key={zoneKey}
            onClick={() => setActiveZone(zoneKey)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
              activeZone === zoneKey
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20 font-semibold'
                : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {ZONE_LABELS[zoneKey]}
          </button>
        ))}
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredDevices.map((dev) => {
          return (
            <div
              key={dev.id}
              className={`p-4 rounded-xl border transition-all relative ${
                dev.state
                  ? 'bg-slate-900/70 border-cyan-500/30 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-75'
              }`}
            >
              {/* Device Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg border ${
                    dev.state
                      ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    {dev.type === 'lighting' && <Lightbulb className="w-4 h-4" />}
                    {dev.type === 'hvac' && <Wind className="w-4 h-4" />}
                    {dev.type === 'lock' && (dev.state ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 text-amber-400" />)}
                    {dev.type === 'security_glass' && <Sun className="w-4 h-4" />}
                    {dev.type === 'shield' && <Radio className="w-4 h-4" />}
                    {dev.type === 'defense' && <ShieldCheck className="w-4 h-4" />}
                    {dev.type === 'power' && <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100 font-mono">
                      {dev.name}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 capitalize mt-0.5">
                      {ZONE_LABELS[dev.zone]} • {dev.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* State toggle switch button */}
                <button
                  onClick={() => onToggleDevice(dev.id)}
                  title={dev.state ? "Deactivate Device" : "Activate Device"}
                  className={`p-1.5 rounded-lg border transition-all ${
                    dev.state
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {/* Specific interactive controls based on device type */}
              {dev.type === 'lighting' && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Luminance Level</span>
                    <span className="text-cyan-300 font-bold">{dev.value ?? 70}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dev.value ?? 70}
                    disabled={!dev.state}
                    onChange={(e) => onUpdateDeviceValue(dev.id, parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-1.5 disabled:opacity-40"
                  />
                  {dev.color && onUpdateDeviceColor && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-mono text-slate-400">Spectrum:</span>
                      {['#06b6d4', '#3b82f6', '#a855f7', '#f59e0b', '#ffffff'].map((hex) => (
                        <button
                          key={hex}
                          onClick={() => onUpdateDeviceColor(dev.id, hex)}
                          style={{ backgroundColor: hex }}
                          className={`w-3.5 h-3.5 rounded-full border ${dev.color === hex ? 'border-white scale-110 shadow-sm' : 'border-transparent'} transition-transform`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {dev.type === 'security_glass' && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Electrochromic Tint</span>
                    <span className="text-cyan-300 font-bold">{dev.value ?? 20}% Opacity</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dev.value ?? 20}
                    disabled={!dev.state}
                    onChange={(e) => onUpdateDeviceValue(dev.id, parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-1.5 disabled:opacity-40"
                  />
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Clear (0%)</span>
                    <span>Blackout (100%)</span>
                  </div>
                </div>
              )}

              {dev.type === 'hvac' && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Climate Setpoint</span>
                    <span className="text-emerald-300 font-bold">{dev.value ?? 21.5}°C</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onUpdateDeviceValue(dev.id, Math.max(16, (dev.value ?? 21) - 0.5))}
                      disabled={!dev.state}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono text-slate-200"
                    >
                      -0.5°
                    </button>
                    <span className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded border border-slate-800">
                      {dev.mode || 'Auto Purify'}
                    </span>
                    <button
                      onClick={() => onUpdateDeviceValue(dev.id, Math.min(28, (dev.value ?? 21) + 0.5))}
                      disabled={!dev.state}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono text-slate-200"
                    >
                      +0.5°
                    </button>
                  </div>
                </div>
              )}

              {dev.type === 'lock' && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Seal Status:</span>
                  <span className={`text-xs font-mono font-semibold flex items-center gap-1 ${
                    dev.state ? 'text-cyan-400' : 'text-amber-400'
                  }`}>
                    {dev.state ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        MAGNETIC SEALED
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        UNLOCKED / PASS
                      </>
                    )}
                  </span>
                </div>
              )}

              {dev.type === 'shield' && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Shielding Level:</span>
                  <span className="text-xs font-mono text-purple-300 font-semibold">
                    {dev.value ? `${dev.value} dB Nullification` : dev.mode}
                  </span>
                </div>
              )}

              {dev.type === 'defense' && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Defense Grid:</span>
                  <span className={`text-xs font-mono font-semibold ${
                    dev.state ? 'text-rose-400 animate-pulse' : 'text-slate-500'
                  }`}>
                    {dev.state ? 'ACTIVE IR BEAM' : 'STANDBY'}
                  </span>
                </div>
              )}

              {/* Power Footer */}
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/40 text-[10px] font-mono text-slate-500">
                <span>Node: {dev.id}</span>
                <span>Power: {dev.state ? `${dev.powerWatts}W` : '0W'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
