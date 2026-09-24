"use client";

import React from "react";
import { useMission } from "../../context/MissionContext";
import { MissionAlert } from "../../types";
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  Check,
  X,
  MapPin,
} from "lucide-react";

export function AlertPanel() {
  const { alerts, acknowledgeAlert, dismissAlert, setMapCenterTarget, incidents } = useMission();

  const activeAlerts = alerts.filter((a) => !a.dismissed);

  const handleLocate = (incidentId?: string) => {
    if (!incidentId) return;
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) {
      setMapCenterTarget({ lat: inc.latitude, lon: inc.longitude, zoom: 19 });
    }
  };

  return (
    <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-3 shadow-md flex flex-col justify-between h-full max-h-[260px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172333] pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            EMERGENCY ALERTS ({activeAlerts.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          SIMULATED ALERT DISPATCH
        </span>
      </div>

      {/* Alert Items List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activeAlerts.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center text-center p-3 rounded bg-[#070b10] border border-[#141f2c] text-xs font-mono text-slate-500">
            <Check className="w-6 h-6 mb-1 text-nominal opacity-50" />
            <p>ALL SYSTEMS NOMINAL</p>
            <p className="text-[10px] text-slate-600">No active triage alerts pending</p>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const isCritical = alert.severity === "CRITICAL" || alert.severity === "EMERGENCY";
            const isWarning = alert.severity === "WARNING";

            return (
              <div
                key={alert.id}
                className={`p-2.5 rounded border transition-all ${
                  isCritical
                    ? "bg-red-950/30 border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : isWarning
                    ? "bg-amber-950/20 border-amber-500/40"
                    : "bg-[#070b10] border-[#162334]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2">
                    {isCritical ? (
                      <AlertOctagon className="w-4 h-4 text-critical shrink-0 mt-0.5 animate-pulse" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-mono font-bold ${
                            isCritical ? "text-red-400" : "text-amber-400"
                          }`}
                        >
                          {alert.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-300 mt-0.5 leading-snug">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    {alert.incidentId && (
                      <button
                        onClick={() => handleLocate(alert.incidentId)}
                        title="Locate on Tactical Map"
                        className="p-1 rounded bg-[#101824] hover:bg-[#1a273a] text-sky-400 border border-sky-500/30 text-xs"
                      >
                        <MapPin className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      title="Acknowledge Alert"
                      className={`p-1 rounded text-xs transition-colors ${
                        alert.acknowledged
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-[#101824] hover:bg-[#1a273a] text-slate-400 hover:text-white border border-slate-700"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      title="Dismiss Alert"
                      className="p-1 rounded bg-[#101824] hover:bg-[#1a273a] text-slate-500 hover:text-red-400 border border-slate-800 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
