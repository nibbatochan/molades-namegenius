// Batched inspection round: every state we need to look at in one render pass,
// both themes, desktop and mobile. Screenshots land in .shots/.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = ".shots";
mkdirSync(OUT, { recursive: true });

const DESKTOP = { width: 1440, height: 950 };
const MOBILE = { width: 390, height: 844 };

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    localStorage.setItem("ng-theme", t);
    document.documentElement.dataset.theme = t;
  }, theme);
}

async function shot(page, name) {
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log(`  ${name}`);
}

async function full(page, name) {
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(`  ${name} (full)`);
}

/** Real key events, so the controlled input's state actually moves. */
async function type(page, text) {
  const entry = page.locator("#entry");
  await entry.click();
  await entry.press("ControlOrMeta+a");
  await entry.press("Delete");
  await entry.pressSequentially(text, { delay: 12 });
}

const browser = await chromium.launch();

for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({ viewport: DESKTOP });
  const page = await context.newPage();

  await page.goto(BASE, { waitUntil: "networkidle" });
  await setTheme(page, theme);
  await page.reload({ waitUntil: "networkidle" });

  console.log(`\n${theme} / desktop`);
  await shot(page, `${theme}-01-hero`);
  await full(page, `${theme}-02-page`);

  // A taken name, so the taken pill lands.
  await type(page, "google");
  await page.waitForTimeout(2600);
  await shot(page, `${theme}-03-registered`);

  // A name that should be free.
  await type(page, "arkavista-nine");
  await page.waitForTimeout(2600);
  await shot(page, `${theme}-04-available`);

  // Normalisation feedback from a pasted URL.
  await type(page, "https://WWW.Acme Coffee.co.in/pricing");
  await page.waitForTimeout(2600);
  await shot(page, `${theme}-05-normalised`);

  // Another ending selected.
  await type(page, "arkavista");
  await page.getByRole("tab", { name: ".co.in", exact: true }).click();
  await page.waitForTimeout(2600);
  await shot(page, `${theme}-06-extension`);

  // The disclosed sheet.
  await page.getByRole("button", { name: /Tell us what you/ }).click();
  await page.waitForTimeout(300);
  await full(page, `${theme}-07-sheet`);

  // A generation run.
  await type(page, "northwind");
  await page.getByRole("button", { name: /Find available names/ }).click();
  await page.waitForTimeout(2200);
  await shot(page, `${theme}-08-streaming`);
  await page.waitForTimeout(9000);
  await full(page, `${theme}-09-results`);

  // The Vastu register.
  await page.getByRole("tab", { name: "Vastu derivation" }).click();
  await page.waitForTimeout(400);
  await shot(page, `${theme}-10-vastu-group1`);

  await page.selectOption('select[aria-label="Birth nakshatra"]', "23");
  await page.selectOption('select[aria-label="Nakshatra pada"]', "2");
  await page
    .locator('input[aria-label="Day of the month you were born"]')
    .pressSequentially("23", { delay: 12 });
  await page.getByRole("button", { name: "No, just me" }).click();
  await page.getByRole("button", { name: /Next — the business/ }).click();
  await page.waitForTimeout(300);
  await page.selectOption('select[aria-label="Trade"]', "finance");
  await page.selectOption('select[aria-label="Entrance direction"]', "n");
  await page.getByRole("button", { name: "Not yet" }).click();
  await page.getByRole("button", { name: "Renown and growth" }).click();
  await page.getByRole("button", { name: "Business to business" }).click();
  await full(page, `${theme}-11-vastu-answered`);

  await page.getByRole("button", { name: "Derive names" }).click();
  await page.waitForTimeout(11000);
  await full(page, `${theme}-12-vastu-derived`);

  // The derived list and the chain both need reading at real scale, not as a
  // full-page thumbnail, so scroll them into view and shoot the viewport.
  const firstEntry = page
    .locator("section")
    .filter({ hasText: "Show derivation" })
    .last();
  if (await firstEntry.count()) {
    await firstEntry.scrollIntoViewIfNeeded();
    await shot(page, `${theme}-13-vastu-list`);
    await page.getByRole("button", { name: "Show derivation" }).first().click();
    await page.waitForTimeout(400);
    await firstEntry.scrollIntoViewIfNeeded();
    await shot(page, `${theme}-14-vastu-chain`);
    await page.mouse.wheel(0, 700);
    await shot(page, `${theme}-15-vastu-chain-cont`);
  }

  await context.close();
}

// Mobile, light only: the composition has to hold, not be re-proven twice.
{
  const context = await browser.newContext({ viewport: MOBILE });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  console.log("\nlight / mobile");
  await shot(page, "mobile-01-hero");
  await full(page, "mobile-02-page");
  await type(page, "google");
  await page.waitForTimeout(2600);
  await shot(page, "mobile-03-registered");
  await page.getByRole("tab", { name: "Vastu derivation" }).click();
  await page.waitForTimeout(400);
  await full(page, "mobile-04-vastu");
  await context.close();
}

await browser.close();
console.log("\ndone");
