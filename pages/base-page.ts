import { HomePage } from './ui/home-page';
import { LoginPage } from './ui/login-page';
import { test as baseTest, Page } from '@playwright/test';
import { MakeAppointmentPage } from './ui/make-appointment-page';
import { SummaryPage } from './ui/summary-page';
import { APIPage } from './api/api.page';

export const test = baseTest.extend<{
    loginPage: LoginPage;
    homePage: HomePage;
    appointmentPage: MakeAppointmentPage;
    summaryPage: SummaryPage;
    apiPage: APIPage;
}>({
     /*eslint no-empty-pattern: "off"*/
    apiPage: async({ }, use) => {
        const instance = new APIPage();
        await use(instance);
    },

    loginPage: async({ page, context }, use) => {
        const instance = new LoginPage(page);
        context.on('page', (newPage: Page) => {
            instance.setPage(newPage);
        });
        await use(instance);
    },
    homePage: async({ page, context }, use) => {
        const instance = new HomePage(page);
        context.on('page', (newPage: Page) => {
            instance.setPage(newPage);
        });
        await use(instance);
    },
    appointmentPage: async({ page, context }, use) => {
        const instance = new MakeAppointmentPage(page);
        context.on('page', (newPage: Page) => {
            instance.setPage(newPage);
        });
        await use(instance);
    },
    summaryPage: async({ page, context }, use) => {
        const instance = new SummaryPage(page);
        context.on('page', (newPage: Page) => {
            instance.setPage(newPage);
        });
        await use(instance);
    },
});
