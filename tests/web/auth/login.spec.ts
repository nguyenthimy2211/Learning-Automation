import { TestData } from '@data/test-data';
import { test } from '@pages/base-page';

// const username: string = 'John Doe';
// const password: string = 'ThisIsNotAPassword';

// const user: User = {
//     username: 'John Doe',
//     password: 'ThisIsNotAPassword'
// };


test.describe('Login Page Tests', () => {
    test('should login successfully with valid credentials', async({ homePage, loginPage }) => {
        await homePage.goto();
        await homePage.clickMakeAppointment();
        // await loginPage.login1(username, password);
        // await loginPage.login(user);
        await loginPage.login(TestData.user);
        await loginPage.verifyLoginSuccess();
        // Add assertions to verify successful login
    });
});
