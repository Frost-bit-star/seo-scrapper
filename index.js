// index.js
// Entry point for the SEO monitoring backend

import dotenv from "dotenv";
dotenv.config();

import { initDB } from "./lib/db.js";
import { monitorKeywords } from "./playwright/monitorKeywords.js";
import { monitorCompetitor } from "./playwright/monitorCompetitor.js";
import { scheduleTasks } from "./pages/api/schedular.js";

// Initialize the StackVerify DB connection
(async () => {
  try {
    await initDB(); // Logs in with hardcoded credentials or from env
    console.log(" StackVerify DB initialized successfully");

    // Start monitoring services
    // These can run in the background or be scheduled
    monitorKeywords();      // Track user keywords and rankings
    monitorCompetitor();    // Track competitor websites, prices, content changes

    // Schedule recurring tasks for checks, reports, and notifications
    scheduleTasks();        // Cron jobs for periodic monitoring

    console.log(" SEO monitoring services are running");
  } catch (err) {
    console.error(" Failed to start backend:", err.message);
    process.exit(1);
  }
})();
