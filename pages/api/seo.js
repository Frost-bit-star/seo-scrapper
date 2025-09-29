// pages/api/seo.js
import { initDB, insert } from "../../lib/db.js";
import { analyzeSite } from "../../playwright/analyzeSite.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url, userId } = req.body;
  if (!url || !userId) return res.status(400).json({ error: "Missing parameters" });

  try {
    await initDB();
    const result = await analyzeSite(url);

    await insert("seo_results", {
      website_id: userId,
      title: result.title,
      meta_description: result.metaDescription,
      h1: result.h1.join(" | "),
      load_time: result.loadTime,
      total_links: result.totalLinks,
      broken_links: JSON.stringify(result.brokenLinks),
      screenshot_path: result.screenshotPath,
    });

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
