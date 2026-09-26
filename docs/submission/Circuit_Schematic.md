# MARK I SAR — Circuit Schematic Engineering Reference

The submitted one-page schematic defines the following electrical and data partition.

## Primary power

`3S LiPo → XT60 → Pixhawk-compatible power module → F450 integrated PCB/PDB`

The PDB distributes propulsion power to four ESC channels. The power module supplies/monitors the Pixhawk power input.

## Propulsion

`Pixhawk MAIN OUT 1–4 → SimonK 30 A ESC 1–4 → A2212 1000 KV motors → 1045 propellers`

Motor rotation and propeller orientation must be verified during commissioning.

## Auxiliary power

`3S battery domain → 5 V / 5 A buck → Raspberry Pi 4B + selected peripherals`

The 5 V rail must be measured at the Raspberry Pi under representative CPU and camera load.

## Flight controller

| Interface | Destination | Function |
|---|---|---|
| POWER | Power module | Flight-controller power + battery monitoring |
| MAIN OUT 1–4 | ESC 1–4 | PWM motor control |
| GPS | GPS/compass | Navigation data |
| TELEM1 | 433 MHz SiK air unit | MAVLink telemetry |
| TELEM2 | Raspberry Pi 4B | MAVLink companion link |

## Companion computer

| Pi interface | Device | Data |
|---|---|---|
| CSI-2 | Camera Module 3 | RGB frames |
| I²C | MLX90640 | Thermal array |
| USB 2.0 / UVC | AR0144 stereo | Stereo frames |
| UART | Pixhawk TELEM2 | MAVLink |
| microSD | 128 GB card | OS, models, logs, mission data |
| 5 V | Buck converter | Regulated power |

## Ground station

`Pixhawk → TELEM1 → 433 MHz SiK air radio → RF link → SiK ground radio → USB → operator laptop`

The telemetry link carries vehicle and selected mission information. It is not defined as a full-resolution video transport channel.

## Engineering boundary

The schematic is an intended prototype interface drawing.
