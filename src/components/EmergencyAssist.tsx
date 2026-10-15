import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Flame, 
  HeartPulse, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  Download,
  PhoneCall,
  BellRing,
  RotateCcw
} from 'lucide-react';
import { IncidentAlert } from '../types';

interface EmergencyAssistProps {
  alerts: IncidentAlert[];
  onTriggerCodeRed: () => void;
  onTriggerMedical: () => void;
  onTriggerFireSuppression: () => void;
  onTriggerSilentDuress: () => void;
  onResolveAlert: (alertId: string) => void;
  onResetEmergency: () => void;
  isEmergencyActive: boolean;
}

export const EmergencyAssist: React.FC<EmergencyAssistProps> = ({
  alerts,
  onTriggerCodeRed,
  onTriggerMedical,
  onTriggerFireSuppression,
  onTriggerSilentDuress,
  onResolveAlert,
  onResetEmergency,
  isEmergencyActive
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [countdown, setCountdown] = useState<number | null>(null);

  const filteredAlerts = filterLevel === 'all'
    ? alerts
    : alerts.filter(a => a.level === filterLevel);

  const handleFireWithCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          onTriggerFireSuppression();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getSeverityBadge = (level: IncidentAlert['level']) => {
    switch (level) {
      case 'emergency':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-500/50 flex items-center gap-1 font-bold animate-pulse"><AlertOctagon className="w-3 h-3" /> CRITICAL EVAC</span>;
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/70 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-semibold"><ShieldAlert className="w-3 h-3" /> CODE RED</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/70 text-amber-300 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> WARNING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"><Info className="w-3 h-3" /> INFO</span>;
    }
  };

  return (
    <div className={`glass-panel-elevated rounded-2xl p-5 border transition-all space-y-5 ${
      isEmergencyActive ? 'border-rose-500/60 shadow-2xl shadow-rose-950/50' : 'border-cyan-500/20'
    }`}>
      {/* Emergency Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg border ${
            isEmergencyActive 
              ? 'bg-rose-950 text-rose-400 border-rose-500/60 animate-pulse' 
              : 'bg-rose-950/50 border-rose-500/30 text-rose-400'
          }`}>
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100 font-mono tracking-wide">
                Emergency Assist & Response Hub
              </h3>
              {isEmergencyActive ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-600 text-white font-bold animate-pulse">
                  ESTATE LOCKDOWN ACTIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  DEFENSE STANDBY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Direct telemetry uplink to autonomous countermeasures and emergency services.
            </p>
          </div>
        </div>

        {isEmergencyActive && (
          <button
            onClick={onResetEmergency}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Disarm & Return to Nominal</span>
          </button>
        )}
      </div>

      {/* Priority Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Code Red Estate Lockdown */}
        <button
          onClick={onTriggerCodeRed}
          className="p-4 rounded-xl border border-rose-500/40 bg-gradient-to-b from-rose-950/50 to-slate-900/80 hover:from-rose-900/70 hover:to-slate-900 text-left transition-all group active:scale-95 shadow-md shadow-rose-950/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-rose-900/60 text-rose-300 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-400 border border-rose-500/40 px-1.5 py-0.5 rounded">
              PRIORITY 1
            </span>
          </div>
          <h4 className="text-sm font-bold text-rose-200 font-mono">
            CODE RED LOCKDOWN
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Seal all airlocks, blast doors, activate 100% window blackout & laser tripwires.
          </p>
        </button>

        {/* Medical Dispatch */}
        <button
          onClick={onTriggerMedical}
          className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/50 to-slate-900/80 hover:from-cyan-900/70 hover:to-slate-900 text-left transition-all group active:scale-95 shadow-md shadow-cyan-950/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-cyan-900/60 text-cyan-300 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/40 px-1.5 py-0.5 rounded">
              PARAMEDIC
            </span>
          </div>
          <h4 className="text-sm font-bold text-cyan-200 font-mono">
            MEDICAL DISPATCH
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Transmit telemetry vitals, disarm perimeter gate locks & illuminate medical landing zone.
          </p>
        </button>

        {/* Halon Fire Suppression */}
        <button
          onClick={countdown ? undefined : handleFireWithCountdown}
          className="p-4 rounded-xl border border-amber-500/40 bg-gradient-to-b from-amber-950/50 to-slate-900/80 hover:from-amber-900/70 hover:to-slate-900 text-left transition-all group active:scale-95 shadow-md shadow-amber-950/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-amber-900/60 text-amber-300 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded">
              {countdown ? `${countdown}s HOLD` : 'FIRE AGENT'}
            </span>
          </div>
          <h4 className="text-sm font-bold text-amber-200 font-mono">
            HALON SUPPRESSION
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Vent oxygen, seal server vault and battery banks. 30s abort safety buffer.
          </p>
        </button>

        {/* Silent Duress */}
        <button
          onClick={onTriggerSilentDuress}
          className="p-4 rounded-xl border border-purple-500/40 bg-gradient-to-b from-purple-950/50 to-slate-900/80 hover:from-purple-900/70 hover:to-slate-900 text-left transition-all group active:scale-95 shadow-md shadow-purple-950/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-purple-900/60 text-purple-300 group-hover:scale-110 transition-transform">
              <EyeOff className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-[10px] font-mono font-bold text-purple-400 border border-purple-500/40 px-1.5 py-0.5 rounded">
              COVERT
            </span>
          </div>
          <h4 className="text-sm font-bold text-purple-200 font-mono">
            SILENT DURESS
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Transmit encrypted distress code to private security tactical escort without audio cues.
          </p>
        </button>
      </div>

      {/* Incident Log Stream */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-300">
              REAL-TIME SECURITY AUDIT LOG ({filteredAlerts.length} RECORDS):
            </span>
          </div>

          {/* Severity filter pills */}
          <div className="flex items-center gap-1.5">
            {['all', 'emergency', 'critical', 'warning', 'info'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono uppercase transition-all ${
                  filterLevel === lvl
                    ? 'bg-slate-700 text-cyan-300 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {filteredAlerts.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-500 rounded-xl bg-slate-950/40 border border-slate-800">
              No incidents matching filter. Perimeter telemetry nominal.
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  alert.resolved
                    ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-900/80 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getSeverityBadge(alert.level)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-200">
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400/80">
                        [{alert.source}]
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0 text-xs font-mono">
                  <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </span>

                  {!alert.resolved ? (
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono transition-all flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-mono">
                      <CheckCircle className="w-3.5 h-3.5" />
                      RESOLVED
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
