"use client";

import React from "react";
import { useMission } from "../../context/MissionContext";
import { Radar, Shield, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";

export function StereoDepthPanel() {
  const { stereoData } = useMission();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CRITICAL":
        return {
          bg: "bg-critical/20 text-critical border-critical/40 animate-pulse",
          text: "CRITICAL COLLISION RISK (<1.0m)",
          icon: AlertOctagon,
        };
      case "WARNING":
        return {
          bg: "bg-warning/20 text-warning border-warning/40",
          text: "OBSTACLE PROXIMITY WARNING (<2.0m)",
          icon: AlertTriangle,
        };
      default:
        return {
          bg: "bg-nominal/20 text-nominal border-nominal/40",
          text: "OBSTACLE CLEARANCE SAFE (>2.0m)",
          icon: CheckCircle2,
        };
    }
  };

  const badge = getStatusBadge(stereoData.status);
  const StatusIcon = badge.icon;

  return (
    <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-3 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172333] pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Radar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            STEREO DEPTH & OBSTACLE RADAR
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
          AR0144 STEREO
        </span>
      </div>

      {/* Disparity & Radar Visualization Box */}
      <div className="relative w-full h-[180px] bg-[#05080c] rounded border border-[#162232] p-3 flex flex-col justify-between overflow-hidden">
        {/* Top Readout */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400">
            NEAREST OBSTACLE:
            <div className="text-xl font-bold font-mono text-slate-100 mt-0.5">
              {stereoData.nearestObstacleMeters.toFixed(1)}{" "}
              <span className="text-xs font-normal text-slate-400">m</span>
            </div>
          </div>

          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border text-[10px] font-mono font-bold ${badge.bg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{stereoData.status}</span>
          </div>
        </div>

        {/* Disparity Histogram */}
        <div className="my-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
            <span>STEREO DISPARITY DEPTH SLICES (0.5m - 20m)</span>
            <span>BEARING: {stereoData.bearingToObstacleDeg}°</span>
          </div>
          <div className="flex items-end space-x-1.5 h-16 pt-2">
            {stereoData.disparityHistogram.map((val, idx) => {
              const heightPct = Math.min(100, Math.max(15, (val / 120) * 100));
              const isClose = idx < 2 && stereoData.nearestObstacleMeters < 5;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isClose
                        ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        : "bg-cyan-600/70 hover:bg-cyan-500"
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    {idx * 2 + 1}m
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Specs */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-[#131d2a] pt-1">
          <span>FORWARD CLEARANCE: {stereoData.forwardClearanceMeters}m</span>
          <span>GLOBAL SHUTTER SYNC: 100%</span>
        </div>
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
        <span>COLLISION AVOIDANCE: ARMED</span>
        <span className="text-slate-300">
          DISPARITY COMPUTE: LOCAL PI 4B
        </span>
      </div>
    </div>
  );
}
