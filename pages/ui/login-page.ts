import { Page } from '@playwright/test';
import { LoginLocator } from '../../locators/login-locators';
import { CommonPage } from './common-page';
import { User } from '../../interfaces/user';
import { AssertHelper } from '../../utilities/assert-helper';


export class LoginPage extends LoginLocator {

    commonPage: CommonPage;
    assertHelper: AssertHelper;
    constructor(page: Page) {
        super(page);
        this.commonPage = new CommonPage(page);
        this.assertHelper = new AssertHelper(page);
    }

    /**
     * Click On Login Button
     * @param user
     */
    async login(user: User): Promise<void> {
        await this.commonPage.fill(this.inputUsername, user.username);
        await this.commonPage.fill(this.inputPassword, user.password);
        await this.commonPage.click(this.btnLogin);
    }

    /**
     * Click Login 1 Button Test
     * @param username
     * @param password
     */
    async login1(username: string, password: string): Promise<void> {
        await this.commonPage.fill(this.inputUsername, username);
        await this.commonPage.fill(this.inputPassword, password);
        await this.commonPage.waitForPageLoad();
        await this.commonPage.click(this.btnLogin);
    }

    /**
     * Get Login message
     * @returns
     */
    async getLoginMessage(): Promise<string> {
        return await this.commonPage.textContent(this.lblLoginMessage);
    }

    /**
     * Verify URL changes to appointment after user login sucess
     */
    async verifyLoginSuccess(): Promise<void> {
        // const loginMessage = await this.getLoginMessage();
        // return loginMessage.includes('Login successful');
        await this.assertHelper.expectToHaveURL(/appointment/);
    }
}
