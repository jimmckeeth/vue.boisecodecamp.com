import { test, expect } from '@playwright/test';

test.describe('Boise Code Camp Migration Tests', () => {

  test('no console errors or warnings on home page', async ({ page }) => {
    const issues = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        issues.push(`[${msg.type()}] ${msg.text()}`);
      }
    });
    page.on('pageerror', err => issues.push(`[pageerror] ${err.message}`));

    await page.goto('http://localhost:4321/');
    // Wait for the hydration and data fetching
    await page.waitForTimeout(3000);
    
    expect(issues, `Found console issues: \n${issues.join('\n')}`).toHaveLength(0);
  });

  test('images are not broken on home page', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    // Wait for hydration
    await page.waitForTimeout(2000);
    
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      
      // For dynamic images like the logo, we might need to wait a bit or check specifically
      await expect(async () => {
        const src = await img.getAttribute('src');
        expect(src, `Image with alt "${alt}" is missing a src attribute`).not.toBeNull();
        expect(src, `Image with alt "${alt}" has an empty src attribute`).not.toBe("");
      }).toPass({ timeout: 5000 });

      const src = await img.getAttribute('src');
      const isLoaded = await img.evaluate((node) => node.complete && node.naturalWidth > 0);
      expect(isLoaded, `Image with src "${src}" (alt: "${alt}") failed to load`).toBeTruthy();
    }
  });

  test('home page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    await expect(page).toHaveTitle(/Boise Code Camp 2026/);
    
    // Check if Navbar exists
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Check for Hero content - the logo image has alt text
    await expect(page.locator('img[alt="codecamp words"]')).toBeVisible();
  });

  test('speakers page renders and loads data', async ({ page }) => {
    await page.goto('http://localhost:4321/speakers');
    await expect(page).toHaveTitle(/Speakers | Boise Code Camp 2026/);
    
    // Give it a moment for the Init component to fetch Sessionize data
    await page.waitForSelector('.speaker-deck', { timeout: 15000 });
    const speakers = page.locator('.speaker-deck .card');
    await expect(speakers).not.toHaveCount(0);
  });

  test('sessions page renders and loads data', async ({ page }) => {
    await page.goto('http://localhost:4321/sessions');
    await expect(page).toHaveTitle(/Sessions | Boise Code Camp 2026/);
    
    // Check if sessions list contains content
    await page.waitForSelector('.row', { timeout: 15000 });
    const sessions = page.locator('.row .session');
    await expect(sessions).not.toHaveCount(0);
  });

  test('navbar navigation works', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    
    // Click on Speakers link
    await page.click('a[href="/speakers"]');
    await expect(page).toHaveURL(/\/speakers/);
    
    // Click on Sessions link
    await page.click('a[href="/sessions"]');
    await expect(page).toHaveURL(/\/sessions/);
    
    // Back to Home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL(/\/$/);
  });

});
