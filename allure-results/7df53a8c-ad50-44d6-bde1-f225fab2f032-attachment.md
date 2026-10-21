# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\auth\login.spec.ts >> Login Page Tests >> should login successfully with valid credentials
- Location: tests\web\auth\login.spec.ts:6:9

# Error details

```
Error: Failed to fill locator: getByPlaceholder('Username') with value: John Doe. Error: Error: locator.fill: Error: strict mode violation: getByPlaceholder('Username') resolved to 2 elements:
    1) <input readonly type="text" value="John Doe" class="form-control" placeholder="Username" aria-describedby="demo_username_label"/> aka getByRole('textbox', { name: 'Username' }).first()
    2) <input value="" type="text" name="username" id="txt-username" autocomplete="off" class="form-control" placeholder="Username"/> aka getByLabel('Username')

Call log:
  - waiting for getByPlaceholder('Username')

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - link "" [ref=f1e2] [cursor=pointer]:
    - /url: "#"
  - navigation [ref=f1e4]:
    - list [ref=f1e5]:
      - link "" [ref=f1e6] [cursor=pointer]:
        - /url: "#"
      - listitem [ref=f1e8]:
        - link "CURA Healthcare" [ref=f1e9] [cursor=pointer]:
          - /url: ./
      - listitem [ref=f1e10]:
        - link "Home" [ref=f1e11] [cursor=pointer]:
          - /url: ./
      - listitem [ref=f1e12]:
        - link "Login" [ref=f1e13] [cursor=pointer]:
          - /url: profile.php#login
  - banner [ref=f1e14]:
    - generic [ref=f1e15]:
      - heading "CURA Healthcare Service" [level=1] [ref=f1e16]
      - heading "We Care About Your Health" [level=3] [ref=f1e17]
      - link "Make Appointment" [ref=f1e18] [cursor=pointer]:
        - /url: ./profile.php#login
  - generic [ref=f1e21]:
    - generic [ref=f1e22]:
      - heading "Login" [level=2] [ref=f1e23]
      - paragraph [ref=f1e24]: Please login to make appointment.
    - generic [ref=f1e26]:
      - generic [ref=f1e27]:
        - generic [ref=f1e28]:
          - generic [ref=f1e29]: Demo account
          - generic [ref=f1e31]:
            - generic [aria-hidden] [ref=f1e33]: 
            - textbox "Username" [ref=f1e34]: John Doe
        - generic [ref=f1e37]:
          - generic [aria-hidden] [ref=f1e39]: 
          - textbox "Password" [ref=f1e40]: ThisIsNotAPassword
      - generic [ref=f1e41]:
        - generic [ref=f1e42]: Username
        - textbox "Username" [ref=f1e44]
      - generic [ref=f1e45]:
        - generic [ref=f1e46]: Password
        - textbox "Password" [ref=f1e48]
      - button "Login" [ref=f1e51] [cursor=pointer]
  - contentinfo [ref=f1e52]:
    - generic [ref=f1e55]:
      - heading [level=4] [ref=f1e56]:
        - strong [ref=f1e57]: CURA Healthcare Service
      - paragraph [ref=f1e58]: Atlanta 550 Pharr Road NE Suite 525Atlanta, GA 30305
      - list [ref=f1e59]:
        - listitem [ref=f1e60]:
          - generic [ref=f1e61]: 
          - text: (678) 813-1KMS
        - listitem [ref=f1e62]:
          - generic [ref=f1e63]: 
          - link "info@katalon.com" [ref=f1e64] [cursor=pointer]:
            - /url: mailto:info@katalon.com
      - list [ref=f1e65]:
        - listitem [ref=f1e66]:
          - link "" [ref=f1e67] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e69]:
          - link "" [ref=f1e70] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e72]:
          - link "" [ref=f1e73] [cursor=pointer]:
            - /url: "#"
      - separator [ref=f1e75]
      - paragraph [ref=f1e76]: Copyright © CURA Healthcare Service 2026
    - link "" [ref=f1e77] [cursor=pointer]:
      - /url: "#top"
```

# Test source

```ts
  1  | import { Locator, Page } from "@playwright/test";
  2  | import { CommonLocators } from "../../locators/common-locators";
  3  | 
  4  | 
  5  | 
  6  | export class CommonPage extends CommonLocators {
  7  |     constructor(page: Page) {
  8  |         super(page);
  9  |     }
  10 |     //for report
  11 |     private describeLoactor(locator: Locator): string {
  12 |         try {
  13 |             return locator.toString();
  14 |         }
  15 |         catch (error) {
  16 |             return "Locator not found";
  17 |         }
  18 |     }
  19 |     /**
  20 |     * Go to the URL
  21 |     * @param {string} url
  22 |     * @param {boolean} isWait - Add a short settle delay after the load state (default true)
  23 |     * @param {'load'|'domcontentloaded'|'commit'} waitUntil - Navigation wait condition
  24 |     * @param {number} [timeout] - Navigation timeout in ms. Pass a short value when the
  25 |     *   caller wraps this goto in a retry (`toPass`): a navigation left on Playwright's
  26 |     *   30s default can consume the whole outer budget in one attempt, so the retry never
  27 |     *   gets a second try. Omit to keep the default.
  28 |     */
  29 |     async goto(url: string, isWait: boolean = true, waitUntil: 'load' | 'domcontentloaded' | 'commit' = 'load', timeout?: number): Promise<void> {
  30 |         await this.page.goto(url, { waitUntil: waitUntil, timeout: timeout });
  31 |     }
  32 |     async clickContinuous(): Promise<void> {
  33 |         await this.click(this.btnContinue);
  34 |         await this.wailForPageLoad();
  35 |     }
  36 |     async click(locator: Locator, options?: { timeout?: number }): Promise<void> {
  37 |         try {
  38 |             await locator.click(options);
  39 |         } catch (error) {
  40 |             throw new Error(`Failed to click on locator: ${this.describeLoactor(locator)}. Error: ${error}`);
  41 |         }
  42 | 
  43 | 
  44 |     }
  45 |     async wailForPageLoad(): Promise<void> {
  46 |         return this.page.waitForLoadState('load');
  47 |     }
  48 | 
  49 |     async fill(locator: Locator, value: string, options?: { timeout?: number }): Promise<void> {
  50 |         try {
  51 |             await locator.fill(value, options);
  52 |         } catch (error) {
> 53 |             throw new Error(`Failed to fill locator: ${this.describeLoactor(locator)} with value: ${value}. Error: ${error}`);
     |                   ^ Error: Failed to fill locator: getByPlaceholder('Username') with value: John Doe. Error: Error: locator.fill: Error: strict mode violation: getByPlaceholder('Username') resolved to 2 elements:
  54 |         }
  55 | 
  56 |     }
  57 | }
  58 | 
```