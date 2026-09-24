"use client";

import React, { useState } from "react";
import { MissionHistoryRecord } from "../../types";
import {
  History,
  Calendar,
  Clock,
  Layers,
  Users,
  Flame,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
} from "lucide-react";

export default function MissionHistoryPage() {
  const [selectedMission, setSelectedMission] = useState<MissionHistoryRecord | null>(null);

  // High-fidelity simulated mission history records
  const historicalMissions: MissionHistoryRecord[] = [
    {
      id: "SEARCH-01",
      missionName: "Survivor & Fire Co-location Drill",
      date: "2026-09-24",
      durationFormatted: "08:42",
      durationSeconds: 522,
      searchAreaHa: 1.8,
      survivorsFound: 2,
      hazardsFound: 4,
      alertsTotal: 3,
      status: "COMPLETED",
      summary: "Autonomous lawnmower search completed across Quadrant-A. Both survivors identified via MLX90640 thermal verification. Secondary brush fire isolated.",
      routeCoordinates: [],
      incidents: [
        {
          id: "INC-0042",
          timestamp: "12:42:18",
          class: "SURVIVOR",
          confidence: 0.96,
          thermalConfirmed: true,
          thermalPeakTemp: 34.8,
          distanceMeters: 11.4,
          latitude: 18.52071,
          longitude: 73.85691,
          uavAltitudeAtCapture: 25.0,
          priority: "CRITICAL",
          status: "RESOLVED",
          notes: "Live survivor extracted by ground rescue unit Alpha-1.",
          fusionBreakdown: { rgbConfidence: 0.91, thermalConfidence: 0.96, depthConfidence: 0.94, poseAccuracy: 0.98, fusedScore: 0.96 },
        },
        {
          id: "INC-0043",
          timestamp: "12:43:07",
          class: "FIRE",
          confidence: 0.93,
          thermalConfirmed: true,
          thermalPeakTemp: 186.4,
          distanceMeters: 18.4,
          latitude: 18.52085,
          longitude: 73.85705,
          uavAltitudeAtCapture: 25.2,
          priority: "HIGH",
          status: "RESOLVED",
          notes: "Perimeter foam deployed by fire containment team.",
          fusionBreakdown: { rgbConfidence: 0.93, thermalConfidence: 0.98, depthConfidence: 0.91, poseAccuracy: 0.97, fusedScore: 0.94 },
        },
      ],
    },
    {
      id: "SEARCH-02_URBAN",
      missionName: "Urban Collapse Structural Survey",
      date: "2026-09-23",
      durationFormatted: "12:15",
      durationSeconds: 735,
      searchAreaHa: 2.4,
      survivorsFound: 1,
      hazardsFound: 5,
      alertsTotal: 4,
      status: "COMPLETED",
      summary: "Multi-hazard inspection over collapsed industrial sector. Downed power cables and compromised masonry logged with high precision stereo ranging.",
      routeCoordinates: [],
      incidents: [
        {
          id: "INC-0038",
          timestamp: "16:11:02",
          class: "ELECTRICAL_WIRE",
          confidence: 0.89,
          thermalConfirmed: true,
          thermalPeakTemp: 72.1,
          distanceMeters: 6.8,
          latitude: 18.52110,
          longitude: 73.85620,
          uavAltitudeAtCapture: 22.0,
          priority: "CRITICAL",
          status: "RESOLVED",
          notes: "Power grid isolation verified by municipal utility team.",
          fusionBreakdown: { rgbConfidence: 0.89, thermalConfidence: 0.92, depthConfidence: 0.95, poseAccuracy: 0.96, fusedScore: 0.92 },
        },
      ],
    },
    {
      id: "DRILL-03_NIGHT",
      missionName: "Night Zero-Visibility Thermal Sweep",
      date: "2026-09-22",
      durationFormatted: "06:30",
      durationSeconds: 390,
      searchAreaHa: 1.2,
      survivorsFound: 3,
      hazardsFound: 1,
      alertsTotal: 2,
      status: "COMPLETED",
      summary: "Evaluated zero-optical visibility capabilities. MLX90640 far-infrared sensor successfully localized all 3 test human heat targets in darkness.",
      routeCoordinates: [],
      incidents: [],
    },
  ];

  const currentSelection = selectedMission || historicalMissions[0];

  return (
    <div className="space-y-4 pb-8 font-mono">
      {/* Title */}
      <div className="bg-[#0d141f] border border-[#1b2738] p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-telemetry-blue" />
          <h1 className="text-base font-bold text-white uppercase tracking-wider">
            MISSION HISTORY & POST-FLIGHT DEBRIEF
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Simulated mission archive · Demonstration data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols): Missions Table */}
        <div className="lg:col-span-7 bg-[#0b1017] border border-[#1b2738] rounded-lg overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070b10] border-b border-[#172333] text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Mission ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Area</th>
                <th className="py-3 px-3">Survivors</th>
                <th className="py-3 px-3">Hazards</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131e2b]">
              {historicalMissions.map((m) => {
                const isSelected = currentSelection.id === m.id;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMission(m)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? "bg-[#121d2d] text-white" : "hover:bg-[#0e1622] text-slate-300"
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-telemetry-blue">
                      {m.id}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{m.date}</td>
                    <td className="py-3 px-3">{m.durationFormatted}</td>
                    <td className="py-3 px-3">{m.searchAreaHa} ha</td>
                    <td className="py-3 px-3 text-nominal font-bold">
                      {m.survivorsFound}
                    </td>
                    <td className="py-3 px-3 text-hazard-orange">
                      {m.hazardsFound}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Column (5 cols): Selected Mission Debrief */}
        <div className="lg:col-span-5 bg-[#0b1017] border border-[#1b2738] rounded-lg p-4 shadow-xl space-y-4">
          <div className="border-b border-[#182638] pb-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              MISSION DEBRIEF RECORD
            </span>
            <h2 className="text-sm font-bold text-white mt-0.5">
              {currentSelection.id}: {currentSelection.missionName}
            </h2>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span>Date: {currentSelection.date}</span>
              <span>·</span>
              <span>Time in Flight: {currentSelection.durationFormatted}</span>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">AREA SWEPT</span>
              <span className="text-sm font-bold text-slate-100">{currentSelection.searchAreaHa} ha</span>
            </div>
            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">SURVIVORS</span>
              <span className="text-sm font-bold text-nominal">{currentSelection.survivorsFound} FOUND</span>
            </div>
            <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d]">
              <span className="text-[10px] text-slate-500 block">HAZARDS</span>
              <span className="text-sm font-bold text-hazard-orange">{currentSelection.hazardsFound} MAPPED</span>
            </div>
          </div>

          {/* Operational Summary */}
          <div className="p-3 rounded bg-[#070b10] border border-[#141f2d] text-xs text-slate-300 leading-relaxed">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">
              AFTER-ACTION SUMMARY:
            </span>
            {currentSelection.summary}
          </div>

          {/* Cataloged Incidents in this mission */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              INCIDENTS LOGGED DURING THIS SORTIE ({currentSelection.incidents.length}):
            </span>
            {currentSelection.incidents.length === 0 ? (
              <p className="text-xs text-slate-500">No individual incidents cataloged.</p>
            ) : (
              currentSelection.incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-2 rounded bg-[#070b10] border border-[#141f2d] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{inc.id} · {inc.class}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-critical/20 text-critical border border-critical/40 font-bold">
                      {inc.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{inc.notes}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
