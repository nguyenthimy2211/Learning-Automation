import type { Locator, Page } from '@playwright/test';
import { CommonLocators } from './common-locators';
export class LoginLocator extends CommonLocators {

    inputUsername!: Locator;
    inputPassword!: Locator;
    btnLogin!: Locator;
    lblLoginMessage!: Locator;
    constructor(page: Page) {
        super(page);
        this.locatorInitialization();
    }
    protected override locatorInitialization(): void {
        super.locatorInitialization();
        this.inputUsername = this.page.getByLabel('Username');
        this.inputPassword = this.page.getByLabel('Password');
        this.btnLogin = this.page.getByRole('button', { name: 'Login' });
        this.lblLoginMessage = this.page.locator('#login_message');
    }
}
