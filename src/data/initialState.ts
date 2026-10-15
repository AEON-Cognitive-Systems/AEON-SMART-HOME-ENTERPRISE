import { Device, CameraFeed, AutomationRoutine, IncidentAlert, PrivacyConfig } from '../types';

export const INITIAL_DEVICES: Device[] = [
  // Living Atrium
  {
    id: 'dev-1',
    name: 'Bioluminescent Ambient Matrix',
    zone: 'atrium',
    type: 'lighting',
    state: true,
    value: 65,
    color: '#06b6d4',
    unit: '%',
    status: 'nominal',
    powerWatts: 42
  },
  {
    id: 'dev-2',
    name: 'Atrium Electrochromic Smart Glass',
    zone: 'atrium',
    type: 'security_glass',
    state: true,
    value: 20, // 20% opacity (transparent)
    unit: '% tint',
    status: 'nominal',
    powerWatts: 15
  },
  {
    id: 'dev-3',
    name: 'Quantum Microclimate HVAC',
    zone: 'atrium',
    type: 'hvac',
    state: true,
    value: 21.5,
    unit: '°C',
    mode: 'Purify & Ionize',
    status: 'nominal',
    powerWatts: 340
  },
  // Master Penthouse
  {
    id: 'dev-4',
    name: 'Circadian Sleep Lighting',
    zone: 'penthouse',
    type: 'lighting',
    state: true,
    value: 30,
    color: '#f59e0b',
    unit: '%',
    status: 'nominal',
    powerWatts: 25
  },
  {
    id: 'dev-5',
    name: 'Acoustic Nullifier Field',
    zone: 'penthouse',
    type: 'shield',
    state: true,
    value: 90,
    unit: 'dB damp',
    status: 'nominal',
    powerWatts: 55
  },
  {
    id: 'dev-6',
    name: 'Master Suite Biometric Airlock',
    zone: 'penthouse',
    type: 'lock',
    state: true, // locked
    status: 'nominal',
    powerWatts: 12
  },
  // Executive Office
  {
    id: 'dev-7',
    name: 'Architectural Luminescence',
    zone: 'office',
    type: 'lighting',
    state: true,
    value: 80,
    color: '#ffffff',
    unit: '%',
    status: 'nominal',
    powerWatts: 35
  },
  {
    id: 'dev-8',
    name: 'Faraday Shielding Grid',
    zone: 'office',
    type: 'shield',
    state: true,
    mode: 'Zero RF Emission',
    status: 'nominal',
    powerWatts: 70
  },
  {
    id: 'dev-9',
    name: 'Executive Vault Biometric Gate',
    zone: 'office',
    type: 'lock',
    state: true,
    status: 'nominal',
    powerWatts: 18
  },
  // Vault & Data Core
  {
    id: 'dev-10',
    name: 'Cryogenic Data Cooling Loop',
    zone: 'vault',
    type: 'hvac',
    state: true,
    value: 16.0,
    unit: '°C',
    mode: 'Sub-Ambient Flow',
    status: 'nominal',
    powerWatts: 580
  },
  {
    id: 'dev-11',
    name: 'Magnetic Hermetic Blast Door',
    zone: 'vault',
    type: 'lock',
    state: true,
    status: 'nominal',
    powerWatts: 120
  },
  {
    id: 'dev-12',
    name: 'Halon Clean Agent Suppression',
    zone: 'vault',
    type: 'defense',
    state: false,
    mode: 'Armed - Standby',
    status: 'standby',
    powerWatts: 8
  },
  // Perimeter Grounds
  {
    id: 'dev-13',
    name: 'Perimeter Laser Tripwire Grid',
    zone: 'perimeter',
    type: 'defense',
    state: true,
    mode: 'Infrared Invisible Mesh',
    status: 'nominal',
    powerWatts: 110
  },
  {
    id: 'dev-14',
    name: 'Perimeter High-CRI Floodlights',
    zone: 'perimeter',
    type: 'lighting',
    state: false,
    value: 0,
    unit: '%',
    status: 'standby',
    powerWatts: 0
  },
  {
    id: 'dev-15',
    name: 'Main Estate Vehicular Gate',
    zone: 'perimeter',
    type: 'lock',
    state: true,
    status: 'nominal',
    powerWatts: 45
  }
];

export const INITIAL_CAMERAS: CameraFeed[] = [
  {
    id: 'cam-gate',
    name: 'Perimeter Gate Alpha',
    zone: 'perimeter',
    location: 'North Entrance Driveway',
    resolution: '4K Ultra-HDR (3840x2160)',
    fps: 60,
    status: 'online',
    threatDetected: false,
    isPrivacyMasked: false,
    bandwidthKbps: 4200,
    lastMotion: '3s ago',
    detections: [
      {
        id: 'det-1',
        label: 'Authorized Vehicle (Tesla S Plaid)',
        confidence: 0.982,
        type: 'vehicle',
        bbox: [32, 42, 36, 40],
        metadata: 'License Plate: AEON-01 [Whitelisted]'
      },
      {
        id: 'det-2',
        label: 'Courier Dropoff (FedEx Secure)',
        confidence: 0.941,
        type: 'package',
        bbox: [72, 60, 14, 18],
        metadata: 'Package Tag #9021-X [Signature Recorded]'
      }
    ]
  },
  {
    id: 'cam-atrium',
    name: 'Grand Atrium Oculus',
    zone: 'atrium',
    location: 'Central Mezzanine Level 1',
    resolution: '4K Optical Flow',
    fps: 60,
    status: 'online',
    threatDetected: false,
    isPrivacyMasked: false,
    bandwidthKbps: 3800,
    lastMotion: 'Just now',
    detections: [
      {
        id: 'det-3',
        label: 'Occupant (Principal Resident)',
        confidence: 0.994,
        type: 'face',
        bbox: [45, 30, 18, 35],
        metadata: 'Biometric Face Match: Resident A [High Confidence]'
      }
    ]
  },
  {
    id: 'cam-vault',
    name: 'Data Core Enclave Cam',
    zone: 'vault',
    location: 'Sub-level -2 Server Enclosure',
    resolution: 'Thermal & Low-Light IR',
    fps: 30,
    status: 'online',
    threatDetected: false,
    isPrivacyMasked: false,
    bandwidthKbps: 2100,
    lastMotion: '12m ago',
    detections: [
      {
        id: 'det-4',
        label: 'Hardware Rack Array A-F',
        confidence: 0.999,
        type: 'threat',
        bbox: [15, 20, 70, 65],
        metadata: 'Thermal Gradient Nominal (23.4°C)'
      }
    ]
  },
  {
    id: 'cam-drone',
    name: 'Sentry Drone 01 (SkyWatch)',
    zone: 'perimeter',
    location: 'Perimeter Boundary Aerial Orbit (25m)',
    resolution: '2.8K Multispectral Gimbal',
    fps: 60,
    status: 'online',
    threatDetected: false,
    isPrivacyMasked: false,
    bandwidthKbps: 5400,
    lastMotion: '1s ago',
    detections: [
      {
        id: 'det-5',
        label: 'Estate Boundary Patrol',
        confidence: 0.965,
        type: 'person',
        bbox: [60, 20, 12, 22],
        metadata: 'Patrol Path 04: Clear [Zero Obstructions]'
      }
    ]
  }
];

export const INITIAL_AUTOMATIONS: AutomationRoutine[] = [
  {
    id: 'auto-1',
    name: 'Total Perimeter Lockdown',
    description: 'Instantly seals all magnetic blast doors, activates electrochromic 100% blackout tint, arms laser tripwire mesh, and alerts local emergency dispatch.',
    icon: 'ShieldAlert',
    active: false,
    category: 'emergency',
    trigger: 'Manual Code Red OR High-Confidence Threat Detected',
    actionSummary: 'Seal 4 gates, tint 12 windows, engage laser fence'
  },
  {
    id: 'auto-2',
    name: 'Executive Arrival Escort',
    description: 'Illuminates approach pathways, opens estate vehicle gates, adjusts atrium HVAC to 21.5°C, and initializes AEON voice briefing upon biometric identification.',
    icon: 'UserCheck',
    active: true,
    category: 'comfort',
    trigger: 'Whitelisted vehicle enters geo-fence (<200m)',
    actionSummary: 'Gate open, path lights 70%, temperature 21.5°C',
    lastExecuted: 'Today at 08:42'
  },
  {
    id: 'auto-3',
    name: 'Stealth Night Watch',
    description: 'Dims all residential luminescence, shifts perimeter surveillance into thermal multispectral tracking, and activates acoustic nullification in sleeping quarters.',
    icon: 'Moon',
    active: true,
    category: 'security',
    trigger: 'Daily at 23:00 OR Voice Command "Initiate Night Watch"',
    actionSummary: 'Acoustic dampers ON, IR sensors armed, lights 0%',
    lastExecuted: 'Yesterday at 23:00'
  },
  {
    id: 'auto-4',
    name: 'Clean Air Purge & Bio-Isolation',
    description: 'Positive pressure HEPA ventilation engaged, hermetic door seals active, air filtration at 100% capacity.',
    icon: 'Wind',
    active: false,
    category: 'comfort',
    trigger: 'Air particulate spike (PM2.5 > 35) or VOC alert',
    actionSummary: 'HEPA booster 100%, fresh air intake cycle'
  },
  {
    id: 'auto-5',
    name: 'Micro-Grid Solar Harvest Mode',
    description: 'Dynamic load-balancing across rooftop solar array and 120kWh battery storage bank. Minimizes peak grid draw.',
    icon: 'Zap',
    active: true,
    category: 'energy',
    trigger: 'Solar irradiance > 650 W/m²',
    actionSummary: 'Divert excess power to cryogenic cooling & battery bank',
    lastExecuted: 'Today at 11:15'
  }
];

export const INITIAL_ALERTS: IncidentAlert[] = [
  {
    id: 'inc-1',
    timestamp: '10:14:02',
    level: 'info',
    zone: 'perimeter',
    title: 'Courier Delivery Recorded',
    description: 'FedEx carrier detected at North Gate. High-res package signature logged. Gate remained secured.',
    resolved: true,
    source: 'Edge Vision Cam Alpha'
  },
  {
    id: 'inc-2',
    timestamp: '09:30:15',
    level: 'info',
    zone: 'atrium',
    title: 'Biometric Access Verified',
    description: 'Principal resident identified via facial recognition (99.4% confidence score).',
    resolved: true,
    source: 'Atrium Neural Oculus'
  },
  {
    id: 'inc-3',
    timestamp: '07:15:40',
    level: 'warning',
    zone: 'perimeter',
    title: 'Perimeter Laser Interruption - Fauna',
    description: 'Infrared sensor sector 03 momentary trigger. Classified as wild fauna (weight < 8kg). Threat negated.',
    resolved: true,
    source: 'Perimeter Laser Grid'
  }
];

export const INITIAL_PRIVACY: PrivacyConfig = {
  localEdgeOnly: true,
  neuralEnclaveLocked: true,
  physicalMicMuted: false,
  physicalCamBlindsEngaged: false,
  zeroCloudLeakageConfirmed: true,
  tamperSensorsArmed: true,
  packetRateBlocked: 0
};
