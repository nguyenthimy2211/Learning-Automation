import {test} from '../../../pages/base-page';
import { user } from '../../../data/user-data';
import { MakeAppointmentPage } from '../../../pages/ui/make-appointment-page';
import { SummaryPage } from '../../../pages/ui/summary-page';
import { appointment } from '../../../data/appointment-data';


test.describe('Create Appoiment', () => {
    test.beforeEach(async({homePage, loginPage})=>{
        await homePage.goto();
        await homePage.clickMakeAppointment();
        await loginPage.login({ ...user });
        await loginPage.verifyLoginSuccess();
    })

    test('APPT-001: Create appointment with default value', async({ appointmentPage, summaryPage }) => {
    await appointmentPage.bookAppointment(appointment);
    await summaryPage.verifySummary(appointment);
    });
});
