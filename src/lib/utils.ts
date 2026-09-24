import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatCoords(lat: number, lon: number): string {
  const latStr = `${Math.abs(lat).toFixed(5)}° ${lat >= 0 ? "N" : "S"}`;
  const lonStr = `${Math.abs(lon).toFixed(5)}° ${lon >= 0 ? "E" : "W"}`;
  return `${latStr}, ${lonStr}`;
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return {
        text: "text-critical",
        border: "border-critical/50",
        bg: "bg-critical/10",
        badge: "bg-critical text-white",
        glow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]",
      };
    case "HIGH":
      return {
        text: "text-hazard-orange",
        border: "border-hazard-orange/50",
        bg: "bg-hazard-orange/10",
        badge: "bg-hazard-orange text-white",
        glow: "shadow-[0_0_12px_rgba(249,115,22,0.35)]",
      };
    case "MEDIUM":
      return {
        text: "text-warning",
        border: "border-warning/50",
        bg: "bg-warning/10",
        badge: "bg-warning text-black font-semibold",
        glow: "shadow-[0_0_8px_rgba(245,158,11,0.25)]",
      };
    default:
      return {
        text: "text-slate-400",
        border: "border-slate-700",
        bg: "bg-slate-800/40",
        badge: "bg-slate-700 text-slate-300",
        glow: "",
      };
  }
}
