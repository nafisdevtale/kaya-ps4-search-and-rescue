"use client";

import React from "react";
import { TopMissionControls } from "../components/mission/TopMissionControls";
import { UAVStatusCard } from "../components/mission/UAVStatusCard";
import { MissionProgressCard } from "../components/mission/MissionProgressCard";
import { TacticalMap } from "../components/mission/TacticalMap";
import { DetectionPanel } from "../components/mission/DetectionPanel";
import { RgbSensorFeed } from "../components/mission/RgbSensorFeed";
import { ThermalSensorPanel } from "../components/mission/ThermalSensorPanel";
import { StereoDepthPanel } from "../components/mission/StereoDepthPanel";
import { SensorFusionVisualizer } from "../components/mission/SensorFusionVisualizer";
import { AlertPanel } from "../components/mission/AlertPanel";
import { MissionTimeline } from "../components/mission/MissionTimeline";
import { IncidentDetailModal } from "../components/mission/IncidentDetailModal";

export default function MissionControlPage() {
  return (
    <div className="space-y-3.5 pb-6">
      {/* 1. Top Mission Simulation Bar */}
      <TopMissionControls />

      {/* 2. Primary Tactical Workspace: UAV Status | Hero Tactical Map | Detections Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column (3 cols): Avionics & Progress */}
        <div className="lg:col-span-3 space-y-3.5">
          <UAVStatusCard />
          <MissionProgressCard />
        </div>

        {/* Center Hero Column (6 cols): Tactical Airspace Map */}
        <div className="lg:col-span-6">
          <TacticalMap />
        </div>

        {/* Right Column (3 cols): Incidents & Hazards Stream */}
        <div className="lg:col-span-3">
          <DetectionPanel />
        </div>
      </div>

      {/* 3. Multi-Modal Sensor Feeds: RGB Vision | MLX90640 Thermal | AR0144 Stereo Depth */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <RgbSensorFeed />
        <ThermalSensorPanel />
        <StereoDepthPanel />
      </div>

      {/* 4. Sensor Fusion, Emergency Alerts & Mission Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        <div className="lg:col-span-5">
          <SensorFusionVisualizer />
        </div>

        <div className="lg:col-span-4">
          <AlertPanel />
        </div>

        <div className="lg:col-span-3">
          <MissionTimeline />
        </div>
      </div>

      {/* 5. Incident Details Modal */}
      <IncidentDetailModal />
    </div>
  );
}
