// import { test } from '@playwright/test';
// import { Constants } from '@../utilities/constants';
// import { TestData } from '@../data/test-data';
// import { User } from '@../interfaces/user';
// import { LoginPage } from '@../pages/login-page';


// /**
//  * Test case: CURA-AUTH-001 Login with valid credentials
//  * Priority: P0
//  * Tags: @smoke @auth @P1
//  * Test data: Username: John Doe; password: ThisIsNotAPassword
//  * Steps:   1. Open login page.
//  *          2. Enter username and password.
//  *          3. Click Login.
//  * Expected result: Login succeeds and the appointment form is displayed.
//  */

// const user: User = TestData.user;

// const username: string = user.username;
// const password: string = user.password;


// test.describe('Authentication', () => {
//     test.beforeEach(async({ page }) => {
//         // Go to the starting url before each test.
//         await page.goto(Constants.BASE_URL);

//     });

//     test('CURA-AUTH-001 Login with valid credentials', {
//         tag: ['@smoke', '@auth', '@P1'],
//     }, async({ page }) => {
//         await page.locator('#menu-toggle').click();
//         await page.getByRole('link', { name: 'Login' }).click();
//         await page.getByLabel('Username').fill(username);
//         await page.getByLabel('Password').fill(password);
//         await page.getByRole('button', { name: 'Login' }).click();
//     });

//     test('CURA-AUTH-001 Login with valid credentials 2', {
//         tag: ['@smoke', '@auth', '@P1'],
//     }, async({ page }) => {
//         const loginPage = new LoginPage();
//         await page.locator('#menu-toggle').click();
//         await page.getByRole('link', { name: 'Login' }).click();
//         await loginPage.login(username, password, page);


//     });
// /*
// * Test case: CURA-AUTH-002 Reject an invalid password
// * Priority: P1
// * Tags:  @auth
// * Test data: Username: John Doe; password: InvalidPassword
// * Steps:   1. Open login page.
// *          2. Enter username and invalid password.
// *          3. Click Login.
// * Expected result: Login fails and an error message is displayed.
// */

//     test('CURA-AUTH-002 Reject an invalid password', {
//         tag: '@auth',
//     }, async({ page }) => {
//         const loginPage = new LoginPage();
//         await page.locator('#menu-toggle').click();
//         await page.getByRole('link', { name: 'Login' }).click();
//         await loginPage.login(username, 'abcd', page);
//     });

//     /**
//      * Test case: CURA-AUTH-003 Reject an invalid username
//      * Priority: P1
//      * Tags:  @auth
//      * Test data: Username: InvalidUser; password: ThisIsNotAPassword
//      * Steps:   1. Open login page.
//      *          2. Enter invalid username and valid password.
//      *          3. Click Login.
//      * Expected result: Login is rejected and an error message is displayed.
//      */
//     test('CURA-AUTH-003 Reject an invalid username', {
//         tag: '@auth',
//     }, async({ page }) => {
//         const loginPage = new LoginPage();
//         await page.locator('#menu-toggle').click();
//         await page.getByRole('link', { name: 'Login' }).click();
//         await loginPage.login('InvalidUser', password, page);
//     });


//     /**
//      * Test case: CURA-AUTH-004 Validate required login fields
//      * Priority: P1
//      * Tags:  @auth
//      * Test data: Username: ; password:
//      * Steps:   1. Open login page.
//      *          2. Leave both fields empty.
//      *          3. Click Login.
//      * Expected result: Authentication does not succeed; required-field validation or a login error is shown.
//      */
//     test('CURA-AUTH-004 Validate required login fields', {
//         tag: '@auth',
//     }, async({ page }) => {
//         const loginPage = new LoginPage();
//         await page.locator('#menu-toggle').click();
//         await page.getByRole('link', { name: 'Login' }).click();
//         await loginPage.login('', '', page);
//     });

//     /**
//      * Test case: CURA-AUTH-005 Password is masked
//      * Priority: P2
//      * Tags:  @auth
//      * Test data: Username: John Doe; password: ThisIsNotAPassword
//      * Steps:   1. Open login page.
//      *          2. Inspect password input type.
//      * Expected result: Password field masks entered characters.
//      */
//     test('CURA-AUTH-005 Password is masked', {
//         tag: '@auth',
//     }, async({ page }) => {
//         const loginPage = new LoginPage();
//         await page.locator('#menu-toggle').click();
//         await page.getByRole('link', { name: 'Login' }).click();
//         await loginPage.login(username, password, page);
//     });
// });
