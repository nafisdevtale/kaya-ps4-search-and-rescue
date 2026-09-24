import { GeoCoordinate, HazardClass, RiskPriority } from "../types";

export interface ScenarioDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  baseLocation: GeoCoordinate;
  polygon: GeoCoordinate[];
  waypoints: GeoCoordinate[];
  totalAreaHa: number;
  expectedDurationSec: number;
  scheduledEvents: {
    timeSec: number;
    type: "TAKEOFF" | "WAYPOINT" | "DETECTION" | "THERMAL" | "STEREO" | "ALERT" | "RTL" | "LANDING" | "COMPLETE";
    data?: any;
  }[];
}

// Fixed Home/Launch coordinates for the competition disaster simulation
export const HOME_COORDINATE: GeoCoordinate = {
  latitude: 18.52040,
  longitude: 73.85670,
  altitude: 0.0,
};

// Search Polygon (1.8 hectares disaster quadrant)
export const SEARCH_POLYGON: GeoCoordinate[] = [
  { latitude: 18.52020, longitude: 73.85640 },
  { latitude: 18.52130, longitude: 73.85640 },
  { latitude: 18.52130, longitude: 73.85750 },
  { latitude: 18.52020, longitude: 73.85750 },
];

// Lawnmower / Grid Waypoint Pattern (20 waypoints)
export const LAWNMOWER_GRID: GeoCoordinate[] = [
  // Leg 1: South to North (West edge)
  { latitude: 18.52030, longitude: 73.85655 },
  { latitude: 18.52055, longitude: 73.85655 },
  { latitude: 18.52080, longitude: 73.85655 },
  { latitude: 18.52105, longitude: 73.85655 },
  { latitude: 18.52120, longitude: 73.85655 },

  // Turn to Leg 2: North to South
  { latitude: 18.52120, longitude: 73.85685 },
  { latitude: 18.52095, longitude: 73.85685 }, // Near Survivor (INC-0042)
  { latitude: 18.52070, longitude: 73.85685 },
  { latitude: 18.52045, longitude: 73.85685 },
  { latitude: 18.52030, longitude: 73.85685 },

  // Turn to Leg 3: South to North
  { latitude: 18.52030, longitude: 73.85715 },
  { latitude: 18.52060, longitude: 73.85715 },
  { latitude: 18.52085, longitude: 73.85715 }, // Near Fire (INC-0043)
  { latitude: 18.52110, longitude: 73.85715 },
  { latitude: 18.52120, longitude: 73.85715 },

  // Turn to Leg 4: North to South (East edge)
  { latitude: 18.52120, longitude: 73.85740 },
  { latitude: 18.52090, longitude: 73.85740 },
  { latitude: 18.52065, longitude: 73.85740 },
  { latitude: 18.52040, longitude: 73.85740 },
  { latitude: 18.52040, longitude: 73.85670 }, // Return Home
];

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "SURVIVOR_FIRE",
    name: "Survivor & Fire Co-location Drill",
    tagline: "Primary demonstration scenario",
    description: "Demonstration of the survivor, thermal-confirmation, range, geotag, and compound-risk sequence.",
    baseLocation: HOME_COORDINATE,
    polygon: SEARCH_POLYGON,
    waypoints: LAWNMOWER_GRID,
    totalAreaHa: 1.8,
    expectedDurationSec: 100,
    scheduledEvents: [
      { timeSec: 0, type: "WAYPOINT", data: { wp: 0, note: "Simulation initialized. Flight-control state set to nominal." } },
      { timeSec: 6, type: "TAKEOFF", data: { alt: 25.0, note: "Simulated takeoff to 25.0m AGL." } },
      { timeSec: 14, type: "WAYPOINT", data: { wp: 1, note: "Simulated search pattern active." } },
      
      // Survivor Detection Sequence
      {
        timeSec: 36,
        type: "DETECTION",
        data: {
          id: "INC-0042",
          class: "PERSON",
          confidence: 0.91,
          latitude: 18.52071,
          longitude: 73.85691,
          distanceMeters: 11.4,
          notes: "Simulated RGB candidate: person in rubble."
        }
      },
      {
        timeSec: 40,
        type: "THERMAL",
        data: {
          id: "INC-0042",
          peakTemp: 34.8,
          confirmed: true,
          notes: "Simulated MLX90640 confirmation: heat signature 34.8°C."
        }
      },
      {
        timeSec: 44,
        type: "STEREO",
        data: {
          id: "INC-0042",
          distanceMeters: 11.4,
          notes: "Simulated AR0144 range: 11.4m line-of-sight."
        }
      },
      {
        timeSec: 48,
        type: "ALERT",
        data: {
          id: "ALT-101",
          severity: "CRITICAL",
          title: "CRITICAL: SURVIVOR DETECTED",
          message: "Simulated thermally confirmed human presence at 18.52071° N, 73.85691° E.",
          incidentId: "INC-0042"
        }
      },

      // Fire Detection Sequence
      {
        timeSec: 65,
        type: "DETECTION",
        data: {
          id: "INC-0043",
          class: "FIRE",
          confidence: 0.93,
          thermalConfirmed: true,
          thermalPeakTemp: 186.4,
          distanceMeters: 18.4,
          latitude: 18.52085,
          longitude: 73.85705,
          notes: "Simulated RGB + thermal fire detection 18.4m from survivor zone."
        }
      },
      {
        timeSec: 68,
        type: "ALERT",
        data: {
          id: "ALT-102",
          severity: "CRITICAL",
          title: "COMPOUND THREAT: FIRE PROXIMITY",
          message: "Simulated fire proximity escalated the incident to CRITICAL.",
          incidentId: "INC-0043"
        }
      },

      // Secondary Debris & Obstacle
      {
        timeSec: 82,
        type: "DETECTION",
        data: {
          id: "INC-0044",
          class: "DEBRIS",
          confidence: 0.86,
          thermalConfirmed: false,
          distanceMeters: 8.2,
          latitude: 18.52055,
          longitude: 73.85680,
          notes: "Simulated stereo detection of debris on the west access route."
        }
      },
      {
        timeSec: 88,
        type: "ALERT",
        data: {
          id: "ALT-103",
          severity: "WARNING",
          title: "ACCESS HAZARD: DEBRIS",
          message: "Ground access route obstructed at 18.52055° N, 73.85680° E.",
          incidentId: "INC-0044"
        }
      },

      // RTL & Completion
      { timeSec: 92, type: "RTL", data: { note: "Simulated grid completion. Return-to-Launch initiated." } },
      { timeSec: 100, type: "COMPLETE", data: { note: "Simulation complete. Return-to-launch sequence finished." } },
    ]
  },
  {
    id: "MULTI_HAZARD_URBAN",
    name: "Urban Collapse Multi-Hazard Survey",
    tagline: "Structural & Environmental Threat Assessment",
    description: "Evaluates dense rubble, smoke dispersion, compromised structures, and power line hazards.",
    baseLocation: HOME_COORDINATE,
    polygon: SEARCH_POLYGON,
    waypoints: LAWNMOWER_GRID.slice(0, 15),
    totalAreaHa: 1.4,
    expectedDurationSec: 80,
    scheduledEvents: [
      { timeSec: 0, type: "WAYPOINT", data: { wp: 0, note: "Urban survey initialization." } },
      { timeSec: 5, type: "TAKEOFF", data: { alt: 28.0, note: "Ascending to high altitude urban survey." } },
      {
        timeSec: 25,
        type: "DETECTION",
        data: {
          id: "INC-0048",
          class: "ELECTRICAL_WIRE",
          confidence: 0.89,
          thermalConfirmed: true,
          thermalPeakTemp: 68.2,
          distanceMeters: 6.8,
          latitude: 18.52060,
          longitude: 73.85660,
          notes: "Simulated downed electrical-line hazard."
        }
      },
      {
        timeSec: 30,
        type: "ALERT",
        data: {
          id: "ALT-105",
          severity: "CRITICAL",
          title: "CRITICAL: DOWNED POWER CABLE",
          message: "Simulated electrical wire hazard detected.",
          incidentId: "INC-0048"
        }
      },
      {
        timeSec: 50,
        type: "DETECTION",
        data: {
          id: "INC-0049",
          class: "DAMAGED_STRUCTURE",
          confidence: 0.94,
          thermalConfirmed: false,
          distanceMeters: 14.2,
          latitude: 18.52095,
          longitude: 73.85720,
          notes: "Simulated structural-damage observation."
        }
      },
      { timeSec: 75, type: "RTL", data: { note: "Survey concluded. RTL engaged." } },
      { timeSec: 80, type: "COMPLETE", data: { note: "UAV disarmed on landing pad." } },
    ]
  },
  {
    id: "COMM_LOSS_FAILSAFE",
    name: "Telemetry Link Interruption Drill",
    tagline: "Offline Autonomy & Failsafe Scenario",
    description: "Simulates a 433 MHz telemetry interruption and the corresponding local fallback and RTL sequence.",
    baseLocation: HOME_COORDINATE,
    polygon: SEARCH_POLYGON,
    waypoints: LAWNMOWER_GRID.slice(0, 10),
    totalAreaHa: 1.0,
    expectedDurationSec: 60,
    scheduledEvents: [
      { timeSec: 0, type: "WAYPOINT", data: { wp: 0, note: "Offline resiliency check." } },
      { timeSec: 8, type: "TAKEOFF", data: { alt: 22.0, note: "Climbing to 22m." } },
      {
        timeSec: 25,
        type: "ALERT",
        data: {
          id: "ALT-108",
          severity: "WARNING",
          title: "TELEMETRY LINK INTERRUPTED",
          message: "433 MHz signal lost. Companion Pi 4B continuing local autonomous survey.",
        }
      },
      {
        timeSec: 40,
        type: "ALERT",
        data: {
          id: "ALT-109",
          severity: "INFO",
          title: "SIMULATED RTL FAILSAFE",
          message: "Simulated Pixhawk failsafe timer triggered. Return-to-launch sequence commenced.",
        }
      },
      { timeSec: 55, type: "COMPLETE", data: { note: "Simulation complete under the configured failsafe sequence." } }
    ]
  }
];
