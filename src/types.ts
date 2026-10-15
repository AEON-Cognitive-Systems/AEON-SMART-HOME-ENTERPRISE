export type ZoneId = 'atrium' | 'penthouse' | 'office' | 'vault' | 'perimeter';

export interface Device {
  id: string;
  name: string;
  zone: ZoneId;
  type: 'lighting' | 'hvac' | 'lock' | 'security_glass' | 'shield' | 'power' | 'defense';
  state: boolean;
  value?: number; // e.g., brightness %, temperature, tint opacity %
  mode?: string;
  color?: string;
  unit?: string;
  status: 'nominal' | 'alert' | 'standby';
  powerWatts: number;
}

export interface DetectionBox {
  id: string;
  label: string;
  confidence: number;
  type: 'person' | 'vehicle' | 'threat' | 'package' | 'face' | 'pet';
  bbox: [number, number, number, number]; // [x, y, width, height] in percentages (0-100)
  metadata?: string;
}

export interface CameraFeed {
  id: string;
  name: string;
  zone: ZoneId;
  location: string;
  resolution: string;
  fps: number;
  status: 'online' | 'analyzing' | 'alert';
  threatDetected: boolean;
  threatDescription?: string;
  isPrivacyMasked: boolean;
  detections: DetectionBox[];
  lastMotion: string;
  bandwidthKbps: number;
}

export interface AutomationRoutine {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  category: 'security' | 'comfort' | 'energy' | 'emergency';
  trigger: string;
  actionSummary: string;
  lastExecuted?: string;
}

export interface IncidentAlert {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'critical' | 'emergency';
  zone: ZoneId | 'system';
  title: string;
  description: string;
  resolved: boolean;
  source: string;
}

export interface AvatarState {
  mode: 'vigilant' | 'analyzing' | 'responding' | 'alert' | 'lockdown';
  speech: string;
  isSpeaking: boolean;
  voiceSynthesisEnabled: boolean;
  speechPitch: number;
  interactionCount: number;
}

export interface PrivacyConfig {
  localEdgeOnly: boolean;
  neuralEnclaveLocked: boolean;
  physicalMicMuted: boolean;
  physicalCamBlindsEngaged: boolean;
  zeroCloudLeakageConfirmed: boolean;
  tamperSensorsArmed: boolean;
  packetRateBlocked: number;
}

export interface EnergyDataPoint {
  time: string;
  totalLoadWatts: number;
  solarGenerationWatts: number;
  batteryDrawWatts: number;
  gridDrawWatts: number;
  hvacWatts: number;
  lightingWatts: number;
  vaultWatts: number;
  defenseWatts: number;
}

export interface NodeEnergyProfile {
  name: string;
  zone: ZoneId;
  currentWatts: number;
  peakWatts: number;
  efficiencyScore: number; // 0-100
  powerFactor: number;
}

