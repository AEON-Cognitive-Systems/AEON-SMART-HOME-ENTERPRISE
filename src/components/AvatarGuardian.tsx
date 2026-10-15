import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Shield, Radio, Sparkles, Activity, AlertTriangle, Send, Mic, RefreshCw } from 'lucide-react';
import { AvatarState } from '../types';

interface AvatarGuardianProps {
  avatarState: AvatarState;
  onSendCommand: (command: string) => void;
  onToggleVoice: () => void;
  systemThreatLevel: 'low' | 'elevated' | 'critical';
}

export const AvatarGuardian: React.FC<AvatarGuardianProps> = ({
  avatarState,
  onSendCommand,
  onToggleVoice,
  systemThreatLevel
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inputText, setInputText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Hologram canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let waveOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Color palette based on state and threat level
      let primaryColor = '#06b6d4'; // cyan
      let secondaryColor = '#3b82f6'; // blue
      let glowColor = 'rgba(6, 182, 212, ';

      if (avatarState.mode === 'lockdown' || systemThreatLevel === 'critical') {
        primaryColor = '#f43f5e'; // rose/red
        secondaryColor = '#ef4444';
        glowColor = 'rgba(244, 63, 94, ';
      } else if (avatarState.mode === 'alert' || systemThreatLevel === 'elevated') {
        primaryColor = '#f59e0b'; // amber
        secondaryColor = '#eab308';
        glowColor = 'rgba(245, 158, 11, ';
      } else if (avatarState.mode === 'responding' || avatarState.isSpeaking) {
        primaryColor = '#a855f7'; // purple / iridescent
        secondaryColor = '#06b6d4';
        glowColor = 'rgba(168, 85, 247, ';
      }

      angle += avatarState.isSpeaking ? 0.045 : 0.015;
      waveOffset += 0.05;

      // 1. Ambient outer glow halo
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 110);
      gradient.addColorStop(0, glowColor + (avatarState.isSpeaking ? '0.45)' : '0.25)'));
      gradient.addColorStop(0.7, glowColor + '0.08)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 115, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Orbital Ring with notches
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 0.7);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([12, 10, 4, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, 85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Middle Counter-Rotating Elliptical Gyro Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-angle * 1.1);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([20, 14]);
      ctx.beginPath();
      ctx.ellipse(0, 0, 72, 38, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 4. Inner Ring with Data Ticks
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 1.4);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 5. Pulsing Neural Sphere Core
      const pulseScale = 1 + Math.sin(waveOffset * 2) * (avatarState.isSpeaking ? 0.14 : 0.05);
      const coreRadius = 32 * pulseScale;

      const coreGrad = ctx.createRadialGradient(centerX - 6, centerY - 6, 2, centerX, centerY, coreRadius);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, primaryColor);
      coreGrad.addColorStop(0.8, secondaryColor);
      coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // 6. Neural Network Nodes inside core
      const nodeCount = 7;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([]);
      for (let i = 0; i < nodeCount; i++) {
        const nodeAngle = (i / nodeCount) * Math.PI * 2 + angle * 2;
        const dist = 18 * Math.cos(waveOffset + i);
        const nx = centerX + Math.cos(nodeAngle) * dist;
        const ny = centerY + Math.sin(nodeAngle) * dist;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      }

      // 7. Dynamic Voice Waveform Arc (bounces actively when speaking or analyzing)
      if (avatarState.isSpeaking || avatarState.mode === 'analyzing') {
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const waveformPoints = 32;
        for (let i = 0; i <= waveformPoints; i++) {
          const theta = (i / waveformPoints) * Math.PI * 2;
          const amp = Math.sin(theta * 6 + waveOffset * 8) * (avatarState.isSpeaking ? 10 : 4);
          const r = 94 + amp;
          const wx = centerX + Math.cos(theta) * r;
          const wy = centerY + Math.sin(theta) * r;
          if (i === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [avatarState, systemThreatLevel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendCommand(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    'System status report',
    'Engage Lockdown Protocol',
    'Set Atrium to 21°C',
    'Activate Night Watch',
    'Check perimeter security'
  ];

  return (
    <div className="glass-panel-elevated rounded-2xl p-5 border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between">
      {/* Background cyber grid and header status */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Guardian Meta */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                avatarState.mode === 'lockdown' ? 'bg-rose-400' :
                avatarState.mode === 'alert' ? 'bg-amber-400' : 'bg-cyan-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                avatarState.mode === 'lockdown' ? 'bg-rose-500' :
                avatarState.mode === 'alert' ? 'bg-amber-500' : 'bg-cyan-500'
              }`} />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wider text-slate-100 uppercase font-mono">
                AEON Core Guardian
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-tight bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                v4.8.2-SOVEREIGN
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span>Mode: <strong className="text-cyan-400 capitalize">{avatarState.mode}</strong></span>
              <span>•</span>
              <span>Latency: <strong className="text-emerald-400">0.24ms</strong></span>
            </p>
          </div>
        </div>

        {/* Voice Toggle button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleVoice}
            title={avatarState.voiceSynthesisEnabled ? "Disable Guardian Voice Synth" : "Enable Guardian Voice Synth"}
            className={`p-2 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
              avatarState.voiceSynthesisEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
          >
            {avatarState.voiceSynthesisEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Voice {avatarState.voiceSynthesisEnabled ? 'ON' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Hologram Avatar Canvas & Visualizer */}
      <div 
        className="flex flex-col items-center justify-center my-3 relative select-none cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSendCommand('Status report')}
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={240}
            height={240}
            className="w-[200px] h-[200px] transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle click prompt hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest text-cyan-200/90 bg-slate-950/80 px-2.5 py-1 rounded-full border border-cyan-500/40 backdrop-blur-sm shadow-lg">
              CLICK TO PING AEON
            </span>
          </div>
        </div>

        {/* Dynamic Holographic Dialogue Bubble */}
        <div className="w-full max-w-md mt-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-center relative shadow-inner">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-3 h-3 animate-spin text-cyan-400" />
            <span>AEON NEURAL TRANSMISSION</span>
            {avatarState.isSpeaking && (
              <span className="inline-flex items-center gap-0.5 ml-1">
                <span className="w-1 h-2.5 bg-cyan-400 animate-pulse rounded-full" />
                <span className="w-1 h-4 bg-cyan-300 animate-pulse delay-75 rounded-full" />
                <span className="w-1 h-3 bg-cyan-400 animate-pulse delay-150 rounded-full" />
              </span>
            )}
          </div>
          <p className="text-sm font-sans text-slate-100 leading-relaxed font-normal min-h-[38px] flex items-center justify-center">
            "{avatarState.speech}"
          </p>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="space-y-2 mt-1">
        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>QUICK DIRECTIVES:</span>
          <span className="text-cyan-500">VOICE OR TEXT</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSendCommand(prompt)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 whitespace-nowrap transition-all active:scale-95 flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input prompt bar for talking to AEON */}
        <form onSubmit={handleSubmit} className="relative flex items-center mt-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Issue vocal directive or query (e.g. 'lock front gate', 'diagnose perimeter')..."
            className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 text-xs font-mono text-slate-100 placeholder:text-slate-500 transition-all shadow-inner"
          />
          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1 shadow-sm shadow-cyan-500/30"
            >
              <span>SEND</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
