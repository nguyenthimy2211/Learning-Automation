import { getLoginData } from '@data/user-data';
import { test } from '@pages/base-page';


/*
 * Test case: CURA-APT-001 Display appointment form after login
 * Priority: P0
 * Tags: @smoke @appointment
 * Test data: Valid credentials
 * Steps:   1. Log in.
 * Expected result: Facility, readmission checkbox, healthcare program, visit date, comment, and Book Appointment controls are available.
 */

test.describe('Appointment Form', () => {
    test.beforeEach(async({ homePage, loginPage }) => {
        await homePage.goto();
        console.log('!!!!!+ ' ,homePage.goto());
        await homePage.clickMakeAppointment();
        await loginPage.login(getLoginData());
        await loginPage.verifyLoginSuccess();
    });

    test('APPT-VAL-001: Validate required fields', async({ appointmentPage }) => {
        await appointmentPage.clickBookAppointment();
        await appointmentPage.validateRequiredField();
  });
});
