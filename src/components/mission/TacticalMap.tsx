"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import TacticalMapInner with SSR disabled to safely handle window/Leaflet
const DynamicTacticalMap = dynamic(
  () => import("./TacticalMapInner").then((mod) => mod.TacticalMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] lg:h-[520px] bg-[#070b10] border border-[#1b2738] rounded-lg flex items-center justify-center font-mono text-xs text-slate-400">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-6 border-2 border-telemetry-blue border-t-transparent rounded-full animate-spin" />
          <span>INITIALIZING TACTICAL MAP SUBSYSTEM...</span>
        </div>
      </div>
    ),
  }
);

export function TacticalMap() {
  return <DynamicTacticalMap />;
}
