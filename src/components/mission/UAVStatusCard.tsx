"use client";

import React from "react";
import { useMission } from "../../context/MissionContext";
import {
  Compass,
  Gauge,
  BatteryCharging,
  Satellite,
  Radio,
  ArrowUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function UAVStatusCard() {
  const { telemetry } = useMission();

  return (
    <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-3.5 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172333] pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-telemetry-blue animate-pulse" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            UAV STATUS & AVIONICS
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101926] border border-[#21354c] text-sky-400 font-semibold">
          MODE: {telemetry.mode}
        </span>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 text-xs font-mono">
        {/* Battery */}
        <div className="p-2 rounded bg-[#070b10] border border-[#141f2c]">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>BATTERY</span>
            <BatteryCharging className="w-3 h-3 text-nominal" />
          </div>
          <div className="text-base font-bold text-slate-100 mt-0.5">
            {telemetry.batteryPercent}%
          </div>
          <div className="text-[10px] text-slate-400">
            {telemetry.batteryVoltage} V · {telemetry.batteryCurrent} A
          </div>
        </div>

        {/* Altitude */}
        <div className="p-2 rounded bg-[#070b10] border border-[#141f2c]">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>ALTITUDE AGL</span>
            <ArrowUp className="w-3 h-3 text-telemetry-blue" />
          </div>
          <div className="text-base font-bold text-slate-100 mt-0.5">
            {telemetry.altitudeMeters.toFixed(1)} <span className="text-xs font-normal text-slate-400">m</span>
          </div>
          <div className="text-[10px] text-slate-400">
            V-Speed: {telemetry.verticalSpeedMs > 0 ? `+${telemetry.verticalSpeedMs.toFixed(1)}` : telemetry.verticalSpeedMs.toFixed(1)} m/s
          </div>
        </div>

        {/* Ground Speed */}
        <div className="p-2 rounded bg-[#070b10] border border-[#141f2c]">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>GROUND SPEED</span>
            <Gauge className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-base font-bold text-slate-100 mt-0.5">
            {telemetry.groundSpeedMs.toFixed(1)} <span className="text-xs font-normal text-slate-400">m/s</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {((telemetry.groundSpeedMs * 3.6).toFixed(1))} km/h
          </div>
        </div>

        {/* Heading & Compass */}
        <div className="p-2 rounded bg-[#070b10] border border-[#141f2c]">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>HEADING</span>
            <Compass className="w-3 h-3 text-amber-400" />
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="text-base font-bold text-slate-100">
              {telemetry.headingDegrees}°
            </span>
            {/* Visual Mini Compass Needle */}
            <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center relative">
              <div
                className="w-0.5 h-3 bg-red-500 rounded-full transition-transform duration-300"
                style={{ transform: `rotate(${telemetry.headingDegrees}deg)` }}
              />
            </div>
          </div>
          <div className="text-[10px] text-slate-400">
            P: {telemetry.pitchDegrees}° · R: {telemetry.rollDegrees}°
          </div>
        </div>
      </div>

      {/* GPS & Navigation Subsystem Readout */}
      <div className="mt-3 p-2.5 rounded bg-[#070b10] border border-[#141f2c] text-[11px] font-mono space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center">
            <Satellite className="w-3.5 h-3.5 text-telemetry-blue mr-1.5" />
            GPS FIX:
          </span>
          <span className="text-nominal font-bold">
            {telemetry.gpsStatus} ({telemetry.satelliteCount} SATS)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center">
            <Radio className="w-3.5 h-3.5 text-sky-400 mr-1.5" />
            MAVLINK RADIO:
          </span>
          <span className="text-slate-200">
            {telemetry.linkStatus} · {telemetry.rssiPercent}% RSSI
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#121c27] text-[10px]">
          <span className="text-slate-500">COORDINATES:</span>
          <span className="text-slate-300 font-mono">
            {telemetry.latitude.toFixed(5)}° N, {telemetry.longitude.toFixed(5)}° E
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-500">PIXHAWK ARM:</span>
          <span className={telemetry.armed ? "text-emerald-400 font-bold" : "text-slate-400"}>
            {telemetry.armed ? "ARMED (PROPS LIVE)" : "DISARMED"}
          </span>
        </div>
      </div>
    </div>
  );
}
