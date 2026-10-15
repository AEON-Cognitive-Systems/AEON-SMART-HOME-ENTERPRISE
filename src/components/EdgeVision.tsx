import React, { useState, useEffect, useRef } from 'react';
import { Camera, Eye, EyeOff, ShieldAlert, Video, AlertCircle, Maximize2, ZoomIn, ZoomOut, RefreshCw, Crosshair, CheckCircle2 } from 'lucide-react';
import { CameraFeed, DetectionBox } from '../types';

interface EdgeVisionProps {
  cameras: CameraFeed[];
  onTogglePrivacyMask: (cameraId: string) => void;
  onSimulateDetection: (cameraId: string) => void;
}

export const EdgeVision: React.FC<EdgeVisionProps> = ({
  cameras,
  onTogglePrivacyMask,
  onSimulateDetection
}) => {
  const [selectedCamId, setSelectedCamId] = useState<string>(cameras[0]?.id || '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showHud, setShowHud] = useState<boolean>(true);

  const activeCam = cameras.find((c) => c.id === selectedCamId) || cameras[0];

  // Dynamic canvas rendering for live edge vision feed
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeCam) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let tick = 0;

    const renderFeed = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw base synthetic scene background according to camera
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, w, h);

      // Camera background gradients depending on zone
      if (activeCam.zone === 'perimeter') {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#0a192f');
        skyGrad.addColorStop(0.5, '#0f172a');
        skyGrad.addColorStop(1, '#020617');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        // Ground horizon line
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.65);
        ctx.lineTo(w, h * 0.65);
        ctx.stroke();

        // Architectural gate lines
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(w * 0.3, h * 0.4, w * 0.4, h * 0.25);
      } else if (activeCam.zone === 'vault') {
        // High-tech server room background
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, w, h);

        // Server rack blinking LEDs
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 6; col++) {
            const ledX = w * 0.2 + col * 45;
            const ledY = h * 0.25 + row * 35;
            const isBlinking = (tick + row * 10 + col * 7) % 30 < 15;
            ctx.fillStyle = isBlinking ? (col % 2 === 0 ? '#10b981' : '#06b6d4') : '#1e293b';
            ctx.fillRect(ledX, ledY, 6, 4);
          }
        }
      } else {
        // Atrium interior
        const atriumGrad = ctx.createLinearGradient(0, 0, 0, h);
        atriumGrad.addColorStop(0, '#0f172a');
        atriumGrad.addColorStop(1, '#020617');
        ctx.fillStyle = atriumGrad;
        ctx.fillRect(0, 0, w, h);

        // Glass ceiling geometric lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.beginPath();
        ctx.moveTo(w * 0.1, 0);
        ctx.lineTo(w * 0.5, h * 0.4);
        ctx.lineTo(w * 0.9, 0);
        ctx.stroke();
      }

      // 2. Moving simulated elements
      const scanY = (tick * 1.5) % h;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.fillRect(0, scanY, w, 2);

      // 3. Privacy Masking Blur effect if toggled
      if (activeCam.isPrivacyMasked) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#06b6d4';
        ctx.font = '14px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🔒 HARDWARE PRIVACY SHIELD ENGAGED', w / 2, h / 2 - 10);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Outfit, sans-serif';
        ctx.fillText('Optical sensor physically obscured at edge level. Zero video feed transmitted.', w / 2, h / 2 + 15);
      } else {
        // Draw Neural Edge Detection Bounding Boxes
        activeCam.detections.forEach((det) => {
          const bx = (det.bbox[0] / 100) * w;
          const by = (det.bbox[1] / 100) * h;
          const bw = (det.bbox[2] / 100) * w;
          const bh = (det.bbox[3] / 100) * h;

          // Box color based on category
          let boxColor = '#06b6d4'; // default cyan
          if (det.type === 'threat' || activeCam.threatDetected) boxColor = '#f43f5e';
          else if (det.type === 'face') boxColor = '#10b981';
          else if (det.type === 'vehicle') boxColor = '#3b82f6';
          else if (det.type === 'package') boxColor = '#f59e0b';

          // Bounding box border
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(bx, by, bw, bh);

          // Corner bracket accents
          const cornerLen = 8;
          ctx.lineWidth = 3;
          // Top-left
          ctx.beginPath();
          ctx.moveTo(bx, by + cornerLen);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx + cornerLen, by);
          ctx.stroke();
          // Bottom-right
          ctx.beginPath();
          ctx.moveTo(bx + bw, by + bh - cornerLen);
          ctx.lineTo(bx + bw, by + bh);
          ctx.lineTo(bx + bw - cornerLen, by + bh);
          ctx.stroke();

          // Label tag badge
          const labelText = `${det.label} ${(det.confidence * 100).toFixed(1)}%`;
          ctx.font = '10px JetBrains Mono, monospace';
          const textMetrics = ctx.measureText(labelText);
          
          ctx.fillStyle = boxColor;
          ctx.fillRect(bx, by - 18, textMetrics.width + 10, 18);
          
          ctx.fillStyle = '#020617';
          ctx.textAlign = 'left';
          ctx.fillText(labelText, bx + 5, by - 5);

          if (det.metadata && showHud) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.fillRect(bx, by + bh + 4, bw, 16);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '9px JetBrains Mono, monospace';
            ctx.fillText(det.metadata, bx + 4, by + bh + 16);
          }
        });

        // HUD Crosshairs & Telemetry Overlay
        if (showHud) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 1;
          ctx.setLineDash([6, 6]);

          // Center crosshair
          const cx = w / 2;
          const cy = h / 2;
          ctx.beginPath();
          ctx.moveTo(cx - 20, cy);
          ctx.lineTo(cx + 20, cy);
          ctx.moveTo(cx, cy - 20);
          ctx.lineTo(cx, cy + 20);
          ctx.stroke();
          ctx.setLineDash([]);

          // Edge telemetry watermark
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillStyle = '#06b6d4';
          ctx.textAlign = 'left';
          ctx.fillText(`CAM: ${activeCam.name.toUpperCase()} // RES: ${activeCam.resolution}`, 14, 22);
          ctx.fillText(`FPS: ${activeCam.fps} // LATENCY: 1.4ms (EDGE TPU)`, 14, 38);

          ctx.textAlign = 'right';
          ctx.fillStyle = '#10b981';
          ctx.fillText(`NEURAL STATUS: NOMINAL`, w - 14, 22);
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`BANDWIDTH: ${activeCam.bandwidthKbps} kbps [ENCRYPTED]`, w - 14, 38);
        }
      }

      frameId = requestAnimationFrame(renderFeed);
    };

    renderFeed();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [activeCam, showHud]);

  return (
    <div className="glass-panel-elevated rounded-2xl p-5 border border-cyan-500/20 space-y-4">
      {/* Edge Vision Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100 font-mono tracking-wide">
                Neural Edge Vision Matrix
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                EDGE TPU ACCELERATED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Real-time object classification, biometric verification, and autonomous patrol monitoring.
            </p>
          </div>
        </div>

        {/* Global stream actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSimulateDetection(activeCam.id)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-cyan-950/70 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Detection Scan</span>
          </button>
        </div>
      </div>

      {/* Camera Selection Tab Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {cameras.map((cam) => {
          const isSelected = cam.id === activeCam.id;
          return (
            <button
              key={cam.id}
              onClick={() => setSelectedCamId(cam.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/50 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-medium text-slate-200 truncate">
                  {cam.name}
                </span>
                <span className={`w-2 h-2 rounded-full ${cam.isPrivacyMasked ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="capitalize">{cam.zone}</span>
                <span>{cam.detections.length} targets</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Primary Video Feed Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black group">
        <canvas
          ref={canvasRef}
          width={720}
          height={380}
          className="w-full h-auto max-h-[380px] object-cover"
        />

        {/* Interactive Floating Controls on Canvas */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs font-mono text-slate-300">
            <span className="text-cyan-400">{activeCam.location}</span>
            <span>•</span>
            <span className="text-slate-400">{activeCam.lastMotion}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => onTogglePrivacyMask(activeCam.id)}
              title={activeCam.isPrivacyMasked ? "Disable Hardware Shield" : "Engage Hardware Privacy Mask"}
              className={`p-1.5 rounded transition-all text-xs font-mono flex items-center gap-1 ${
                activeCam.isPrivacyMasked
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              {activeCam.isPrivacyMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{activeCam.isPrivacyMasked ? 'Shield Active' : 'Mask Cam'}</span>
            </button>

            <button
              onClick={() => setShowHud(!showHud)}
              className={`p-1.5 rounded hover:bg-slate-800 transition-all text-xs ${showHud ? 'text-cyan-400' : 'text-slate-400'}`}
              title="Toggle HUD Telemetry"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Target Detection Analysis Feed Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>REAL-TIME DETECTIONS ({activeCam.detections.length} CURRENT TARGETS):</span>
          <span className="text-emerald-400">ZERO CLOUD STREAMING // ON-DEVICE TPU</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activeCam.detections.map((det) => (
            <div
              key={det.id}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {det.type === 'threat' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  ) : det.type === 'face' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Crosshair className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200 font-mono">
                    {det.label}
                  </div>
                  {det.metadata && (
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {det.metadata}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {(det.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
