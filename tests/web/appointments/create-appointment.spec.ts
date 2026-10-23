import { test } from '@pages/base-page';
import { user } from '@data/user-data';
import { appointment, getRandomCsvAppointment, getRandomExcelAppointment, getRandomJsonAppointment } from '@data/appointment-data';


test.describe('Create Appoiment', () => {
    test.beforeEach(async({ homePage, loginPage })=>{
        await homePage.goto();
        await homePage.clickMakeAppointment();
        await loginPage.login({ ...user });
        await loginPage.verifyLoginSuccess();
    });

    test('APPT-001: Create appointment with default value', async({ appointmentPage, summaryPage }) => {
    await appointmentPage.bookAppointment(appointment);
    await summaryPage.verifySummary(appointment);
    });

     test('APPT-003: Create appointment using Excel test data', async({ appointmentPage, summaryPage }) => {
        const appointment = await getRandomExcelAppointment();
        await appointmentPage.bookAppointment(appointment);
        await summaryPage.verifySummary(appointment);
    });

    test('APPT-004: Create appointment using CSV test data', async({ appointmentPage, summaryPage }) => {
        const appointment = getRandomCsvAppointment();
        await appointmentPage.bookAppointment(appointment);
        await summaryPage.verifySummary(appointment);
    });

    test('APPT-005: Create appointment using JSON test data', async({ appointmentPage, summaryPage }) => {
        const appointment = getRandomJsonAppointment();
        await appointmentPage.bookAppointment(appointment);
        await summaryPage.verifySummary(appointment);
    });
});
