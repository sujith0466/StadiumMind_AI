import { test, expect } from '@playwright/test';

const pagesToTest = [
  { path: '/', name: 'landing' },
  { path: '/fan', name: 'fan' },
  { path: '/executive', name: 'executive' },
  { path: '/operations', name: 'operations' },
  { path: '/crowd', name: 'crowd' },
  { path: '/emergency', name: 'emergency' },
  { path: '/volunteer', name: 'volunteer' },
  { path: '/transport', name: 'transport' },
];

test.describe('StadiumMind AI E2E Verification', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Browser console error: ${msg.text()}`);
      }
    });

    page.on('response', response => {
      if (response.status() >= 400 && response.status() < 600) {
        if (response.url().includes('localhost') || response.url().includes('127.0.0.1')) {
          console.warn(`Failed internal network request: ${response.url()} [${response.status()}]`);
        }
      }
    });
  });

  for (const p of pagesToTest) {
    test(`Verify ${p.name} dashboard`, async ({ page }, testInfo) => {
      await page.goto(p.path, { waitUntil: 'networkidle' });

      // Wait a moment for dynamic data to settle (animations, skeletons)
      await page.waitForTimeout(2000); 

      // Interact with specific elements based on the page
      if (p.name === 'landing') {
        const btn = page.getByRole('link', { name: /Fan Portal/i }).first();
        if (await btn.isVisible()) {
          await btn.hover();
        }
      } else if (p.name === 'fan') {
        const input = page.getByPlaceholder(/Ask the stadium AI/i);
        if (await input.isVisible()) {
          await input.fill('Where is the nearest restroom?');
          await page.keyboard.press('Enter');
          await page.waitForTimeout(1000);
        }
      } else if (p.name === 'operations') {
        // Try to click an incident action button
        const actionBtn = page.getByRole('button', { name: /Dispatch/i }).first();
        if (await actionBtn.isVisible()) {
          await actionBtn.click();
        }
      } else if (p.name === 'emergency') {
        const escalateBtn = page.getByRole('button', { name: /Escalate/i }).first();
        if (await escalateBtn.isVisible()) {
          await escalateBtn.click();
        }
      }

      const getFilename = (name: string, projectName: string) => {
        if (projectName === 'Desktop Chrome') {
          if (name === 'landing') return 'landing-desktop.png';
          if (name === 'fan') return 'fan-portal.png';
          return `${name}-dashboard.png`;
        }
        if (projectName === 'Tablet Chrome') {
          return `${name}-tablet.png`;
        }
        return `${name}-mobile.png`;
      };

      const filename = getFilename(p.name, testInfo.project.name);
      const filepath = `../screenshots/${filename}`;
      
      await page.screenshot({ path: filepath, fullPage: true });

      await expect(page.locator('body')).toBeVisible();
    });
  }
});
