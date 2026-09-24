"use client";

import React from "react";
import { useMission } from "../../context/MissionContext";
import { formatTime } from "../../lib/utils";
import {
  Activity,
  Target,
  MapPin,
  Users,
  Flame,
  Clock,
  Layers,
} from "lucide-react";

export function MissionProgressCard() {
  const { progress } = useMission();

  return (
    <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-3.5 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172333] pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            SEARCH MISSION PROGRESS
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
          {progress.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs font-mono mb-1">
          <span className="text-slate-400">AREA COVERAGE:</span>
          <span className="text-telemetry-blue font-bold">{progress.progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#070b10] border border-[#141f2c] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-telemetry-blue to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,180,216,0.5)]"
            style={{ width: `${progress.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-[#070b10] border border-[#141f2c]">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>WAYPOINTS</span>
            <Target className="w-3 h-3 text-telemetry-blue" />
          </div>
          <div className="text-sm font-bold text-slate-100 mt-0.5">
            {progress.waypointsCompleted} / {progress.totalWaypoints}
          </div>
          <div className="text-[10px] text-slate-400">
            {progress.waypointsCompleted >= progress.totalWaypoints ? "Sweep Complete" : "In Progress"}
          </div>
        </div>

        <div className="p-2 rounded bg-[#070b10] border border-[#141f2c]">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>AREA SWEPT</span>
            <Layers className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-slate-100 mt-0.5">
            {progress.areaCoveredHa.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">ha</span>
          </div>
          <div className="text-[10px] text-slate-400">
            of {progress.totalAreaHa.toFixed(1)} ha total
          </div>
        </div>

        <div className="p-2 rounded bg-[#070b10] border border-[#141f2c]">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>SURVIVORS</span>
            <Users className="w-3 h-3 text-nominal" />
          </div>
          <div className="text-sm font-bold text-nominal mt-0.5">
            {progress.survivorsCount} CONFIRMED
          </div>
          <div className="text-[10px] text-slate-400">
            Thermal verified
          </div>
        </div>

        <div className="p-2 rounded bg-[#070b10] border border-[#141f2c]">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>HAZARDS</span>
            <Flame className="w-3 h-3 text-hazard-orange" />
          </div>
          <div className="text-sm font-bold text-hazard-orange mt-0.5">
            {progress.hazardsCount} DETECTED
          </div>
          <div className="text-[10px] text-slate-400">
            Fire / Debris / Smoke
          </div>
        </div>
      </div>
    </div>
  );
}
