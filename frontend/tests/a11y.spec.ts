import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

test.describe('Accessibility Verification (Axe)', () => {
  for (const p of pagesToTest) {
    test(`Verify accessibility on ${p.name} page`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'networkidle' });

      // Wait a moment for dynamic data and animations
      await page.waitForTimeout(2000);

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      
      // We expect zero accessibility violations
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
