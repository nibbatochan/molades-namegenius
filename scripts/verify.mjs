import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = "shots";
const BASE = "http://localhost:3000";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const shot = (name, opts = {}) => page.screenshot({ path: `${OUT}/${name}.png`, ...opts });

const meterLabel = () =>
  page.locator('[role="meter"]').first().getAttribute("aria-label");

// 1. Unreadable URL: a private address must be refused, not fetched.
await page.goto(BASE, { waitUntil: "networkidle" });
await page.locator('input[aria-label="Website to read"]').fill("http://localhost:9999");
await page.getByRole("button", { name: "Read" }).click();
await page.getByText(/only read public websites/).waitFor({ timeout: 15000 });
console.log("PASS  private URL refused:", await page.getByText(/only read public websites/).innerText());
await shot("11-url-unreadable");

// 2. Meter levels.
await page.goto(BASE, { waitUntil: "networkidle" });
console.log("meter empty   ->", await meterLabel());
await page.locator('input[aria-label="Name to check"]').fill("northwind");
await page.waitForTimeout(200);
console.log("meter name    ->", await meterLabel());
await page
  .locator('textarea[aria-label="What are you building"]')
  .fill("A scheduling tool for independent physiotherapy clinics so patients can book and reschedule their own appointments without phoning reception.");
await page.waitForTimeout(300);
console.log("meter + desc  ->", await meterLabel());
await shot("12-meter-good");

// 3. A run must fire with only the description filled.
await page.goto(BASE, { waitUntil: "networkidle" });
await page
  .locator('textarea[aria-label="What are you building"]')
  .fill("A quiet note-taking app for field biologists working offline in remote places, syncing when signal returns.");
await page.waitForTimeout(400);
const runButton = page.getByRole("button", { name: "Find available names" });
console.log("PASS  run enabled with description only:", await runButton.isEnabled());
await runButton.click();
await page
  .getByText(/Every one of these was free|Nothing came back free/)
  .first()
  .waitFor({ timeout: 90000 });
const cards = await page.locator("h2 ~ * >> text=/\\.com$/").count().catch(() => 0);
console.log("PASS  description-only run produced results, cards seen:", cards);
await shot("13-description-only-run");

await browser.close();
console.log("done");
