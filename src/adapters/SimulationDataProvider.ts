import { SimulationEngine } from "../simulation/engine";
import {
  IDataProvider,
  UAVTelemetry,
  MissionProgress,
  IncidentDetection,
  MissionAlert,
  TimelineEvent,
  ThermalGridData,
  StereoDepthData,
  SystemHealthReport,
} from "../types";

export class SimulationDataProvider implements IDataProvider {
  public mode: "SIMULATION" = "SIMULATION";
  private engine: SimulationEngine;

  constructor(scenarioId?: string) {
    this.engine = new SimulationEngine(scenarioId);
  }

  public init(): void {
    // Engine is instantiated and ready in simulation mode
  }

  public destroy(): void {
    this.engine.resetMission();
  }

  public startMission(scenarioId?: string): void {
    this.engine.startMission(scenarioId);
  }

  public pauseMission(): void {
    this.engine.pauseMission();
  }

  public resumeMission(): void {
    this.engine.resumeMission();
  }

  public returnToLaunch(): void {
    this.engine.returnToLaunch();
  }

  public triggerEmergency(): void {
    this.engine.triggerEmergency();
  }

  public resetMission(): void {
    this.engine.resetMission();
  }

  public setSpeedMultiplier(speed: number): void {
    this.engine.setSpeedMultiplier(speed);
  }

  public getSpeedMultiplier(): number {
    return this.engine.getSpeedMultiplier();
  }

  // --- Observables / Listeners ---

  public onTelemetryUpdate(callback: (telemetry: UAVTelemetry) => void): () => void {
    return this.engine.onTelemetryUpdate(callback);
  }

  public onMissionProgressUpdate(callback: (progress: MissionProgress) => void): () => void {
    return this.engine.onMissionProgressUpdate(callback);
  }

  public onDetectionAdded(callback: (detection: IncidentDetection) => void): () => void {
    return this.engine.onDetectionAdded(callback);
  }

  public onAlertAdded(callback: (alert: MissionAlert) => void): () => void {
    return this.engine.onAlertAdded(callback);
  }

  public onTimelineEvent(callback: (event: TimelineEvent) => void): () => void {
    return this.engine.onTimelineEvent(callback);
  }

  public onThermalFrame(callback: (frame: ThermalGridData) => void): () => void {
    return this.engine.onThermalFrame(callback);
  }

  public onStereoData(callback: (stereo: StereoDepthData) => void): () => void {
    return this.engine.onStereoData(callback);
  }

  public onSystemHealthUpdate(callback: (health: SystemHealthReport) => void): () => void {
    return this.engine.onSystemHealthUpdate(callback);
  }

  // Immediate state accessors
  public getSnapshot() {
    return {
      telemetry: this.engine.getTelemetry(),
      progress: this.engine.getProgress(),
      incidents: this.engine.getIncidents(),
      alerts: this.engine.getAlerts(),
      timeline: this.engine.getTimeline(),
      thermal: this.engine.getThermalFrame(),
      stereo: this.engine.getStereoData(),
      health: this.engine.getSystemHealth(),
      scenario: this.engine.getScenario(),
    };
  }
}
