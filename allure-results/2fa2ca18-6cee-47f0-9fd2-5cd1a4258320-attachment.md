# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\auth\login.spec.ts >> Authentication >> CURA-AUTH-001 Login with valid credentials 2
- Location: tests\web\auth\login.spec.ts:44:9

# Error details

```
TimeoutError: locator.fill: Timeout 10000ms exceeded.
Call log:
  - waiting for getByLabel('Username')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "" [ref=e2] [cursor=pointer]:
    - /url: "#"
  - navigation [ref=e4]:
    - list [ref=e5]:
      - link "" [ref=e6] [cursor=pointer]:
        - /url: "#"
      - listitem [ref=e8]:
        - link "CURA Healthcare" [ref=e9] [cursor=pointer]:
          - /url: ./
      - listitem [ref=e10]:
        - link "Home" [ref=e11] [cursor=pointer]:
          - /url: ./
      - listitem [ref=e12]:
        - link "Login" [ref=e13] [cursor=pointer]:
          - /url: profile.php#login
  - banner [ref=e14]:
    - generic [ref=e15]:
      - heading "CURA Healthcare Service" [level=1] [ref=e16]
      - heading "We Care About Your Health" [level=3] [ref=e17]
      - link "Make Appointment" [ref=e18] [cursor=pointer]:
        - /url: ./profile.php#login
  - contentinfo [ref=e19]:
    - generic [ref=e22]:
      - heading [level=4] [ref=e23]:
        - strong [ref=e24]: CURA Healthcare Service
      - paragraph [ref=e25]: Atlanta 550 Pharr Road NE Suite 525Atlanta, GA 30305
      - list [ref=e26]:
        - listitem [ref=e27]:
          - generic [ref=e28]: 
          - text: (678) 813-1KMS
        - listitem [ref=e29]:
          - generic [ref=e30]: 
          - link "info@katalon.com" [ref=e31] [cursor=pointer]:
            - /url: mailto:info@katalon.com
      - list [ref=e32]:
        - listitem [ref=e33]:
          - link "" [ref=e34] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e36]:
          - link "" [ref=e37] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e39]:
          - link "" [ref=e40] [cursor=pointer]:
            - /url: "#"
      - separator [ref=e42]
      - paragraph [ref=e43]: Copyright © CURA Healthcare Service 2026
    - text: 
```

# Test source

```ts
  1  | import { Page } from '@playwright/test';
  2  | 
  3  | 
  4  | export class LoginPage {
  5  |     async login(username: string, password: string, page: Page): Promise<void> {
> 6  |         await page.getByLabel('Username').fill(username);
     |                                           ^ TimeoutError: locator.fill: Timeout 10000ms exceeded.
  7  |         await page.getByLabel('Password').fill(password);
  8  |         await page.getByRole('button', { name: 'Login' }).click();
  9  |     }
  10 | }
```