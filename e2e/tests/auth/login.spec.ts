import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

test.describe('Authentication - Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('E2E-001: Agent can login successfully', async ({ page }) => {
    const email = 'agent@realestate.pro';
    const password = 'agent123';
    await loginPage.login(email, password);
    await page.waitForURL('/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('E2E-002: Admin can login successfully', async ({ page }) => {
    const email = 'admin@realestate.pro';
    const password = 'admin123';
    await loginPage.login(email, password);
    await page.waitForURL('/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('E2E-003: Login fails with invalid credentials', async ({ page }) => {
    const email = `invalid-${Date.now()}@example.com`;
    const password = 'wrongpassword';
    await loginPage.login(email, password);
    const hasError = await loginPage.expectErrorMessage('Invalid email or password');
    expect(hasError).toBe(true);
    expect(await loginPage.isOnLoginPage()).toBe(true);
  });

  test('E2E-004: Rate limiting triggers after 5 failed attempts', async ({ page }) => {
    const email = `ratelimit-${Date.now()}@example.com`;
    const wrongPassword = 'wrongpassword';
    for (let i = 0; i < 5; i++) {
      await loginPage.login(email, wrongPassword);
      await page.waitForTimeout(500);
      await loginPage.goto();
    }
    await loginPage.login(email, wrongPassword);
    const hasRateLimitError = await loginPage.expectErrorMessage('too many');
    expect(hasRateLimitError).toBe(true);
    expect(await loginPage.isOnLoginPage()).toBe(true);
  });
});
