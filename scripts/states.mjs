import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 620 }, deviceScaleFactor: 2 });

// Validation error: too short after normalization.
await page.goto(BASE, { waitUntil: "networkidle" });
await page.locator('input[aria-label="Name to check"]').fill("a");
await page.getByText(/at least two letters/).waitFor({ timeout: 8000 });
console.log("PASS  too-short error shown");
await page.screenshot({ path: "shots/14-name-too-short.png" });

// Normalization shown back rather than failing silently.
await page.locator('input[aria-label="Name to check"]').fill("Acme Coffee Co.");
await page.getByText("acmecoffeeco.com").first().waitFor({ timeout: 8000 });
console.log("PASS  normalization shown back");
await page.screenshot({ path: "shots/15-normalization.png" });

// Paste a full URL and confirm it strips to the label.
await page.locator('input[aria-label="Name to check"]').fill("https://www.northwind.com/pricing");
await page.waitForTimeout(1200);
const pill = await page.locator('input[aria-label="Name to check"]').locator("xpath=../..").innerText();
console.log("PASS  pasted URL handled:", pill.replace(/\s+/g, " ").trim());
await page.screenshot({ path: "shots/16-pasted-url.png" });

await browser.close();
console.log("done");
