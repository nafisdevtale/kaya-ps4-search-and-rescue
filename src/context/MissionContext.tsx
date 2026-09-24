"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  UAVTelemetry,
  MissionProgress,
  IncidentDetection,
  MissionAlert,
  TimelineEvent,
  ThermalGridData,
  StereoDepthData,
  SystemHealthReport,
} from "../types";
import { SimulationDataProvider } from "../adapters/SimulationDataProvider";
import { SCENARIOS } from "../simulation/scenarios";

interface MissionContextType {
  telemetry: UAVTelemetry;
  progress: MissionProgress;
  incidents: IncidentDetection[];
  alerts: MissionAlert[];
  timeline: TimelineEvent[];
  thermalFrame: ThermalGridData;
  stereoData: StereoDepthData;
  systemHealth: SystemHealthReport;
  selectedIncident: IncidentDetection | null;
  setSelectedIncident: (incident: IncidentDetection | null) => void;
  selectedScenarioId: string;
  setSelectedScenarioId: (id: string) => void;
  speedMultiplier: number;
  setSpeedMultiplier: (speed: number) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  mapCenterTarget: { lat: number; lon: number; zoom?: number } | null;
  setMapCenterTarget: (target: { lat: number; lon: number; zoom?: number } | null) => void;

  startMission: () => void;
  pauseMission: () => void;
  resumeMission: () => void;
  returnToLaunch: () => void;
  triggerEmergency: () => void;
  resetMission: () => void;
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  updateIncidentNotes: (incidentId: string, notes: string) => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const providerRef = useRef<SimulationDataProvider | null>(null);

  if (!providerRef.current) {
    providerRef.current = new SimulationDataProvider("SURVIVOR_FIRE");
  }

  const provider = providerRef.current;
  const initialSnapshot = provider.getSnapshot();

  const [telemetry, setTelemetry] = useState<UAVTelemetry>(initialSnapshot.telemetry);
  const [progress, setProgress] = useState<MissionProgress>(initialSnapshot.progress);
  const [incidents, setIncidents] = useState<IncidentDetection[]>([]);
  const [alerts, setAlerts] = useState<MissionAlert[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [thermalFrame, setThermalFrame] = useState<ThermalGridData>(initialSnapshot.thermal);
  const [stereoData, setStereoData] = useState<StereoDepthData>(initialSnapshot.stereo);
  const [systemHealth, setSystemHealth] = useState<SystemHealthReport>(initialSnapshot.health);

  const [selectedIncident, setSelectedIncident] = useState<IncidentDetection | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("SURVIVOR_FIRE");
  const [speedMultiplier, setSpeedMultiplierState] = useState<number>(1);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [mapCenterTarget, setMapCenterTarget] = useState<{ lat: number; lon: number; zoom?: number } | null>(null);

  // Synthesized tactical audio using browser Web Audio API
  const playAlertChime = (severity: string) => {
    if (!audioEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (severity === "CRITICAL" || severity === "EMERGENCY") {
        // High alert two-tone sequence
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.setValueAtTime(1174, ctx.currentTime + 0.15); // D6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.36);
      } else {
        // Subtle info ping
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.21);
      }
    } catch {
      // AudioContext policy or headless environment fallback
    }
  };

  useEffect(() => {
    const unsubTelemetry = provider.onTelemetryUpdate((t) => setTelemetry({ ...t }));
    const unsubProgress = provider.onMissionProgressUpdate((p) => setProgress({ ...p }));
    const unsubDetection = provider.onDetectionAdded((d) => {
      setIncidents((prev) => {
        const idx = prev.findIndex((i) => i.id === d.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = d;
          return updated;
        }
        return [d, ...prev];
      });
      playAlertChime("INFO");
    });
    const unsubAlert = provider.onAlertAdded((a) => {
      setAlerts((prev) => [a, ...prev.filter((item) => item.id !== a.id)]);
      playAlertChime(a.severity);
    });
    const unsubTimeline = provider.onTimelineEvent((e) => {
      setTimeline((prev) => [e, ...prev]);
    });
    const unsubThermal = provider.onThermalFrame((th) => setThermalFrame({ ...th }));
    const unsubStereo = provider.onStereoData((st) => setStereoData({ ...st }));
    const unsubHealth = provider.onSystemHealthUpdate((h) => setSystemHealth({ ...h }));

    return () => {
      unsubTelemetry();
      unsubProgress();
      unsubDetection();
      unsubAlert();
      unsubTimeline();
      unsubThermal();
      unsubStereo();
      unsubHealth();
      provider.destroy();
    };
  }, [provider]);

  const handleStartMission = () => {
    provider.startMission(selectedScenarioId);
    setIncidents([]);
    setAlerts([]);
    setTimeline([]);
  };

  const handlePauseMission = () => provider.pauseMission();
  const handleResumeMission = () => provider.resumeMission();
  const handleReturnToLaunch = () => provider.returnToLaunch();
  const handleTriggerEmergency = () => provider.triggerEmergency();
  const handleResetMission = () => {
    provider.resetMission();
    setIncidents([]);
    setAlerts([]);
    setTimeline([]);
    setSelectedIncident(null);
  };

  const handleSetSpeed = (speed: number) => {
    setSpeedMultiplierState(speed);
    provider.setSpeedMultiplier(speed);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a))
    );
  };

  const handleUpdateNotes = (incidentId: string, notes: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, notes } : i))
    );
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident({ ...selectedIncident, notes });
    }
  };

  return (
    <MissionContext.Provider
      value={{
        telemetry,
        progress,
        incidents,
        alerts,
        timeline,
        thermalFrame,
        stereoData,
        systemHealth,
        selectedIncident,
        setSelectedIncident,
        selectedScenarioId,
        setSelectedScenarioId,
        speedMultiplier,
        setSpeedMultiplier: handleSetSpeed,
        audioEnabled,
        setAudioEnabled,
        mapCenterTarget,
        setMapCenterTarget,
        startMission: handleStartMission,
        pauseMission: handlePauseMission,
        resumeMission: handleResumeMission,
        returnToLaunch: handleReturnToLaunch,
        triggerEmergency: handleTriggerEmergency,
        resetMission: handleResetMission,
        acknowledgeAlert: handleAcknowledgeAlert,
        dismissAlert: handleDismissAlert,
        updateIncidentNotes: handleUpdateNotes,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error("useMission must be used within a MissionProvider");
  }
  return context;
}
