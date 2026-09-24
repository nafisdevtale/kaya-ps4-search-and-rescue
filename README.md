# PS4 Search & Rescue Command Center

**KAYA Buildathon 2026 · PS4 — AI-Powered Autonomous Drone for Search-and-Rescue**  
**Team:** ANOMALY · **Team ID:** KT-2047

## Scope

This repository contains the command-center software, simulation data path, and engineering documentation for the proposed PS4 search-and-rescue system.

The current web application is a **deterministic simulation**. It demonstrates the operator workflow, sensor-fusion sequence, detection catalog, mission controls, alerts, and system-health views without requiring a physical UAV.

### Current status

| Area | Status |
|---|---|
| Command-center web application | Implemented |
| Mission simulation | Implemented |
| Detection / fusion / risk workflow | Implemented as simulation logic |
| Physical UAV | Not integrated |
| Pixhawk / MAVLink live telemetry | Architecture defined; not connected |
| ROS 2 companion-computer pipeline | Architecture defined; not connected |
| Field / flight validation | Not performed in this repository |

No simulated value should be interpreted as a flight-test or field-test result.

## System architecture

````
RGB Camera ───────┐
Thermal Sensor ───┼──> Raspberry Pi 4B ──> Perception / Fusion ──> Risk Engine
Stereo Camera ────┘          ▲                                      │
                             │                                      ▼
                        MAVLink / Serial                      Alert + Geotag
                             │                                      │
                       Pixhawk 2.4.8                                ▼
                                                               Command Center
````

The intended physical integration path is:

````
Pixhawk 2.4.8
      │
MAVLink / Serial
      │
      ▼
Raspberry Pi 4B · 4 GB
      │
ROS 2 Humble
      │
      ├── RGB perception
      ├── Thermal analysis
      ├── Stereo depth
      ├── Sensor fusion
      └── Edge risk engine
      │
      ▼
Command Center
````

The deployed dashboard currently uses `SimulationDataProvider`; it does not consume live Pixhawk data.

## Hardware baseline

| Subsystem | Selected hardware |
|---|---|
| Airframe | F450 quadcopter frame |
| Motors | 4 × A2212 1000 KV BLDC |
| ESCs | 4 × 30 A SimonK |
| Propellers | 1045 CW/CCW |
| Battery | 3S 11.1 V 5200 mAh LiPo |
| Flight controller | Pixhawk 2.4.8 |
| GNSS | NEO-M8N GPS + compass |
| Companion computer | Raspberry Pi 4 Model B · 4 GB |
| RGB camera | Raspberry Pi Camera Module 3 |
| Thermal | MLX90640 · 32 × 24 |
| Stereo | Waveshare AR0144 synchronized stereo camera |
| Telemetry | 433 MHz SiK radio |
| Local storage | 128 GB high-endurance microSD |
| Pi power | 5 V / 5 A buck converter |

Detailed hardware notes are in [hardware/SYSTEM_SPECIFICATIONS.md](hardware/SYSTEM_SPECIFICATIONS.md).

## Software stack

- Next.js 16 App Router
- React 19
- TypeScript 5.6
- Tailwind CSS 3.4
- Leaflet
- Lucide React
- Local React state/context
- Deterministic TypeScript simulation engine

The dashboard has no required API keys or application-side secrets.

## Mission flow

The primary demonstration sequence is:

1. Initialize mission
2. Arm / take off
3. Search a predefined polygon using a grid path
4. Detect a visual candidate
5. Confirm with thermal data
6. Estimate range from stereo depth
7. Combine detection data with UAV pose
8. Assign a prototype risk priority
9. Create a geotagged alert
10. Continue search or return to launch

Prototype priority rules include:

- Survivor + fire within the configured proximity threshold → CRITICAL
- Survivor → HIGH
- Fire / flood → HIGH
- Smoke / debris → MEDIUM

These rules are demonstration logic, not an emergency-services standard.

## Repository layout

````
src/
  app/                    Next.js routes
  components/             Dashboard components
  adapters/               Simulation data adapter
  config/                 Project identity and system configuration
  context/                Mission state
  simulation/             Scenario definitions and simulation engine
  types/                  Domain models

hardware/                 Hardware baseline and interfaces
software/                 ROS 2 / MAVLink integration architecture
````

## Run locally

Requirements: Node.js and npm.

````bash
git clone https://github.com/nafisdevtale/kaya-ps4-search-and-rescue.git
cd kaya-ps4-search-and-rescue

npm install
npm run dev
````

Open `http://localhost:3000`.

Production build:

````bash
npm run build
npm run start
````

## Deployment

The application is configured as a standard Next.js deployment.

For Vercel:

1. Import this GitHub repository.
2. Keep the root directory as `/`.
3. Use the detected Next.js framework.
4. Use the default build command.
5. No environment variables are required for the current simulation build.

After deployment, test:

- `/`
- `/detections`
- `/history`
- `/system`
- `/architecture`
- Start the default mission and run the complete simulation once.

## Engineering notes

The physical system is intended to run perception and risk logic locally on the companion computer so that internet access is not required for core aircraft-side processing. The current repository does not claim that the physical implementation has been completed or flight-validated.

**Team ANOMALY · KT-2047 · KAYA Buildathon 2026**
