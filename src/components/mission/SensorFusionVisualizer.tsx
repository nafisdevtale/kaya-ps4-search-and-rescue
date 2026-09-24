"use client";

import React from "react";
import { useMission } from "../../context/MissionContext";
import {
  Sparkles,
  Camera,
  Thermometer,
  Ruler,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function SensorFusionVisualizer() {
  const { incidents, selectedIncident } = useMission();

  // Highlight selected incident, or default to the most critical active incident (e.g. Survivor INC-0042)
  const targetIncident =
    selectedIncident || incidents.find((i) => i.class === "SURVIVOR") || incidents[0];

  return (
    <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-3.5 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172333] pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-telemetry-blue" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            MULTI-MODAL SENSOR FUSION ENGINE
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-telemetry-blue/10 border border-telemetry-blue/30 text-telemetry-blue font-semibold">
          ANOMALY FUSION PIPELINE
        </span>
      </div>

      {/* Visual Pipeline Chain */}
      {targetIncident ? (
        <div className="space-y-3">
          <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span>TARGET: <b className="text-white">{targetIncident.id}</b> ({targetIncident.class})</span>
            <span className="text-emerald-400 font-bold">TRIAGE PRIORITY: {targetIncident.priority}</span>
          </div>

          {/* 4 Sensor Modalities Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            {/* 1. RGB Modality */}
            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2c]">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>1. RGB OPTICAL</span>
                <Camera className="w-3 h-3 text-telemetry-blue" />
              </div>
              <div className="text-xs font-bold text-slate-100 mt-1">
                PERSON CANDIDATE
              </div>
              <div className="text-[10px] text-telemetry-blue font-semibold mt-0.5">
                CONF: {(targetIncident.confidence * 100).toFixed(0)}%
              </div>
            </div>

            {/* 2. Thermal Modality */}
            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2c]">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>2. THERMAL FIR</span>
                <Thermometer className="w-3 h-3 text-red-400" />
              </div>
              <div className="text-xs font-bold text-slate-100 mt-1">
                HEAT SIGNATURE
              </div>
              <div className={`text-[10px] font-semibold mt-0.5 ${targetIncident.thermalConfirmed ? "text-emerald-400" : "text-slate-500"}`}>
                {targetIncident.thermalConfirmed ? `CONFIRMED (${targetIncident.thermalPeakTemp || 34.8}°C)` : "UNCONFIRMED"}
              </div>
            </div>

            {/* 3. Stereo Depth Modality */}
            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2c]">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>3. STEREO DEPTH</span>
                <Ruler className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="text-xs font-bold text-slate-100 mt-1">
                DISPARITY RANGE
              </div>
              <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                DISTANCE: {targetIncident.distanceMeters}m
              </div>
            </div>

            {/* 4. GPS/IMU Pose Modality */}
            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2c]">
              <div className="text-slate-400 flex items-center justify-between text-[10px]">
                <span>4. GPS/IMU POSE</span>
                <Compass className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-xs font-bold text-slate-100 mt-1">
                GEODETIC RAYCAST
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                POSE: 3D ACCURATE
              </div>
            </div>
          </div>

          {/* Fusion Outcome Bar */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-[#0d1e30] via-[#10253d] to-[#0c1826] border border-telemetry-blue/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-[0_0_15px_rgba(0,180,216,0.15)]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400">
                  FUSED COMPOSITE RESULT:
                </div>
                <div className="text-sm font-bold font-mono text-white flex items-center space-x-2">
                  <span>{targetIncident.class} VERIFIED</span>
                  <span className="text-emerald-400 text-xs">
                    (Confidence: {(targetIncident.fusionBreakdown.fusedScore * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono">
              <span className="text-slate-400 block text-[10px]">GEO-TAG:</span>
              <span className="text-slate-200">
                {targetIncident.latitude.toFixed(5)}° N, {targetIncident.longitude.toFixed(5)}° E
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-32 flex flex-col items-center justify-center text-center p-4 rounded bg-[#070b10] border border-[#141f2c] text-xs font-mono text-slate-500">
          <Sparkles className="w-6 h-6 mb-2 opacity-30 text-telemetry-blue" />
          <p>FUSION ENGINE STANDBY</p>
          <p className="text-[10px] text-slate-600 mt-1">
            Correlates RGB bounding vectors, MLX90640 thermal isotherms, and AR0144 stereo range
          </p>
        </div>
      )}
    </div>
  );
}
