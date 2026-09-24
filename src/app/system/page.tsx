"use client";

import React from "react";
import { useMission } from "../../context/MissionContext";
import { PROJECT_BRAND } from "../../config/branding";
import {
  Activity,
  Cpu,
  HardDrive,
  Thermometer,
  Radio,
  Wifi,
  Globe,
  Camera,
  Satellite,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Server,
} from "lucide-react";

export default function SystemHealthPage() {
  const { systemHealth } = useMission();

  const comp = systemHealth.companionComputer;
  const fc = systemHealth.flightController;

  return (
    <div className="space-y-4 pb-8 font-mono">
      {/* Title Bar */}
      <div className="bg-[#0d141f] border border-[#1b2738] p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              SYSTEM HEALTH & HARDWARE DIAGNOSTICS
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulation view of Pixhawk 2.4.8 and Raspberry Pi 4B (4GB) health data
          </p>
        </div>

        {/* Offline Intelligence Resilience Notice */}
        <div className="flex items-center px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <ShieldCheck className="w-4 h-4 mr-2" />
          <span>DESIGNED FOR OFFLINE OPERATION</span>
        </div>
      </div>

      {/* Primary Hardware Subsystems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Companion Computer Card */}
        <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-4 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#172333] pb-2">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-telemetry-blue" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                COMPANION: {comp.model}
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              ROS 2: {comp.ros2Status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">CPU UTILIZATION</span>
              <span className="text-base font-bold text-slate-100">{comp.cpuUsagePercent}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Quad-core Cortex-A72</span>
            </div>

            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">RAM ALLOCATION</span>
              <span className="text-base font-bold text-slate-100">
                {(comp.ramUsedMb / 1024).toFixed(1)} / {(comp.ramTotalMb / 1024).toFixed(1)} GB
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">LPDDR4-3200 SDRAM</span>
            </div>

            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">SoC CORE TEMP</span>
              <span className="text-base font-bold text-amber-400">{comp.socTempCelsius}°C</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Active heatsink nominal</span>
            </div>

            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">128 GB HIGH-ENDURANCE MICROSD</span>
              <span className="text-base font-bold text-slate-100">
                {comp.storageUsedGb} / {comp.storageTotalGb} GB
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">High Endurance Class 10</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d] text-[11px] text-slate-300">
            <span className="text-slate-500 block text-[10px]">SIMULATED ROS 2 NODE SET:</span>
            <span className="text-slate-200">
              mavlink_bridge, yolo_detector, mlx90640_driver, ar0144_stereo, sensor_fusion, risk_engine, local_logger ({comp.activeNodes} nodes)
            </span>
          </div>
        </div>

        {/* Flight Controller Card */}
        <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-4 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#172333] pb-2">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                AUTOPILOT: {fc.model}
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              MAVLINK PATH: SIMULATED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">FIRMWARE</span>
              <span className="text-sm font-bold text-slate-100">{fc.firmware}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Extended Kalman Filter 3</span>
            </div>

            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">POWER RAIL</span>
              <span className="text-base font-bold text-emerald-400">{fc.voltageRailV} V</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">5V/5A Regulated Buck</span>
            </div>

            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">DUAL IMU STATUS</span>
              <span className="text-sm font-bold text-emerald-400">{fc.imuState}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Accels & Gyros Calibrated</span>
            </div>

            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">EXTERNAL COMPASS</span>
              <span className="text-sm font-bold text-emerald-400">{fc.compassState}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Isolated mast mounting</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d] text-[11px] text-slate-300">
            <span className="text-slate-500 block text-[10px]">FAIL-SAFE MODEL:</span>
            <span className="text-slate-200">
              Low Battery RTL at 20% · Geofence Breach Land · Radio Loss Failsafe Engaged
            </span>
          </div>
        </div>
      </div>

      {/* Sensor Suite Diagnostics */}
      <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-4 shadow-xl space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#172333] pb-2">
          PERCEPTION & TELEMETRY HARDWARE STATUS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* RGB */}
          <div className="p-3 rounded bg-[#070b10] border border-[#141f2d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center">
                <Camera className="w-3.5 h-3.5 text-telemetry-blue mr-1.5" />
                RGB Optical
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[11px] text-slate-400">{systemHealth.sensors.rgbCamera.name}</div>
            <div className="text-[10px] text-slate-500">{systemHealth.sensors.rgbCamera.details}</div>
          </div>

          {/* Thermal */}
          <div className="p-3 rounded bg-[#070b10] border border-[#141f2d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center">
                <Thermometer className="w-3.5 h-3.5 text-red-400 mr-1.5" />
                Thermal FIR
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[11px] text-slate-400">{systemHealth.sensors.thermalSensor.name}</div>
            <div className="text-[10px] text-slate-500">{systemHealth.sensors.thermalSensor.details}</div>
          </div>

          {/* Stereo */}
          <div className="p-3 rounded bg-[#070b10] border border-[#141f2d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center">
                <Layers className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
                Stereo Depth
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[11px] text-slate-400">{systemHealth.sensors.stereoCamera.name}</div>
            <div className="text-[10px] text-slate-500">{systemHealth.sensors.stereoCamera.details}</div>
          </div>

          {/* GPS */}
          <div className="p-3 rounded bg-[#070b10] border border-[#141f2d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center">
                <Satellite className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                Geodetic GNSS
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">LOCKED</span>
            </div>
            <div className="text-[11px] text-slate-400">{systemHealth.sensors.gpsModule.name}</div>
            <div className="text-[10px] text-slate-500">{systemHealth.sensors.gpsModule.details}</div>
          </div>
        </div>
      </div>

      {/* Communications & Link Infrastructure */}
      <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-4 shadow-xl space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#172333] pb-2">
          COMMUNICATIONS & LINK ARCHITECTURE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded bg-[#070b10] border border-[#141f2d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center">
                <Radio className="w-3.5 h-3.5 text-sky-400 mr-1.5" />
                433 MHz MAVLink Radio
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
            </div>
            <div className="text-[11px] text-slate-400">SiK Transceiver (1.5km LOS range)</div>
            <div className="text-[10px] text-slate-500">Low-latency bidirectional flight telemetry</div>
          </div>

          <div className="p-3 rounded bg-[#070b10] border border-[#141f2d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center">
                <Wifi className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                Local 5GHz Wi-Fi Telemetry
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
            </div>
            <div className="text-[11px] text-slate-400">Local ground-station link</div>
            <div className="text-[10px] text-slate-500">Telemetry and sensor-data transport</div>
          </div>

          <div className="p-3 rounded bg-[#070b10] border border-[#141f2d] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center">
                <Globe className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                Internet Connectivity
              </span>
              <span className="text-[10px] text-amber-400 font-bold">OPTIONAL</span>
            </div>
            <div className="text-[11px] text-slate-400">Disaster Zone Offline Autonomy</div>
            <div className="text-[10px] text-slate-500">Core aircraft-side processing is designed to run without internet access</div>
          </div>
        </div>
      </div>
    </div>
  );
}
