import React, { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_DEVICES, 
  INITIAL_CAMERAS, 
  INITIAL_AUTOMATIONS, 
  INITIAL_ALERTS, 
  INITIAL_PRIVACY 
} from './data/initialState';
import { Device, CameraFeed, AutomationRoutine, IncidentAlert, PrivacyConfig, AvatarState } from './types';
import { Header } from './components/Header';
import { AvatarGuardian } from './components/AvatarGuardian';
import { EdgeVision } from './components/EdgeVision';
import { DeviceMatrix } from './components/DeviceMatrix';
import { Automations } from './components/Automations';
import { EmergencyAssist } from './components/EmergencyAssist';
import { PrivacySecurity } from './components/PrivacySecurity';
import { EnergyDashboard } from './components/EnergyDashboard';
import { VoiceCommandBar } from './components/VoiceCommandBar';

export function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'vision' | 'devices' | 'automations' | 'energy' | 'emergency' | 'privacy'>('overview');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [cameras, setCameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [automations, setAutomations] = useState<AutomationRoutine[]>(INITIAL_AUTOMATIONS);
  const [alerts, setAlerts] = useState<IncidentAlert[]>(INITIAL_ALERTS);
  const [privacyConfig, setPrivacyConfig] = useState<PrivacyConfig>(INITIAL_PRIVACY);

  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [isLockdown, setIsLockdown] = useState(false);
  const [threatLevel, setThreatLevel] = useState<'low' | 'elevated' | 'critical'>('low');

  const [avatarState, setAvatarState] = useState<AvatarState>({
    mode: 'vigilant',
    speech: 'AEON Guardian online. All 15 estate nodes operational. Zero external telemetry leaks detected.',
    isSpeaking: false,
    voiceSynthesisEnabled: true,
    speechPitch: 1.0,
    interactionCount: 1
  });

  // Speech synthesis helper
  const speakText = useCallback((text: string) => {
    if (!avatarState.voiceSynthesisEnabled) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.onstart = () => {
        setAvatarState((prev) => ({ ...prev, isSpeaking: true }));
      };
      utterance.onend = () => {
        setAvatarState((prev) => ({ ...prev, isSpeaking: false }));
      };
      utterance.onerror = () => {
        setAvatarState((prev) => ({ ...prev, isSpeaking: false }));
      };
      window.speechSynthesis.speak(utterance);
    }
  }, [avatarState.voiceSynthesisEnabled]);

  // Voice & Directive Execution Engine
  const executeCommand = useCallback((cmd: string) => {
    setLastCommand(cmd);
    const lower = cmd.toLowerCase();

    // 1. Full Lockdown
    if (lower.includes('lockdown') || lower.includes('code red') || lower.includes('intruder') || lower.includes('threat')) {
      setIsLockdown(true);
      setThreatLevel('critical');
      // Lock all doors, tint all glass, activate laser tripwires
      setDevices((prev) =>
        prev.map((d) => {
          if (d.type === 'lock') return { ...d, state: true, status: 'nominal' };
          if (d.type === 'security_glass') return { ...d, state: true, value: 100 };
          if (d.type === 'defense') return { ...d, state: true, status: 'nominal' };
          if (d.type === 'lighting') return { ...d, value: 15, color: '#f43f5e' };
          return d;
        })
      );
      const response = 'Directive confirmed: Initiating total perimeter lockdown. All magnetic seals engaged, electrochromic glass set to blackout, and infrared defense grids armed.';
      setAvatarState((prev) => ({
        ...prev,
        mode: 'lockdown',
        speech: response
      }));
      speakText(response);

      // Add alert
      setAlerts((prev) => [
        {
          id: `inc-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: 'critical',
          zone: 'perimeter',
          title: 'Code Red Estate Lockdown Triggered',
          description: `Lockdown authorized by vocal command: "${cmd}". All ingress hermetically sealed.`,
          resolved: false,
          source: 'AEON Vocal Engine'
        },
        ...prev
      ]);
      return;
    }

    // 2. Disarm / Unlock / Nominal
    if (lower.includes('disarm') || lower.includes('unlock') || lower.includes('nominal') || lower.includes('stand down')) {
      setIsLockdown(false);
      setThreatLevel('low');
      setDevices((prev) =>
        prev.map((d) => {
          if (d.type === 'security_glass') return { ...d, value: 20 };
          if (d.type === 'lighting') return { ...d, value: 70, color: '#06b6d4' };
          if (d.type === 'defense') return { ...d, state: false };
          return d;
        })
      );
      const response = 'Lockdown terminated. Defense condition restored to DEFCON 5 nominal. Ingress pathways restored.';
      setAvatarState((prev) => ({
        ...prev,
        mode: 'vigilant',
        speech: response
      }));
      speakText(response);
      return;
    }

    // 3. Status Briefing
    if (lower.includes('status') || lower.includes('report') || lower.includes('briefing') || lower.includes('check')) {
      const activeDevicesCount = devices.filter(d => d.state).length;
      const response = `Sovereign Estate report: 4 optical edge streams nominal. ${activeDevicesCount} IoT nodes meshed. Zero outbound telemetry leakage. Power load is optimal at 1.1 kilowatts.`;
      setAvatarState((prev) => ({
        ...prev,
        mode: 'analyzing',
        speech: response
      }));
      speakText(response);
      return;
    }

    // 4. Night Watch
    if (lower.includes('night') || lower.includes('sleep') || lower.includes('bedtime')) {
      setDevices((prev) =>
        prev.map((d) => {
          if (d.type === 'lighting') return { ...d, state: false, value: 0 };
          if (d.type === 'shield' && d.zone === 'penthouse') return { ...d, state: true, value: 95 };
          if (d.type === 'lock') return { ...d, state: true };
          return d;
        })
      );
      const response = 'Stealth Night Watch engaged. Interior luminescence extinguished, acoustic nullification active in master suite, and multispectral perimeter night patrol running.';
      setAvatarState((prev) => ({
        ...prev,
        mode: 'vigilant',
        speech: response
      }));
      speakText(response);
      return;
    }

    // 5. Climate / HVAC
    if (lower.includes('temp') || lower.includes('climate') || lower.includes('cool') || lower.includes('warm') || lower.includes('hvac')) {
      setDevices((prev) =>
        prev.map((d) => (d.type === 'hvac' ? { ...d, state: true, value: 21.0 } : d))
      );
      const response = 'Microclimate HVAC setpoints adjusted to optimal 21.0 degrees Celsius with continuous ionic air purification.';
      setAvatarState((prev) => ({
        ...prev,
        mode: 'responding',
        speech: response
      }));
      speakText(response);
      return;
    }

    // 6. Lights
    if (lower.includes('light') || lower.includes('dim') || lower.includes('bright')) {
      setDevices((prev) =>
        prev.map((d) => (d.type === 'lighting' ? { ...d, state: true, value: 80 } : d))
      );
      const response = 'Luminescence matrix updated across all active sectors to 80% natural daylight balance.';
      setAvatarState((prev) => ({
        ...prev,
        mode: 'responding',
        speech: response
      }));
      speakText(response);
      return;
    }

    // 7. Energy / Power / Solar Telemetry
    if (lower.includes('energy') || lower.includes('power') || lower.includes('solar') || lower.includes('battery') || lower.includes('watt')) {
      setActiveTab('energy');
      const totalWatts = devices.reduce((sum, d) => sum + (d.state ? d.powerWatts : 0), 0);
      const response = `Switching to Real-Time Energy Telemetry. Estate load is ${(totalWatts / 1000).toFixed(2)} kW. Solar micro-grid harvesting at 1.85 kW with zero public grid dependence.`;
      setAvatarState((prev) => ({
        ...prev,
        mode: 'analyzing',
        speech: response
      }));
      speakText(response);
      return;
    }

    // Generic natural directive fallback
    const response = `Directive "${cmd}" verified and executed across local sovereign mesh nodes. All security protocols remain enforced.`;
    setAvatarState((prev) => ({
      ...prev,
      mode: 'responding',
      speech: response
    }));
    speakText(response);
  }, [devices, speakText]);

  // Device interaction handlers
  const handleToggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.state;
          const msg = `${d.name} ${nextState ? 'engaged' : 'powered down'}.`;
          setAvatarState((s) => ({ ...s, speech: msg }));
          return { ...d, state: nextState };
        }
        return d;
      })
    );
  };

  const handleUpdateDeviceValue = (id: string, value: number) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, value } : d))
    );
  };

  const handleUpdateDeviceColor = (id: string, color: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, color } : d))
    );
  };

  // Camera privacy & simulation handlers
  const handleTogglePrivacyMask = (camId: string) => {
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === camId) {
          const nextMask = !c.isPrivacyMasked;
          const msg = nextMask
            ? `Physical lens shutter deployed on ${c.name}. Sensor physically blinded.`
            : `Physical lens shutter opened on ${c.name}. Edge vision resumed.`;
          setAvatarState((s) => ({ ...s, speech: msg }));
          speakText(msg);
          return { ...c, isPrivacyMasked: nextMask };
        }
        return c;
      })
    );
  };

  const handleSimulateDetection = (camId: string) => {
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === camId) {
          const newDet = {
            id: `det-${Date.now()}`,
            label: 'Unregistered Courier Drone',
            confidence: 0.974,
            type: 'vehicle' as const,
            bbox: [Math.floor(Math.random() * 40 + 20), Math.floor(Math.random() * 30 + 20), 22, 28] as [number, number, number, number],
            metadata: 'Altitude: 14m // No Transponder Signature'
          };
          return {
            ...c,
            threatDetected: true,
            detections: [newDet, ...c.detections.slice(0, 3)]
          };
        }
        return c;
      })
    );
    const msg = 'New edge detection event registered on surveillance matrix. Analyzing signature...';
    setAvatarState((s) => ({ ...s, mode: 'alert', speech: msg }));
  };

  // Automation handlers
  const handleToggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleExecuteAutomation = (id: string) => {
    const routine = automations.find((a) => a.id === id);
    if (!routine) return;
    executeCommand(routine.name);
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lastExecuted: 'Just now' } : a))
    );
  };

  const handleCreateAutomation = (newRoutine: Omit<AutomationRoutine, 'id'>) => {
    const routine: AutomationRoutine = {
      ...newRoutine,
      id: `auto-${Date.now()}`
    };
    setAutomations((prev) => [routine, ...prev]);
    const msg = `New autonomous routine "${routine.name}" committed to secure enclave.`;
    setAvatarState((s) => ({ ...s, speech: msg }));
    speakText(msg);
  };

  // Emergency handlers
  const handleTriggerCodeRed = () => {
    executeCommand('Lockdown Protocol Code Red');
  };

  const handleTriggerMedical = () => {
    // Unlock estate gate for paramedics
    setDevices((prev) =>
      prev.map((d) => (d.id === 'dev-15' ? { ...d, state: false } : d))
    );
    const msg = 'Paramedic medical dispatch uplink initiated. North Gate unlocked for emergency responder transit. Approach lighting set to maximum illumination.';
    setAvatarState((s) => ({ ...s, mode: 'alert', speech: msg }));
    speakText(msg);
    setAlerts((prev) => [
      {
        id: `inc-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'emergency',
        zone: 'perimeter',
        title: 'Emergency Medical Dispatch Sequence',
        description: 'Vehicular gates unlocked for paramedic arrival. Beacon lights flashing.',
        resolved: false,
        source: 'AEON Medical Protocol'
      },
      ...prev
    ]);
  };

  const handleTriggerFireSuppression = () => {
    // Halon clean agent
    setDevices((prev) =>
      prev.map((d) => (d.id === 'dev-12' ? { ...d, state: true, status: 'nominal' } : d))
    );
    const msg = 'Halon clean-agent fire suppression system activated in sub-level data core. Oxygen displacement in progress. All doors hermetically sealed.';
    setAvatarState((s) => ({ ...s, mode: 'lockdown', speech: msg }));
    speakText(msg);
    setAlerts((prev) => [
      {
        id: `inc-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'emergency',
        zone: 'vault',
        title: 'Halon Fire Suppression Discharged',
        description: 'Server Vault halon agent active. Atmospheric seals locked.',
        resolved: false,
        source: 'Atmospheric Sensor Suite'
      },
      ...prev
    ]);
  };

  const handleTriggerSilentDuress = () => {
    const msg = 'Silent duress distress signal transmitted via encrypted satellite uplink to tactical escort team. Local indicators kept nominal.';
    setAvatarState((s) => ({ ...s, mode: 'vigilant', speech: msg }));
    setAlerts((prev) => [
      {
        id: `inc-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'critical',
        zone: 'system',
        title: 'Silent Duress Distress Beacon Fired',
        description: 'Covert satellite beacon dispatched. Zero acoustic signature.',
        resolved: false,
        source: 'Duress Protocol'
      },
      ...prev
    ]);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  const handleResetEmergency = () => {
    executeCommand('Disarm Lockdown and Return to Nominal');
  };

  // Privacy handlers
  const handleTogglePrivacySetting = (key: keyof PrivacyConfig) => {
    setPrivacyConfig((prev) => {
      const nextVal = !prev[key];
      const updated = { ...prev, [key]: nextVal };
      if (key === 'physicalMicMuted') {
        const msg = nextVal ? 'Physical relay cut power to all microphones.' : 'Physical microphones powered on.';
        setAvatarState((s) => ({ ...s, speech: msg }));
      }
      if (key === 'physicalCamBlindsEngaged') {
        // also set cameras masked
        setCameras((cList) => cList.map((c) => ({ ...c, isPrivacyMasked: nextVal })));
      }
      return updated;
    });
  };

  const handleExportAuditReport = () => {
    const auditData = {
      system: 'AEON Smart Home Enterprise Guardian v4.8.2',
      estate: 'Sovereign Villa 01',
      timestamp: new Date().toISOString(),
      privacyCompliance: {
        zeroCloudLeakage: true,
        localInferenceOnly: true,
        tamperProofEnclave: true
      },
      devicesOnline: devices.length,
      camerasActive: cameras.length,
      recentAlerts: alerts.slice(0, 10)
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEON_SECURITY_AUDIT_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setAvatarState((s) => ({
      ...s,
      speech: 'Cryptographic compliance audit certificate generated and downloaded.'
    }));
  };

  const unresolvedAlertCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col grid-bg selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemThreatLevel={threatLevel}
        isLockdown={isLockdown}
        onEmergencyLockdownClick={isLockdown ? handleResetEmergency : handleTriggerCodeRed}
        unresolvedAlertCount={unresolvedAlertCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-28 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Holographic AI Avatar Guardian Section */}
            <AvatarGuardian
              avatarState={avatarState}
              onSendCommand={executeCommand}
              onToggleVoice={() => setAvatarState((prev) => ({ ...prev, voiceSynthesisEnabled: !prev.voiceSynthesisEnabled }))}
              systemThreatLevel={threatLevel}
            />

            {/* Energy Telemetry Grid in Overview */}
            <EnergyDashboard
              devices={devices}
              onTriggerEcoMode={() => executeCommand('Micro-Grid Solar Harvest Mode')}
            />

            {/* Side-by-side Edge Vision & IoT Matrix teaser on Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EdgeVision
                cameras={cameras}
                onTogglePrivacyMask={handleTogglePrivacyMask}
                onSimulateDetection={handleSimulateDetection}
              />
              <DeviceMatrix
                devices={devices}
                onToggleDevice={handleToggleDevice}
                onUpdateDeviceValue={handleUpdateDeviceValue}
                onUpdateDeviceColor={handleUpdateDeviceColor}
              />
            </div>
          </div>
        )}

        {activeTab === 'energy' && (
          <EnergyDashboard
            devices={devices}
            onTriggerEcoMode={() => executeCommand('Micro-Grid Solar Harvest Mode')}
          />
        )}

        {activeTab === 'vision' && (
          <EdgeVision
            cameras={cameras}
            onTogglePrivacyMask={handleTogglePrivacyMask}
            onSimulateDetection={handleSimulateDetection}
          />
        )}

        {activeTab === 'devices' && (
          <DeviceMatrix
            devices={devices}
            onToggleDevice={handleToggleDevice}
            onUpdateDeviceValue={handleUpdateDeviceValue}
            onUpdateDeviceColor={handleUpdateDeviceColor}
          />
        )}

        {activeTab === 'automations' && (
          <Automations
            automations={automations}
            onToggleAutomation={handleToggleAutomation}
            onExecuteAutomation={handleExecuteAutomation}
            onCreateAutomation={handleCreateAutomation}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyAssist
            alerts={alerts}
            onTriggerCodeRed={handleTriggerCodeRed}
            onTriggerMedical={handleTriggerMedical}
            onTriggerFireSuppression={handleTriggerFireSuppression}
            onTriggerSilentDuress={handleTriggerSilentDuress}
            onResolveAlert={handleResolveAlert}
            onResetEmergency={handleResetEmergency}
            isEmergencyActive={isLockdown}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacySecurity
            privacyConfig={privacyConfig}
            onTogglePrivacySetting={handleTogglePrivacySetting}
            onExportAuditReport={handleExportAuditReport}
          />
        )}
      </main>

      {/* Persistent Voice Command & Directives Bar */}
      <VoiceCommandBar
        onExecuteCommand={executeCommand}
        isListening={isListening}
        setIsListening={setIsListening}
        lastCommand={lastCommand}
      />
    </div>
  );
}
export default App;
