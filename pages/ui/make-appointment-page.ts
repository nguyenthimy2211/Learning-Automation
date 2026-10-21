import { Page } from "@playwright/test";
import { MakeAppointmentLocators } from "../../locators/make-appointment-locators";
import { AssertHelper } from "../../utilities/assert-helper";
import { CommonPage } from "./common-page";
import type { Appointment, HealthcareProgram } from "../../interfaces/appointment";



export class MakeAppointmentPage extends MakeAppointmentLocators {
    commonPage: CommonPage;
    assertHelper: AssertHelper;
    constructor(page: Page) {
        super(page);
        this.commonPage = new CommonPage(page);
        this.assertHelper = new AssertHelper(page);
    }

    /**
     * Select Faicilty
     * @param facility "Tokyo CURA Healthcare Center" | "Hongkong CURA Healthcare Center" | "Seoul CURA Healthcare Center"
     */
    async selectFacility(facility: string = 'Tokyo CURA Healthcare Center'): Promise<void> {
        await this.commonPage.selectOption(this.cboFacility, { label: facility });
    }

    /**
     * Check or Uncheck Hospital Readmission
     * @param check Default: true
     */
    async setHospitalReadmission(check: boolean = true): Promise<void> {
        await this.commonPage.setChecked(this.chkHospitalReadmission, check);
    }

    /**
     * Select Healthcare Program
     * @param program
     */
    async selectHealthcareProgram(program: HealthcareProgram): Promise<void> {
        const radios = {
            Medicare: this.rdnProgramMeicare,
            Medicaid: this.rdnProgramMedicaid,
            None: this.rdnProgramNone,
        };
        await this.commonPage.check(radios[program]);
    }

    /**
     * Input Visit Date
     * @param date
     */
    async enterVisitDate(date: string): Promise<void> {
        await this.commonPage.click(this.inputVisitDate);
        await this.commonPage.pressSequentially(this.inputVisitDate, date);
        await this.commonPage.pressKeyboard('Tab');
    }

    /**
     * Input Comment
     * @param comment
     */
    async enterComment(comment: string): Promise<void> {
        await this.commonPage.fill(this.inputComment, comment);
    }

    /**
     * Click on Book Appointment button
     */
    async clickBookAppointment(): Promise<void> {
        await this.commonPage.click(this.btnBookAppointment);
    }

    /**
     * Book Appointment
     * @param appointment
     */
    async bookAppointment(appointment: Appointment): Promise<void> {
        await this.selectFacility(appointment.facility);
        await this.setHospitalReadmission(appointment.hospitalReadmission);
        await this.selectHealthcareProgram(appointment.healthcareProgram);
        await this.enterVisitDate(appointment.visitDate);
        await this.enterComment(appointment.comment);
    }

    /**
     * Validate Require Field
     */
    async validateRequiredField(): Promise<void> {
        await this.assertHelper.expectToHaveJSProperty(this.inputVisitDate, 'Please fill out this field.');
    }
}
