# Software Architecture & ROS 2 Pipeline

**Competition:** KAYA Buildathon 2026  
**Problem Statement:** PS4 — AI-Powered Autonomous Drone for Search-and-Rescue: Detecting People and Hazards  
**Team:** Team ANOMALY (KT-2047)  
**System Status:** Software pipeline designed for Raspberry Pi 4B (4GB) running ROS 2 Humble. Currently executing in deterministic **SIMULATION MODE** on the command dashboard.

---

## 1. High-Level Architecture

The software architecture bridges low-level flight dynamics with high-level multi-modal autonomy:

```
+----------------------------------------------------------------------------+
|                          ARDUCOPTER AUTOPILOT (PIXHAWK)                    |
|  - Attitude Estimation (EKF3)           - Waypoint Navigation (AUTO)       |
|  - Motor Mixer & PID Regulators         - Fail-safe Monitors (Battery/GPS) |
+-------------------------------------+--------------------------------------+
                                      | MAVLink / MicroXRCE-DDS
                                      v
+----------------------------------------------------------------------------+
|                       ROS 2 HUMBLE (RASPBERRY PI 4B 4GB)                   |
|                                                                            |
|  +-------------------------+             +-------------------------------+  |
|  | mavlink_bridge_node     |             | camera_driver_nodes           |  |
|  | Subscribes to MAVLink   |             | - rgb_cam_node (Pi Cam 3)     |  |
|  | Publishes:              |             | - mlx90640_thermal_node       |  |
|  | /uav/telemetry          |             | - ar0144_stereo_depth_node    |  |
|  | /uav/nav_sat_fix        |             +---------------+---------------+  |
|  +------------+------------+                             |                  |
|               |                                          |                  |
|               v                                          v                  |
|  +-----------------------------------------------------------------------+  |
|  |                      PERCEPTION & SENSOR FUSION                       |  |
|  |                                                                       |  |
|  |  +---------------------------+       +-----------------------------+  |  |
|  |  | yolo_detection_node       |       | thermal_analyzer_node       |  |  |
|  |  | - Lightweight Edge Model  |       | - 32x24 Heatmap Clustering  |  |  |
|  |  | - Classes: Person, Fire,  |       | - Human Signature: 33-38°C  |  |  |
|  |  |   Smoke, Flood, Debris    |       | - Hotspot Anomaly Tracking  |  |  |
|  |  +-------------+-------------+       +--------------+--------------+  |  |
|  |                |                                    |                 |  |
|  |                +------------------+-----------------+                 |  |
|  |                                   |                                   |  |
|  |                                   v                                   |  |
|  |  +-----------------------------------------------------------------+  |  |
|  |  | sensor_fusion_node                                              |  |  |
|  |  | - Correlates RGB 2D Bounding Boxes with Thermal Peak Vectors    |  |  |
|  |  | - Queries AR0144 Disparity Map for Physical Distance           |  |  |
|  |  | - Fuses Telemetry Pose (GPS Lat/Lon + Alt + Heading)            |  |  |
|  |  | - Computes Exact Incident Ground Coordinates (Geo-tagging)     |  |  |
|  |  +--------------------------------+--------------------------------+  |  |
|  +-----------------------------------|-----------------------------------+  |
|                                      v                                      |
|  +-----------------------------------------------------------------------+  |
|  | anomaly_risk_engine_node                                              |  |
|  | - Evaluates Environmental Threat Matrix & Spatial Colocation          |  |
|  | - Survivor + Fire = CRITICAL Priority                                 |  |
|  | - Standalone Survivor / Fire / Flood = HIGH Priority                  |  |
|  | - Smoke / Debris = MEDIUM Priority                                    |  |
|  | - Publishes: /incidents/fused, /alerts/high_priority                   |  |
|  +-----------------------------------+-----------------------------------+  |
|                                      |                                      |
|                                      v                                      |
|  +-----------------------------------------------------------------------+  |
|  | dashboard_adapter_node (WebSocket / REST Server)                      |  |
|  | - Publishes real-time telemetry, incidents, alerts, & camera frames   |  |
|  +-----------------------------------------------------------------------+  |
+----------------------------------------------------------------------------+
```

---

## 2. Sensor Fusion Mechanism: Step-by-Step

A common flaw in single-modality drones is high false positives (e.g. mannequins or hot rocks). The ANOMALY pipeline resolves this through deterministic multi-modal verification:

1. **Step 1: Visual Perception (RGB)**
   - The lightweight YOLO inference node identifies a candidate class (e.g. `PERSON` with 91% confidence).
2. **Step 2: Thermal Verification (MLX90640)**
   - The thermal node samples the 32 × 24 array and inspects the angular region corresponding to the visual bounding box.
   - If a localized heat signature matches human skin range (34.8°C), the node flags `HEAT_SIGNATURE = CONFIRMED`.
3. **Step 3: Depth & Obstacle Perception (AR0144 Stereo)**
   - Synchronized stereo disparity calculates the direct line-of-sight distance (e.g. `11.4 m`).
4. **Step 4: Geodetic Ray-Casting (GPS + IMU Fusion)**
   - Using the UAV's current GPS position, barometric altitude, camera gimbal tilt, and heading angle, the system projects the optical ray onto the digital elevation plane.
   - Generates precise geodetic coordinates (e.g., `18.52071° N, 73.85691° E`).
5. **Step 5: Prioritization & Dispatch**
   - The **ANOMALY Risk Engine** classifies the compound event (e.g. Survivor in vicinity of rubble) as `CRITICAL` or `HIGH` priority, triggering instant audible and visual alerts on the command dashboard.

---

## 3. Data Flow & Adapter Abstraction

To ensure the command center can switch seamlessly between simulated flight drills and physical field trials without modifying a single UI component:

```
[ SIMULATION ENGINE ]             [ PHYSICAL UAV COMPANION ]
Deterministic State Engine        ROS 2 Nodes + MAVLink Router
         |                                     |
         +------------------+------------------+
                            v
              [ IDataProvider Interface ]
              - subscribeTelemetry(callback)
              - subscribeDetections(callback)
              - subscribeAlerts(callback)
              - sendMissionCommand(command)
                            |
                            v
              [ Dashboard Mission Store ]
                            |
                            v
            [ React / Next.js Command Center UI ]
```
