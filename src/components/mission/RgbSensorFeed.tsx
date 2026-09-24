"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMission } from "../../context/MissionContext";
import { Camera } from "lucide-react";

export function RgbSensorFeed() {
  const { progress, incidents, telemetry } = useMission();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  // Animate the simulated optical feed with camera grain, HUD, and detection boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Base terrain simulation (Disaster rubble gradient)
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#121921");
      grad.addColorStop(0.5, "#182330");
      grad.addColorStop(1, "#0d131a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. Simulated Rubble & Structural Contours
      ctx.strokeStyle = "rgba(40, 60, 80, 0.4)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, h * 0.3 + i * 30 + Math.sin(frame * 0.02 + i) * 3);
        ctx.lineTo(w, h * 0.35 + i * 28 + Math.cos(frame * 0.02 + i) * 3);
        ctx.stroke();
      }

      // 3. Central Target Crosshair & HUD Reticle
      ctx.strokeStyle = "rgba(0, 180, 216, 0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Center Circle
      ctx.arc(w / 2, h / 2, 35, 0, Math.PI * 2);
      ctx.stroke();

      // Corner Brackets
      const bracketSize = 14;
      const margin = 20;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(margin, margin + bracketSize);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + bracketSize, margin);
      // Top-Right
      ctx.moveTo(w - margin - bracketSize, margin);
      ctx.lineTo(w - margin, margin);
      ctx.lineTo(w - margin, margin + bracketSize);
      // Bottom-Left
      ctx.moveTo(margin, h - margin - bracketSize);
      ctx.lineTo(margin, h - margin);
      ctx.lineTo(margin + bracketSize, h - margin);
      // Bottom-Right
      ctx.moveTo(w - margin - bracketSize, h - margin);
      ctx.lineTo(w - margin, h - margin);
      ctx.lineTo(w - margin, h - margin - bracketSize);
      ctx.stroke();

      // 4. Draw detection boxes from active incidents
      const hasSurvivor = incidents.some((i) => i.class === "SURVIVOR" || i.class === "PERSON");
      const hasFire = incidents.some((i) => i.class === "FIRE");

      if (hasSurvivor) {
        // Draw PERSON / SURVIVOR Bounding Box
        const bx = w * 0.38 + Math.sin(frame * 0.03) * 2;
        const by = h * 0.36 + Math.cos(frame * 0.03) * 2;
        const bw = 70;
        const bh = 100;

        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh);

        // Label Tag
        ctx.fillStyle = "#10b981";
        ctx.fillRect(bx, by - 18, 96, 18);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 10px monospace";
        ctx.fillText("SURVIVOR 0.96", bx + 4, by - 5);
      }

      if (hasFire) {
        // Draw FIRE Bounding Box
        const fx = w * 0.62 + Math.sin(frame * 0.04) * 2;
        const fy = h * 0.42;
        const fw = 80;
        const fh = 70;

        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.strokeRect(fx, fy, fw, fh);

        ctx.fillStyle = "#ef4444";
        ctx.fillRect(fx, fy - 18, 75, 18);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px monospace";
        ctx.fillText("FIRE 0.93", fx + 4, fy - 5);
      }

      // 5. Film Grain Simulation
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 32) {
        const noise = (Math.random() - 0.5) * 12;
        data[i] += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
      }
      ctx.putImageData(imgData, 0, 0);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [incidents]);

  return (
    <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-3 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172333] pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-telemetry-blue" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            RGB SENSOR FEED (PI CAM 3)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
          DEMO DATA
        </span>
      </div>

      {/* Simulated Canvas Feed */}
      <div className="relative w-full h-[180px] bg-[#05080c] rounded border border-[#162232] overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} width={380} height={180} className="w-full h-full object-cover" />

        {/* Tactical On-Screen Display (OSD) */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          REC ● 1080p30 FOV 75°
        </div>

        <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          EDGE DETECTOR: SIMULATED
        </div>

        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          ALT: {telemetry.altitudeMeters.toFixed(1)}m · SPD: {telemetry.groundSpeedMs.toFixed(1)}m/s
        </div>

        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          TIMESTAMP: {mounted ? telemetry.timestamp : "--:--:--"}
        </div>
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
        <span>OBJECT DETECTION: SIMULATED</span>
        <span className="text-slate-300">
          OBJECTS DETECTED: {incidents.length}
        </span>
      </div>
    </div>
  );
}
