import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", text: /Bridging/i },
  { path: "/projects", text: /Projects/i },
  { path: "/photos", text: /Photos/i },
  { path: "/photos/map", text: /Photo Map|Add .*Mapbox/i },
  { path: "/fulbrightmap", text: /New Taipei|Preparing the map|Add .*Mapbox/i },
  { path: "/experience/arcade", text: /Experience|Arcade|Start/i },
  { path: "/strike-tracker", text: /Strike Tracker/i },
];

for (const route of routes) {
  test(`${route.path} renders without page errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(route.path);
    await expect(page.locator("body")).toContainText(route.text);
    await expect(page.locator("main, #root")).toBeVisible();

    expect(errors.filter((message) => !message.includes("Failed to load resource"))).toEqual([]);
  });
}
