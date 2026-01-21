import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';
import * as path from 'path';

test.describe('Property Creation - Agent Workflow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('agent@realestate.pro', 'agent123');
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
  });

  test('E2E-021: Agent can access property creation form', async ({ page }) => {
    await expect(page.locator('[data-testid="add-property-button"]')).toBeVisible();
    
    await page.locator('[data-testid="add-property-button"]').click();
    
    await expect(page.locator('[data-testid="property-form"]')).toBeVisible();
  });

  test('E2E-022: Property creation form has all required fields', async ({ page }) => {
    await page.locator('[data-testid="add-property-button"]').click();
    await expect(page.locator('[data-testid="property-form"]')).toBeVisible();
    
    await expect(page.locator('[data-testid="input-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-city"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-surface"]')).toBeVisible();
    await expect(page.locator('[data-testid="select-property-type"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-bedrooms"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-bathrooms"]')).toBeVisible();
    await expect(page.locator('[data-testid="textarea-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="image-upload-zone"]')).toBeVisible();
  });

  test('E2E-023: Agent can create property with images', async ({ page }) => {
    await page.locator('[data-testid="add-property-button"]').click();
    await expect(page.locator('[data-testid="property-form"]')).toBeVisible();
    
    await page.locator('[data-testid="input-title"]').fill('E2E Test Property');
    await page.locator('[data-testid="input-price"]').fill('250000');
    await page.locator('[data-testid="input-city"]').fill('Test City');
    await page.locator('[data-testid="input-surface"]').fill('120');
    await page.locator('[data-testid="select-property-type"]').selectOption('apartment');
    await page.locator('[data-testid="input-bedrooms"]').fill('3');
    await page.locator('[data-testid="input-bathrooms"]').fill('2');
    await page.locator('[data-testid="textarea-description"]').fill('This is an E2E test property');
    
    const testImagePath = path.join(__dirname, '../../fixtures/test-image.jpg');
    await page.locator('[data-testid="file-input"]').setInputFiles(testImagePath);
    
    await expect(page.locator('[data-testid="image-preview"]')).toBeVisible();
    
    await page.locator('[data-testid="submit-property"]').click();
    
    await expect(page.locator('[data-testid="form-success"]')).toBeVisible({ timeout: 10000 });
  });

  test('E2E-024: Form shows error when submitting without images', async ({ page }) => {
    await page.locator('[data-testid="add-property-button"]').click();
    await expect(page.locator('[data-testid="property-form"]')).toBeVisible();
    
    await page.locator('[data-testid="input-title"]').fill('Test Property No Images');
    await page.locator('[data-testid="input-price"]').fill('150000');
    await page.locator('[data-testid="input-city"]').fill('Test City');
    await page.locator('[data-testid="input-surface"]').fill('100');
    
    await page.locator('[data-testid="submit-property"]').click();
    
    await expect(page.locator('[data-testid="form-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="form-error"]')).toContainText('At least one image is required');
  });
});
