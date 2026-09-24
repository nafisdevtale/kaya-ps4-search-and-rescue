"use client";

import React from "react";
import { useMission } from "../../context/MissionContext";
import { History, Clock, CheckCircle2, AlertTriangle, AlertOctagon, Info } from "lucide-react";

export function MissionTimeline() {
  const { timeline, incidents, setSelectedIncident } = useMission();

  const getEventIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertOctagon className="w-3.5 h-3.5 text-critical shrink-0 mt-0.5" />;
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />;
      case "nominal":
        return <CheckCircle2 className="w-3.5 h-3.5 text-nominal shrink-0 mt-0.5" />;
      default:
        return <Info className="w-3.5 h-3.5 text-telemetry-blue shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="bg-[#0b1017] border border-[#1b2738] rounded-lg p-3 shadow-md flex flex-col justify-between h-full max-h-[260px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172333] pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-telemetry-blue" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            CHRONOLOGICAL MISSION TIMELINE ({timeline.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          EVENT STREAM LOG
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs font-mono">
        {timeline.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center text-center p-3 rounded bg-[#070b10] border border-[#141f2c] text-xs font-mono text-slate-500">
            <Clock className="w-6 h-6 mb-1 opacity-30 text-slate-400" />
            <p>STANDBY: NO EVENTS LOGGED</p>
            <p className="text-[10px] text-slate-600">Events will populate during mission execution</p>
          </div>
        ) : (
          timeline.map((event) => (
            <div
              key={event.id}
              className="flex items-start space-x-2 p-1.5 rounded bg-[#070b10] border border-[#131d2b] hover:border-[#1d2d42] transition-colors"
            >
              {getEventIcon(event.level)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-200 truncate text-[11px]">
                    {event.title}
                  </span>
                  <div className="text-[10px] text-slate-500 shrink-0 space-x-1">
                    <span className="text-telemetry-blue font-semibold">{event.relativeTime}</span>
                    <span>({event.timestamp})</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {event.description}
                </p>

                {event.incidentId && (
                  <button
                    onClick={() => {
                      const inc = incidents.find((i) => i.id === event.incidentId);
                      if (inc) setSelectedIncident(inc);
                    }}
                    className="mt-1 text-[9px] text-sky-400 hover:underline flex items-center"
                  >
                    Inspect Target {event.incidentId} →
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
