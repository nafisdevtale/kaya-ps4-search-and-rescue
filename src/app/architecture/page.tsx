"use client";

import React, { useState } from "react";
import { PROJECT_BRAND } from "../../config/branding";
import {
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Thermometer,
  Ruler,
  Compass,
  AlertTriangle,
  Server,
  Zap,
} from "lucide-react";

export default function ArchitecturePage() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: "SEARCH",
      desc: "UAV autonomously navigates lawnmower grid waypoints across defined search polygon using GPS + compass + barometer.",
      subsystem: "Pixhawk 2.4.8 (ArduCopter AUTO Mode)",
    },
    {
      step: 2,
      title: "DETECT",
      desc: "Edge-optimized YOLO detector analyzes 1080p optical stream from Raspberry Pi Camera Module 3 in real time.",
      subsystem: "yolo_detection_node (Raspberry Pi 4B 4GB)",
    },
    {
      step: 3,
      title: "CONFIRM",
      desc: "MLX90640 far-infrared 32×24 array inspects visual bounding box for human body heat signature (33°C - 38°C).",
      subsystem: "thermal_analyzer_node (MLX90640 I2C)",
    },
    {
      step: 4,
      title: "LOCALIZE",
      desc: "AR0144 stereo disparity computes target distance; ray-casting with UAV GPS/IMU calculates geodetic coordinates.",
      subsystem: "sensor_fusion_node (Stereo Depth + GPS)",
    },
    {
      step: 5,
      title: "PRIORITIZE",
      desc: "Edge Risk Engine synthesizes compound threat rules (e.g. Survivor + Fire proximity escalates to CRITICAL).",
      subsystem: "edge_risk_engine_node (Threat Matrix)",
    },
    {
      step: 6,
      title: "ALERT",
      desc: "Geotagged alert is added to the command-center incident stream.",
      subsystem: "dashboard_adapter_node (Local Wi-Fi / Radio)",
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Title */}
      <div className="bg-[#0d141f] border border-[#1b2738] p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-telemetry-blue" />
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              SYSTEM ARCHITECTURE & SENSOR FUSION PIPELINE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hardware avionics, ROS 2 software stack, and edge perception, fusion, and prioritization flow
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">HARDWARE PLATFORM:</span>
          <span className="text-telemetry-blue font-bold px-2 py-0.5 rounded bg-[#101926] border border-[#21354c]">
            F450 · PIXHAWK · PI 4B (4GB)
          </span>
        </div>
      </div>

      {/* Interactive system walkthrough */}
      <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-4 shadow-xl space-y-4">
        <div className="border-b border-[#182638] pb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            INTERACTIVE SYSTEM WALKTHROUGH
          </h2>
          <span className="text-[10px] text-telemetry-blue font-semibold">
            STEP {activeStep} OF 6 ACTIVE
          </span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                activeStep === s.step
                  ? "bg-[#142336] border-telemetry-blue shadow-[0_0_12px_rgba(0,180,216,0.25)] text-white"
                  : "bg-[#070b10] border-[#162334] text-slate-400 hover:text-slate-200 hover:bg-[#0e1724]"
              }`}
            >
              <div className="text-[10px] font-bold text-telemetry-blue">STEP {s.step}</div>
              <div className="text-xs font-bold mt-0.5">{s.title}</div>
            </button>
          ))}
        </div>

        {/* Active Step Details Banner */}
        <div className="p-4 rounded-lg bg-[#070b10] border border-[#192b3e] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-telemetry-blue text-black font-bold text-xs">
                STEP {activeStep}: {steps[activeStep - 1].title}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                SUBSYSTEM: {steps[activeStep - 1].subsystem}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {steps[activeStep - 1].desc}
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-2">
            <button
              onClick={() => setActiveStep((prev) => (prev > 1 ? prev - 1 : 6))}
              className="px-3 py-1.5 rounded bg-[#101824] hover:bg-[#1a2739] text-slate-300 text-xs border border-slate-700"
            >
              PREV
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev < 6 ? prev + 1 : 1))}
              className="px-3 py-1.5 rounded bg-telemetry-blue hover:bg-telemetry-blueLight text-black font-bold text-xs"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>

      {/* Hardware Architecture Diagram Cards */}
      <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-4 shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#182638] pb-2">
          1. FIXED HARDWARE ARCHITECTURE (F450 PLATFORM)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Propulsion & Airframe */}
          <div className="p-3.5 rounded bg-[#070b10] border border-[#162334] space-y-2">
            <div className="flex items-center justify-between text-telemetry-blue font-bold">
              <span>AIRFRAME & PROPULSION</span>
              <Zap className="w-4 h-4" />
            </div>
            <ul className="text-slate-300 space-y-1.5 text-[11px] list-disc list-inside">
              <li><b>Frame:</b> F450 Glass Fiber Quadcopter</li>
              <li><b>Motors:</b> 4 × A2212 1000 KV BLDC</li>
              <li><b>ESCs:</b> 4 × 30A SimonK Regulators</li>
              <li><b>Propellers:</b> 1045 CW/CCW Nylon</li>
              <li><b>Battery:</b> 3S 11.1V 5200 mAh LiPo</li>
              <li><b>Power Converter:</b> 5V / 5A Buck for Pi 4B</li>
            </ul>
          </div>

          {/* Card 2: Autopilot Unit */}
          <div className="p-3.5 rounded bg-[#070b10] border border-[#162334] space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>AUTOPILOT AVIONICS</span>
              <Server className="w-4 h-4" />
            </div>
            <ul className="text-slate-300 space-y-1.5 text-[11px] list-disc list-inside">
              <li><b>Flight Controller:</b> Pixhawk 2.4.8</li>
              <li><b>Firmware:</b> ArduCopter 4.5.x</li>
              <li><b>Sensors:</b> Dual IMU + Barometer</li>
              <li><b>GNSS:</b> Ublox NEO-M8N + Compass Mast</li>
              <li><b>Radio:</b> 433 MHz SiK Telemetry</li>
              <li><b>Interface:</b> MAVLink over UART</li>
            </ul>
          </div>

          {/* Card 3: Companion & Sensor Suite */}
          <div className="p-3.5 rounded bg-[#070b10] border border-[#162334] space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>COMPANION & SENSORS</span>
              <Cpu className="w-4 h-4" />
            </div>
            <ul className="text-slate-300 space-y-1.5 text-[11px] list-disc list-inside">
              <li><b>Companion:</b> Raspberry Pi 4B 4GB</li>
              <li><b>Storage:</b> 128 GB High Endurance microSD</li>
              <li><b>RGB:</b> Pi Camera Module 3 (1080p30)</li>
              <li><b>Thermal:</b> MLX90640 32×24 Far-Infrared</li>
              <li><b>Stereo:</b> Waveshare AR0144 Sync Global</li>
              <li><b>Comms:</b> Local Wi-Fi + 433MHz MAVLink</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Software Architecture & Data Flow */}
      <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-4 shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#182638] pb-2">
          2. ROS 2 SOFTWARE PIPELINE & DATA FLOW
        </h2>

        {/* Visual ASCII Flow Chart */}
        <div className="p-4 rounded bg-[#06090e] border border-[#152231] overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300">
          <pre className="text-slate-300">
{`PIXHAWK 2.4.8 (ArduCopter)
    │  MAVLink Telemetry (Attitude, Altitude, GPS, Battery)
    ▼
RASPBERRY PI 4B (4GB) ── Ubuntu 22.04 LTS + ROS 2 Humble
    ├── mavlink_bridge_node ─────── Subscribes to MAVLink packets & publishes /uav/telemetry
    ├── rgb_cam_node ────────────── 1080p stream from Pi Camera Module 3
    ├── yolo_detection_node ─────── Runs edge YOLO model: Person, Fire, Smoke, Flood, Debris
    ├── mlx90640_thermal_node ───── Samples 32x24 FIR matrix (8 Hz) over I2C
    ├── ar0144_stereo_depth_node ── Synchronized disparity map & obstacle clearance
    ├── sensor_fusion_node ──────── Fuses RGB Bounding Box + Thermal Peak + Stereo Range + Pose
    ├── edge_risk_engine ───────── Prototype priority rules: Survivor + Fire proximity = CRITICAL
    ├── local_logging_node ──────── Blackbox flight telemetry & incidents recorded to 128GB microSD
    └── dashboard_adapter_node ──── WebSocket JSON & frame stream to Ground Station UI
            │
            ▼
PS4 SEARCH & RESCUE COMMAND CENTER (Next.js / React / TypeScript Dashboard)`}
          </pre>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300/90 leading-relaxed">
        <span className="font-bold block mb-1">
          COMPETITION DEMONSTRATION & STATUS STATEMENT:
        </span>
        The physical UAV prototype is planned for subsequent development and offline demonstration. The current interactive command dashboard runs in strict <b>SIMULATION MODE</b> with a deterministic state engine. All risk prioritization logic represents experimental prototype rules and is not certified against official emergency service standards. Chemical leak detection is planned for future payload sensor revisions.
      </div>
    </div>
  );
}
