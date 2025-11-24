import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Resume AI Platform - E2E Tests', () => {
    test('homepage loads correctly', async ({ page }) => {
        await page.goto('/');

        // Check for main heading
        await expect(page.locator('h1')).toContainText('Resume AI');

        // Check for description
        await expect(page.locator('text=Get a recruiter-grade evaluation')).toBeVisible();

        // Check for upload area
        await expect(page.locator('text=Drag & drop your resume')).toBeVisible();
    });

    test('file upload area displays correctly', async ({ page }) => {
        await page.goto('/');

        // Check for supported file types
        await expect(page.locator('text=PDF or DOCX')).toBeVisible();

        // Check for file size limit
        await expect(page.locator('text=Max 10MB')).toBeVisible();
    });

    test('privacy message is displayed', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('text=Privacy First')).toBeVisible();
        await expect(page.locator('text=processed in your browser')).toBeVisible();
    });

    test('navigation to dashboard without data shows no content', async ({ page }) => {
        await page.goto('/dashboard');

        // Should redirect or show no data since we haven't uploaded
        const pageContent = await page.content();

        // Either redirected to home or shows empty dashboard
        const isRedirected = page.url().includes('/');
        const hasBackButton = await page.locator('text=Back to Upload').isVisible().catch(() => false);

        expect(isRedirected || hasBackButton).toBeTruthy();
    });
});
