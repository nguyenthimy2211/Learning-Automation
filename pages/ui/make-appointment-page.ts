import type { Page } from '@playwright/test';
import { MakeAppointmentLocators } from '@locators/make-appointment-locators';
import type { Appointment, HealthcareProgram } from '@interfaces/appointment';
import { step } from '@utilities/logging';
import { CommonPage } from './common-page';
import { AssertHelper } from '@utilities/assert-helper';

export class MakeAppointmentPage extends MakeAppointmentLocators {
  commonPage: CommonPage;
  assertHelper: AssertHelper;
  constructor(page: Page) {
    super(page);
    this.commonPage = new CommonPage(page);
    this.assertHelper = new AssertHelper(page);
  }

  /**
   * Select Facility
   * @param facility "Tokyo CURA Healthcare Center" | "Hongkong CURA Healthcare Center" | "Seoul CURA Healthcare Center"
   */
  @step('Select Facility')
  async selectFacility(facility: string = 'Tokyo CURA Healthcare Center'): Promise<void> {
    // await this.cboFacility.selectOption({ label: facility });
    await this.commonPage.selectOption(this.cboFacility, { label: facility });
  }

  /**
   * Check or uncheck Hostipal Readmission
   * @param checked Default: true
   */
  @step('Check or uncheck Hostipal Readmission')
  async setHospitalReadmission(checked: boolean = true): Promise<void> {
    // await this.chkHospitalReadmission.setChecked(checked);
    await this.commonPage.setChecked(this.chkHospitalReadmission, checked);
  }

  /**
   * Select Healcare Program
   * @param program
   */
  @step('Select Healcare Program')
  async selectHealthcareProgram(program: HealthcareProgram): Promise<void> {
    const radios = {
      Medicare: this.rdoProgramMeicare,
      Medicaid: this.rdoProgramMedicaid,
      None: this.rdoProgramNone,
    };
    // await radios[program].check();
    await this.commonPage.check(radios[program]);
  }

  /**
   * Input Visit Date
   * @param date
   */
  @step('Input Visit Date')
  async enterVisitDate(date: string): Promise<void> {
    // await this.inputVisitDate.click();
    // await this.inputVisitDate.pressSequentially(date, { delay: 100 });
    // await page.keyboard.press('Tab');

    await this.commonPage.click(this.inputVisitDate);
    await this.commonPage.pressSequentially(this.inputVisitDate, date);
    await this.commonPage.pressKeyboard('Tab');
  }

  /**
   * Input Comment
   * @param comment
   */
  @step('Input Comment')
  async enterComment(comment: string): Promise<void> {
    // await this.inputComment.fill(comment);
    await this.commonPage.fill(this.inputComment, comment);
  }

  /**
   * Click on Book Appointment button
   */
  @step('Click on Book Appointment button')
  async clickBookAppointment(): Promise<void> {
    // await this.btnBookAppointment.click();
    await this.commonPage.click(this.btnBookAppointment);
  }

  /**
   * Book Appointment
   * @param appointment
   */
  @step('Book Appointment')
  async bookAppointment(appointment: Appointment): Promise<void> {
    await this.selectFacility(appointment.facility);
    await this.setHospitalReadmission(appointment.hospitalReadmission);
    await this.selectHealthcareProgram(appointment.healthcareProgram);
    await this.enterVisitDate(appointment.visitDate);
    await this.enterComment(appointment.comment);
    await this.clickBookAppointment();
  }

  /**
   * Validate Required Field
   */
  @step('Validate Required Field')
  async validateRequiredField(): Promise<void> {
    await this.assertHelper.expectToHaveJSProperty(this.inputVisitDate, 'Please fill out this field.');
  }
}
