// pages/api/schedular.js
import { read, insert } from "../../lib/db.js";
import { monitorKeywords } from "../../playwright/monitorKeywords.js";
import { monitorCompetitor } from "../../playwright/monitorCompetitor.js";
import cron from "cron";

export function scheduleTasks() {
  // Run every hour (adjust cron timing as needed)
  const job = new cron.CronJob("0 * * * *", async () => {
    console.log("🕒 Running scheduled SEO monitoring scan...");

    try {
      // Fetch all monitored websites from DB
      const monitoredSites = await read("monitored_sites", 1000);

      for (const site of monitoredSites) {
        const { url, userId, keywords = [] } = site;

        // Monitor keywords
        const keywordResult = await monitorKeywords(url, keywords);

        // Monitor competitor changes
        const competitorResult = await monitorCompetitor(url);

        // Store historical results
        await insert("keyword_monitoring", {
          userId,
          url,
          result: keywordResult,
          timestamp: new Date(),
        });
        await insert("competitor_monitoring", {
          userId,
          url,
          result: competitorResult,
          timestamp: new Date(),
        });
      }

      console.log(" Scheduled scan completed successfully");
    } catch (err) {
      console.error("Scheduler task error:", err.message);
    }
  });

  job.start();
  console.log("⏱ Scheduler started (runs every hour)");
}
