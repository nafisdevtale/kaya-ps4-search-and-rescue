export interface ProjectBrandConfig {
  projectName: string;
  commandCenterTitle: string;
  shortName: string;
  teamName: string;
  teamId: string;
  competition: string;
  problemStatement: string;
  subtitle: string;
  systemTagline: string;
  version: string;
  simulationNotice: string;
  hardwarePlatform: string;
  companionComputer: string;
  flightController: string;
}

export const PROJECT_BRAND: ProjectBrandConfig = {
  projectName: "PS4 Search & Rescue",
  commandCenterTitle: "PS4 SEARCH & RESCUE COMMAND CENTER",
  shortName: "PS4 SAR",
  teamName: "ANOMALY",
  teamId: "KT-2047",
  competition: "KAYA Buildathon 2026",
  problemStatement: "PS4 — AI-Powered Autonomous Drone for Search-and-Rescue: Detecting People and Hazards",
  subtitle: "AI-Powered Autonomous Search & Rescue",
  systemTagline: "Multi-Modal Search, Detection & Triage",
  version: "SIM",
  simulationNotice: "SIMULATION MODE — DEMONSTRATION DATA",
  hardwarePlatform: "F450 · A2212 1000KV · 30A ESC · 1045 Props · 3S 5200mAh",
  companionComputer: "Raspberry Pi 4B 4GB",
  flightController: "Pixhawk 2.4.8 (ArduCopter)",
};
