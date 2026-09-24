/**
 * Future Hardware Data Provider: MAVLink & ROS 2 Bridge
 * 
 * IMPORTANT:
 * The physical UAV prototype is planned for subsequent development and offline demonstration.
 * This class establishes the exact interface contract for future physical integration:
 * - Pixhawk 2.4.8 (ArduCopter) via MAVLink over 433 MHz / Serial
 * - Companion Raspberry Pi 4B (4GB) running ROS 2 Humble
 * 
 * The current dashboard uses SimulationDataProvider.
 */

import { IDataProvider } from "./IDataProvider";
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

export class FutureLiveMavlinkRos2Provider implements IDataProvider {
  public mode: "LIVE" = "LIVE";

  public init(): void {
    console.info(
      "[FUTURE LIVE PROVIDER] FutureLiveMavlinkRos2Provider scaffolded. Physical UAV integration planned for subsequent phase."
    );
  }

  public destroy(): void {}

  public startMission(): void {
    throw new Error("Physical UAV not connected. Switch to SIMULATION MODE for system demonstration.");
  }

  public pauseMission(): void {
    throw new Error("Physical UAV not connected.");
  }

  public resumeMission(): void {
    throw new Error("Physical UAV not connected.");
  }

  public returnToLaunch(): void {
    throw new Error("Physical UAV not connected.");
  }

  public triggerEmergency(): void {
    throw new Error("Physical UAV not connected.");
  }

  public resetMission(): void {}

  public onTelemetryUpdate(): () => void {
    return () => {};
  }
  public onMissionProgressUpdate(): () => void {
    return () => {};
  }
  public onDetectionAdded(): () => void {
    return () => {};
  }
  public onAlertAdded(): () => void {
    return () => {};
  }
  public onTimelineEvent(): () => void {
    return () => {};
  }
  public onThermalFrame(): () => void {
    return () => {};
  }
  public onStereoData(): () => void {
    return () => {};
  }
  public onSystemHealthUpdate(): () => void {
    return () => {};
  }
}
