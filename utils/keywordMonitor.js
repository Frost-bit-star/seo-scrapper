// utils/keywordMonitor.js
import { chromium } from "playwright";

export async function getKeywordRanking(url, keywords = []) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const rankings = [];

  for (const keyword of keywords) {
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`);
    const links = await page.$$eval("a", (els) => els.map((a) => a.href));
    const rank = links.findIndex((link) => link.includes(url)) + 1;
    rankings.push({ keyword, rank: rank || null });
  }

  await browser.close();
  return rankings;
}
