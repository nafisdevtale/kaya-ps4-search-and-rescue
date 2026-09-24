# Hardware Specification

**KAYA Buildathon 2026 · PS4 Search & Rescue**  
**Team:** ANOMALY · KT-2047  
**Status:** Proposed physical platform; current web application runs in simulation.

## Airframe and propulsion

| Component | Specification |
|---|---|
| Frame | F450 quadcopter frame |
| Motors | 4 × A2212 1000 KV BLDC |
| ESCs | 4 × 30 A SimonK |
| Propellers | 1045 CW/CCW |
| Battery | 3S 11.1 V 5200 mAh LiPo |
| DC-DC converter | 5 V / 5 A |

## Flight control

| Component | Specification |
|---|---|
| Flight controller | Pixhawk 2.4.8 |
| Firmware | ArduCopter |
| Navigation | NEO-M8N GPS + compass |
| Telemetry | 433 MHz SiK radio |
| Companion link | MAVLink over serial |

## Companion computer

**Raspberry Pi 4 Model B · 4 GB**

Planned software environment:

- Ubuntu 22.04 LTS
- ROS 2 Humble
- OpenCV
- Edge perception and sensor-fusion nodes
- Local logging on 128 GB high-endurance microSD

## Sensors

### RGB

Raspberry Pi Camera Module 3 for visual detection and scene context.

### Thermal

MLX90640, 32 × 24 far-infrared array, used for thermal confirmation and hotspot detection.

### Stereo

Waveshare AR0144 synchronized stereo camera for depth estimation and obstacle/range information.

## Intended data path

`\`\`\`
Camera / Thermal / Stereo
          │
          ▼
   Raspberry Pi 4B
          │
   ROS 2 processing
          │
   Sensor fusion
          │
   Risk prioritization
          │
          ▼
    Operator console

Pixhawk 2.4.8
      │
   MAVLink
      │
      └──────────────► Raspberry Pi 4B
`\`\`\`

## Power and storage

- Propulsion: 3S 11.1 V LiPo
- Companion supply: regulated 5 V / 5 A
- Local storage: 128 GB high-endurance microSD
- No NVMe storage is required for the current baseline

## Current limitation

The physical UAV, live Pixhawk link, companion-computer ROS 2 nodes, and sensor hardware are not connected to the deployed dashboard in the current submission build. The web application uses a local simulation provider.
