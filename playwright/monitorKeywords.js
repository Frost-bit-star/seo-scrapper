import { chromium } from "playwright";

export async function monitorKeywords(url, keywords = []) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const result = { url, rankings: [], timestamp: new Date() };

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    const content = await page.content();

    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const count = (content.match(regex) || []).length;
      result.rankings.push({ keyword, count });
    }
  } catch (err) {
    console.error("monitorKeywords error:", err.message);
    result.error = err.message;
  } finally {
    await browser.close();
  }

  return result;
}
