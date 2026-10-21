import { Constants } from '../../../utilities/constants';
import { TestData } from '../../../data/test-data';
import { User } from '../../../interfaces/user';
import { test } from '../../../pages/base-page';



/*
 * Test case: CURA-APT-001 Display appointment form after login
 * Priority: P0
 * Tags: @smoke @appointment
 * Test data: Valid credentials
 * Steps:   1. Log in.
 * Expected result: Facility, readmission checkbox, healthcare program, visit date, comment, and Book Appointment controls are available.
 */
// const loginPage = new LoginPage();
const user: User = TestData.user;
const username: string = user.username;
const password: string = user.password;

// test.describe('Appointment Form', () => {
//     test.beforeEach(async ({ page }) => {
//         // Go to the starting url before each test.
//         await page.goto(Constants.BASE_URL);

//     });

//     test('CURA-APPT-001 Display appointment form after login', { tag: ['@smoke', '@appointment'] },
//         async ({ page }) => {

//             await page.locator('#menu-toggle').click();
//             await page.getByRole('link', { name: 'Login' }).click();
//             await loginPage.login(username, password, page);
//             await page.getByLabel('Facility').selectOption('Hongkong CURA Healthcare Center');
//             await page.getByRole('checkbox', { name: 'Apply for hospital readmission' }).check();
//             await page.getByRole('radio', { name: 'Medicaid' }).check();
//             await page.getByLabel('Visit Date (Required)').fill('23/10/2026');
//             await page.getByRole('textbox', { name: 'Comment' }).fill('test');
//             await page.getByRole('button', { name: 'Book Appointment' }).click();

//         });


// })
test.describe('Appointment Form', () => {
    test.beforeEach(async ({ homePage, loginPage }) => {
        await homePage.goto();
        await homePage.clickMakeAppointment();
        await loginPage.login(TestData.user);
        await loginPage.verifyLoginSuccess();
    });

})
