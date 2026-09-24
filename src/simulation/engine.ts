import {
  UAVTelemetry,
  MissionProgress,
  IncidentDetection,
  MissionAlert,
  TimelineEvent,
  ThermalGridData,
  StereoDepthData,
  SystemHealthReport,
  GeoCoordinate,
  HazardClass,
  RiskPriority,
  MissionStatus,
} from "../types";
import { SCENARIOS, ScenarioDefinition, HOME_COORDINATE } from "./scenarios";

type Listener<T> = (data: T) => void;

export class SimulationEngine {
  private scenario: ScenarioDefinition;
  private timer: NodeJS.Timeout | null = null;
  private elapsedSeconds: number = 0;
  private speedMultiplier: number = 1;
  private isPaused: boolean = false;
  private isEmergency: boolean = false;
  private currentWaypointIndex: number = 0;
  private targetWaypointIndex: number = 0;

  // Active Mission State
  private currentTelemetry: UAVTelemetry;
  private missionProgress: MissionProgress;
  private incidents: IncidentDetection[] = [];
  private alerts: MissionAlert[] = [];
  private timeline: TimelineEvent[] = [];
  private currentThermalFrame: ThermalGridData;
  private currentStereoData: StereoDepthData;
  private systemHealth: SystemHealthReport;

  // Event Listeners (Adapter Pattern)
  private telemetryListeners: Set<Listener<UAVTelemetry>> = new Set();
  private progressListeners: Set<Listener<MissionProgress>> = new Set();
  private detectionListeners: Set<Listener<IncidentDetection>> = new Set();
  private alertListeners: Set<Listener<MissionAlert>> = new Set();
  private timelineListeners: Set<Listener<TimelineEvent>> = new Set();
  private thermalListeners: Set<Listener<ThermalGridData>> = new Set();
  private stereoListeners: Set<Listener<StereoDepthData>> = new Set();
  private healthListeners: Set<Listener<SystemHealthReport>> = new Set();

  constructor(scenarioId: string = "SURVIVOR_FIRE") {
    const found = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    this.scenario = found;
    this.currentTelemetry = this.createInitialTelemetry();
    this.missionProgress = this.createInitialProgress();
    this.currentThermalFrame = this.generateThermalMatrix(false, false);
    this.currentStereoData = {
      nearestObstacleMeters: 14.2,
      status: "SAFE",
      disparityHistogram: [12, 24, 45, 80, 110, 85, 40, 15],
      forwardClearanceMeters: 18.5,
      bearingToObstacleDeg: 0,
    };
    this.systemHealth = this.createInitialHealth();
  }

  private createInitialTelemetry(): UAVTelemetry {
    return {
      timestamp: new Date().toLocaleTimeString(),
      mode: "AUTO",
      batteryPercent: 96,
      batteryVoltage: 12.4,
      batteryCurrent: 0.8,
      altitudeMeters: 0.0,
      groundSpeedMs: 0.0,
      headingDegrees: 0,
      latitude: HOME_COORDINATE.latitude,
      longitude: HOME_COORDINATE.longitude,
      gpsFix: true,
      gpsStatus: "FIX",
      satelliteCount: 16,
      linkStatus: "ACTIVE",
      rssiPercent: 98,
      pitchDegrees: 0.2,
      rollDegrees: -0.1,
      verticalSpeedMs: 0.0,
      armed: false,
    };
  }

  private createInitialProgress(): MissionProgress {
    return {
      missionId: "SEARCH-01",
      missionName: this.scenario.name,
      status: "STANDBY",
      progressPercent: 0,
      waypointsCompleted: 0,
      totalWaypoints: this.scenario.waypoints.length,
      areaCoveredHa: 0.0,
      totalAreaHa: this.scenario.totalAreaHa,
      detectionsCount: 0,
      survivorsCount: 0,
      hazardsCount: 0,
      elapsedTimeSeconds: 0,
      batteryRemainingPercent: 96,
    };
  }

  private createInitialHealth(): SystemHealthReport {
    return {
      companionComputer: {
        model: "Raspberry Pi 4B 4GB",
        cpuUsagePercent: 28,
        ramUsagePercent: 44,
        ramUsedMb: 1760,
        ramTotalMb: 4000,
        socTempCelsius: 48.5,
        storageUsedGb: 22.4,
        storageTotalGb: 128.0,
        ros2Status: "RUNNING",
        activeNodes: 8,
      },
      flightController: {
        model: "Pixhawk 2.4.8",
        firmware: "ArduCopter 4.5.x",
        mavlinkHeartbeat: true,
        ekfStatus: "HEALTHY",
        imuState: "NOMINAL",
        compassState: "CALIBRATED",
        barometerState: "HEALTHY",
        voltageRailV: 5.08,
      },
      sensors: {
        rgbCamera: {
          name: "Raspberry Pi Camera Module 3",
          status: "OPERATIONAL",
          details: "1080p30 Edge Pipeline Active",
        },
        thermalSensor: {
          name: "MLX90640 32x24 FIR",
          status: "OPERATIONAL",
          details: "I2C 400kHz · 8 Hz Refresh",
        },
        stereoCamera: {
          name: "Waveshare AR0144 Global Shutter",
          status: "OPERATIONAL",
          details: "Hardware Sync Disparity Running",
        },
        gpsModule: {
          name: "Ublox NEO-M8N + Compass",
          status: "OPERATIONAL",
          details: "3D Fix · 16 Satellites Tracked",
        },
      },
      comms: {
        mavlink433: {
          name: "433 MHz SiK Telemetry",
          status: "OPERATIONAL",
          details: "57600 baud · Packet loss 0.2%",
        },
        wifiTelemetry: {
          name: "Local 5GHz Wi-Fi Ground Link",
          status: "OPERATIONAL",
          details: "Direct WebSocket to Command Station",
        },
        internetOptional: {
          name: "External Internet Uplink",
          status: "WARNING",
          details: "Offline Mode Active (Core System Autonomous)",
        },
      },
    };
  }

  // --- External Controls ---

  public setSpeedMultiplier(speed: number) {
    this.speedMultiplier = Math.max(0.5, Math.min(speed, 5));
  }

  public getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }

  public startMission(scenarioId?: string) {
    if (scenarioId && scenarioId !== this.scenario.id) {
      const found = SCENARIOS.find((s) => s.id === scenarioId);
      if (found) this.scenario = found;
    }

    this.resetMission();
    this.isPaused = false;
    this.isEmergency = false;
    this.missionProgress.status = "INITIALIZING";
    this.notifyProgress();

    this.addTimelineEvent(
      "MISSION",
      "Mission Initialized",
      `Mission ${this.missionProgress.missionId} (${this.scenario.name}) initiated. Pre-arm checks passing.`,
      "info"
    );

    const tickInterval = 500; // 500ms simulation tick

    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.tick(tickInterval / 1000 * this.speedMultiplier);
      }
    }, tickInterval);
  }

  public pauseMission() {
    this.isPaused = true;
    this.missionProgress.status = "PAUSED";
    this.notifyProgress();
    this.addTimelineEvent("MISSION", "Mission Paused", "Operator issued PAUSE command. UAV loitering.", "warning");
  }

  public resumeMission() {
    this.isPaused = false;
    this.missionProgress.status = "SEARCHING";
    this.notifyProgress();
    this.addTimelineEvent("MISSION", "Mission Resumed", "Operator resumed search pattern.", "info");
  }

  public returnToLaunch() {
    this.missionProgress.status = "RETURNING";
    this.currentTelemetry.mode = "RTL";
    this.notifyTelemetry();
    this.notifyProgress();
    this.addTimelineEvent("NAVIGATION", "Return To Launch Engaged", "RTL commanded. UAV returning to home waypoint.", "warning");
  }

  public triggerEmergency() {
    this.isEmergency = true;
    this.missionProgress.status = "EMERGENCY";
    this.currentTelemetry.mode = "EMERGENCY";
    this.currentTelemetry.groundSpeedMs = 0;
    this.notifyTelemetry();
    this.notifyProgress();

    const emergencyAlert: MissionAlert = {
      id: `ALT-EMG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      severity: "EMERGENCY",
      title: "EMERGENCY SHUTDOWN / FAILSAFE ACTIVE",
      message: "Operator triggered Emergency Mode. Propellers idle. Initiating emergency controlled descent.",
      acknowledged: false,
      dismissed: false,
    };
    this.alerts.unshift(emergencyAlert);
    this.notifyAlert(emergencyAlert);

    this.addTimelineEvent("SYSTEM", "EMERGENCY TRIGGERED", "Manual emergency protocol executed.", "critical");
  }

  public resetMission() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.elapsedSeconds = 0;
    this.currentWaypointIndex = 0;
    this.targetWaypointIndex = 0;
    this.isPaused = false;
    this.isEmergency = false;
    this.incidents = [];
    this.alerts = [];
    this.timeline = [];
    this.firedEventIndices.clear();

    this.currentTelemetry = this.createInitialTelemetry();
    this.missionProgress = this.createInitialProgress();
    this.currentThermalFrame = this.generateThermalMatrix(false, false);

    this.notifyTelemetry();
    this.notifyProgress();
  }

  // --- Main Tick Step ---

  private tick(dt: number) {
    if (this.isEmergency) return;

    this.elapsedSeconds += dt;
    this.missionProgress.elapsedTimeSeconds = Math.floor(this.elapsedSeconds);

    // 1. Mission Phases
    if (this.elapsedSeconds < 4) {
      this.missionProgress.status = "INITIALIZING";
      this.currentTelemetry.mode = "AUTO";
      this.currentTelemetry.armed = false;
    } else if (this.elapsedSeconds < 8) {
      if (this.missionProgress.status !== "ARMED") {
        this.missionProgress.status = "ARMED";
        this.currentTelemetry.armed = true;
        this.currentTelemetry.batteryCurrent = 4.2;
        this.addTimelineEvent("SYSTEM", "Motors Armed", "Pixhawk 2.4.8 armed successfully. Safety switch disengaged.", "nominal");
      }
    } else if (this.elapsedSeconds < 16) {
      if (this.missionProgress.status !== "TAKEOFF") {
        this.missionProgress.status = "TAKEOFF";
        this.addTimelineEvent("NAVIGATION", "Takeoff Climb", "Ascending to 25.0m survey altitude at 2.0 m/s.", "info");
      }
      const climbProgress = Math.min((this.elapsedSeconds - 8) / 8, 1);
      this.currentTelemetry.altitudeMeters = Number((climbProgress * 25.0).toFixed(1));
      this.currentTelemetry.verticalSpeedMs = 2.0;
      this.currentTelemetry.batteryCurrent = 18.5;
    } else if (this.missionProgress.status !== "RETURNING" && this.missionProgress.status !== "COMPLETED") {
      this.missionProgress.status = "SEARCHING";
      this.currentTelemetry.verticalSpeedMs = 0.0;
      this.currentTelemetry.altitudeMeters = Number((25.0 + Math.sin(this.elapsedSeconds * 0.5) * 0.3).toFixed(1));
      this.currentTelemetry.groundSpeedMs = Number((8.2 + Math.cos(this.elapsedSeconds * 0.3) * 0.5).toFixed(1));
      this.currentTelemetry.batteryCurrent = Number((14.2 + Math.sin(this.elapsedSeconds) * 0.8).toFixed(1));
    }

    // 2. Battery Consumption
    const totalEstSec = this.scenario.expectedDurationSec;
    const remainingPct = Math.max(20, Math.round(96 - (this.elapsedSeconds / totalEstSec) * 26));
    this.currentTelemetry.batteryPercent = remainingPct;
    this.currentTelemetry.batteryVoltage = Number((12.4 - (1 - remainingPct / 100) * 1.6).toFixed(1));
    this.missionProgress.batteryRemainingPercent = remainingPct;

    // 3. Waypoint Navigation & Geodesic Interpolation
    this.updateWaypointNavigation(dt);

    // 4. Check Scheduled Scenario Events (Detections, Alerts)
    this.checkScheduledEvents();

    // 5. Update Stereo Obstacle Sensing
    this.updateStereoSensing();

    // 6. Update Thermal Sensing
    this.updateThermalSensing();

    // 7. Update Companion Computer Metrics
    this.updateHealthMetrics();

    // 8. Notify Listeners
    this.currentTelemetry.timestamp = new Date().toLocaleTimeString();
    this.notifyTelemetry();
    this.notifyProgress();
  }

  private updateWaypointNavigation(dt: number) {
    const waypoints = this.scenario.waypoints;
    if (waypoints.length === 0) return;

    if (this.missionProgress.status === "RETURNING") {
      // Fly back to Home
      const home = HOME_COORDINATE;
      const dLat = home.latitude - this.currentTelemetry.latitude;
      const dLon = home.longitude - this.currentTelemetry.longitude;
      const dist = Math.sqrt(dLat * dLat + dLon * dLon);

      if (dist < 0.00005) {
        this.missionProgress.status = "COMPLETED";
        this.currentTelemetry.groundSpeedMs = 0;
        this.currentTelemetry.altitudeMeters = 0;
        this.currentTelemetry.armed = false;
        this.addTimelineEvent("MISSION", "Mission Complete", "UAV touched down at Home. Survey concluded successfully.", "nominal");
      } else {
        const step = 0.000025 * dt * this.speedMultiplier;
        this.currentTelemetry.latitude += (dLat / dist) * Math.min(dist, step);
        this.currentTelemetry.longitude += (dLon / dist) * Math.min(dist, step);
        this.currentTelemetry.headingDegrees = Math.round((Math.atan2(dLon, dLat) * 180) / Math.PI + 360) % 360;
      }
      return;
    }

    if (this.missionProgress.status !== "SEARCHING") return;

    const targetWp = waypoints[this.targetWaypointIndex];
    const dLat = targetWp.latitude - this.currentTelemetry.latitude;
    const dLon = targetWp.longitude - this.currentTelemetry.longitude;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);

    if (dist < 0.00004) {
      // Waypoint Reached
      this.currentWaypointIndex = this.targetWaypointIndex;
      this.missionProgress.waypointsCompleted = this.currentWaypointIndex + 1;
      
      const pct = Math.min(100, Math.round(((this.currentWaypointIndex + 1) / waypoints.length) * 100));
      this.missionProgress.progressPercent = pct;
      this.missionProgress.areaCoveredHa = Number(((pct / 100) * this.scenario.totalAreaHa).toFixed(2));

      if (this.targetWaypointIndex < waypoints.length - 1) {
        this.targetWaypointIndex++;
      } else {
        // All waypoints completed -> Initiate RTL
        this.returnToLaunch();
      }
    } else {
      const step = 0.000018 * dt * this.speedMultiplier;
      this.currentTelemetry.latitude += (dLat / dist) * Math.min(dist, step);
      this.currentTelemetry.longitude += (dLon / dist) * Math.min(dist, step);
      const heading = (Math.atan2(dLon, dLat) * 180) / Math.PI;
      this.currentTelemetry.headingDegrees = Math.round((heading + 360) % 360);
    }
  }

  private firedEventIndices: Set<number> = new Set();

  private checkScheduledEvents() {
    for (let idx = 0; idx < this.scenario.scheduledEvents.length; idx++) {
      const ev = this.scenario.scheduledEvents[idx];
      // Fire deterministically once time has elapsed
      if (this.elapsedSeconds >= ev.timeSec && !this.firedEventIndices.has(idx)) {
        this.firedEventIndices.add(idx);
        if (ev.type === "DETECTION") {
          const detData = ev.data;
          if (!this.incidents.find((i) => i.id === detData.id)) {
            const hasFireNearby = this.incidents.some((i) => i.class === "FIRE");
            const priority: RiskPriority =
              detData.class === "SURVIVOR" || (detData.class === "PERSON" && hasFireNearby)
                ? "CRITICAL"
                : detData.class === "FIRE"
                ? "HIGH"
                : detData.class === "DEBRIS"
                ? "MEDIUM"
                : "LOW";

            const newDetection: IncidentDetection = {
              id: detData.id,
              timestamp: new Date().toLocaleTimeString(),
              class: detData.class as HazardClass,
              confidence: detData.confidence,
              thermalConfirmed: !!detData.thermalConfirmed,
              thermalPeakTemp: detData.thermalPeakTemp || (detData.class === "PERSON" ? 34.8 : undefined),
              distanceMeters: detData.distanceMeters,
              latitude: detData.latitude,
              longitude: detData.longitude,
              uavAltitudeAtCapture: this.currentTelemetry.altitudeMeters,
              priority: priority,
              status: "ACTIVE",
              notes: detData.notes,
              fusionBreakdown: {
                rgbConfidence: detData.confidence,
                thermalConfidence: detData.class === "PERSON" || detData.class === "FIRE" ? 0.94 : 0.45,
                depthConfidence: 0.92,
                poseAccuracy: 0.98,
                fusedScore: Math.min(0.99, Number((detData.confidence * 0.4 + 0.94 * 0.3 + 0.92 * 0.2 + 0.98 * 0.1).toFixed(2))),
              },
            };

            this.incidents.unshift(newDetection);
            this.missionProgress.detectionsCount = this.incidents.length;
            this.missionProgress.survivorsCount = this.incidents.filter((i) => i.class === "SURVIVOR" || i.class === "PERSON").length;
            this.missionProgress.hazardsCount = this.incidents.filter((i) => i.class !== "SURVIVOR" && i.class !== "PERSON").length;

            this.notifyDetection(newDetection);
            this.addTimelineEvent(
              "PERCEPTION",
              `${detData.class} Identified`,
              `AI candidate localized at ${detData.latitude.toFixed(5)}, ${detData.longitude.toFixed(5)} (${detData.distanceMeters}m).`,
              priority === "CRITICAL" ? "critical" : "warning",
              newDetection.id
            );
          }
        } else if (ev.type === "THERMAL") {
          const incident = this.incidents.find((i) => i.id === ev.data.id);
          if (incident && !incident.thermalConfirmed) {
            incident.thermalConfirmed = true;
            incident.thermalPeakTemp = ev.data.peakTemp;
            if (incident.class === "PERSON") {
              incident.class = "SURVIVOR"; // Promoted to Survivor after thermal verification
              incident.priority = "CRITICAL";
            }
            incident.fusionBreakdown.thermalConfidence = 0.96;
            incident.fusionBreakdown.fusedScore = 0.96;
            this.notifyDetection(incident);
            this.addTimelineEvent(
              "FUSION",
              "Thermal Heat Signature Verified",
              `MLX90640 confirmed peak temperature ${ev.data.peakTemp}°C. Survivor state confirmed.`,
              "critical",
              incident.id
            );
          }
        } else if (ev.type === "STEREO") {
          const incident = this.incidents.find((i) => i.id === ev.data.id);
          if (incident) {
            this.addTimelineEvent(
              "FUSION",
              "Stereo Disparity Range Computed",
              `Waveshare AR0144 estimated target distance at ${ev.data.distanceMeters}m with 98% depth confidence.`,
              "info",
              incident.id
            );
          }
        } else if (ev.type === "ALERT") {
          const alertData = ev.data;
          if (!this.alerts.find((a) => a.id === alertData.id)) {
            const newAlert: MissionAlert = {
              id: alertData.id,
              timestamp: new Date().toLocaleTimeString(),
              severity: alertData.severity,
              title: alertData.title,
              message: alertData.message,
              incidentId: alertData.incidentId,
              acknowledged: false,
              dismissed: false,
            };
            this.alerts.unshift(newAlert);
            this.notifyAlert(newAlert);
            this.addTimelineEvent("ALERT", alertData.title, alertData.message, alertData.severity === "CRITICAL" ? "critical" : "warning", alertData.incidentId);
          }
        }
      }
    }
  }

  private updateStereoSensing() {
    // When drone is near Survivor INC-0042 (lat ~18.52071)
    const distToSurvivor = Math.hypot(this.currentTelemetry.latitude - 18.52071, this.currentTelemetry.longitude - 73.85691);
    const distToFire = Math.hypot(this.currentTelemetry.latitude - 18.52085, this.currentTelemetry.longitude - 73.85705);

    let nearest = 12.5;
    let status: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

    if (distToSurvivor < 0.00015) {
      nearest = Number((11.4 + Math.sin(this.elapsedSeconds * 2) * 0.4).toFixed(1));
    } else if (distToFire < 0.00015) {
      nearest = Number((18.4 + Math.cos(this.elapsedSeconds * 2) * 0.6).toFixed(1));
    } else {
      nearest = Number((14.0 + Math.sin(this.elapsedSeconds * 0.7) * 2.0).toFixed(1));
    }

    if (nearest < 2.0) status = "CRITICAL";
    else if (nearest < 5.0) status = "WARNING";

    this.currentStereoData = {
      nearestObstacleMeters: nearest,
      status,
      disparityHistogram: [
        Math.round(20 + Math.random() * 5),
        Math.round(40 + Math.random() * 8),
        Math.round(75 + Math.random() * 12),
        Math.round(110 + Math.random() * 15),
        Math.round(95 + Math.random() * 10),
        Math.round(50 + Math.random() * 6),
        Math.round(25 + Math.random() * 4),
        Math.round(10 + Math.random() * 2),
      ],
      forwardClearanceMeters: Math.max(2.0, Number((nearest + 4.5).toFixed(1))),
      bearingToObstacleDeg: Math.round(Math.sin(this.elapsedSeconds) * 15),
    };
    this.notifyStereo();
  }

  private updateThermalSensing() {
    const isNearSurvivor = Math.hypot(this.currentTelemetry.latitude - 18.52071, this.currentTelemetry.longitude - 73.85691) < 0.0002;
    const isNearFire = Math.hypot(this.currentTelemetry.latitude - 18.52085, this.currentTelemetry.longitude - 73.85705) < 0.0002;

    this.currentThermalFrame = this.generateThermalMatrix(isNearSurvivor, isNearFire);
    this.notifyThermal();
  }

  private generateThermalMatrix(hasSurvivor: boolean, hasFire: boolean): ThermalGridData {
    const rows = 24;
    const cols = 32;
    const matrix: number[][] = [];
    let minTemp = 21.0;
    let maxTemp = 26.5;
    let hotspotLocation: { row: number; col: number; temp: number } | undefined = undefined;

    // Hotspot coordinates in 32x24 grid
    const survivorR = 12;
    const survivorC = 16;
    const fireR = 8;
    const fireC = 23;

    for (let r = 0; r < rows; r++) {
      const rowArr: number[] = [];
      for (let c = 0; c < cols; c++) {
        // Base ambient temperature with sensor noise
        let temp = 22.0 + (Math.sin(r * 0.4) + Math.cos(c * 0.3)) * 1.2 + (Math.random() - 0.5) * 0.8;

        if (hasSurvivor) {
          const distSq = (r - survivorR) ** 2 + (c - survivorC) ** 2;
          const heatAdd = Math.exp(-distSq / 9.0) * 12.8; // Peak ~34.8°C
          temp += heatAdd;
        }

        if (hasFire) {
          const distSq = (r - fireR) ** 2 + (c - fireC) ** 2;
          const fireAdd = Math.exp(-distSq / 14.0) * 160.0; // Peak ~186°C
          temp += fireAdd;
        }

        rowArr.push(Number(temp.toFixed(1)));
      }
      matrix.push(rowArr);
    }

    // Determine min/max
    let globalMax = -100;
    let globalMin = 1000;
    let maxR = 0;
    let maxC = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = matrix[r][c];
        if (val > globalMax) {
          globalMax = val;
          maxR = r;
          maxC = c;
        }
        if (val < globalMin) {
          globalMin = val;
        }
      }
    }

    if (hasSurvivor || hasFire) {
      hotspotLocation = { row: maxR, col: maxC, temp: globalMax };
    }

    return {
      rows,
      cols,
      matrix,
      minTemp: globalMin,
      maxTemp: globalMax,
      hotspotLocation,
      humanHeatSignatureDetected: hasSurvivor,
    };
  }

  private updateHealthMetrics() {
    this.systemHealth.companionComputer.cpuUsagePercent = Math.round(25 + Math.sin(this.elapsedSeconds * 0.5) * 12);
    this.systemHealth.companionComputer.ramUsagePercent = 44;
    this.systemHealth.companionComputer.socTempCelsius = Number((48.0 + Math.sin(this.elapsedSeconds * 0.2) * 2.5).toFixed(1));
    this.notifyHealth();
  }

  private addTimelineEvent(
    category: TimelineEvent["category"],
    title: string,
    description: string,
    level: TimelineEvent["level"],
    incidentId?: string
  ) {
    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = Math.floor(this.elapsedSeconds % 60);
    const relativeTime = `T+${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    const event: TimelineEvent = {
      id: `EVT-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleTimeString(),
      relativeTime,
      category,
      title,
      description,
      level,
      incidentId,
    };

    this.timeline.unshift(event);
    this.notifyTimeline(event);
  }

  // --- Subscription Handlers ---

  public onTelemetryUpdate(callback: Listener<UAVTelemetry>): () => void {
    this.telemetryListeners.add(callback);
    callback(this.currentTelemetry);
    return () => this.telemetryListeners.delete(callback);
  }

  public onMissionProgressUpdate(callback: Listener<MissionProgress>): () => void {
    this.progressListeners.add(callback);
    callback(this.missionProgress);
    return () => this.progressListeners.delete(callback);
  }

  public onDetectionAdded(callback: Listener<IncidentDetection>): () => void {
    this.detectionListeners.add(callback);
    return () => this.detectionListeners.delete(callback);
  }

  public onAlertAdded(callback: Listener<MissionAlert>): () => void {
    this.alertListeners.add(callback);
    return () => this.alertListeners.delete(callback);
  }

  public onTimelineEvent(callback: Listener<TimelineEvent>): () => void {
    this.timelineListeners.add(callback);
    return () => this.timelineListeners.delete(callback);
  }

  public onThermalFrame(callback: Listener<ThermalGridData>): () => void {
    this.thermalListeners.add(callback);
    callback(this.currentThermalFrame);
    return () => this.thermalListeners.delete(callback);
  }

  public onStereoData(callback: Listener<StereoDepthData>): () => void {
    this.stereoListeners.add(callback);
    callback(this.currentStereoData);
    return () => this.stereoListeners.delete(callback);
  }

  public onSystemHealthUpdate(callback: Listener<SystemHealthReport>): () => void {
    this.healthListeners.add(callback);
    callback(this.systemHealth);
    return () => this.healthListeners.delete(callback);
  }

  // --- Notification Dispatchers ---
  private notifyTelemetry() {
    this.telemetryListeners.forEach((fn) => fn(this.currentTelemetry));
  }
  private notifyProgress() {
    this.progressListeners.forEach((fn) => fn(this.missionProgress));
  }
  private notifyDetection(d: IncidentDetection) {
    this.detectionListeners.forEach((fn) => fn(d));
  }
  private notifyAlert(a: MissionAlert) {
    this.alertListeners.forEach((fn) => fn(a));
  }
  private notifyTimeline(t: TimelineEvent) {
    this.timelineListeners.forEach((fn) => fn(t));
  }
  private notifyThermal() {
    this.thermalListeners.forEach((fn) => fn(this.currentThermalFrame));
  }
  private notifyStereo() {
    this.stereoListeners.forEach((fn) => fn(this.currentStereoData));
  }
  private notifyHealth() {
    this.healthListeners.forEach((fn) => fn(this.systemHealth));
  }

  // Getters for immediate hydration
  public getTelemetry(): UAVTelemetry {
    return this.currentTelemetry;
  }
  public getProgress(): MissionProgress {
    return this.missionProgress;
  }
  public getIncidents(): IncidentDetection[] {
    return this.incidents;
  }
  public getAlerts(): MissionAlert[] {
    return this.alerts;
  }
  public getTimeline(): TimelineEvent[] {
    return this.timeline;
  }
  public getThermalFrame(): ThermalGridData {
    return this.currentThermalFrame;
  }
  public getStereoData(): StereoDepthData {
    return this.currentStereoData;
  }
  public getSystemHealth(): SystemHealthReport {
    return this.systemHealth;
  }
  public getScenario(): ScenarioDefinition {
    return this.scenario;
  }
}
