"use client";

import React, { useState } from "react";
import { useMission } from "../../context/MissionContext";
import { getPriorityColor } from "../../lib/utils";
import {
  X,
  MapPin,
  Thermometer,
  Eye,
  Ruler,
  Clock,
  Compass,
  CheckCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";

export function IncidentDetailModal() {
  const {
    selectedIncident,
    setSelectedIncident,
    setMapCenterTarget,
    updateIncidentNotes,
  } = useMission();

  const [notesText, setNotesText] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!selectedIncident) return null;

  const prioStyle = getPriorityColor(selectedIncident.priority);

  const handleCenterMap = () => {
    setMapCenterTarget({
      lat: selectedIncident.latitude,
      lon: selectedIncident.longitude,
      zoom: 19,
    });
  };

  const handleSaveNotes = () => {
    updateIncidentNotes(selectedIncident.id, notesText);
    setIsEditingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0b121c] border border-telemetry-blue/40 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 bg-[#080d14] border-b border-[#182638]">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-0.5 rounded font-bold border ${prioStyle.border} ${prioStyle.bg} ${prioStyle.text}`}
            >
              {selectedIncident.priority}
            </span>
            <span className="text-sm font-bold text-white">
              {selectedIncident.class}
            </span>
            <span className="text-slate-400">({selectedIncident.id})</span>
          </div>

          <button
            onClick={() => setSelectedIncident(null)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#141e2c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Geodetic & Capture Telemetry */}
          <div className="p-3 rounded-lg bg-[#070b10] border border-[#141f2d] grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10px] text-slate-500 block">GEODETIC LATITUDE:</span>
              <span className="text-slate-200 font-bold">{selectedIncident.latitude.toFixed(6)}° N</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">GEODETIC LONGITUDE:</span>
              <span className="text-slate-200 font-bold">{selectedIncident.longitude.toFixed(6)}° E</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">UAV ALTITUDE AT CAPTURE:</span>
              <span className="text-slate-200 font-bold">{selectedIncident.uavAltitudeAtCapture.toFixed(1)} m AGL</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">TIMESTAMP:</span>
              <span className="text-slate-200 font-bold">{selectedIncident.timestamp}</span>
            </div>
          </div>

          {/* Multi-Modal Sensor Breakdown */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
              MULTI-MODAL SENSOR CORRELATION
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded bg-[#070b10] border border-[#141f2d]">
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>RGB AI</span>
                  <Eye className="w-3 h-3 text-telemetry-blue" />
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  {(selectedIncident.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-[9px] text-slate-400">YOLO Model</div>
              </div>

              <div className="p-2 rounded bg-[#070b10] border border-[#141f2d]">
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>THERMAL FIR</span>
                  <Thermometer className="w-3 h-3 text-red-400" />
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  {selectedIncident.thermalConfirmed ? `${selectedIncident.thermalPeakTemp || 34.8}°C` : "N/A"}
                </div>
                <div className="text-[9px] text-emerald-400">
                  {selectedIncident.thermalConfirmed ? "Confirmed" : "No anomaly"}
                </div>
              </div>

              <div className="p-2 rounded bg-[#070b10] border border-[#141f2d]">
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>STEREO RANGE</span>
                  <Ruler className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  {selectedIncident.distanceMeters} m
                </div>
                <div className="text-[9px] text-slate-400">AR0144 Baseline</div>
              </div>
            </div>
          </div>

          {/* Operator Triage Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                OPERATOR LOG NOTES:
              </span>
              {!isEditingNotes && (
                <button
                  onClick={() => {
                    setNotesText(selectedIncident.notes || "");
                    setIsEditingNotes(true);
                  }}
                  className="text-[10px] text-sky-400 hover:underline"
                >
                  Edit Note
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Enter responder field notes, triage status, or rescue team assignment..."
                  rows={3}
                  className="w-full bg-[#070b10] border border-[#1c2e44] rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-telemetry-blue"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="px-2.5 py-1 rounded bg-[#101824] text-slate-400 border border-slate-700 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-2.5 py-1 rounded bg-telemetry-blue text-black font-bold hover:bg-telemetry-blueLight"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded bg-[#070b10] border border-[#141f2d] text-slate-300 text-[11px] leading-relaxed">
                {selectedIncident.notes || "No notes logged yet. Click 'Edit Note' to add operator observations."}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-3 bg-[#080d14] border-t border-[#182638]">
          <button
            onClick={handleCenterMap}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#111e2e] hover:bg-[#1a2d44] text-sky-400 border border-sky-500/40 font-bold transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>CENTER ON MAP</span>
          </button>

          <button
            onClick={() => setSelectedIncident(null)}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
