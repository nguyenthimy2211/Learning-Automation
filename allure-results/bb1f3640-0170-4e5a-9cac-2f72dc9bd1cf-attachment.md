# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\appointments\appointment-validation.spec.ts >> Appointment Form >> CURA-APPT-001 Display appointment form after login
- Location: tests\web\appointments\appointment-validation.spec.ts:28:9

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('cell', { name: '23' })

```

# Page snapshot

```yaml
- generic [ref=f2e1]:
  - link "" [ref=f2e2] [cursor=pointer]:
    - /url: "#"
  - navigation [ref=f2e4]:
    - list [ref=f2e5]:
      - link "" [ref=f2e6] [cursor=pointer]:
        - /url: "#"
      - listitem [ref=f2e8]:
        - link "CURA Healthcare" [ref=f2e9] [cursor=pointer]:
          - /url: ./
      - listitem [ref=f2e10]:
        - link "Home" [ref=f2e11] [cursor=pointer]:
          - /url: ./
      - listitem [ref=f2e12]:
        - link "History" [ref=f2e13] [cursor=pointer]:
          - /url: history.php#history
      - listitem [ref=f2e14]:
        - link "Profile" [ref=f2e15] [cursor=pointer]:
          - /url: profile.php#profile
      - listitem [ref=f2e16]:
        - link "Logout" [ref=f2e17] [cursor=pointer]:
          - /url: authenticate.php?logout
  - banner [ref=f2e18]:
    - generic [ref=f2e19]:
      - heading "CURA Healthcare Service" [level=1] [ref=f2e20]
      - heading "We Care About Your Health" [level=3] [ref=f2e21]
      - link "Make Appointment" [ref=f2e22] [cursor=pointer]:
        - /url: ./index.php#appointment
  - generic [ref=f2e25]:
    - generic [ref=f2e26]:
      - heading "Make Appointment" [level=2] [ref=f2e27]
      - separator [ref=f2e28]
    - generic [ref=f2e29]:
      - generic [ref=f2e30]:
        - generic [ref=f2e31]: Facility
        - combobox "Facility" [ref=f2e33]:
          - option "Tokyo CURA Healthcare Center"
          - option "Hongkong CURA Healthcare Center" [selected]
          - option "Seoul CURA Healthcare Center"
      - generic [ref=f2e36] [cursor=pointer]:
        - checkbox "Apply for hospital readmission" [checked] [ref=f2e37]
        - text: Apply for hospital readmission
      - generic [ref=f2e38]:
        - generic [ref=f2e39]: Healthcare Program
        - generic [ref=f2e40]:
          - generic [ref=f2e41] [cursor=pointer]:
            - radio "Medicare" [ref=f2e42]
            - text: Medicare
          - generic [ref=f2e43] [cursor=pointer]:
            - radio "Medicaid" [checked] [active] [ref=f2e44]
            - text: Medicaid
          - generic [ref=f2e45] [cursor=pointer]:
            - radio "None" [ref=f2e46]
            - text: None
      - generic [ref=f2e47]:
        - generic [ref=f2e48]: Visit Date (Required)
        - generic [ref=f2e50]:
          - textbox "Visit Date (Required)" [ref=f2e51]:
            - /placeholder: dd/mm/yyyy
          - generic [ref=f2e52]: 
      - generic [ref=f2e54]:
        - generic [ref=f2e55]: Comment
        - textbox "Comment" [ref=f2e57]
      - button "Book Appointment" [ref=f2e60] [cursor=pointer]
  - contentinfo [ref=f2e61]:
    - generic [ref=f2e64]:
      - heading [level=4] [ref=f2e65]:
        - strong [ref=f2e66]: CURA Healthcare Service
      - paragraph [ref=f2e67]: Atlanta 550 Pharr Road NE Suite 525Atlanta, GA 30305
      - list [ref=f2e68]:
        - listitem [ref=f2e69]:
          - generic [ref=f2e70]: 
          - text: (678) 813-1KMS
        - listitem [ref=f2e71]:
          - generic [ref=f2e72]: 
          - link "info@katalon.com" [ref=f2e73] [cursor=pointer]:
            - /url: mailto:info@katalon.com
      - list [ref=f2e74]:
        - listitem [ref=f2e75]:
          - link "" [ref=f2e76] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f2e78]:
          - link "" [ref=f2e79] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f2e81]:
          - link "" [ref=f2e82] [cursor=pointer]:
            - /url: "#"
      - separator [ref=f2e84]
      - paragraph [ref=f2e85]: Copyright © CURA Healthcare Service 2026
    - link "" [ref=f2e86] [cursor=pointer]:
      - /url: "#top"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { Constants } from '../../../utilities/constants';
  3  | import { LoginPage } from '../../../pages/login-page';
  4  | import { TestData } from '../../../data/test-data';
  5  | import { User } from '../../../interfaces/user';
  6  | 
  7  | 
  8  | 
  9  | /*
  10 |  * Test case: CURA-APT-001 Display appointment form after login
  11 |  * Priority: P0
  12 |  * Tags: @smoke @appointment
  13 |  * Test data: Valid credentials
  14 |  * Steps:   1. Log in.
  15 |  * Expected result: Facility, readmission checkbox, healthcare program, visit date, comment, and Book Appointment controls are available.
  16 |  */
  17 | const loginPage = new LoginPage();
  18 | const user: User = TestData.user;
  19 | const username: string = user.username;
  20 | const password: string = user.password;
  21 | 
  22 | test.describe('Appointment Form', () => {
  23 |     test.beforeEach(async ({ page }) => {
  24 |         // Go to the starting url before each test.
  25 |         await page.goto(Constants.BASE_URL);
  26 |     });
  27 | 
  28 |     test('CURA-APPT-001 Display appointment form after login', { tag: ['@smoke', '@appointment'] },
  29 |         async ({ page }) => {
  30 | 
  31 |             await page.locator('#menu-toggle').click();
  32 |             await page.getByRole('link', { name: 'Login' }).click();
  33 |             await loginPage.login(username, password, page);
  34 |             // await page.getByRole('button', { name: 'Login' }).click();
  35 | 
  36 |             await page.getByLabel('Facility').selectOption('Hongkong CURA Healthcare Center');
  37 |             await page.getByRole('checkbox', { name: 'Apply for hospital readmission' }).check();
  38 |             await page.getByRole('radio', { name: 'Medicaid' }).check();
> 39 |             await page.getByRole('cell', { name: '23' }).click();
     |                                                          ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  40 |             await page.getByRole('textbox', { name: 'Comment' }).click();
  41 |             await page.getByRole('textbox', { name: 'Comment' }).fill('test');
  42 |             await page.getByRole('button', { name: 'Book Appointment' }).click();
  43 | 
  44 |         });
  45 | })
  46 | 
```