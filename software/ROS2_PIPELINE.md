# Software & Integration Architecture

**KAYA Buildathon 2026 · PS4 Search & Rescue**  
**Team:** ANOMALY · **KT-2047**

## Integration boundary

The intended physical communication path is:

```
Pixhawk 2.4.8
      │
MAVLink / Serial
      │
      ▼
Raspberry Pi 4B · 4 GB
      │
ROS 2 Humble architecture
      ├── RGB perception
      ├── MLX90640 thermal analysis
      ├── AR0144 stereo depth / SLAM
      ├── sensor fusion
      └── edge risk engine
      │
      ▼
Mission data adapter
      │
      ▼
Next.js command center
```

The current dashboard stops at the simulation boundary: `SimulationDataProvider` supplies deterministic mission data. Live Pixhawk, MAVLink, ROS 2 and physical sensor streams are not connected.

## Perception pipeline

1. RGB perception generates candidate people/hazard detections.
2. Thermal data provides a complementary heat-signature signal.
3. Stereo data provides depth/spatial context.
4. Pixhawk navigation state provides vehicle pose and flight state.
5. Fusion associates detection, thermal, depth and vehicle-state information.
6. Geo-tagging associates a detection with a geographic position.
7. The prototype risk layer assigns a demonstration priority.
8. Mission data is stored locally and surfaced to the command center.

## Current simulation

The simulation provides:

- UAV telemetry
- Search progress
- RGB / thermal / stereo events
- Detection records
- Alerts
- Mission timeline events
- System-health values

These are demonstration values and must not be interpreted as flight-test measurements.

## Prototype risk rules

| Condition | Demonstration priority |
|---|---|
| Survivor + fire within configured threshold | CRITICAL |
| Survivor | HIGH |
| Fire / flood | HIGH |
| Smoke / debris | MEDIUM |
| Other / unclassified | LOW |

These are prototype demonstration rules, not emergency-service standards.

## Data interfaces

| Interface | Source | Destination | Purpose |
|---|---|---|---|
| PWM | Pixhawk MAIN OUT 1–4 | ESCs | Motor control |
| GPS / compass | Navigation module | Pixhawk | Position / heading data |
| MAVLink / UART | Pixhawk TELEM2 | Raspberry Pi | Flight and mission state |
| MAVLink / UART | Pixhawk TELEM1 | 433 MHz SiK air unit | Ground telemetry |
| CSI-2 | Camera Module 3 | Raspberry Pi | RGB frames |
| I²C | MLX90640 | Raspberry Pi | Thermal array data |
| USB 2.0 / UVC | AR0144 | Raspberry Pi | Stereo frames |
| USB | SiK ground unit | Operator laptop | Telemetry input |

## Physical integration boundary

A future hardware provider may replace the simulation source with MAVLink/ROS 2 data without changing the dashboard's domain model. Before that transition, the team must validate serial wiring, message rates, time synchronization, sensor drivers, CPU load, thermal limits, power stability and failure handling on the actual aircraft.
