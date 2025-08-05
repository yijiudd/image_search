import { test, expect } from '@playwright/test';

test('homepage has search functionality', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('#input')).toBeVisible();
	await expect(page.locator('button[type="submit"]')).toBeVisible();
	await expect(page.locator('button[type="submit"]')).toHaveText('Search');
});

test('search input accepts text', async ({ page }) => {
	await page.goto('/');

	const searchInput = page.locator('#input');
	await searchInput.fill('mars');
	await expect(searchInput).toHaveValue('mars');
});

test('typing mars and clicking search shows searched images', async ({ page }) => {
	await page.goto('/');

	// Type "mars" in the search input
	const searchInput = page.locator('#input');
	await searchInput.fill('mars');
	
	// Click the search button
	const searchButton = page.locator('button[type="submit"]');
	await searchButton.click();
	
	// Wait for the search to complete and verify results are shown
	await expect(page.locator('h2')).toContainText('results for "mars"');
	
	// Verify that images are displayed
	await expect(page.locator('.content img').first()).toBeVisible()
	
	// Verify the search bar has moved (indicating search was performed)
	await expect(page.locator('.searchBar')).toHaveClass(/moved/);
});
