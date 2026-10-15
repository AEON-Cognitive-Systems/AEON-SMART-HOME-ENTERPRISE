import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  MicOff, 
  EyeOff, 
  FileCheck, 
  Download, 
  Server, 
  Cpu, 
  AlertCircle, 
  Wifi, 
  Key, 
  Terminal,
  Activity
} from 'lucide-react';
import { PrivacyConfig } from '../types';

interface PrivacySecurityProps {
  privacyConfig: PrivacyConfig;
  onTogglePrivacySetting: (key: keyof PrivacyConfig) => void;
  onExportAuditReport: () => void;
}

export const PrivacySecurity: React.FC<PrivacySecurityProps> = ({
  privacyConfig,
  onTogglePrivacySetting,
  onExportAuditReport
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'packets' | 'enclave'>('status');

  const simulatedPackets = [
    { time: '10:14:22', proto: 'TLS 1.3', src: '192.168.1.104 [Atrium Oculus]', dest: '192.168.1.2 [AEON Enclave]', payload: 'Encrypted Video (Local H.265)', status: 'PASSED' },
    { time: '10:14:21', proto: 'Matter/Thread', src: '192.168.1.88 [HVAC Plant]', dest: '192.168.1.2 [AEON Enclave]', payload: 'Telemetry Packet (Temp, VOC)', status: 'PASSED' },
    { time: '10:14:19', proto: 'DNS/UDP', src: '192.168.1.21 [Smart TV]', dest: 'telemetry.cloud.external', payload: 'Tracking Beacon Attempt', status: 'BLOCKED BY EDGE WALL' },
    { time: '10:14:15', proto: 'Thread AES-128', src: '192.168.1.42 [Master Lock]', dest: '192.168.1.2 [AEON Enclave]', payload: 'Keycard Handshake Token', status: 'PASSED' },
  ];

  return (
    <div className="glass-panel-elevated rounded-2xl p-5 border border-cyan-500/20 space-y-5">
      {/* Privacy Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100 font-mono tracking-wide">
                Privacy-First Security & Edge Telemetry
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                100% LOCAL INFERENCE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Zero cloud transmission of residential audio, visual feeds, or occupant biometric hashes.
            </p>
          </div>
        </div>

        <button
          onClick={onExportAuditReport}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Certificate</span>
        </button>
      </div>

      {/* Edge Processing Guarantees Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">ENCLAVE ISOLATION</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-100">
            Air-Gapped
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Neural model weights executed strictly in local SRAM hardware enclave.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">CLOUD LEAKAGE PROOF</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            0.00 B/s Outbound
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Kernel-level firewall drops all outbound WAN packets carrying media.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">CRYPTO ENCRYPTION</span>
            <Key className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-300">
            Post-Quantum Kyber
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Internal bus keys re-negotiated every 15 minutes via Kyber-1024.
          </p>
        </div>
      </div>

      {/* Hardware Killswitches & Physical Controls */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-slate-200">
            PHYSICAL HARDWARE OVERRIDES & SENSOR CUTOFFS:
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            RELAY-TRIGGERED HARD DISCONNECT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Physical Mic Killswitch */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${
                privacyConfig.physicalMicMuted 
                  ? 'bg-rose-950 text-rose-400 border-rose-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                <MicOff className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-mono font-medium text-slate-200">
                  Physical Microphone Relays
                </h5>
                <p className="text-[11px] text-slate-400">
                  {privacyConfig.physicalMicMuted ? 'Power physically cut from all estate mics' : 'Microphones listening for wake directive'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onTogglePrivacySetting('physicalMicMuted')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all font-semibold ${
                privacyConfig.physicalMicMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {privacyConfig.physicalMicMuted ? 'MUTED' : 'LIVE'}
            </button>
          </div>

          {/* Physical Camera Blinds */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${
                privacyConfig.physicalCamBlindsEngaged 
                  ? 'bg-amber-950 text-amber-400 border-amber-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-mono font-medium text-slate-200">
                  Motorized Optical Lens Shutters
                </h5>
                <p className="text-[11px] text-slate-400">
                  {privacyConfig.physicalCamBlindsEngaged ? 'Physical mechanical blinds deployed' : 'Optical sensors unobstructed'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onTogglePrivacySetting('physicalCamBlindsEngaged')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all font-semibold ${
                privacyConfig.physicalCamBlindsEngaged
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {privacyConfig.physicalCamBlindsEngaged ? 'BLINDS CLOSED' : 'OPEN'}
            </button>
          </div>
        </div>
      </div>

      {/* Packet Inspection Log Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>LOCAL PACKET INSPECTOR (LAN REVERSE PROXY):</span>
          <span className="text-cyan-400 font-mono">ALL TRAFFIC ZERO-KNOWLEDGE AUDITED</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">TIMESTAMP</th>
                <th className="py-2 px-3">PROTOCOL</th>
                <th className="py-2 px-3">SOURCE</th>
                <th className="py-2 px-3">PAYLOAD</th>
                <th className="py-2 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {simulatedPackets.map((pkt, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-2 px-3 text-slate-500">{pkt.time}</td>
                  <td className="py-2 px-3 text-cyan-400">{pkt.proto}</td>
                  <td className="py-2 px-3">{pkt.src}</td>
                  <td className="py-2 px-3 text-slate-400">{pkt.payload}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      pkt.status === 'PASSED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40 font-bold'
                    }`}>
                      {pkt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
