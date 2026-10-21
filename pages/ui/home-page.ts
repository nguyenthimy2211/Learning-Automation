import { Page } from "@playwright/test";
import { HomeLocators } from "../../locators/home-locators";
import { Constants } from "../../utilities/constants";
import { CommonPage } from "./common-page";


export class HomePage extends HomeLocators {
    commonPage: CommonPage;
    constructor(page: Page) {
        super(page);
        this.commonPage = new CommonPage(page);
    }

    /**
     * Navigates to the home page of the application.
     * This method uses the base URL defined in the Constants class to navigate to the home page.
     * It is an asynchronous function that returns a Promise<void>.
     *
     * @returns {Promise<void>} A promise that resolves when the navigation is complete.
     */
    async goto(): Promise<void> {
        await this.page.goto(Constants.BASE_URL);
    }

    /**
     * Clicks the "Make Appointment" button on the home page.
     * This method uses the CommonPage class to perform the click action on the "Make Appointment" button.
     * It is an asynchronous function that returns a Promise<void>.
     *
     * @returns {Promise<void>} A promise that resolves when the click action is complete.
     */
    async clickMakeAppointment(): Promise<void> {
        await this.commonPage.click(this.btnMakeAppointment);
    }


}
