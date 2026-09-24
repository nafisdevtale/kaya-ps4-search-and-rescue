/**
 * Global TypeScript Interfaces & Domain Models
 * PS4 Search & Rescue Command Center
 */

export type FlightMode = 
  | "AUTO"
  | "GUIDED"
  | "LOITER"
  | "RTL"
  | "LAND"
  | "STABILIZE"
  | "EMERGENCY"
  | "DISARMED";

export type MissionStatus = 
  | "STANDBY"
  | "INITIALIZING"
  | "ARMED"
  | "TAKEOFF"
  | "SEARCHING"
  | "PAUSED"
  | "RETURNING"
  | "LANDING"
  | "COMPLETED"
  | "EMERGENCY";

export type HazardClass = 
  | "PERSON"
  | "SURVIVOR"
  | "FIRE"
  | "SMOKE"
  | "FLOOD"
  | "DEBRIS"
  | "DAMAGED_STRUCTURE"
  | "LANDSLIDE"
  | "VEHICLE"
  | "ELECTRICAL_WIRE";

export type RiskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL" | "EMERGENCY";

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface UAVTelemetry {
  timestamp: string;
  mode: FlightMode;
  batteryPercent: number;
  batteryVoltage: number;
  batteryCurrent: number;
  altitudeMeters: number;
  groundSpeedMs: number;
  headingDegrees: number;
  latitude: number;
  longitude: number;
  gpsFix: boolean;
  gpsStatus: "FIX" | "NO FIX" | "3D FIX" | "DGPS";
  satelliteCount: number;
  linkStatus: "ACTIVE" | "DEGRADED" | "DISCONNECTED";
  rssiPercent: number;
  pitchDegrees: number;
  rollDegrees: number;
  verticalSpeedMs: number;
  armed: boolean;
}

export interface IncidentDetection {
  id: string;
  timestamp: string;
  class: HazardClass;
  confidence: number; // 0.00 - 1.00
  thermalConfirmed: boolean;
  thermalPeakTemp?: number; // e.g. 34.8°C
  distanceMeters: number; // from stereo AR0144
  latitude: number;
  longitude: number;
  uavAltitudeAtCapture: number;
  priority: RiskPriority;
  status: "ACTIVE" | "ACKNOWLEDGED" | "TRIAGED" | "RESOLVED";
  notes?: string;
  fusionBreakdown: {
    rgbConfidence: number;
    thermalConfidence: number;
    depthConfidence: number;
    poseAccuracy: number;
    fusedScore: number;
  };
}

export interface MissionAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  incidentId?: string;
  latitude?: number;
  longitude?: number;
  acknowledged: boolean;
  dismissed: boolean;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  relativeTime: string; // e.g. "T+00:45"
  category: "SYSTEM" | "NAVIGATION" | "PERCEPTION" | "FUSION" | "ALERT" | "MISSION";
  title: string;
  description: string;
  level: "nominal" | "info" | "warning" | "critical";
  incidentId?: string;
}

export interface SearchWaypoint {
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED";
}

export interface SearchArea {
  name: string;
  polygon: GeoCoordinate[];
  gridPath: GeoCoordinate[];
  totalAreaHa: number;
  center: GeoCoordinate;
}

export interface ThermalGridData {
  rows: number; // 24
  cols: number; // 32
  matrix: number[][]; // 24 x 32 temperature array
  minTemp: number;
  maxTemp: number;
  hotspotLocation?: { row: number; col: number; temp: number };
  humanHeatSignatureDetected: boolean;
}

export interface StereoDepthData {
  nearestObstacleMeters: number;
  status: "SAFE" | "WARNING" | "CRITICAL";
  disparityHistogram: number[];
  forwardClearanceMeters: number;
  bearingToObstacleDeg: number;
}

export interface MissionProgress {
  missionId: string;
  missionName: string;
  status: MissionStatus;
  progressPercent: number;
  waypointsCompleted: number;
  totalWaypoints: number;
  areaCoveredHa: number;
  totalAreaHa: number;
  detectionsCount: number;
  survivorsCount: number;
  hazardsCount: number;
  elapsedTimeSeconds: number;
  batteryRemainingPercent: number;
}

export interface SystemHealthSubsystem {
  name: string;
  status: "OPERATIONAL" | "WARNING" | "DEGRADED" | "OFFLINE";
  details: string;
  metrics?: Record<string, string | number>;
}

export interface SystemHealthReport {
  companionComputer: {
    model: "Raspberry Pi 4B 4GB";
    cpuUsagePercent: number;
    ramUsagePercent: number;
    ramUsedMb: number;
    ramTotalMb: number;
    socTempCelsius: number;
    storageUsedGb: number;
    storageTotalGb: number;
    ros2Status: "RUNNING" | "STOPPED";
    activeNodes: number;
  };
  flightController: {
    model: "Pixhawk 2.4.8";
    firmware: "ArduCopter 4.5.x";
    mavlinkHeartbeat: boolean;
    ekfStatus: "HEALTHY" | "DEGRADED";
    imuState: "NOMINAL";
    compassState: "CALIBRATED";
    barometerState: "HEALTHY";
    voltageRailV: number;
  };
  sensors: {
    rgbCamera: SystemHealthSubsystem;
    thermalSensor: SystemHealthSubsystem;
    stereoCamera: SystemHealthSubsystem;
    gpsModule: SystemHealthSubsystem;
  };
  comms: {
    mavlink433: SystemHealthSubsystem;
    wifiTelemetry: SystemHealthSubsystem;
    internetOptional: SystemHealthSubsystem;
  };
}

export interface MissionHistoryRecord {
  id: string;
  missionName: string;
  date: string;
  durationFormatted: string;
  durationSeconds: number;
  searchAreaHa: number;
  survivorsFound: number;
  hazardsFound: number;
  alertsTotal: number;
  status: "COMPLETED" | "ABORTED" | "RTL_TRIGGERED";
  incidents: IncidentDetection[];
  routeCoordinates: GeoCoordinate[];
  summary: string;
}

/**
 * Data Provider Interface (Clean Adapter Pattern)
 * Allows the frontend to swap between Simulation and physical MAVLink/ROS2 hardware
 */
export interface IDataProvider {
  mode: "SIMULATION" | "LIVE";
  init(): void;
  destroy(): void;
  startMission(scenarioId?: string): void;
  pauseMission(): void;
  resumeMission(): void;
  returnToLaunch(): void;
  triggerEmergency(): void;
  resetMission(): void;
  
  onTelemetryUpdate(callback: (telemetry: UAVTelemetry) => void): () => void;
  onMissionProgressUpdate(callback: (progress: MissionProgress) => void): () => void;
  onDetectionAdded(callback: (detection: IncidentDetection) => void): () => void;
  onAlertAdded(callback: (alert: MissionAlert) => void): () => void;
  onTimelineEvent(callback: (event: TimelineEvent) => void): () => void;
  onThermalFrame(callback: (frame: ThermalGridData) => void): () => void;
  onStereoData(callback: (stereo: StereoDepthData) => void): () => void;
  onSystemHealthUpdate(callback: (health: SystemHealthReport) => void): () => void;
}
