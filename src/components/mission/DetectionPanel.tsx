"use client";

import React from "react";
import { useMission } from "../../context/MissionContext";
import { IncidentDetection } from "../../types";
import { getPriorityColor } from "../../lib/utils";
import {
  ShieldAlert,
  Flame,
  UserCheck,
  MapPin,
  Thermometer,
  Ruler,
  Clock,
  Eye,
  ChevronRight,
} from "lucide-react";

export function DetectionPanel() {
  const {
    incidents,
    selectedIncident,
    setSelectedIncident,
    setMapCenterTarget,
  } = useMission();

  const handleViewOnMap = (e: React.MouseEvent, inc: IncidentDetection) => {
    e.stopPropagation();
    setMapCenterTarget({ lat: inc.latitude, lon: inc.longitude, zoom: 19 });
  };

  return (
    <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-3.5 shadow-md flex flex-col h-full max-h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172333] pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-critical" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            DETECTED INCIDENTS & HAZARDS ({incidents.length})
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          FUSED (RGB+THERMAL+DEPTH)
        </span>
      </div>

      {/* Incident Cards Stream */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {incidents.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-center p-4 rounded bg-[#070b10] border border-[#141f2c] text-xs font-mono text-slate-500">
            <ShieldAlert className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
            <p>NO ACTIVE INCIDENTS DETECTED</p>
            <p className="text-[10px] text-slate-600 mt-1">
              Start the simulation to run the multi-modal detection sequence
            </p>
          </div>
        ) : (
          incidents.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            const prioStyle = getPriorityColor(inc.priority);
            const isSurvivor = inc.class === "SURVIVOR";
            const isFire = inc.class === "FIRE";

            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#111c2a] border-telemetry-blue shadow-[0_0_15px_rgba(0,180,216,0.25)]"
                    : "bg-[#070b10] hover:bg-[#0e1724] border-[#162334]"
                }`}
              >
                {/* Top Row: Class & Priority Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                        isSurvivor
                          ? "bg-nominal/20 text-nominal border border-nominal/40"
                          : isFire
                          ? "bg-critical/20 text-critical border border-critical/40"
                          : "bg-warning/20 text-warning border border-warning/40"
                      }`}
                    >
                      {isSurvivor ? "S" : isFire ? "F" : "!"}
                    </span>
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-100">
                        {inc.class}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 ml-2">
                        {inc.id}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${prioStyle.border} ${prioStyle.bg} ${prioStyle.text}`}
                  >
                    {inc.priority}
                  </span>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-400 my-2">
                  <div className="flex items-center space-x-1.5">
                    <Eye className="w-3 h-3 text-telemetry-blue" />
                    <span>MODEL CONF: {(inc.confidence * 100).toFixed(0)}%</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Thermometer className="w-3 h-3 text-red-400" />
                    <span className={inc.thermalConfirmed ? "text-emerald-400 font-semibold" : ""}>
                      FIR: {inc.thermalConfirmed ? `${inc.thermalPeakTemp || 34.8}°C` : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Ruler className="w-3 h-3 text-cyan-400" />
                    <span>RANGE: {inc.distanceMeters}m</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{inc.timestamp}</span>
                  </div>
                </div>

                {/* Coordinates & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#121c27] text-[10px] font-mono">
                  <span className="text-slate-400 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-slate-500" />
                    {inc.latitude.toFixed(5)}, {inc.longitude.toFixed(5)}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleViewOnMap(e, inc)}
                      className="px-2 py-0.5 rounded bg-[#101c2a] hover:bg-[#1a2d44] text-sky-400 border border-sky-500/30 transition-colors"
                    >
                      VIEW ON MAP
                    </button>
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="px-2 py-0.5 rounded bg-[#131d2b] hover:bg-[#1d2b3e] text-slate-300 border border-slate-700 transition-colors"
                    >
                      DETAILS
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
