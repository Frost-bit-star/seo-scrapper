import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function analyzeSite(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const result = {
    url,
    status: "unknown",
    title: "",
    h1: [],
    meta: {},
    links: { internal: [], external: [], broken: [] },
    images: [],
    performance: {},
    screenshot: "",
    timestamp: new Date(),
  };

  try {
    const response = await page.goto(url, { waitUntil: "load", timeout: 60000 });
    result.status = response.status();

    // Extract page info
    result.title = await page.title();
    result.h1 = await page.$$eval("h1", els => els.map(el => el.innerText.trim()));

    // Meta tags
    const metas = await page.$$eval("meta", els =>
      els.map(el => ({ name: el.getAttribute("name"), content: el.getAttribute("content") }))
    );
    metas.forEach(m => {
      if (m.name) result.meta[m.name.toLowerCase()] = m.content;
    });

    // Links
    const anchors = await page.$$eval("a", els => els.map(a => a.href));
    for (const link of anchors) {
      try {
        const res = await page.goto(link, { waitUntil: "domcontentloaded", timeout: 10000 });
        if (res.status() >= 400) result.links.broken.push(link);
        else if (link.includes(url)) result.links.internal.push(link);
        else result.links.external.push(link);
      } catch {
        result.links.broken.push(link);
      }
    }

    // Images
    result.images = await page.$$eval("img", imgs => imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height
    })));

    // Performance metrics
    result.performance = await page.evaluate(() => JSON.stringify(window.performance.timing));

    // Take screenshot
    const screenshotsDir = path.join(process.cwd(), "public", "screenshots");
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
    const filename = path.join(screenshotsDir, `${Date.now()}.png`);
    await page.screenshot({ path: filename, fullPage: true });
    result.screenshot = filename;

  } catch (err) {
    console.error("Playwright analyzeSite error:", err.message);
    result.error = err.message;
  } finally {
    await browser.close();
  }

  return result;
}

// ✅ Default export for ES module compatibility
export default analyzeSite;
