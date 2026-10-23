import { Locator, Page } from '@playwright/test';
import { CommonLocators } from './common-locators';


export class MakeAppointmentLocators extends CommonLocators {

    cboFacility!: Locator;
    chkHospitalReadmission!: Locator;
    rdoProgramMeicare!: Locator;

    rdoProgramMedicaid!: Locator;
    rdoProgramNone!: Locator;
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
        this.rdoProgramMeicare = this.page.getByLabel('Medicare', { exact: true });
        this.rdoProgramMedicaid = this.page.getByLabel('Medicaid', { exact: true });
        this.rdoProgramNone = this.page.getByLabel('None', { exact: true });
        this.inputVisitDate = this.page.getByPlaceholder('dd/mm/yyyy');
        this.inputComment = this.page.getByPlaceholder('Comment');
        this.btnBookAppointment = this.page.getByRole('button', { name: 'Book Appointment' });
    }
}
