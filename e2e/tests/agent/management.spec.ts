import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

test.describe('Agent Property Management', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('agent@realestate.pro', 'agent123');
    // Expect to be on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('E2E-031: Agent can view list of properties', async ({ page }) => {
    // Check if the table loads and contains properties
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Should see at least one property row
    const rows = page.locator('tr[data-testid^="property-row-"]');
    // Frontend pagination default is 5 items per page
    await expect(rows).toHaveCount(5); 
    
    // Check headers
    await expect(page.getByText('Thumbnail', { exact: true })).toBeVisible();
    await expect(page.getByText('Title', { exact: true })).toBeVisible();
    await expect(page.getByText('Price', { exact: true })).toBeVisible();
    await expect(page.getByText('Status', { exact: true })).toBeVisible();
  });

  test('E2E-032: Agent can edit a property', async ({ page }) => {
    // Target property with ID 9 (visible on page 1)
    const editButton = page.locator('[data-testid="edit-property-9"]');
    await editButton.click();

    // Verify redirection to edit page
    await expect(page).toHaveURL(/\/properties\/9\/edit/);
    
    // Verify form is populated (check title value)
    const titleInput = page.getByTestId('input-title');
    await expect(titleInput).not.toBeEmpty();
    
    // Update title
    const newTitle = `Updated Property Title ${Date.now()}`;
    await titleInput.fill(newTitle);
    
    // Submit form
    await page.getByTestId('submit-property').click();
    
    // Expect success message or redirection
    // Logic says redirect to dashboard after 1.5s
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    
    // Verify new title is visible in the row
    const row = page.locator('[data-testid="property-row-9"]');
    await expect(row).toContainText(/Updated Property Title/);
  });

  test('E2E-033: Agent can toggle property status', async ({ page }) => {
    // Target property with ID 9 (visible on page 1)
    const statusBadge = page.locator('[data-testid="property-status-9"]');
    
    // Get initial text
    const initialStatus = await statusBadge.innerText();
    const toggleButton = page.locator('[data-testid="toggle-status-property-9"]');
    
    // Click toggle
    await toggleButton.click();
    
    // Wait for API and UI update
    // The button text toggles between Publish and Unpublish
    // The badge text toggles between published and draft
    
    if (initialStatus.toLowerCase() === 'published') {
        await expect(statusBadge).toHaveText('draft', { ignoreCase: true });
        await expect(toggleButton).toHaveText('Publish');
    } else {
        await expect(statusBadge).toHaveText('published', { ignoreCase: true });
        await expect(toggleButton).toHaveText('Unpublish');
    }
    
    // Toggle back to restore state (optional but good practice)
    await toggleButton.click();
    await expect(statusBadge).toHaveText(initialStatus, { ignoreCase: true });
  });

  test('E2E-034: Agent can delete a property', async ({ page }) => {
    // Find a valid delete button dynamically to avoid ID dependency issues
    const rows = page.locator('tr[data-testid^="property-row-"]');
    await expect(rows.first()).toBeVisible();
    
    // Use the first row available, which is likely a test creation artifact or newest item
    const firstRow = rows.first();
    const testId = await firstRow.getAttribute('data-testid');
    const propertyId = testId?.split('-').pop();

    if (!propertyId) {
      throw new Error('Could not extract property ID from row');
    }

    const deleteButton = page.locator(`[data-testid="delete-property-${propertyId}"]`);
    
    // Ensure row exists first
    const row = page.locator(`[data-testid="property-row-${propertyId}"]`);
    await expect(row).toBeVisible();
    
    // Click delete
    await deleteButton.click();
    
    // Expect Confirmation Modal
    const modal = page.locator('text=Confirm Deletion');
    await expect(modal).toBeVisible();
    
    // Click Confirm in Modal
    const confirmButton = page.locator('[data-testid="confirm-delete"]');
    // Setup a Promise to wait for the API response which actually performs the deletion
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes(`/properties/${propertyId}`) && r.request().method() === 'DELETE' && r.status() === 200),
      confirmButton.click()
    ]);
    
    // Verify row is gone - wait for it to detach
    await expect(row).not.toBeVisible();
  });
});
