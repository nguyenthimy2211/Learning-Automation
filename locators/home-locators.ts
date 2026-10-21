import type { Locator, Page } from '@playwright/test';
import { CommonLocators } from './common-locators';

export class HomeLocators extends CommonLocators {
    btnMakeAppointment!: Locator;
    btnMenuToggle!: Locator;
    btnMenuClose!: Locator;
    linkSidebarHome!: Locator;
    linkSidebarLogin!: Locator;
    btnToTop!: Locator;

    constructor(page: Page) {
        super(page);
        this.locatorInitialization();
    }

    protected override locatorInitialization(): void {
        super.locatorInitialization();
        this.btnMakeAppointment = this.page.getByRole('link', { name: 'Make Appointment' });
        this.btnMenuToggle = this.page.locator('#menu-toggle');
        this.btnMenuClose = this.page.getByRole('button', { name: 'Close' });
        this.linkSidebarHome = this.page.getByRole('link', { name: 'Home' });
        this.linkSidebarLogin = this.page.getByRole('link', { name: 'Login' });
        this.btnToTop = this.page.getByRole('button', { name: 'To Top' });
    }
}
