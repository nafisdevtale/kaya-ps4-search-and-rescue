# Hardware Specification

**KAYA Buildathon 2026 · PS4 Search & Rescue**  
**Team:** ANOMALY · **KT-2047**

## Locked prototype baseline

| Subsystem | Final specification | Qty. | Procurement basis |
|---|---|---:|---|
| Airframe | F450/Q450 450 mm frame with integrated PCB/power distribution | 1 | Robu |
| Propulsion | A2212 1000 KV + SimonK 30 A ESC + 1045 propeller matched 4-set | 1 set | FlyRobo |
| Flight control | Pixhawk 2.4.8 + GPS/compass + power module | 1 | Robu |
| Companion compute | Raspberry Pi 4 Model B, 4 GB | 1 | Robu |
| Storage | Samsung EVO Plus 128 GB microSD | 1 | Moglix |
| RGB vision | Raspberry Pi Camera Module 3, 11.9 MP IMX708 | 1 | Robu |
| Thermal | MLX90640, 32 × 24 IR array, I²C | 1 | Robocraze |
| Stereo | Waveshare AR0144 synchronized stereo USB camera | 1 | Robu |
| Propulsion battery | 3S 11.1 V 5200 mAh, 40C/80C LiPo | 1 | GenX |
| Companion power | 5 V / 5 A synchronous buck | 1 | Robu |
| Cooling | 5 V active cooling / heatsink-fan assembly for Pi 4 | 1 | Budgetary allowance |
| Telemetry | 433 MHz, 100 mW-class SiK air + ground pair | 1 pair | Robocraze |
| Landing gear | F450/F550 ABS landing skid | 1 set | Robu |
| Wiring / integration | XT60, power/signal wire, camera cable, heat-shrink, standoffs, ties | 1 lot | Budgetary allowance |
| Test support | B3 2S/3S LiPo balance charger | 1 | StemVolt; not airborne payload |

Final procurement list: **₹44,636.73**. Core flight-system subtotal excluding charger: **₹44,277.73**. Stress-case total: **₹45,152.97**.

## Electrical architecture

```
3S LiPo
  ├──> Pixhawk-compatible power module ──> Pixhawk 2.4.8
  │                                      ├── MAIN OUT 1–4 → ESCs → motors
  │                                      ├── GPS / compass
  │                                      ├── TELEM1 → 433 MHz SiK air unit
  │                                      └── TELEM2 → Raspberry Pi 4B (MAVLink)
  │
  └──> 5 V / 5 A buck → Raspberry Pi 4B + selected peripherals

RGB Camera 3 ──> CSI-2 ───────────────┐
MLX90640 ─────> I²C ──────────────────┼──> Raspberry Pi 4B
AR0144 ────────> USB 2.0 / UVC ────────┘
```

## Hardware responsibilities

### Pixhawk 2.4.8

Flight stabilization, navigation-state processing, actuator commands, flight modes and failsafe behavior.

### Raspberry Pi 4B

Companion perception, thermal processing, stereo processing, sensor fusion, geo-tagging, risk logic, local storage and mission-data handling.

### Sensors

- **RGB:** visual scene and object-detection input.
- **MLX90640:** low-cost thermal confirmation and hotspot detection; not an industrial thermal imager.
- **AR0144 stereo:** depth/spatial perception and visual-odometry/SLAM input.

### Telemetry

The 433 MHz SiK link carries vehicle and selected mission information. It is not defined as a full-resolution video transport channel.

## Procurement boundary

The MVP excludes dedicated 3D LiDAR, RTK GPS, a redundant flight controller, gimbal hardware, an industrial thermal camera, gas sensing, Jetson-class compute and cloud AI.

## Validation boundary

This is a Buildathon prototype baseline, not a certified flight-ready aircraft. Before autonomous flight, validate total mass, thrust margin, motor/ESC current, battery sag, 5 V rail stability, center of gravity, propeller direction, GPS/compass interference, telemetry and failsafes.
