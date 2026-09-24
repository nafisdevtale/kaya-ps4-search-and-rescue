# Simulation Scenarios & Timeline Definitions

**System:** PS4 Search & Rescue Command Center  
**Mode:** STRICT SIMULATION MODE  
**Environment:** Demonstration and evaluation mode with deterministic state engine

---

## 1. Scenario Portfolio

To facilitate evaluation by competition judges, the dashboard supports selectable simulation scenarios:

1. **Scenario 1: Survivor & Fire Co-location (DEFAULT JUDGES DRILL)**
   - Autonomous lawnmower search pattern over 1.8 hectare quadrant.
   - Detects trapped survivor with thermal confirmation (34.8°C).
   - Detects active brush/structural fire 18.4m away.
   - Triggers compound escalation to `CRITICAL` priority.
   - Completes grid sweep and returns to launch (RTL).
   - Duration: 90–120 seconds.

2. **Scenario 2: Multi-Hazard Urban Collapse**
   - Search over urban disaster zone.
   - Identifies structural debris, compromised structures, and smoke plumes.
   - Evaluates obstacle clearance using AR0144 stereo depth.

3. **Scenario 3: Communication & Telemetry Interruption**
   - Simulates RF jamming / shadow loss on the 433 MHz link.
   - Dashboard demonstrates local offline resilience and automated RTL fail-safe.

4. **Scenario 4: GPS Degradation & Visual Odometry Fallback**
   - Simulates GPS lock failure (`NO FIX`).
   - Demonstrates visual odometry pose estimation from Waveshare AR0144 stereo camera.

---

## 2. Default Drill Deterministic Timeline (Survivor + Fire)

| Time | Phase | Subsystem Events |
| :--- | :--- | :--- |
| **T+00s** | `INITIALIZING` | System boot, ROS 2 nodes online, MAVLink handshake |
| **T+08s** | `ARMING` | Motor safety switch engaged, pre-arm checks pass |
| **T+15s** | `TAKEOFF` | Climb to 25.0m AGL, stable hover established |
| **T+25s** | `SEARCHING` | Lawnmower grid navigation begins at Waypoint 1 |
| **T+40s** | `DETECTION` | RGB camera identifies `PERSON` candidate (conf: 91%) |
| **T+44s** | `THERMAL_CONFIRM` | MLX90640 detects localized heat spot at 34.8°C |
| **T+48s** | `STEREO_RANGE` | AR0144 calculates distance to target: 11.4m |
| **T+52s** | `GEO_TAG` | Fused coordinates `18.52071° N, 73.85691° E` plotted on tactical map |
| **T+56s** | `ALERT_DISPATCH` | `CRITICAL` audible & visual alert dispatched |
| **T+72s** | `SECONDARY_HAZARD`| Flame detection (conf: 91%, thermal confirmed) at 18.4m |
| **T+85s** | `GRID_ADVANCE` | Waypoint navigation continues, progress 75% |
| **T+105s**| `RTL_TRIGGER` | Battery threshold / sweep completion triggers Return-to-Launch |
| **T+120s**| `MISSION_COMPLETE`| Touchdown at home coordinates, summary log finalized |
