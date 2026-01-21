import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.bg-red-100');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    // First wait for API success, then navigation
    const [response] = await Promise.all([
      this.page.waitForResponse(r => 
        r.url().includes('/auth/access-token') && r.status() === 200
      ),
      this.loginButton.click()
    ]);
    
    // Then wait for navigation to complete
    await this.page.waitForURL('/dashboard', { timeout: 10000 });
  }

  async expectErrorMessage(message: string) {
    await this.page.waitForSelector('.bg-red-100', { timeout: 5000 });
    const text = await this.errorMessage.textContent();
    return text?.toLowerCase().includes(message.toLowerCase()) ?? false;
  }

  async isOnLoginPage() {
    return this.page.url().includes('/login');
  }
}
