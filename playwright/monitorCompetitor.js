import { chromium } from "playwright";
import { diffHTML } from "../utils/diff.js";

async function monitorCompetitor(url, previousHTML = "") {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const result = {
    url,
    changes: [],
    products: [],
    currentHTML: "",
    timestamp: new Date(),
  };

  try {
    // Go to the target URL
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    const html = await page.content();

    // Compare with previous HTML if provided
    if (previousHTML) {
      result.changes = diffHTML(previousHTML, html);
    }

    // Optional: parse products/prices from the page
    const products = await page.$$eval(".product", items =>
      items.map(item => ({
        name: item.querySelector(".name")?.innerText.trim(),
        price: item.querySelector(".price")?.innerText.trim(),
        available: !item.classList.contains("sold-out")
      }))
    );

    result.products = products;
    result.currentHTML = html;

    // You could add more scraping logic here if needed in future
    // e.g., monitoring promotions, ratings, reviews, etc.

  } catch (err) {
    console.error("monitorCompetitor error:", err.message);
    result.error = err.message;
  } finally {
    await browser.close();
  }

  return result;
}

// ✅ Default export for ES modules
export default monitorCompetitor;
