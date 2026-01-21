import { test, expect } from '@playwright/test';

test.describe('Public Properties - Browse Listings', () => {
  test('E2E-011: Public can view published properties without authentication', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({ timeout: 10000 });
    const propertyCount = await page.locator('[data-testid="property-card"]').count();
    expect(propertyCount).toBeGreaterThan(0);
  });

  test('E2E-012: Property cards display title, price, and image', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('[data-testid="property-card"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await expect(firstCard.locator('[data-testid="property-title"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="property-price"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="property-image"]')).toBeVisible();
  });

  test('E2E-013: Can click property card to view details', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('[data-testid="property-card"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    const propertyTitle = await firstCard.locator('[data-testid="property-title"]').textContent();
    await firstCard.locator('a', { hasText: 'View Details' }).click();
    await expect(page).toHaveURL(/\/properties\/\d+/, { timeout: 5000 });
    await expect(page.locator('h1, h2').filter({ hasText: propertyTitle || '' })).toBeVisible();
  });

  test('E2E-014: Multiple properties are displayed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({ timeout: 10000 });
    const propertyCount = await page.locator('[data-testid="property-card"]').count();
    expect(propertyCount).toBeGreaterThanOrEqual(5);
  });

  test('E2E-015: User can filter properties by City', async ({ page }) => {
    await page.goto('/');
    
    // Select city "New York"
    const citySelect = page.getByTestId('filter-city');
    await expect(citySelect).toBeVisible();
    await citySelect.selectOption('New York');

    // Wait for list to update - New York properties should be visible
    // We expect cards to contain "New York" text
    const cards = page.getByTestId('property-card');
    await expect(cards.first()).toBeVisible();
    
    // Check first 3 cards to ensure they are in New York
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
        await expect(cards.nth(i)).toContainText('New York');
    }
  });

  test('E2E-016: User can sort properties by Price', async ({ page }) => {
    await page.goto('/');
    
    const sortSelect = page.getByTestId('sort-by');
    await sortSelect.selectOption('price_asc');
    
    // Wait for update
    await page.waitForTimeout(1000); 
    
    // Get prices of first few elements
    const priceLocators = page.getByTestId('property-price');
    const price1Text = await priceLocators.nth(0).innerText();
    const price2Text = await priceLocators.nth(1).innerText();
    
    // Parse "$250,000" -> 250000
    const parsePrice = (p: string) => parseInt(p.replace(/[^0-9]/g, ''));
    
    expect(parsePrice(price1Text)).toBeLessThanOrEqual(parsePrice(price2Text));
    
    // Sort Descending
    await sortSelect.selectOption('price_desc');
    await page.waitForTimeout(1000);
    
    const priceHighText = await priceLocators.nth(0).innerText();
    const priceNextText = await priceLocators.nth(1).innerText();
    
    expect(parsePrice(priceHighText)).toBeGreaterThanOrEqual(parsePrice(priceNextText));
  });
});
