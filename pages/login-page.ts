import { Page } from '@playwright/test';


export class LoginPage {
    async login(username: string, password: string, page: Page): Promise<void> {
        await page.getByLabel('Username').fill(username);
        await page.getByLabel('Password').fill(password);
        await page.getByRole('button', { name: 'Login' }).click();
    }
}