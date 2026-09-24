"use client";

import React, { useState } from "react";
import { useMission } from "../../context/MissionContext";
import { SCENARIOS } from "../../simulation/scenarios";
import {
  Play,
  Pause,
  RotateCcw,
  Navigation2,
  AlertTriangle,
  RotateCw,
  Compass,
  CheckCircle2,
  Clock,
  Battery,
} from "lucide-react";
import { formatTime } from "../../lib/utils";

export function TopMissionControls() {
  const {
    progress,
    telemetry,
    selectedScenarioId,
    setSelectedScenarioId,
    startMission,
    pauseMission,
    resumeMission,
    returnToLaunch,
    triggerEmergency,
    resetMission,
  } = useMission();

  const [confirmEmergency, setConfirmEmergency] = useState(false);

  const isRunning =
    progress.status === "INITIALIZING" ||
    progress.status === "ARMED" ||
    progress.status === "TAKEOFF" ||
    progress.status === "SEARCHING" ||
    progress.status === "RETURNING";

  const isPaused = progress.status === "PAUSED";
  const isEmergency = progress.status === "EMERGENCY";

  const handleEmergencyClick = () => {
    if (!confirmEmergency) {
      setConfirmEmergency(true);
      setTimeout(() => setConfirmEmergency(false), 5000);
    } else {
      triggerEmergency();
      setConfirmEmergency(false);
    }
  };

  return (
    <div className="w-full bg-[#0d141f] border border-[#1b2738] rounded-lg p-3 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Scenario Selector & Drill Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              DEMONSTRATION DRILL SCENARIO:
            </label>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              disabled={isRunning}
              className="bg-[#080d14] border border-[#22354c] rounded px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-telemetry-blue disabled:opacity-50 cursor-pointer"
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.tagline})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Metrics Chips */}
          <div className="flex items-center space-x-2 pt-3 sm:pt-0">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#090f17] border border-[#1b2839] rounded text-[11px] font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-telemetry-blue" />
              <span>{formatTime(progress.elapsedTimeSeconds)}</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#090f17] border border-[#1b2839] rounded text-[11px] font-mono text-slate-300">
              <Battery className="w-3.5 h-3.5 text-nominal" />
              <span>{telemetry.batteryPercent}% ({telemetry.batteryVoltage}V)</span>
            </div>
          </div>
        </div>

        {/* Right: Simulation Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isRunning && !isPaused ? (
            <button
              onClick={startMission}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START MISSION</span>
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeMission}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>RESUME</span>
            </button>
          ) : (
            <button
              onClick={pauseMission}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-black font-mono text-xs font-bold transition-all active:scale-95"
            >
              <Pause className="w-4 h-4 fill-black" />
              <span>PAUSE</span>
            </button>
          )}

          <button
            onClick={returnToLaunch}
            disabled={!isRunning || progress.status === "RETURNING" || progress.status === "COMPLETED"}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md bg-[#131d2b] hover:bg-[#1a2739] text-sky-400 border border-sky-500/30 font-mono text-xs font-medium disabled:opacity-40 transition-colors"
            title="Command UAV Return To Launch"
          >
            <Navigation2 className="w-3.5 h-3.5" />
            <span>RTL</span>
          </button>

          <button
            onClick={resetMission}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-md bg-[#101824] hover:bg-[#172233] text-slate-400 hover:text-slate-200 border border-[#203147] font-mono text-xs font-medium transition-colors"
            title="Reset Simulation State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          {/* Emergency Failsafe Trigger */}
          <button
            onClick={handleEmergencyClick}
            disabled={isEmergency}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md font-mono text-xs font-bold transition-all ${
              confirmEmergency
                ? "bg-red-700 hover:bg-red-800 text-white border border-red-500 animate-pulse"
                : isEmergency
                ? "bg-red-950/60 text-red-500 border border-red-800/50 cursor-not-allowed"
                : "bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/40"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{confirmEmergency ? "CONFIRM EMERGENCY?" : isEmergency ? "EMERGENCY ACTIVE" : "EMERGENCY"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
