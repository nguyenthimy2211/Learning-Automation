import { Page } from "@playwright/test";
import { SummaryLocator } from "../../locators/summary-locators";
import { AssertHelper } from "../../utilities/assert-helper";
import { CommonPage } from "./common-page";
import { AppointmentSummary } from "../../interfaces/appointment";


export class SummaryPage extends SummaryLocator {
    commonPage: CommonPage;
    assertHelper: AssertHelper;
    constructor(page: Page) {
        super(page);
        this.commonPage = new CommonPage(page);
        this.assertHelper = new AssertHelper(page);
    }

    /**
     * Wait For Summary Page
     */
    async waitForPage(): Promise<void> {
        await this.assertHelper.expectToHaveURL(/summary/);
        await this.assertHelper.assertElementVisible(this.lblFacility);
    }

    /**
     * Get Summary
     * @returns
     */
    async getSummary(): Promise<AppointmentSummary> {
        return {
            facility: await this.commonPage.textContent(this.lblFacility),
            hospitalReadmission: await this.commonPage.textContent(this.lblHospitalReadmission) == 'Yes',
            healthcareProgram: await this.commonPage.textContent(this.lblHealthcareProgram),
            visitDate: await this.commonPage.textContent(this.lblVisitDate),
            comment: await this.commonPage.textContent(this.lblComment),
        }
    }

    /**
     * Verify Summary
     * @param expect
     */
    async verifySummary(expect: AppointmentSummary): Promise<void> {
        await this.assertHelper.expectToHaveText(this.lblFacility, expect.facility);
        await this.assertHelper.expectToHaveText(this.lblHospitalReadmission, expect.hospitalReadmission ? 'Yes' : 'No');
        await this.assertHelper.expectToHaveText(this.lblHealthcareProgram, expect.healthcareProgram);
        await this.assertHelper.expectToHaveText(this.lblVisitDate, expect.visitDate);
        await this.assertHelper.expectToHaveText(this.lblComment, expect.comment);
    }

    /**
     * Click Go To Home Page
     */
    async clickGoToHomePage(): Promise<void> {
        await this.commonPage.click(this.btnGotoHomePage);
    }
}
