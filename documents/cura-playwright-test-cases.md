# CURA Healthcare — Playwright E2E Test Cases

## 1. Document Information

| Field | Value |
|---|---|
| Application | CURA Healthcare Service demo |
| Base URL | https://katalon-demo-cura.herokuapp.com/ |
| Automation framework | Playwright + TypeScript |
| Design pattern | Page Object Model (POM) |
| Target environments | QA, UAT, Staging |
| Browsers | Chromium, Firefox, WebKit |
| Test data formats | JSON, CSV, Excel (`.xlsx`) |

> **Environment note:** The public CURA demo URL is used as the reference application. Replace the configured base URL with the actual QA, UAT, and Staging URLs when available. Do not run destructive or high-volume tests against shared environments without approval.

## 2. Test Scope

This suite covers:
- Homepage navigation and appointment entry.
- Login success and validation failures.
- Appointment form fields and randomized input.
- Appointment submission and summary verification.
- Data-driven scenarios using JSON, CSV, and Excel.
- Cross-browser and environment execution.
- Basic accessibility and resilience checks.

## 3. Preconditions

1. The application is reachable in the selected environment.
2. The test user is authorized and available.
3. Browser dependencies are installed with Playwright.
4. Environment configuration selects the intended base URL.
5. Test data contains valid facility, program, date, and comment values.
6. Randomized test inputs are logged so failures can be reproduced.

### Default demo credentials

| Field | Value |
|---|---|
| Username | `John Doe` |
| Password | `ThisIsNotAPassword` |

Store credentials for non-demo environments in GitHub Actions secrets or an approved secret manager. Do not commit real credentials to the repository.

## 4. Priority and Execution Tags

| Priority | Meaning |
|---|---|
| P0 | Critical journey; blocks release if failing |
| P1 | Important functional coverage |
| P2 | Additional validation or resilience coverage |

Suggested tags:
- `@smoke` — critical checks for pull requests.
- `@regression` — broader scheduled suite.
- `@auth` — authentication tests.
- `@appointment` — appointment workflow.
- `@data-driven` — multiple test-data records.
- `@cross-browser` — execute on Chromium, Firefox, and WebKit.

## 5. Test Cases

### A. Homepage and Navigation

| ID | Priority | Tags | Test case | Preconditions / Test data | Steps | Expected result |
|---|---|---|---|---|---|---|
| CURA-HOME-001 | P0 | `@smoke` | Open the homepage | Application available | 1. Navigate to base URL. 2. Wait for the page to become usable. | Homepage loads successfully and the Make Appointment button is visible. |
| CURA-HOME-002 | P1 | `@regression` | Open login page from Make Appointment | Homepage loaded | 1. Click Make Appointment. | Login page opens and the username, password, and Login controls are visible. |
| CURA-HOME-003 | P1 | `@regression` | Verify direct login URL | Application available | 1. Navigate to `/profile.php#login`. | Login page is displayed without a navigation error. |

### B. Authentication

| ID | Priority | Tags | Test case | Test data | Steps | Expected result |
|---|---|---|---|---|---|---|
| CURA-AUTH-001 | P0 | `@smoke` `@auth` | Login with valid credentials | Username: `John Doe`; password: `ThisIsNotAPassword` | 1. Open login page. 2. Enter username and password. 3. Click Login. | Login succeeds and the appointment form is displayed. |
| CURA-AUTH-002 | P1 | `@auth` | Reject an invalid password | Username: `John Doe`; invalid password | 1. Open login page. 2. Enter valid username and invalid password. 3. Click Login. | Login is rejected and a clear error message is displayed. |
| CURA-AUTH-003 | P1 | `@auth` | Reject an invalid username | Invalid username; valid-looking password | 1. Open login page. 2. Enter invalid username and password. 3. Click Login. | Login is rejected and an error message is displayed. |
| CURA-AUTH-004 | P1 | `@auth` | Validate required login fields | Empty username and password | 1. Open login page. 2. Leave both fields empty. 3. Click Login. | Authentication does not succeed; required-field validation or a login error is shown. |
| CURA-AUTH-005 | P2 | `@auth` | Password is masked | Any password | 1. Open login page. 2. Inspect password input type. | Password field masks entered characters. |

### C. Appointment Form

| ID | Priority | Tags | Test case | Test data | Steps | Expected result |
|---|---|---|---|---|---|---|
| CURA-APT-001 | P0 | `@smoke` `@appointment` | Display appointment form after login | Valid credentials | 1. Log in. | Facility, readmission checkbox, healthcare program, visit date, comment, and Book Appointment controls are available. |
| CURA-APT-002 | P1 | `@appointment` | Select each supported facility | Tokyo, Hongkong, Seoul CURA Healthcare Center | 1. Log in. 2. Select each facility in separate data-driven iterations. | Each facility can be selected and the chosen value is retained. |
| CURA-APT-003 | P1 | `@appointment` | Toggle hospital readmission on and off | `true`, `false` | 1. Log in. 2. Set checkbox to the specified value. 3. Inspect checked state. | Checkbox state matches the requested value in each iteration. |
| CURA-APT-004 | P1 | `@appointment` | Select each healthcare program | Medicare, Medicaid, None | 1. Log in. 2. Select each program in separate iterations. | The selected radio option is checked and other options are not selected. |
| CURA-APT-005 | P1 | `@appointment` | Enter a valid future visit date | Date in the future, formatted for the date input | 1. Log in. 2. Enter the visit date. | The date field accepts and retains the date. |
| CURA-APT-006 | P1 | `@appointment` | Enter a comment | Non-empty plain-text comment | 1. Log in. 2. Enter a comment. | Comment is accepted and retained in the form. |
| CURA-APT-007 | P1 | `@appointment` | Prevent booking without required visit date | Leave date empty; complete other required fields | 1. Log in. 2. Fill all other fields. 3. Leave visit date empty. 4. Click Book Appointment. | Booking is prevented and the date field indicates it is required. |
| CURA-APT-008 | P2 | `@appointment` | Submit comment with punctuation | Example: `Follow-up: pain & mobility (review #2).` | 1. Fill the form with the comment. 2. Book appointment. | Comment is submitted without unintended truncation or character corruption. |
| CURA-APT-009 | P2 | `@appointment` | Select a facility using keyboard | Any supported facility | 1. Focus the Facility control. 2. Use keyboard navigation to select an option. | Facility can be selected using keyboard interaction. |

### D. Appointment Booking and Summary

| ID | Priority | Tags | Test case | Test data | Steps | Expected result |
|---|---|---|---|---|---|---|
| CURA-APT-010 | P0 | `@smoke` `@appointment` | Book an appointment with valid data | One valid complete appointment record | 1. Log in. 2. Fill all appointment fields. 3. Click Book Appointment. | Appointment summary page is displayed. |
| CURA-SUM-001 | P0 | `@smoke` `@appointment` | Verify facility on summary | Selected facility | 1. Book appointment. 2. Read Facility on summary. | Summary facility equals the selected facility. |
| CURA-SUM-002 | P0 | `@smoke` `@appointment` | Verify hospital readmission on summary | Checkbox `true` and `false` in separate iterations | 1. Book appointment. 2. Read hospital readmission value. | Summary value reflects the checkbox selection. |
| CURA-SUM-003 | P0 | `@smoke` `@appointment` | Verify healthcare program on summary | Medicare, Medicaid, None in separate iterations | 1. Book appointment. 2. Read Healthcare Program on summary. | Summary value equals the selected program. |
| CURA-SUM-004 | P0 | `@smoke` `@appointment` | Verify visit date on summary | Selected future date | 1. Book appointment. 2. Read Visit Date on summary. | Summary date matches the submitted date, allowing only documented display-format differences. |
| CURA-SUM-005 | P0 | `@smoke` `@appointment` | Verify comment on summary | Unique comment string | 1. Book appointment. 2. Read Comment on summary. | Summary comment exactly matches the submitted comment. |
| CURA-SUM-006 | P0 | `@smoke` `@appointment` | Verify all submitted values together | Complete appointment record | 1. Capture submitted values. 2. Book appointment. 3. Assert all five summary fields. | Facility, readmission, healthcare program, visit date, and comment all match. |
| CURA-SUM-007 | P1 | `@regression` | Verify summary URL and heading | Valid appointment | 1. Book appointment. | URL resolves to the appointment summary and the confirmation heading is visible. |
| CURA-SUM-008 | P2 | `@regression` | Verify appointment values after page reload | Valid appointment | 1. Book appointment. 2. Reload summary page. | Verify behavior against the application's expected persistence contract; document if the demo does not persist summary data across reloads. |

### E. Data-Driven and Randomized Tests

| ID | Priority | Tags | Test case | Test data | Steps | Expected result |
|---|---|---|---|---|---|---|
| CURA-DATA-001 | P1 | `@data-driven` | Execute appointment cases from JSON | Valid JSON records | 1. Load JSON. 2. Validate records. 3. Run booking for each record. | Each valid record executes and its summary matches its inputs. |
| CURA-DATA-002 | P1 | `@data-driven` | Execute appointment cases from CSV | Valid CSV rows | 1. Parse CSV. 2. Convert field types. 3. Run booking for each row. | Each row is parsed correctly and produces the expected test result. |
| CURA-DATA-003 | P1 | `@data-driven` | Execute appointment cases from Excel | Valid `.xlsx` worksheet | 1. Read worksheet. 2. Normalize rows. 3. Run booking for each row. | Worksheet records are converted to the shared data type and tested correctly. |
| CURA-DATA-004 | P1 | `@data-driven` | Generate randomized valid appointment data | Facility and program option lists; future date range | 1. Generate random values. 2. Log a reproducible seed and generated values. 3. Submit appointment. 4. Assert summary. | Randomly selected values are valid and match the summary. |
| CURA-DATA-005 | P1 | `@data-driven` | Ensure generated visit date is in the future | Date factory | 1. Generate a date. 2. Compare it with the current date using the application's date rules. | Generated date is strictly in the allowed future range. |
| CURA-DATA-006 | P2 | `@data-driven` | Reject malformed data records | Missing facility, invalid program, malformed date, or missing required fields | 1. Load an invalid record. 2. Validate before browser actions. | Data validation fails clearly before attempting to book an appointment. |

### F. Cross-Browser and Environment Coverage

| ID | Priority | Tags | Test case | Configuration | Steps | Expected result |
|---|---|---|---|---|---|---|
| CURA-CI-001 | P0 | `@smoke` `@cross-browser` | Run smoke suite on Chromium | QA | Execute smoke tests in Chromium. | All smoke tests pass or failures produce diagnostics. |
| CURA-CI-002 | P1 | `@cross-browser` | Run regression suite on Firefox | QA or scheduled regression environment | Execute regression tests in Firefox. | Supported flows behave consistently. |
| CURA-CI-003 | P1 | `@cross-browser` | Run regression suite on WebKit | QA or scheduled regression environment | Execute regression tests in WebKit. | Supported flows behave consistently. |
| CURA-CI-004 | P1 | `@regression` | Run tests against QA | `ENV=qa` | Run the configured suite. | Requests target the QA base URL. |
| CURA-CI-005 | P1 | `@regression` | Run tests against UAT | `ENV=uat` | Run the configured suite. | Requests target the UAT base URL. |
| CURA-CI-006 | P1 | `@regression` | Run tests against Staging | `ENV=staging` | Run the configured suite. | Requests target the Staging base URL. |
| CURA-CI-007 | P1 | `@regression` | Reject unsupported environment | `ENV=production` or another unsupported value | Start the test runner. | Configuration fails immediately with a clear unsupported-environment error. |
| CURA-CI-008 | P1 | `@regression` | Publish diagnostics after failure | Intentionally failing test in a safe test branch | 1. Run the test in CI. 2. Inspect workflow artifacts. | HTML report and available traces/screenshots are uploaded even when tests fail. |

## 6. Appointment Test Data Matrix

Use these values for data-driven coverage. Dates are examples and should be generated dynamically for long-term test stability.

| Data ID | Facility | Readmission | Healthcare program | Visit date example | Comment |
|---|---|---:|---|---|---|
| APT-001 | Tokyo CURA Healthcare Center | `true` | Medicare | `2027-01-15` | Routine follow-up |
| APT-002 | Hongkong CURA Healthcare Center | `false` | Medicaid | `2027-02-10` | Follow-up visit |
| APT-003 | Seoul CURA Healthcare Center | `true` | None | `2027-03-20` | Review appointment |
| APT-004 | Tokyo CURA Healthcare Center | `false` | None | Generate future date | `Check-in: mobility review #4` |
| APT-005 | Hongkong CURA Healthcare Center | `true` | Medicare | Generate future date | `Confirm appointment details` |
| APT-006 | Seoul CURA Healthcare Center | `false` | Medicaid | Generate future date | `Routine review & consultation` |

## 7. Suggested Test Execution Plan

| Trigger | Environment | Browser(s) | Scope |
|---|---|---|---|
| Pull request | QA | Chromium | Smoke tests, lint, TypeScript checks |
| Push to main | QA | Chromium, Firefox, WebKit | Smoke or agreed regression subset |
| Nightly schedule | QA | Chromium, Firefox, WebKit | Full regression suite |
| Release candidate | UAT | All supported browsers | Acceptance and regression |
| Pre-release validation | Staging | All supported browsers | Smoke and release-critical regression |
| Manual dispatch | Selected environment | Selected browser matrix | Targeted debugging or rerun |

## 8. Automation Design Guidelines

1. Keep selectors and page actions inside page objects; keep business assertions in test files.
2. Use Playwright's auto-waiting and web-first assertions instead of fixed sleeps.
3. Use isolated test contexts and unique test data where possible.
4. Do not rely on test execution order or share mutable state across parallel tests.
5. Record the environment, browser, test-data record, random seed, and generated values on failure.
6. Prefer deterministic tests in pull requests; reserve randomized combinations for a controlled regression suite.
7. Validate CSV/JSON/Excel data before launching browser actions.
8. Keep credentials out of source control and protect environment-specific secrets.
9. Configure retries to collect diagnostics, not to hide persistent failures.
10. Review flaky failures before automatically treating them as product defects.

## 9. Definition of Done

- [ ] All POM classes and fixtures are implemented and reviewed.
- [ ] Login and appointment smoke tests pass in QA on Chromium.
- [ ] All five appointment summary fields are asserted.
- [ ] JSON, CSV, and Excel readers return the shared typed data model.
- [ ] Random data is valid and reproducible from logs.
- [ ] QA, UAT, and Staging can be selected through configuration.
- [ ] Chromium, Firefox, and WebKit projects are configured.
- [ ] GitHub Actions runs checks and publishes failure artifacts.
- [ ] Environment secrets and access restrictions are configured.
- [ ] README documents local execution, CI execution, and troubleshooting.

## 10. Reference

- CURA Healthcare Service demo: https://katalon-demo-cura.herokuapp.com/
- Playwright documentation: https://playwright.dev/docs/intro
- Playwright Page Object Models: https://playwright.dev/docs/pom
- Playwright projects: https://playwright.dev/docs/test-projects
- GitHub Actions documentation: https://docs.github.com/actions
