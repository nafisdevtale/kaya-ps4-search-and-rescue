import type { Metadata } from "next";
import "./globals.css";
import { PROJECT_BRAND } from "../config/branding";
import { MissionProvider } from "../context/MissionContext";
import { TopBar } from "../components/TopBar";

export const metadata: Metadata = {
  title: `${PROJECT_BRAND.commandCenterTitle} · ${PROJECT_BRAND.teamName} (${PROJECT_BRAND.teamId})`,
  description: `${PROJECT_BRAND.subtitle} - Operational Command Center for KAYA Buildathon 2026 PS4`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col font-sans antialiased selection:bg-telemetry-blue selection:text-black">
        <MissionProvider>
          <TopBar />
          <main className="flex-1 w-full max-w-[1920px] mx-auto p-2 sm:p-4">
            {children}
          </main>
          
          {/* Tactical Bottom Status Footer */}
          <footer className="w-full bg-[#05080c] border-t border-[#141d2a] px-4 py-2 text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-slate-400 font-semibold">{PROJECT_BRAND.teamName} · {PROJECT_BRAND.teamId}</span>
              <span>·</span>
              <span>AVIONICS: {PROJECT_BRAND.flightController}</span>
              <span>·</span>
              <span>COMPANION: {PROJECT_BRAND.companionComputer}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-amber-400/90 font-medium">
                {PROJECT_BRAND.simulationNotice}
              </span>
              <span>·</span>
              <span>ZERO CLOUD DEPENDENCY · OFFLINE RESILIENT</span>
            </div>
          </footer>
        </MissionProvider>
      </body>
    </html>
  );
}
