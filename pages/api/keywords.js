// pages/api/keywords.js
import { initDB, insert } from "../../lib/db.js";
import { getKeywordRanking } from "../../utils/keywordMonitor.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url, userId, keywords } = req.body;
  if (!url || !userId || !Array.isArray(keywords)) return res.status(400).json({ error: "Missing parameters" });

  try {
    await initDB();
    const rankings = await getKeywordRanking(url, keywords);

    await insert("keyword_rankings", {
      website_id: userId,
      url,
      rankings: JSON.stringify(rankings),
      created_at: new Date().toISOString(),
    });

    res.status(200).json({ success: true, rankings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
