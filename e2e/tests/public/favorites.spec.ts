import { test, expect } from '@playwright/test';

test.describe('Favorites Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('E2E-FAV-001: Can add property to favorites from card', async ({ page }) => {
    await page.goto('/');
    
    const firstCard = page.locator('[data-testid="property-card"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    
    const favoriteBtn = firstCard.locator('[data-testid="toggle-favorite"]');
    await favoriteBtn.click();
    
    await expect(favoriteBtn).toHaveClass(/bg-red-50/);
    
    const favLink = page.locator('a[href="/favorites"]');
    await expect(favLink).toContainText('(1)');
  });

  test('E2E-FAV-002: Can remove property from favorites', async ({ page }) => {
    await page.goto('/');
    
    const firstCard = page.locator('[data-testid="property-card"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    
    const favoriteBtn = firstCard.locator('[data-testid="toggle-favorite"]');
    
    await favoriteBtn.click();
    await expect(favoriteBtn).toHaveClass(/bg-red-50/);
    
    await favoriteBtn.click();
    await expect(favoriteBtn).not.toHaveClass(/bg-red-50/);
    
    const favLink = page.locator('a[href="/favorites"]');
    await expect(favLink).toContainText('(0)');
  });

  test('E2E-FAV-003: Can navigate to favorites page', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('a[href="/favorites"]').click();
    
    await expect(page).toHaveURL('/favorites');
    await expect(page.locator('h1')).toContainText('My Favorites');
  });

  test('E2E-FAV-004: Favorites page shows empty state', async ({ page }) => {
    await page.goto('/favorites');
    
    await expect(page.locator('h2')).toContainText('No favorites yet');
    await expect(page.locator('text=Start exploring and save properties you love!')).toBeVisible();
  });

  test('E2E-FAV-005: Favorites page displays saved properties', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({ timeout: 10000 });
    
    const cards = page.locator('[data-testid="property-card"]');
    for (let i = 0; i < 3; i++) {
      await cards.nth(i).locator('[data-testid="toggle-favorite"]').click();
      await page.waitForTimeout(200);
    }
    
    await page.goto('/favorites');
    
    await expect(page.locator('[data-testid="property-card"]')).toHaveCount(3);
  });

  test('E2E-FAV-006: Favorites survive page reload', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="property-card"]').first().locator('[data-testid="toggle-favorite"]').click();
    await page.locator('[data-testid="property-card"]').nth(1).locator('[data-testid="toggle-favorite"]').click();
    
    await page.reload();
    
    const favLink = page.locator('a[href="/favorites"]');
    await expect(favLink).toContainText('(2)');
  });
});
