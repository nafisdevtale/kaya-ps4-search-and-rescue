# MARK I SAR — System Review: Electrical & Data Interface

## Purpose

This document explains the submitted electrical/data schematic as an engineering system rather than as a duplicate drawing.

## Electrical partition

1. **Primary propulsion power:** 3S 11.1 V LiPo, XT60, power module and F450 integrated PDB.
2. **Flight control:** Pixhawk 2.4.8 with GPS/compass and power module.
3. **Propulsion control:** four PWM channels to 30 A ESCs and A2212 motors.
4. **Auxiliary electronics:** regulated 5 V / 5 A companion-computer supply.
5. **Perception:** RGB, thermal and synchronized stereo sensing.
6. **Companion compute:** Raspberry Pi 4B 4 GB.
7. **Telemetry:** 433 MHz SiK air/ground pair.
8. **Ground station:** USB telemetry receiver and operator laptop.

## Functional data flow

`RGB + thermal + stereo + GPS/IMU → Raspberry Pi → perception → sensor fusion → geo-tagging → risk logic → local storage / mission data → command center`

Pixhawk remains the flight-control computer. Raspberry Pi remains the perception and mission-processing computer.

## Sensor roles

- **RGB:** visible-spectrum object and scene perception.
- **MLX90640:** low-cost thermal confirmation and hotspot detection.
- **AR0144 stereo:** depth/spatial perception and visual-odometry/SLAM input.
- **GPS/IMU:** vehicle state and geo-reference.

## Telemetry

The 433 MHz SiK path is intended for vehicle and selected mission data. It is not treated as a high-bandwidth video channel.

## Non-claims

The repository does not claim that physical UAV integration, physical AI inference, sensor fusion, autonomous flight or field validation have been completed. The web application is a deterministic simulation.

## Final interface summary

| Subsystem | Interface | Responsibility |
|---|---|---|
| 3S LiPo | XT60 / battery bus | Primary energy |
| Power module | Battery → Pixhawk | FC power + sensing |
| F450 PDB | Battery → ESCs | Propulsion distribution |
| Pixhawk 2.4.8 | PWM / GPS / UART / MAVLink | Flight control |
| A2212 + ESC | VBAT + PWM | Propulsion |
| 5 V buck | VBAT → 5 V | Companion electronics |
| Camera Module 3 | CSI-2 | RGB |
| MLX90640 | I²C | Thermal |
| AR0144 | USB 2.0 | Stereo |
| Raspberry Pi 4B | UART / CSI / I²C / USB / microSD | Companion processing |
| 433 MHz SiK | UART + RF + USB | Telemetry |
| Laptop | USB / dashboard | Ground command center |
