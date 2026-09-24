# Engineering Package Guide

**KAYA Buildathon 2026 · PS4 Search & Rescue · Team ANOMALY · KT-2047**

## Document hierarchy

These artifacts are complementary, not duplicate versions of one file.

1. **BOM — procurement source of truth**
   - Components, quantities, specifications, suppliers, market snapshot and budget.
   - Final procurement list: ₹44,636.73.
   - Budget ceiling: ₹46,000.
   - Stress case: ₹45,152.97.

2. **Circuit Schematic — electrical-interface source of truth**
   - Battery and regulated power paths.
   - Pixhawk power, PWM, GPS, UART and telemetry interfaces.
   - Raspberry Pi CSI/I²C/USB/UART interfaces.
   - Ground-station telemetry path.

3. **System Architecture — system-level source of truth**
   - Functional partitioning of power, flight control, perception, companion computing, propulsion, ground station and data flow.

4. **System Review — explanatory engineering document**
   - Detailed interface descriptions, data flow, validation requirements, limitations and final interface summary.

5. **Dashboard source — software implementation**
   - Deterministic simulation of the command-center workflow.

## Submission artifacts

| File | Location | Use |
|---|---|---|
| Final BOM | `docs/submission/BOM_Final.md` (controlled PDF submitted separately) | BOM / procurement submission |
| Circuit schematic | `docs/submission/Circuit_Schematic.md` (controlled PDF submitted separately) | Circuit / electrical schematic submission |
| System architecture | `docs/submission/System_Architecture.svg` | Architecture reference |
| System review | `docs/submission/System_Review_Engineering_Document.md` (controlled PDF submitted separately) | Detailed engineering support |

## Consistency rules

- Team identity is **ANOMALY · KT-2047**.
- Project/system identity is **PS4 Search & Rescue**. Do not use ANOMALY as the drone/system name.
- Companion computer is **Raspberry Pi 4 Model B, 4 GB**.
- Flight controller is **Pixhawk 2.4.8**.
- Physical integration is not claimed as complete.
- Simulation values are not flight-test evidence.
- MLX90640 is a low-resolution thermal array, not an industrial thermal camera.
- Dedicated LiDAR, RTK GPS, redundant FC, gimbal, gas sensor, Jetson-class compute and cloud AI are outside the MVP.

## Submission check

Use the same project title, team ID, problem statement, BOM total, schematic and architecture image in the submission form. Do not add claims of live telemetry, physical AI inference, autonomous flight or field validation unless those capabilities have actually been tested.
