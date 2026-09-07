// Confirms the two things fixed last: a legible stamp, and a derived list that
// does not stack every name sharing an opening word together.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
mkdirSync(".shots", { recursive: true });

const browser = await chromium.launch();

for (const stock of ["paper", "deed"]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate((s) => {
    localStorage.setItem("ng-stock", s);
    document.documentElement.dataset.stock = s;
  }, stock);
  await page.reload({ waitUntil: "networkidle" });

  await page.getByRole("tab", { name: "Vastu register" }).click();
  await page.selectOption('select[aria-label="Birth nakshatra"]', "23");
  await page.selectOption('select[aria-label="Nakshatra pada"]', "2");
  await page
    .locator('input[aria-label="Day of the month you were born"]')
    .pressSequentially("23", { delay: 12 });
  await page.getByRole("button", { name: "No, just me" }).click();
  await page.getByRole("button", { name: /Next — the business/ }).click();
  await page.selectOption('select[aria-label="Trade"]', "finance");
  await page.selectOption('select[aria-label="Entrance direction"]', "n");
  await page.getByRole("button", { name: "Renown and growth" }).click();
  await page.getByRole("button", { name: "Derive names" }).click();
  await page.waitForTimeout(12000);

  const names = await page
    .locator("li")
    .filter({ hasText: "Show derivation" })
    .locator("p")
    .first()
    .evaluateAll((els) => els.map((e) => e.textContent));

  const heads = await page.evaluate(() =>
    [...document.querySelectorAll("li")]
      .filter((li) => li.textContent?.includes("Show derivation"))
      .map((li) => li.querySelector("p")?.textContent?.trim())
      .filter(Boolean),
  );

  const leads = heads.map((n) => n.slice(0, 4).toLowerCase());
  const distinct = new Set(leads).size;
  console.log(`\n${stock}`);
  console.log(`  derived: ${heads.length}`);
  console.log(`  first eight: ${heads.slice(0, 8).join(", ")}`);
  console.log(`  distinct opening words in first eight: ${new Set(leads.slice(0, 8)).size}`);
  console.log(`  distinct overall: ${distinct}`);

  const entry = page.locator("li").filter({ hasText: "Show derivation" }).first();
  await entry.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `.shots/final-${stock}-list.png` });

  await page.getByRole("button", { name: "Show derivation" }).first().click();
  await page.waitForTimeout(400);
  await entry.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `.shots/final-${stock}-chain.png` });

  await context.close();
}

await browser.close();
console.log("\nconfirmed");
