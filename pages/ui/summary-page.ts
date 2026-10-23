import { type Page } from '@playwright/test';
import { SummaryLocators } from '@locators/summary-locators';
import type { AppointmentSummary } from '@interfaces/appointment';
import { AssertHelper } from '@utilities/assert-helper';
import { CommonPage } from './common-page';
import { step } from '@utilities/logging';

export class SummaryPage extends SummaryLocators {

  commonPage: CommonPage;
  assertHelper: AssertHelper;

  constructor(page: Page) {
    super(page);
    this.commonPage = new CommonPage(page);
    this.assertHelper = new AssertHelper(page);
  }


  /**
   * Wait for Summary page
   */
  @step('Wait for Summary page')
  async waitForPage(): Promise<void> {
    await this.assertHelper.expectToHaveURL(/summary/);
    await this.assertHelper.assertElementVisible(this.lblFacility);
  }


  /**
   * Get Summary
   * @returns
   */
  @step('Get Summary')
  async getSummary(): Promise<AppointmentSummary> {
    // return {
    //   facility: (await this.lblFacility.textContent())?.trim() ?? '',
    //   hospitalReadmission: (await this.lblHospitalReadmission.textContent())?.trim() === 'Yes',
    //   healthcareProgram: (await this.lblHealthcareProgram.textContent())?.trim() ?? '',
    //   visitDate: (await this.lblVisitDate.textContent())?.trim() ?? '',
    //   comment: (await this.lblComment.textContent())?.trim() ?? '',
    // };

    return {
      facility: await this.commonPage.textContent(this.lblFacility),
      hospitalReadmission: await this.commonPage.textContent( this.lblHospitalReadmission) === 'Yes',
      healthcareProgram: await this.commonPage.textContent(this.lblHealthcareProgram),
      visitDate: await this.commonPage.textContent(this.lblVisitDate),
      comment: await this.commonPage.textContent(this.lblComment),
    };
  }

  /**
   * Verify Summary
   * @param expected
   */
  async verifySummary(expected: AppointmentSummary): Promise<void> {
    // await expect(this.lblFacility).toHaveText(expected.facility);
    // await expect(this.lblHospitalReadmission).toHaveText(expected.hospitalReadmission ? 'Yes' : 'No');
    // await expect(this.lblHealthcareProgram).toHaveText(expected.healthcareProgram);
    // await expect(this.lblVisitDate).toHaveText(expected.visitDate);
    // await expect(this.lblComment).toHaveText(expected.comment);

    await this.assertHelper.expectToHaveText(this.lblFacility, expected.facility);
    await this.assertHelper.expectToHaveText(this.lblHospitalReadmission, expected.hospitalReadmission ? 'Yes' : 'No');
    await this.assertHelper.expectToHaveText(this.lblHealthcareProgram, expected.healthcareProgram);
    await this.assertHelper.expectToHaveText(this.lblVisitDate, expected.visitDate);
    await this.assertHelper.expectToHaveText(this.lblComment, expected.comment);
  }

  /**
   * Click Go to Homepage
   */
  @step('Click Go to Homepage')
  async clickGoToHomepage(): Promise<void> {
    // await this.btnGoToHomepage.click();
    await this.commonPage.click(this.btnGotoHomePage);
  }
}
