"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROJECT_BRAND } from "../config/branding";
import { useMission } from "../context/MissionContext";
import {
  Radio,
  Navigation,
  Compass,
  Volume2,
  VolumeX,
  Gauge,
  Layers,
  History,
  Activity,
  Cpu,
  ShieldAlert,
  Flame,
} from "lucide-react";

export function TopBar() {
  const pathname = usePathname();
  const {
    telemetry,
    progress,
    speedMultiplier,
    setSpeedMultiplier,
    audioEnabled,
    setAudioEnabled,
  } = useMission();

  const navLinks = [
    { href: "/", label: "Mission Control", icon: Navigation },
    { href: "/detections", label: "Detections", icon: ShieldAlert, badge: progress.detectionsCount },
    { href: "/history", label: "Mission History", icon: History },
    { href: "/system", label: "System Health", icon: Activity },
    { href: "/architecture", label: "Architecture", icon: Cpu },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SEARCHING":
        return "bg-telemetry-blue/20 text-telemetry-blue border-telemetry-blue/40 animate-pulse";
      case "ARMED":
      case "TAKEOFF":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
      case "EMERGENCY":
        return "bg-critical text-white border-critical animate-bounce font-bold";
      case "RETURNING":
      case "LANDING":
        return "bg-warning/20 text-warning border-warning/40";
      case "COMPLETED":
        return "bg-nominal/20 text-nominal border-nominal/40";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080d14]/95 backdrop-blur-md border-b border-[#1b2738]">
      {/* Topmost System Status Ticker */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#05080d] border-b border-[#131c28] text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-slate-300 font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-telemetry-blue animate-ping mr-1.5" />
            {PROJECT_BRAND.teamName} · {PROJECT_BRAND.teamId}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">
            {PROJECT_BRAND.competition} · {PROJECT_BRAND.problemStatement.split(":")[0]}
          </span>
        </div>

        {/* Prominent SIMULATION MODE Warning Banner */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold tracking-wide text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
            {PROJECT_BRAND.simulationNotice}
          </div>

          <div className="hidden md:flex items-center space-x-3 text-slate-400">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-nominal mr-1" />
              GPS: {telemetry.gpsStatus} ({telemetry.satelliteCount} SAT)
            </span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-nominal mr-1" />
              LINK: {telemetry.linkStatus} (433MHz)
            </span>
            <span className="text-slate-500">
              SIMULATION DATA: LOCAL
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Brand / Project Identity */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Custom Abstract Geometric Logo Symbol */}
            <div className="relative w-8 h-8 rounded bg-gradient-to-br from-telemetry-blue/20 to-telemetry-blueDark/40 border border-telemetry-blue/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,180,216,0.2)]">
              <div className="w-3.5 h-3.5 border-2 border-telemetry-blue rotate-45 group-hover:rotate-90 transition-transform duration-500" />
              <div className="absolute w-1.5 h-1.5 bg-nominal rounded-full" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-wider text-white font-mono uppercase">
                  {PROJECT_BRAND.projectName}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                  {PROJECT_BRAND.version}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-tight">
                {PROJECT_BRAND.subtitle}
              </div>
            </div>
          </Link>

          {/* Mission Indicator Badge */}
          <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-[#1c293a]">
            <span className="text-[11px] font-mono text-slate-400">MISSION:</span>
            <span className="text-[12px] font-mono font-bold text-white bg-[#101824] px-2 py-0.5 rounded border border-[#22354c]">
              {progress.missionId}
            </span>
            <span
              className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${getStatusColor(
                progress.status
              )}`}
            >
              {progress.status}
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#141f2e] text-white border border-telemetry-blue/40 shadow-[0_0_10px_rgba(0,180,216,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0e1622]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-telemetry-blue" : "text-slate-500"}`} />
                <span>{item.label}</span>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-critical/20 text-critical border border-critical/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Simulation Controls & Audio Toggle */}
        <div className="flex items-center space-x-2">
          {/* Speed Multiplier */}
          <div className="hidden sm:flex items-center bg-[#0d141e] border border-[#1d2b3c] rounded px-1.5 py-0.5 text-[11px] font-mono">
            <span className="text-slate-500 mr-1.5 text-[10px]">SPEED:</span>
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                  speedMultiplier === spd
                    ? "bg-telemetry-blue text-black font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Audio Chime Mute/Unmute */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? "Mute tactical audio alerts" : "Enable tactical audio alerts"}
            className={`p-1.5 rounded border text-xs transition-colors ${
              audioEnabled
                ? "bg-[#101824] border-telemetry-blue/30 text-telemetry-blue hover:bg-[#162233]"
                : "bg-[#101824] border-slate-700 text-slate-500 hover:text-slate-300"
            }`}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Bar */}
      <div className="flex md:hidden items-center justify-around px-2 py-1.5 bg-[#0a0f17] border-t border-[#151f2b] text-[11px]">
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded ${
                isActive ? "text-telemetry-blue" : "text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
