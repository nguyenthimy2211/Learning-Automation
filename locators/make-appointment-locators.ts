import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";


export class MakeAppointmentLocators  extends CommonLocators {

cboFacility!: Locator;
chkHospitalReadmission!: Locator;
rdnProgramMeicare!: Locator;

rdnProgramMedicaid!: Locator;
rdnProgramNone!: Locator;
inputVisitDate!: Locator;
inputComment!: Locator;
btnBookAppointment!: Locator;

constructor(page: Page) {
    super(page);
    this.locatorInitialization();

}
protected override locatorInitialization(): void {
    super.locatorInitialization();
    this.cboFacility = this.page.getByRole('combobox', { name: 'Facility' });
    this.chkHospitalReadmission = this.page.getByRole('checkbox', { name: 'Apply for hospital readmission' });
    this.rdnProgramMeicare = this.page.getByRole('radio', { name: 'Medicare' });
    this.rdnProgramMedicaid = this.page.getByRole('radio', { name: 'Medicaid' });
    this.inputVisitDate = this.page.getByPlaceholder('dd/mm/yyyy');
    this.inputComment = this.page.getByPlaceholder('Comment');
    this.btnBookAppointment = this.page.getByRole('button', { name: 'Book Appointment' });
}
}
