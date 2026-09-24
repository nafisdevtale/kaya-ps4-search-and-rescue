# Software Architecture

**KAYA Buildathon 2026 · PS4 Search & Rescue**  
**Team:** ANOMALY · KT-2047  
**Status:** Integration architecture; dashboard currently runs in simulation mode.

## Data path

`\`\`\`
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
      ├── MLX90640 thermal analysis
      ├── AR0144 stereo depth
      ├── Sensor fusion
      └── Edge risk engine
      │
      ▼
Command-center data adapter
      │
      ▼
Next.js dashboard
`\`\`\`

## Perception flow

1. RGB detection produces a candidate.
2. Thermal data is used as a second modality.
3. Stereo depth provides target / obstacle range.
4. UAV pose is combined with the detection for geotagging.
5. The risk engine applies prototype priority rules.
6. The dashboard receives the resulting detection and alert objects.

## Simulation provider

The current application uses `SimulationDataProvider` backed by the local TypeScript simulation engine.

The simulation provides:

- UAV telemetry
- Search progress
- RGB / thermal / stereo events
- Detection records
- Alerts
- Timeline events
- System-health values

These values are demonstration data.

## Physical integration path

A future hardware implementation would replace the simulation data source with a provider that reads MAVLink and ROS 2 data from the Raspberry Pi. The dashboard interface is separated from the transport layer so the UI does not depend on the data source.

## Risk engine

Current demonstration rules:

| Condition | Priority |
|---|---|
| Survivor + fire within configured threshold | CRITICAL |
| Survivor | HIGH |
| Fire / flood | HIGH |
| Smoke / debris | MEDIUM |
| Other / unclassified | LOW |

The threshold and priorities are prototype logic for the competition demonstration.
