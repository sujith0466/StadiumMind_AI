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
