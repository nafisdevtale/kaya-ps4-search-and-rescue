"use client";

import React, { useState } from "react";
import { useMission } from "../../context/MissionContext";
import { IncidentDetection, HazardClass, RiskPriority } from "../../types";
import { getPriorityColor } from "../../lib/utils";
import { IncidentDetailModal } from "../../components/mission/IncidentDetailModal";
import {
  ShieldAlert,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Thermometer,
  Ruler,
  MapPin,
  CheckCircle,
} from "lucide-react";

export default function DetectionsPage() {
  const { incidents, setSelectedIncident } = useMission();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"time" | "priority" | "confidence">("time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fallback demo incidents if user hasn't run the mission yet
  const displayIncidents: IncidentDetection[] =
    incidents.length > 0
      ? incidents
      : [
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
            status: "ACTIVE",
            notes: "Adult survivor under light rubble masonry. Hand movement observed.",
            fusionBreakdown: {
              rgbConfidence: 0.91,
              thermalConfidence: 0.96,
              depthConfidence: 0.94,
              poseAccuracy: 0.98,
              fusedScore: 0.96,
            },
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
            status: "ACTIVE",
            notes: "Active flame hotspot 18.4m east of survivor perimeter.",
            fusionBreakdown: {
              rgbConfidence: 0.93,
              thermalConfidence: 0.98,
              depthConfidence: 0.91,
              poseAccuracy: 0.97,
              fusedScore: 0.94,
            },
          },
          {
            id: "INC-0044",
            timestamp: "12:44:31",
            class: "DEBRIS",
            confidence: 0.86,
            thermalConfirmed: false,
            distanceMeters: 8.2,
            latitude: 18.52055,
            longitude: 73.85680,
            uavAltitudeAtCapture: 24.8,
            priority: "MEDIUM",
            status: "ACTIVE",
            notes: "Collapsed concrete slab obstructing ground rescue vehicle approach.",
            fusionBreakdown: {
              rgbConfidence: 0.86,
              thermalConfidence: 0.35,
              depthConfidence: 0.95,
              poseAccuracy: 0.98,
              fusedScore: 0.88,
            },
          },
        ];

  // Filtering
  const filtered = displayIncidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.notes && inc.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass =
      selectedClassFilter === "ALL" || inc.class === selectedClassFilter;

    return matchesSearch && matchesClass;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    const factor = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "priority") {
      const pWeights = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (pWeights[a.priority] - pWeights[b.priority]) * factor;
    } else if (sortBy === "confidence") {
      return (a.confidence - b.confidence) * factor;
    } else {
      return a.id.localeCompare(b.id) * factor;
    }
  });

  // Export GeoJSON
  const handleExportGeoJSON = () => {
    const geojson = {
      type: "FeatureCollection",
      features: sorted.map((inc) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [inc.longitude, inc.latitude, inc.uavAltitudeAtCapture],
        },
        properties: {
          id: inc.id,
          class: inc.class,
          priority: inc.priority,
          confidence: inc.confidence,
          thermalConfirmed: inc.thermalConfirmed,
          thermalPeakTemp: inc.thermalPeakTemp,
          distanceMeters: inc.distanceMeters,
          timestamp: inc.timestamp,
          notes: inc.notes,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ANOMALY_INCIDENTS_${new Date().toISOString().slice(0, 10)}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-8 font-mono">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0d141f] border border-[#1b2738] p-4 rounded-lg">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-critical" />
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              INCIDENT TRIAGE & DETECTION CATALOG
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geotagged multi-modal detections synthesized by the edge risk engine
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportGeoJSON}
            className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#101c2a] hover:bg-[#192b40] text-sky-400 border border-sky-500/30 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT GEOJSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0a0f17] border border-[#162334] p-3 rounded-lg text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, class, notes..."
            className="w-full bg-[#060a0f] border border-[#1b2b3d] rounded pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-telemetry-blue"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["ALL", "SURVIVOR", "FIRE", "SMOKE", "FLOOD", "DEBRIS"].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClassFilter(cls)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                selectedClassFilter === cls
                  ? "bg-telemetry-blue text-black font-bold"
                  : "bg-[#0f1722] text-slate-400 hover:text-white border border-[#1d2d42]"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-slate-500 text-[11px]">SORT:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#060a0f] border border-[#1b2b3d] rounded px-2 py-1 text-slate-300 text-xs focus:outline-none"
          >
            <option value="time">Time / ID</option>
            <option value="priority">Priority Tier</option>
            <option value="confidence">Confidence</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-1 rounded bg-[#0f1722] border border-[#1d2d42] text-slate-400 hover:text-white"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Detections Table */}
      <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070b10] border-b border-[#172333] text-slate-400 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-3">Incident ID</th>
              <th className="py-3 px-3">Class</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">AI Conf</th>
              <th className="py-3 px-3">Thermal FIR</th>
              <th className="py-3 px-3">Distance</th>
              <th className="py-3 px-3">Coordinates (Lat, Lon)</th>
              <th className="py-3 px-3">Time</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#131e2b]">
            {sorted.map((inc) => {
              const prioStyle = getPriorityColor(inc.priority);
              const isSurvivor = inc.class === "SURVIVOR";
              const isFire = inc.class === "FIRE";

              return (
                <tr
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="hover:bg-[#0f1724] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-bold text-white group-hover:text-telemetry-blue">
                    {inc.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-center space-x-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSurvivor ? "bg-nominal" : isFire ? "bg-critical" : "bg-warning"
                        }`}
                      />
                      <span className="font-bold text-slate-200">{inc.class}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${prioStyle.border} ${prioStyle.bg} ${prioStyle.text}`}
                    >
                      {inc.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {(inc.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-3">
                    {inc.thermalConfirmed ? (
                      <span className="text-emerald-400 font-semibold flex items-center">
                        <Thermometer className="w-3 h-3 mr-1" />
                        {inc.thermalPeakTemp || 34.8}°C
                      </span>
                    ) : (
                      <span className="text-slate-500">Unconfirmed</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {inc.distanceMeters} m
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {inc.latitude.toFixed(5)}°, {inc.longitude.toFixed(5)}°
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {inc.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(inc);
                      }}
                      className="px-2.5 py-1 rounded bg-[#101b28] hover:bg-[#1a2c42] text-sky-400 border border-sky-500/30 text-[11px] transition-colors"
                    >
                      INSPECT
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <IncidentDetailModal />
    </div>
  );
}
