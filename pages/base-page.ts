import { HomePage } from "./ui/home-page";
import { LoginPage } from "./ui/login-page";
import { test as baseTest, Page } from "@playwright/test";
import { MakeAppointmentPage } from "./ui/make-appointment-page";
import { SummaryPage } from "./ui/summary-page";

export const test = baseTest.extend<{
    loginPage: LoginPage;
    homePage: HomePage;
    appointmentPage: MakeAppointmentPage;
    summaryPage: SummaryPage;
}>({
    loginPage: async ({ page, context }, use) => {
        const instance = new LoginPage(page);
        context.on('page', (newPage: Page) => {
            instance.setPage(newPage);
        });
        await use(instance);
    },
    homePage: async ({ page, context }, use) => {
        const instance = new HomePage(page);
        context.on('page', (newPage: Page) => {
            instance.setPage(newPage);
        });
        await use(instance);
    }
});
