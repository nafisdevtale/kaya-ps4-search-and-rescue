"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMission } from "../../context/MissionContext";
import { SEARCH_POLYGON, LAWNMOWER_GRID, HOME_COORDINATE } from "../../simulation/scenarios";
import { IncidentDetection, GeoCoordinate } from "../../types";
import {
  Crosshair,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Flame,
  AlertTriangle,
  UserCheck,
  Eye,
  Grid,
} from "lucide-react";

export function TacticalMapInner() {
  const {
    telemetry,
    progress,
    incidents,
    selectedIncident,
    setSelectedIncident,
    mapCenterTarget,
    setMapCenterTarget,
  } = useMission();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const uavMarkerRef = useRef<any>(null);
  const trajectoryPolylineRef = useRef<any>(null);
  const incidentMarkersRef = useRef<Map<string, any>>(new Map());
  const trajectoryPointsRef = useRef<[number, number][]>([]);

  const [autoCenter, setAutoCenter] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<"LEAFLET" | "VECTOR_FALLBACK">("LEAFLET");
  const [showWaypoints, setShowWaypoints] = useState<boolean>(true);
  const [showSearchGrid, setShowSearchGrid] = useState<boolean>(true);
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapMode !== "LEAFLET" || typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const L = (await import("leaflet")).default;

        // Fix leaflet icon default issues
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }

        const map = L.map(mapContainerRef.current!, {
          center: [HOME_COORDINATE.latitude, HOME_COORDINATE.longitude],
          zoom: 18,
          zoomControl: false,
          attributionControl: false,
        });

        // Tactical Dark OpenStreetMap Tiles
        const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          subdomains: ["a", "b", "c"],
        });

        tileLayer.on("tileerror", () => {
          // If offline or tile error, switch to high-precision vector fallback
          if (isMounted) setMapMode("VECTOR_FALLBACK");
        });

        tileLayer.addTo(map);

        // 1. Draw Search Polygon
        const polygonCoords = SEARCH_POLYGON.map((p) => [p.latitude, p.longitude] as [number, number]);
        L.polygon(polygonCoords, {
          color: "#00b4d8",
          weight: 2,
          dashArray: "4, 6",
          fillColor: "#0077b6",
          fillOpacity: 0.08,
        }).addTo(map);

        // 2. Draw Lawnmower Grid Path
        if (showSearchGrid) {
          const gridCoords = LAWNMOWER_GRID.map((w) => [w.latitude, w.longitude] as [number, number]);
          L.polyline(gridCoords, {
            color: "#1e3a5f",
            weight: 2,
            dashArray: "2, 4",
          }).addTo(map);
        }

        // 3. Draw Home/Base Station Marker
        const homeIcon = L.divIcon({
          className: "custom-home-icon",
          html: `
            <div style="
              width: 24px;
              height: 24px;
              border: 2px solid #10b981;
              background: rgba(16, 185, 129, 0.2);
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: monospace;
              font-size: 9px;
              font-weight: bold;
              color: #10b981;
            ">H</div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        L.marker([HOME_COORDINATE.latitude, HOME_COORDINATE.longitude], { icon: homeIcon })
          .addTo(map)
          .bindTooltip("HOME BASE (LAUNCH/RTL)", { className: "tactical-tooltip", direction: "top" });

        // 4. UAV Marker with dynamic rotation
        const uavIcon = L.divIcon({
          className: "custom-uav-icon",
          html: `
            <div id="uav-marker-icon" style="
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              transform: rotate(${telemetry.headingDegrees}deg);
              transition: transform 0.2s linear;
            ">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L20 20L12 16L4 20L12 2Z" fill="#00b4d8" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="2.5" fill="#ffffff"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        uavMarkerRef.current = L.marker([telemetry.latitude, telemetry.longitude], {
          icon: uavIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        // 5. Trajectory Polyline
        trajectoryPolylineRef.current = L.polyline([], {
          color: "#00b4d8",
          weight: 2.5,
          opacity: 0.7,
        }).addTo(map);

        leafletMapRef.current = map;
      } catch (err) {
        console.error("Leaflet initialization failed, switching to vector mode:", err);
        setMapMode("VECTOR_FALLBACK");
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [mapMode]);

  // Update UAV position, trajectory, and heading
  useEffect(() => {
    if (!leafletMapRef.current || !uavMarkerRef.current) return;

    const latLng: [number, number] = [telemetry.latitude, telemetry.longitude];
    uavMarkerRef.current.setLatLng(latLng);

    // Update icon heading rotation
    const iconElement = document.getElementById("uav-marker-icon");
    if (iconElement) {
      iconElement.style.transform = `rotate(${telemetry.headingDegrees}deg)`;
    }

    // Append to trajectory
    if (showTrajectory && trajectoryPolylineRef.current) {
      trajectoryPointsRef.current.push(latLng);
      if (trajectoryPointsRef.current.length > 300) trajectoryPointsRef.current.shift();
      trajectoryPolylineRef.current.setLatLngs(trajectoryPointsRef.current);
    }

    // Auto-center map if enabled
    if (autoCenter) {
      leafletMapRef.current.panTo(latLng, { animate: true, duration: 0.4 });
    }
  }, [telemetry.latitude, telemetry.longitude, telemetry.headingDegrees, autoCenter, showTrajectory]);

  // Sync Incidents on Map
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;
    import("leaflet").then((L) => {
      incidents.forEach((inc) => {
        if (!incidentMarkersRef.current.has(inc.id)) {
          const isSurvivor = inc.class === "SURVIVOR";
          const isFire = inc.class === "FIRE";
          const color = isSurvivor ? "#10b981" : isFire ? "#ef4444" : "#f59e0b";

          const markerHtml = `
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: ${color};
              border: 2px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 11px;
              font-weight: bold;
              font-family: monospace;
              box-shadow: 0 0 14px ${color};
            " class="${inc.priority === "CRITICAL" ? "marker-critical-pulse" : ""}">
              ${isSurvivor ? "S" : isFire ? "F" : "!"}
            </div>
          `;

          const customIcon = L.divIcon({
            className: `incident-marker-${inc.id}`,
            html: markerHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: monospace; font-size: 11px; color: #f1f5f9;">
              <div style="font-weight: bold; color: ${color}; font-size: 12px; margin-bottom: 4px;">
                ${inc.class} (${(inc.confidence * 100).toFixed(0)}%)
              </div>
              <div>ID: ${inc.id}</div>
              <div>PRIORITY: <b style="color: ${color};">${inc.priority}</b></div>
              <div>THERMAL: ${inc.thermalConfirmed ? "CONFIRMED (" + (inc.thermalPeakTemp || 34.8) + "°C)" : "UNCONFIRMED"}</div>
              <div>RANGE: ${inc.distanceMeters}m</div>
              <div>COORDS: ${inc.latitude.toFixed(5)}, ${inc.longitude.toFixed(5)}</div>
            </div>
          `);

          marker.on("click", () => {
            setSelectedIncident(inc);
          });

          incidentMarkersRef.current.set(inc.id, marker);
        }
      });
    });
  }, [incidents, setSelectedIncident]);

  // Center on clicked incident
  useEffect(() => {
    if (mapCenterTarget && leafletMapRef.current) {
      leafletMapRef.current.setView([mapCenterTarget.lat, mapCenterTarget.lon], mapCenterTarget.zoom || 19, {
        animate: true,
      });
      setAutoCenter(false);
    }
  }, [mapCenterTarget]);

  // Zoom controls
  const handleZoomIn = () => leafletMapRef.current?.zoomIn();
  const handleZoomOut = () => leafletMapRef.current?.zoomOut();
  const handleResetView = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([HOME_COORDINATE.latitude, HOME_COORDINATE.longitude], 18, { animate: true });
      setAutoCenter(true);
    }
  };

  return (
    <div className="relative w-full h-[460px] lg:h-[520px] bg-[#070b10] border border-[#1b2738] rounded-lg overflow-hidden shadow-2xl flex flex-col">
      {/* Top Map HUD Overlay */}
      <div className="absolute top-2 left-2 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center space-x-2 bg-[#080d14]/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-[#1c2a3c] text-xs font-mono">
          <div className="w-2 h-2 rounded-full bg-telemetry-blue animate-pulse" />
          <span className="font-bold text-slate-200">TACTICAL AIRSPACE MAP</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">ZONE: QUADRANT-A (1.8 ha)</span>
        </div>

        {/* Map Mode Selector */}
        <div className="flex items-center bg-[#080d14]/90 backdrop-blur-md rounded-md border border-[#1c2a3c] p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setMapMode("LEAFLET")}
            className={`px-2 py-1 rounded transition-colors ${
              mapMode === "LEAFLET" ? "bg-telemetry-blue text-black font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            SATELLITE
          </button>
          <button
            onClick={() => setMapMode("VECTOR_FALLBACK")}
            className={`px-2 py-1 rounded transition-colors ${
              mapMode === "VECTOR_FALLBACK" ? "bg-telemetry-blue text-black font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            OFFLINE VECTOR GRID
          </button>
        </div>
      </div>

      {/* Right Map Action Controls */}
      <div className="absolute top-2 right-2 z-20 flex flex-col space-y-1.5 pointer-events-auto">
        <button
          onClick={() => setAutoCenter(!autoCenter)}
          title="Toggle Auto-Center UAV"
          className={`p-2 rounded-md border backdrop-blur-md transition-colors ${
            autoCenter
              ? "bg-telemetry-blue text-black border-telemetry-blue font-bold shadow-[0_0_12px_rgba(0,180,216,0.3)]"
              : "bg-[#090e17]/90 text-slate-400 hover:text-white border-[#1c2a3c]"
          }`}
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-md bg-[#090e17]/90 hover:bg-[#121c2c] text-slate-300 border border-[#1c2a3c] backdrop-blur-md transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-md bg-[#090e17]/90 hover:bg-[#121c2c] text-slate-300 border border-[#1c2a3c] backdrop-blur-md transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          title="Reset to Home Base"
          className="p-2 rounded-md bg-[#090e17]/90 hover:bg-[#121c2c] text-slate-300 border border-[#1c2a3c] backdrop-blur-md transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Map View Area */}
      {mapMode === "LEAFLET" ? (
        <div ref={mapContainerRef} className="w-full h-full z-10" />
      ) : (
        /* Offline High-Precision Vector Fallback Grid (Guaranteed zero-API resilience) */
        <div className="w-full h-full relative bg-[#060a0f] flex items-center justify-center p-4">
          <svg className="w-full h-full" viewBox="0 0 800 500">
            {/* Radar Circular Range Rings */}
            <circle cx="400" cy="250" r="80" stroke="#121e2c" strokeWidth="1" fill="none" />
            <circle cx="400" cy="250" r="160" stroke="#121e2c" strokeWidth="1" fill="none" />
            <circle cx="400" cy="250" r="230" stroke="#121e2c" strokeWidth="1" fill="none" strokeDasharray="3, 3" />
            
            {/* Crosshairs */}
            <line x1="0" y1="250" x2="800" y2="250" stroke="#101924" strokeWidth="1" />
            <line x1="400" y1="0" x2="400" y2="500" stroke="#101924" strokeWidth="1" />

            {/* Search Polygon */}
            <polygon
              points="200,100 600,100 600,400 200,400"
              fill="rgba(0,180,216,0.05)"
              stroke="#00b4d8"
              strokeWidth="2"
              strokeDasharray="5, 5"
            />

            {/* Lawnmower Grid Path */}
            <polyline
              points="
                240,380 240,120 
                340,120 340,380 
                440,380 440,120 
                540,120 540,380
              "
              fill="none"
              stroke="#1e324a"
              strokeWidth="2"
              strokeDasharray="3, 3"
            />

            {/* Home Base Marker */}
            <rect x="388" y="238" width="24" height="24" rx="4" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="2" />
            <text x="400" y="254" textAnchor="middle" fill="#10b981" fontSize="12" fontFamily="monospace" fontWeight="bold">H</text>

            {/* Incidents on Vector Grid */}
            {incidents.map((inc) => {
              const isSurvivor = inc.class === "SURVIVOR";
              const isFire = inc.class === "FIRE";
              const color = isSurvivor ? "#10b981" : isFire ? "#ef4444" : "#f59e0b";
              const cx = isSurvivor ? 340 : isFire ? 460 : 280;
              const cy = isSurvivor ? 220 : isFire ? 190 : 310;
              return (
                <g key={inc.id} onClick={() => setSelectedIncident(inc)} className="cursor-pointer">
                  <circle cx={cx} cy={cy} r="14" fill={color} stroke="#ffffff" strokeWidth="2" className={inc.priority === "CRITICAL" ? "marker-critical-pulse" : ""} />
                  <text x={cx} y={cy + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {isSurvivor ? "S" : isFire ? "F" : "!"}
                  </text>
                  <text x={cx} y={cy + 24} textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace">
                    {inc.class}
                  </text>
                </g>
              );
            })}

            {/* UAV Vector Marker */}
            <g
              transform={`translate(${
                400 + ((telemetry.longitude - HOME_COORDINATE.longitude) * 200000)
              }, ${
                250 - ((telemetry.latitude - HOME_COORDINATE.latitude) * 200000)
              }) rotate(${telemetry.headingDegrees})`}
            >
              <polygon points="0,-16 12,12 0,6 -12,12" fill="#00b4d8" stroke="#ffffff" strokeWidth="2" />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
            </g>
          </svg>
        </div>
      )}

      {/* Bottom Map Legend & Coordinates Bar */}
      <div className="absolute bottom-2 left-2 right-2 z-20 flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#080d14]/90 backdrop-blur-md border border-[#1a2839] rounded-md text-[11px] font-mono text-slate-300 pointer-events-auto">
        {/* Semantic Marker Legend */}
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-telemetry-blue inline-block" />
            <span>UAV</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-nominal inline-block" />
            <span>SURVIVOR</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-critical inline-block" />
            <span>FIRE</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-hazard-orange inline-block" />
            <span>SMOKE</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" />
            <span>DEBRIS</span>
          </span>
        </div>

        {/* Live Coordinate Readout */}
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="text-slate-400">LAT: {telemetry.latitude.toFixed(6)}°</span>
          <span className="text-slate-400">LON: {telemetry.longitude.toFixed(6)}°</span>
          <span className="text-telemetry-blue font-bold">ALT: {telemetry.altitudeMeters.toFixed(1)}m</span>
        </div>
      </div>
    </div>
  );
}
