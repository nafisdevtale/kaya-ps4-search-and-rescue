# Hardware Architecture & System Specifications

**Competition:** KAYA Buildathon 2026  
**Problem Statement:** PS4 — AI-Powered Autonomous Drone for Search-and-Rescue: Detecting People and Hazards  
**Team:** Team ANOMALY (KT-2047)  
**System Status:** Physical UAV prototype planned for subsequent development and offline demonstration. Current web demonstration runs in strict **SIMULATION MODE**.

---

## 1. Fixed Airframe & Propulsion

The airframe is built on a standard, battle-tested quadcopter geometry optimized for payload capacity and stability during sensor sweeps.

| Component | Specification | Operational Role |
| :--- | :--- | :--- |
| **Airframe** | F450 Glass Fiber / Polyamide Quadcopter Frame (450 mm wheel base) | Rigid sensor mounting & flight stability |
| **Motors** | 4 × A2212 1000 KV Brushless DC (BLDC) Motors | Direct lift and directional thrust |
| **ESCs** | 4 × 30A Electronic Speed Controllers with SimonK firmware | Real-time motor RPM regulation via PWM |
| **Propellers** | 1045 (10 × 4.5 in) CW/CCW Nylon-reinforced Propellers | High static thrust for payload delivery |
| **Flight Battery** | 3S 11.1 V 5200 mAh LiPo Battery (35C discharge rate) | Primary power bus for propulsion and avionics |
| **Power Conversion**| 5V / 5A High-efficiency DC-DC Buck Converter | Regulated, low-noise supply for Raspberry Pi 4B |

---

## 2. Avionics & Flight Control

Autonomy and low-level flight stabilization are partitioned between the flight controller and the companion computer.

```
                      +-----------------------------+
                      | 3S 11.1V 5200mAh LiPo       |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v (Direct 11.1V)                              v (Step-down 5V / 5A)
    +-------------------+                         +-------------------------+
    | 4x 30A ESC +      |                         | Raspberry Pi 4B (4GB)   |
    | A2212 1000KV BLDC |                         | Companion Computer      |
    +-------------------+                         +------------+------------+
              ^                                                |
              | PWM                                            | MAVLink / Serial
              |                                                v
    +---------+---------+                         +------------+------------+
    | Pixhawk 2.4.8     |<=======================>| ArduCopter Autopilot    |
    | Flight Controller |    MAVLink Telemetry    | Extended Kalman Filter  |
    +---------+---------+                         +-------------------------+
              |
              +--> GPS + Compass (Ublox NEO-M8N)
              +--> Onboard Barometer & Dual IMU
              +--> 433 MHz Radio Transceiver (Ground Telemetry)
```

- **Autopilot Unit:** Pixhawk 2.4.8 32-bit ARM Cortex-M4 flight controller running **ArduCopter**.
- **Navigation Sensors:** High-precision Ublox NEO-M8N GPS with external compass mast to avoid motor electromagnetic interference; redundant internal IMU and barometric altimeter.
- **Flight Modes:** `STABILIZE`, `LOITER`, `AUTO` (waypoint grid navigation), `RTL` (Return To Launch), and fail-safe `EMERGENCY LAND`.

---

## 3. Companion Computer & Edge Processing

To maintain full search-and-rescue autonomy in disaster zones where cellular or satellite networks are unavailable, all perception, AI inference, and risk assessment are performed locally on the aircraft.

- **Unit:** **Raspberry Pi 4 Model B (4 GB RAM)**
- **Operating Environment:** Ubuntu 22.04 LTS with ROS 2 Humble Hawksbill.
- **Local Storage:** 128 GB SanDisk High Endurance microSD (for onboard system logs, ROS bag files, and geotagged incident telemetry).
- **Core Intelligence Guarantee:** Internet connectivity is strictly optional. Core vision inference, sensor fusion, risk assessment, and telemetry broadcast continue uninterrupted offline.

---

## 4. Multi-Modal Sensor Suite

Perception combines three complementary modalities to overcome environmental challenges like fog, smoke, collapsed rubble, and low-light conditions:

```
+-------------------------------------------------------------------------+
|                       MULTI-MODAL PERCEPTION SUITE                      |
+-------------------------------------------------------------------------+
|                                                                         |
|   1. RGB VISION                   2. THERMAL SENSING                    |
|   Raspberry Pi Camera Module 3    MLX90640 FIR Sensor                   |
|   - 12 MP Sony IMX708             - 32 x 24 Far-Infrared Array          |
|   - Wide FOV with Autofocus       - -40°C to 300°C target range         |
|   - Visual object detection       - Body heat & hotspot confirmation    |
|                                                                         |
|   3. STEREO DEPTH                                                       |
|   Waveshare AR0144 Synchronized Stereo Camera                           |
|   - Dual monochrome global shutter sensors                              |
|   - Visual odometry & baseline distance estimation (0.5m - 20m)         |
|   - Obstacle proximity verification                                     |
|                                                                         |
+-------------------------------------------------------------------------+
```

1. **RGB Camera (Raspberry Pi Camera Module 3):**
   - High-definition situational imagery for visual identification of persons, smoke, fire, debris, and structural damage.
2. **Thermal Sensor (MLX90640):**
   - 32 × 24 far-infrared thermal sensor communicating over I2C (400 kHz).
   - Detects thermal anomalies, human body heat signatures (33°C - 38°C), and structural fires even through thick dust or smoke.
3. **Stereo Camera (Waveshare AR0144):**
   - Synchronized dual-lens global shutter camera.
   - Computes stereo disparity maps to accurately measure physical distance to survivors and obstacles without relying on active LiDAR.

---

## 5. Communications & Telemetry

- **Telemetry Link:** 433 MHz SiK radio transceiver (up to 1.5 km LOS range) for bidirectional MAVLink command & status packets.
- **High-Bandwidth Link:** 2.4 / 5.8 GHz Local Wi-Fi network hosted by the UAV companion computer to transmit rich dashboard telemetry, fused incident data, and compressed thermal/visual frames to operator laptops/tablets in the field.
- **Zero Cloud Reliance:** No external cloud services or third-party servers are required for flight or emergency response.
