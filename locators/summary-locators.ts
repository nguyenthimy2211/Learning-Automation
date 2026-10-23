import { Locator, Page } from '@playwright/test';
import { CommonLocators } from './common-locators';

export class SummaryLocators extends CommonLocators {
    lblFacility!: Locator;
    lblHospitalReadmission!: Locator;
    lblHealthcareProgram!: Locator;
    lblVisitDate!: Locator;
    lblComment!: Locator;
    btnGotoHomePage!: Locator;

    constructor(page: Page) {
        super(page);
        this.locatorInitialization();
    }
protected override locatorInitialization(): void {
        super.locatorInitialization();
        this.lblFacility = this.page.locator('#facility');
        this.lblHospitalReadmission = this.page.locator('#hospital_readmission');
        this.lblHealthcareProgram = this.page.locator('#program');
        this.lblVisitDate = this.page.locator('#visit_date');
        this.lblComment = this.page.locator('#comment');
        this.btnGotoHomePage = this.page.getByRole('link', { name: 'Go to Homepage' });
    }


}
