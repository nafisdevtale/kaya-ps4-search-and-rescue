"use client";

import React, { useEffect, useRef } from "react";
import { useMission } from "../../context/MissionContext";
import { Thermometer, Flame, UserCheck, AlertCircle } from "lucide-react";

export function ThermalSensorPanel() {
  const { thermalFrame, incidents } = useMission();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert temperature to Ironbow/Inferno RGB color
  const getIronbowColor = (temp: number, min: number, max: number): [number, number, number] => {
    const range = Math.max(max - min, 1);
    const norm = Math.max(0, Math.min(1, (temp - min) / range));

    // Multi-stop heat colormap: Dark Blue -> Purple -> Red -> Orange -> Yellow -> White
    if (norm < 0.2) {
      const t = norm / 0.2;
      return [Math.round(15 + 40 * t), Math.round(20 + 20 * t), Math.round(80 + 100 * t)];
    } else if (norm < 0.4) {
      const t = (norm - 0.2) / 0.2;
      return [Math.round(55 + 100 * t), Math.round(40 + 10 * t), Math.round(180 - 80 * t)];
    } else if (norm < 0.7) {
      const t = (norm - 0.4) / 0.3;
      return [Math.round(155 + 90 * t), Math.round(50 + 60 * t), Math.round(100 - 80 * t)];
    } else if (norm < 0.9) {
      const t = (norm - 0.7) / 0.2;
      return [Math.round(245 + 10 * t), Math.round(110 + 110 * t), Math.round(20 + 10 * t)];
    } else {
      const t = (norm - 0.9) / 0.1;
      return [255, 255, Math.round(30 + 225 * t)];
    }
  };

  // Render authentic 32x24 low-res pixel grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !thermalFrame || !thermalFrame.matrix) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rows = thermalFrame.rows;
    const cols = thermalFrame.cols;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const temp = thermalFrame.matrix[r]?.[c] ?? thermalFrame.minTemp;
        const [red, green, blue] = getIronbowColor(temp, thermalFrame.minTemp, thermalFrame.maxTemp);

        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);

        // Pixel grid separation line for genuine MLX90640 low-resolution look
        ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(c * cellW, r * cellH, cellW, cellH);
      }
    }

    // Draw hotspot indicator crosshair if detected
    if (thermalFrame.hotspotLocation) {
      const hx = thermalFrame.hotspotLocation.col * cellW + cellW / 2;
      const hy = thermalFrame.hotspotLocation.row * cellH + cellH / 2;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hx, hy, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`${thermalFrame.hotspotLocation.temp.toFixed(1)}°C`, hx + 12, hy + 3);
    }
  }, [thermalFrame]);

  const hasSurvivor = incidents.some((i) => i.class === "SURVIVOR");
  const hasFire = incidents.some((i) => i.class === "FIRE");

  return (
    <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-3 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172333] pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-red-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            THERMAL SENSOR (MLX90640)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
          SIMULATED 32×24
        </span>
      </div>

      {/* 32x24 Canvas Matrix */}
      <div className="relative w-full h-[180px] bg-[#05080c] rounded border border-[#162232] overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} width={380} height={180} className="w-full h-full object-cover" />

        {/* Tactical On-Screen Display (OSD) */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-200 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          ARRAY: 32×24 FIR · 8 Hz
        </div>

        <div className="absolute top-2 right-2 text-[10px] font-mono text-red-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm font-bold">
          PEAK: {thermalFrame.maxTemp.toFixed(1)}°C
        </div>

        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          RANGE: {thermalFrame.minTemp.toFixed(1)}°C - {thermalFrame.maxTemp.toFixed(1)}°C
        </div>

        <div className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          {hasSurvivor ? (
            <span className="text-emerald-400 font-bold flex items-center">
              <UserCheck className="w-3 h-3 mr-1" /> HUMAN HEAT: CONFIRMED
            </span>
          ) : hasFire ? (
            <span className="text-red-400 font-bold flex items-center">
              <Flame className="w-3 h-3 mr-1" /> FIRE HOTSPOT: ACTIVE
            </span>
          ) : (
            <span className="text-slate-400">AMBER BACKGROUND SCAN</span>
          )}
        </div>
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
        <span className="flex items-center">
          HOTSPOT: {thermalFrame.hotspotLocation ? (
            <span className="text-amber-400 font-bold ml-1">DETECTED (R{thermalFrame.hotspotLocation.row}, C{thermalFrame.hotspotLocation.col})</span>
          ) : (
            <span className="text-slate-500 ml-1">NOMINAL</span>
          )}
        </span>
        <span className={hasSurvivor ? "text-emerald-400 font-semibold" : "text-slate-500"}>
          {hasSurvivor ? "34.8°C BODY HEAT VERIFIED" : "NO CRITICAL ANOMALY"}
        </span>
      </div>
    </div>
  );
}
