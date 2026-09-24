import { SimulationEngine } from "../src/simulation/engine";

async function runTest() {
  console.log("Starting ANOMALY Simulation Engine Test...");
  const engine = new SimulationEngine("SURVIVOR_FIRE");

  let survivorDetected = false;
  let thermalConfirmed = false;
  let fireDetected = false;
  let alertCount = 0;
  let timelineCount = 0;

  engine.onDetectionAdded((d) => {
    console.log(`[EVENT] Detection Added: ${d.id} (${d.class}) - Priority: ${d.priority}`);
    if (d.id === "INC-0042") survivorDetected = true;
    if (d.id === "INC-0043") fireDetected = true;
  });

  engine.onAlertAdded((a) => {
    console.log(`[EVENT] Alert Dispatched: [${a.severity}] ${a.title}`);
    alertCount++;
  });

  engine.onTimelineEvent((e) => {
    timelineCount++;
  });

  // Fast forward by setting speed multiplier to 5x
  engine.setSpeedMultiplier(5);
  engine.startMission();

  // Poll engine status until completion or max 25 seconds
  const startMs = Date.now();
  while (Date.now() - startMs < 25000) {
    const progress = engine.getProgress();
    const telem = engine.getTelemetry();

    const incs = engine.getIncidents();
    const survivor = incs.find((i) => i.id === "INC-0042");
    if (survivor && survivor.thermalConfirmed) {
      thermalConfirmed = true;
    }

    if (progress.status === "COMPLETED") {
      console.log("Mission COMPLETED successfully in test run!");
      break;
    }
    await new Promise((res) => setTimeout(res, 200));
  }

  engine.resetMission();

  console.log("\n--- TEST RESULTS ---");
  console.log(`Survivor (INC-0042) Detected: ${survivorDetected}`);
  console.log(`Thermal Heat Signature Confirmed: ${thermalConfirmed}`);
  console.log(`Fire (INC-0043) Detected: ${fireDetected}`);
  console.log(`Total Alerts Dispatched: ${alertCount}`);
  console.log(`Total Timeline Events: ${timelineCount}`);

  if (survivorDetected && thermalConfirmed && fireDetected && alertCount >= 2) {
    console.log("\n>>> ALL ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! <<<");
    process.exit(0);
  } else {
    console.error("FAILED to satisfy all scenario triggers.");
    process.exit(1);
  }
}

runTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
