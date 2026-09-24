# PS4 Search & Rescue Command Center

> **Operational Command Center for Autonomous Multi-Modal Aerial Search, Detection & Triage**  
> **Competition:** KAYA Buildathon 2026  
> **Problem Statement:** PS4 — AI-Powered Autonomous Drone for Search-and-Rescue: Detecting People and Hazards  
> **Team:** Team ANOMALY  
> **Team ID:** KT-2047  
> **Live Demo:** [https://ps4-drone-command-center.vercel.app](https://ps4-drone-command-center.vercel.app) *(Deployment Link Placeholder)*  
> **Demo Video:** [https://youtu.be/placeholder-demo-video](https://youtu.be/placeholder-demo-video) *(Video Walkthrough Placeholder)*  

---

## ⚠️ Important System Demonstration Notice

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                                 SIMULATION MODE                                      ║
║        DATA GENERATED FOR COMPETITION DEMONSTRATION & BENCHMARK EVALUATION           ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

* **Physical UAV Status:** The physical UAV airframe and embedded companion computer are planned for subsequent physical prototyping and offline field demonstration.
* **Current Operational Mode:** The web dashboard currently executes in **SIMULATION MODE** powered by a deterministic, local physics-and-telemetry state engine.
* **No Fabricated Claims:** This system does not claim unverified field flight test results, measured battery drain profiles, or live hardware telemetry. All numerical readouts are coherent simulated values designed to benchmark operator workflows and triage algorithms.

---

## 1. Executive Summary

During critical disaster scenarios (earthquakes, structural collapse, wildfires, and floods), ground search-and-rescue teams face severe situational blindness. **ANOMALY** is an autonomous search-and-rescue unmanned aerial vehicle (UAV) designed to rapidly search affected sectors, visually and thermally localize survivors, detect life-threatening environmental hazards, compute compound risk priorities, and provide emergency operators with an actionable command console.

The command center functions as the high-information-density tactical dashboard for field commanders, maintaining complete operational autonomy even when global internet connectivity is severed.

---

## 2. Fixed System Architecture

The hardware and avionics architecture is fixed around standardized, high-reliability components:

```
                                  [ F450 QUADCOPTER AIRFRAME ]
                                                │
             ┌──────────────────────────────────┴──────────────────────────────────┐
             ▼                                                                     ▼
[ PROPULSION & POWER ]                                              [ AUTOPILOT AVIONICS ]
- 4 × A2212 1000 KV BLDC Motors                                     - Pixhawk 2.4.8 Autopilot
- 4 × 30A SimonK ESCs                                               - ArduCopter 4.5.x Firmware
- 1045 CW/CCW Nylon Propellers                                      - Ublox NEO-M8N GPS + Compass Mast
- 3S 11.1V 5200 mAh LiPo Battery                                    - Dual Onboard IMU + Barometer
- 5V / 5A Step-down Buck Converter                                  - 433 MHz SiK Telemetry Transceiver
             │                                                                     │
             └──────────────────────────────────┬──────────────────────────────────┘
                                                ▼ MAVLink / Serial
                            [ COMPANION COMPUTER: RASPBERRY PI 4B (4GB) ]
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
        [ RGB OPTICAL CAM ]           [ THERMAL SENSOR ]             [ STEREO DEPTH CAM ]
      Pi Camera Module 3             MLX90640 32×24 FIR             Waveshare AR0144 Global
      - 1080p30 Edge Feed            - I2C (8 Hz Refresh)           - Synchronized Dual Sensor
      - Visual Object Candidate      - Human Heat Signature (34.8°C)- Stereo Disparity Ranging
                 │                              │                              │
                 └──────────────────────────────┼──────────────────────────────┘
                                                ▼
                                    [ ROS 2 HUMBLE PIPELINE ]
                                    - yolo_detection_node
                                    - thermal_analyzer_node
                                    - ar0144_stereo_depth_node
                                    - sensor_fusion_node
                                    - anomaly_risk_engine_node
                                                │
                                                ▼
                                 [ DATA ADAPTER ARCHITECTURE ]
                                                │
                                                ▼
                        [ PS4 SEARCH & RESCUE COMMAND CENTER (UI) ]
```

### Component Specification Highlights:
* **Airframe:** F450 Glass Fiber Quadcopter (450 mm wheelbase).
* **Companion Computer:** **Raspberry Pi 4B 4GB** (Strictly Pi 4B 4GB; no Pi 5).
* **Autopilot Unit:** Pixhawk 2.4.8 running ArduCopter firmware with Extended Kalman Filter (EKF3).
* **RGB Camera:** Raspberry Pi Camera Module 3 (Wide FOV, Autofocus).
* **Thermal Sensor:** MLX90640 32 × 24 far-infrared sensor array.
* **Stereo Depth:** Waveshare AR0144 synchronized global shutter stereo camera.
* **Communications:** 433 MHz SiK radio (telemetry) + Local 5 GHz Wi-Fi (command center).

---

## 3. Sensor Fusion & Multi-Modal Verification Chain

Single-modality vision systems generate unacceptable false-alarm rates in search-and-rescue (e.g. mannequins or hot rocks). The **ANOMALY** pipeline enforces deterministic 4-stage multi-modal confirmation:

```
1. OPTICAL (RGB)         2. THERMAL (FIR)          3. STEREO DEPTH         4. GNSS / IMU POSE
   Pi Camera Module 3       MLX90640 32x24 Array      AR0144 Stereo Camera    Pixhawk + NEO-M8N
   YOLO candidate:          Human heat signature      Disparity range:        Geodetic ray-cast:
   PERSON (91% Conf)        CONFIRMED (34.8°C)        11.4 m                  18.52071°N, 73.85691°E
          │                        │                         │                        │
          └────────────────────────┴────────────┬────────────┴────────────────────────┘
                                                ▼
                                     [ SENSOR FUSION ENGINE ]
                                                │
                                                ▼
                                     [ FUSED COMPOSITE INCIDENT ]
                                     Class: SURVIVOR
                                     Composite Confidence: 96%
                                     Geotag: 18.52071° N, 73.85691° E
                                                │
                                                ▼
                                    [ ANOMALY RISK ENGINE ]
                                    Rule: Survivor near Active Fire (<25m)
                                    Assigned Priority: CRITICAL
                                                │
                                                ▼
                                    [ COMMAND CENTER DISPATCH ]
                                    Audible & Visual Alert Triggered
```

---

## 4. ANOMALY Risk Engine: Priority Matrix

The risk engine computes prototype priority tiers to assist field triage (not certified emergency service dispatch standards):

| Detected Condition | Proximity / Compound Rule | Risk Priority | Dashboard Status |
| :--- | :--- | :--- | :--- |
| **Survivor + Active Fire** | Distance < 25 meters | **CRITICAL** | Flashing Red Alert + Audio Beacon |
| **Survivor Confirmed** | Thermal Body Heat (33-38°C) | **HIGH / CRITICAL** | Green-Red Priority Pin |
| **Active Fire** | Structural / Thermal Hotspot | **HIGH** | Red Hazard Pin |
| **Flash Flood** | Pathway Encroachment | **HIGH** | Cyan Hazard Pin |
| **Smoke Plume** | High Density / Drift Vector | **MEDIUM** | Orange Hazard Pin |
| **Debris Obstruction** | Access Path Blocked | **MEDIUM** | Amber Hazard Pin |
| **Downed Wire** | Live Electrical Hazard | **HIGH** | Yellow Hazard Pin |
| **Isolated Vehicle** | Vacant Structural Landmark | **LOW** | Neutral Gray Pin |

*(Note: Chemical leak detection is planned for future gas sensor revisions and is NOT implemented in this prototype).*

---

## 5. Technology Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript 5.6
* **Styling:** Tailwind CSS 3.4 (Aerospace dark palette, high contrast, compact telemetry tokens)
* **Tactical Mapping:** Leaflet 1.9 + SVG/Canvas high-precision offline vector fallback
* **Iconography:** Lucide React
* **State Management & Audio:** React Context with Web Audio API synthesizer for offline tactical chimes
* **Architecture Pattern:** Data Adapter Pattern (`IDataProvider` with `SimulationDataProvider` and `FutureLiveMavlinkRos2Provider`)

---

## 6. Repository Structure

```
├── README.md                      # Comprehensive documentation and deployment guide
├── package.json                   # Next.js dependencies & scripts
├── tsconfig.json                  # Strict TypeScript configuration
├── tailwind.config.ts             # Command-center color palette & tactical tokens
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── page.tsx               # Primary Mission Control Command Center
│   │   ├── detections/page.tsx    # Detections table with filters and GeoJSON export
│   │   ├── history/page.tsx       # Historical mission sorties & post-flight debrief
│   │   ├── system/page.tsx        # System health & hardware diagnostics
│   │   ├── architecture/page.tsx  # Interactive architecture & sensor fusion walkthrough
│   │   ├── layout.tsx             # Root layout with topbar & mission provider
│   │   └── globals.css            # Tactical scrollbar, Leaflet dark mode, pulsing markers
│   ├── components/                # Modular UI components
│   │   ├── TopBar.tsx             # Persistent status ticker & navigation
│   │   └── mission/               # Mission Control components
│   │       ├── TopMissionControls.tsx    # START MISSION, PAUSE, RTL, EMERGENCY
│   │       ├── UAVStatusCard.tsx         # Detailed avionics telemetry
│   │       ├── MissionProgressCard.tsx   # Search progress & area metrics
│   │       ├── TacticalMap.tsx           # Dynamic client Leaflet wrapper
│   │       ├── TacticalMapInner.tsx      # Dual-mode Leaflet & Vector Grid Hero map
│   │       ├── DetectionPanel.tsx        # Incident stream with action triggers
│   │       ├── RgbSensorFeed.tsx         # Simulated 1080p optical feed with AI boxes
│   │       ├── ThermalSensorPanel.tsx    # MLX90640 32x24 authentic Ironbow FIR heatmap
│   │       ├── StereoDepthPanel.tsx      # AR0144 stereo disparity obstacle radar
│   │       ├── SensorFusionVisualizer.tsx# Multi-modal fusion chain explanation
│   │       ├── AlertPanel.tsx            # Emergency alert triage panel
│   │       ├── MissionTimeline.tsx       # Chronological event stream
│   │       └── IncidentDetailModal.tsx   # Detailed incident inspector with operator notes
│   ├── config/
│   │   └── branding.ts            # Centralized PROJECT_BRAND configuration object
│   ├── context/
│   │   └── MissionContext.tsx     # Unified mission state & Web Audio synthesizer
│   ├── adapters/
│   │   ├── IDataProvider.ts       # Clean Data Adapter interface
│   │   ├── SimulationDataProvider.ts # Active deterministic simulation adapter
│   │   └── FutureLiveMavlinkRos2Provider.ts # Scaffolded physical UAV adapter
│   ├── simulation/
│   │   ├── engine.ts              # Deterministic simulation state engine
│   │   └── scenarios.ts           # Scenario waypoints, search polygons, and event triggers
│   └── types/
│       └── index.ts               # Domain types (UAVTelemetry, Incidents, Alerts, etc.)
├── docs/
│   └── RISK_ENGINE.md             # Algorithmic risk matrix specifications
├── hardware/
│   └── SYSTEM_SPECIFICATIONS.md   # Detailed BOM, pinouts, and power distribution
├── software/
│   └── ROS2_PIPELINE.md           # ROS 2 node graph & MAVLink bridge architecture
├── simulation/
│   └── SCENARIOS.md               # Simulation timeline & drill definitions
└── scripts/
    └── verify-simulation.ts       # Automated CLI simulation test harness
```

---

## 7. How to Run Locally

### Prerequisites
* **Node.js:** v18.0.0 or later (Tested on Node.js v26)
* **npm:** v9.0.0 or later

### Installation & Execution

```bash
# 1. Clone repository
git clone https://github.com/nafisdevtale/kaya-ps4-search-and-rescue.git cd kaya-ps4-search-and-rescue
cd ps4-search-and-rescue

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# Navigate to: http://localhost:3000
```

### Production Build & Launch

```bash
# Compile and build static production bundle
npm run build

# Start production server
npm run start
```

### Run Automated Simulation Test Harness

```bash
# Run deterministic test script verifying survivor detection, thermal confirmation, fire, and RTL
npx tsx scripts/verify-simulation.ts
```

---

## 8. Deployment Guide (Vercel)

The application is architected for zero-configuration, one-click deployment to **Vercel**:

1. Push this repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import this repository.
4. Framework Preset: **Next.js** (automatically detected).
5. Root Directory: `./` (default).
6. Build Command: `next build` (default).
7. Output Directory: `.next` (default).
8. Environment Variables: None required (app is completely self-contained and zero-API dependent).
9. Click **Deploy**.

---

## 9. Verification & Acceptance Criteria Matrix

| Requirement | Acceptance Criteria | Status |
| :--- | :--- | :--- |
| **System Boot** | Dashboard launches successfully without runtime errors | **PASSED** |
| **Default Screen** | Mission Control is the primary default screen (`/`) | **PASSED** |
| **Demonstration Banner** | `● SIMULATION MODE` banner prominently visible | **PASSED** |
| **Mission Controls** | Start, Pause, Resume, RTL, Emergency actions functional | **PASSED** |
| **Tactical Map** | Hero interactive map with UAV trajectory, polygon, and waypoints | **PASSED** |
| **Offline Resilience** | Dual-mode Leaflet + High-precision Vector Grid fallback | **PASSED** |
| **Multi-Modal Sensing** | Simultaneous RGB, 32×24 Thermal FIR, and Stereo Depth panels | **PASSED** |
| **Sensor Fusion** | Visual breakdown connecting RGB + Thermal + Stereo + GPS | **PASSED** |
| **Detection Catalog** | Searchable table with filters, sorting, and GeoJSON export | **PASSED** |
| **Mission History** | Debrief records with duration, survivors, hazards, and notes | **PASSED** |
| **System Diagnostics** | Real-time health metrics for Pixhawk and Raspberry Pi 4B 4GB | **PASSED** |
| **Architecture Page** | Hardware diagrams, ROS 2 pipelines, and interactive 6-step walkthrough | **PASSED** |
| **Responsive Design** | Optimized for desktop, laptop, and tablet form factors | **PASSED** |
| **Branding Isolation** | Single-config brand abstraction in `src/config/branding.ts` | **PASSED** |

---

## 10. Future Hardware Integration Roadmap

```
PHYSICAL UAV INTEGRATION (PHASE 2)
Pixhawk 2.4.8 (ArduCopter) ──── MAVLink / Serial ────┐
                                                     ▼
Raspberry Pi 4B (4GB) ──────── ROS 2 Humble ───► IDataProvider ───► Dashboard UI
```

The frontend uses the `IDataProvider` interface pattern. To connect physical hardware in the future:
1. Replace `SimulationDataProvider` with `LiveMavlinkRos2Provider`.
2. Connect WebSocket to the Raspberry Pi 4B ROS 2 bridge node.
3. No UI modifications or component redesigns will be required.

---

**Team ANOMALY · KT-2047 · KAYA Buildathon 2026**
