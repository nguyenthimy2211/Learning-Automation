# CURA Healthcare — Detailed Test Cases and Test Steps

## 1. Document Information

| Field | Value |
|---|---|
| Application | CURA Healthcare Service demo |
| Base URL | https://katalon-demo-cura.herokuapp.com/ |
| Framework | Playwright + TypeScript |
| Pattern | Page Object Model (POM) |
| Environments | QA, UAT, Staging |
| Browsers | Chromium, Firefox, WebKit |
| Test data formats | JSON, CSV, Excel (`.xlsx`) |

**Environment setup:** The URL above is the public demo URL. Configure the actual QA, UAT, and Staging URLs in the environment configuration before using this suite in a real project.

## 2. Test Case Conventions

- **Priority P0:** Critical user journey / smoke test.
- **Priority P1:** Important functional test.
- **Priority P2:** Additional validation or resilience test.
- **Test type:** Positive, negative, data-driven, cross-browser, or CI.
- **Expected results:** Assert the UI state and business outcome, not merely that a click completed.
- **Test isolation:** Run each appointment scenario independently and assert against the exact values used in that scenario.

## 3. Shared Test Data

### Valid login

| Field | Value |
|---|---|
| Username | `John Doe` |
| Password | `ThisIsNotAPassword` |

### Appointment options

| Field | Supported values |
|---|---|
| Facility | Tokyo CURA Healthcare Center; Hongkong CURA Healthcare Center; Seoul CURA Healthcare Center |
| Apply for hospital readmission | Checked; unchecked |
| Healthcare Program | Medicare; Medicaid; None |
| Visit Date | Valid date in the future |
| Comment | Non-empty plain text; include punctuation in selected tests |

### Suggested appointment data

| Data ID | Facility | Readmission | Program | Visit date example | Comment |
|---|---|---:|---|---|---|
| APT-001 | Tokyo CURA Healthcare Center | Checked | Medicare | Generated future date | Routine follow-up |
| APT-002 | Hongkong CURA Healthcare Center | Unchecked | Medicaid | Generated future date | Follow-up visit |
| APT-003 | Seoul CURA Healthcare Center | Checked | None | Generated future date | Review appointment |
| APT-004 | Tokyo CURA Healthcare Center | Unchecked | None | Generated future date | `Check-in: mobility review #4` |
| APT-005 | Hongkong CURA Healthcare Center | Checked | Medicare | Generated future date | `Routine review & consultation` |
| APT-006 | Seoul CURA Healthcare Center | Unchecked | Medicaid | Generated future date | Confirm appointment details |

> For long-term automation, generate future dates dynamically instead of relying on the example dates. Log generated values and the random seed to reproduce failures.

---

# 4. Detailed Test Cases

## A. Homepage and Navigation

### CURA-HOME-001 — Verify homepage loads successfully

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | Positive / Smoke |
| Tags | `@smoke` `@navigation` |
| Preconditions | Application is reachable in the selected environment. |
| Test data | Configured environment base URL |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Launch the selected browser. | Browser starts successfully. |
| 2 | Navigate to the configured base URL. | Homepage loads without a browser error. |
| 3 | Verify the page heading or main content is visible. | The CURA Healthcare Service homepage content is displayed. |
| 4 | Locate the **Make Appointment** button. | The button is visible and enabled. |

### CURA-HOME-002 — Navigate to login using Make Appointment

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | Positive / Smoke |
| Tags | `@smoke` `@navigation` |
| Preconditions | Homepage is loaded. |
| Test data | None |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Click **Make Appointment**. | The application navigates to the login page. |
| 2 | Verify the URL contains `/profile.php#login`. | The login route is displayed. |
| 3 | Verify the Username field is visible. | Username input is available. |
| 4 | Verify the Password field is visible. | Password input is available. |
| 5 | Verify the Login button is visible. | Login button is available and enabled. |

### CURA-HOME-003 — Navigate directly to the login URL

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Positive |
| Tags | `@regression` `@navigation` |
| Preconditions | Application is reachable. |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Navigate directly to `/profile.php#login` using the configured base URL. | Login page is displayed. |
| 2 | Verify the login form controls. | Username, Password, and Login controls are visible. |
| 3 | Check the final URL. | URL points to the expected login route. |

## B. Authentication

### CURA-AUTH-001 — Login with valid credentials

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | Positive / Smoke |
| Tags | `@smoke` `@auth` |
| Preconditions | Login page is displayed. |
| Test data | Username: `John Doe`; Password: `ThisIsNotAPassword` |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Enter `John Doe` in Username. | Username field contains `John Doe`. |
| 2 | Enter `ThisIsNotAPassword` in Password. | Password field accepts the value and masks the characters. |
| 3 | Click **Login**. | Login request is submitted. |
| 4 | Wait for navigation or the appointment page state. | Login succeeds. |
| 5 | Verify the appointment form is displayed. | Facility and appointment fields are available. |

### CURA-AUTH-002 — Reject an invalid password

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Negative |
| Tags | `@regression` `@auth` |
| Preconditions | Login page is displayed. |
| Test data | Username: `John Doe`; Password: invalid password |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Enter `John Doe` in Username. | Username is entered. |
| 2 | Enter an incorrect password. | Password is entered. |
| 3 | Click **Login**. | Login is attempted. |
| 4 | Verify that the appointment form is not displayed. | User remains unauthenticated. |
| 5 | Verify the error message. | A login error is visible and communicates that authentication failed. |

### CURA-AUTH-003 — Reject an invalid username

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Negative |
| Tags | `@regression` `@auth` |
| Preconditions | Login page is displayed. |
| Test data | Invalid username and any non-empty password |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Enter a username that is not authorized. | Username field contains the invalid username. |
| 2 | Enter a non-empty password. | Password field contains the entered value. |
| 3 | Click **Login**. | Login is attempted. |
| 4 | Verify that login does not succeed. | Appointment form is not displayed. |
| 5 | Verify the login error. | An error message is displayed. |

### CURA-AUTH-004 — Submit login with empty fields

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Negative / Validation |
| Tags | `@regression` `@auth` |
| Preconditions | Login page is displayed. |
| Test data | Empty username and password |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Leave Username empty. | Username remains empty. |
| 2 | Leave Password empty. | Password remains empty. |
| 3 | Click **Login**. | The form is submitted or browser validation is triggered. |
| 4 | Verify authentication state. | Login does not succeed and appointment form is not displayed. |
| 5 | Verify feedback. | Required-field validation or a login error is shown according to application behavior. |

### CURA-AUTH-005 — Verify password masking

| Attribute | Details |
|---|---|
| Priority | P2 |
| Type | UI validation |
| Tags | `@regression` `@auth` |
| Preconditions | Login page is displayed. |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Enter any sample password. | Password is accepted. |
| 2 | Inspect the Password input type or visible rendering. | Input type is `password` and the characters are masked. |

## C. Appointment Form

### CURA-APT-001 — Verify appointment form after login

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | Positive / Smoke |
| Tags | `@smoke` `@appointment` |
| Preconditions | Valid user credentials are available. |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Open the homepage. | Homepage is displayed. |
| 2 | Click **Make Appointment**. | Login page is displayed. |
| 3 | Enter valid credentials and click **Login**. | User is authenticated. |
| 4 | Verify Facility control. | Facility selection is visible. |
| 5 | Verify Apply for hospital readmission checkbox. | Checkbox is visible. |
| 6 | Verify Healthcare Program radio options. | Medicare, Medicaid, and None are available. |
| 7 | Verify Visit Date and Comment fields. | Both fields are visible. |
| 8 | Verify **Book Appointment**. | Button is visible and enabled. |

### CURA-APT-002 — Select each supported facility

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Data-driven |
| Tags | `@regression` `@appointment` `@data-driven` |
| Preconditions | Appointment form is displayed. |
| Test data | Tokyo, Hongkong, and Seoul facility options |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Start a fresh appointment form. | Form is displayed with default values. |
| 2 | Select **Tokyo CURA Healthcare Center**. | Tokyo facility is selected. |
| 3 | Verify the selected option. | Facility control displays Tokyo. |
| 4 | Reset or start a new test iteration. | A clean appointment form is available. |
| 5 | Select **Hongkong CURA Healthcare Center**. | Hongkong facility is selected. |
| 6 | Verify the selected option. | Facility control displays Hongkong. |
| 7 | Reset or start a new test iteration. | A clean appointment form is available. |
| 8 | Select **Seoul CURA Healthcare Center**. | Seoul facility is selected. |
| 9 | Verify the selected option. | Facility control displays Seoul. |

### CURA-APT-003 — Set hospital readmission checkbox to checked and unchecked

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Data-driven |
| Tags | `@regression` `@appointment` `@data-driven` |
| Preconditions | Appointment form is displayed. |
| Test data | `true`, `false` |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Start with a fresh appointment form. | Checkbox state is known. |
| 2 | Set the checkbox to `checked = true`. | Checkbox is checked. |
| 3 | Assert the checkbox checked state. | `isChecked()` returns `true`. |
| 4 | Set the checkbox to `checked = false`. | Checkbox is unchecked. |
| 5 | Assert the checkbox checked state. | `isChecked()` returns `false`. |

### CURA-APT-004 — Select each healthcare program

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Data-driven |
| Tags | `@regression` `@appointment` `@data-driven` |
| Preconditions | Appointment form is displayed. |
| Test data | Medicare, Medicaid, None |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Start a fresh appointment form. | Program options are visible. |
| 2 | Select **Medicare**. | Medicare is selected. |
| 3 | Verify radio state. | Medicare is checked and the other options are not checked. |
| 4 | Start a fresh iteration and select **Medicaid**. | Medicaid is selected. |
| 5 | Verify radio state. | Medicaid is checked and the other options are not checked. |
| 6 | Start a fresh iteration and select **None**. | None is selected. |
| 7 | Verify radio state. | None is checked and the other options are not checked. |

### CURA-APT-005 — Enter a valid future visit date

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Positive / Validation |
| Tags | `@regression` `@appointment` |
| Preconditions | Appointment form is displayed. |
| Test data | A date in the future accepted by the date field |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Generate a valid future date according to the application date rules. | Date is after the current date. |
| 2 | Format the date for the input control. | Date uses the expected input format. |
| 3 | Enter the date in Visit Date. | Date field accepts the value. |
| 4 | Read the field value. | Value matches the generated date in the input format. |

### CURA-APT-006 — Enter a comment containing punctuation

| Attribute | Details |
|---|---|
| Priority | P2 |
| Type | Positive / Input validation |
| Tags | `@regression` `@appointment` |
| Preconditions | Appointment form is displayed. |
| Test data | `Check-in: mobility review #4 & follow-up.` |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Enter the test comment in Comment. | Text is accepted. |
| 2 | Read the Comment field value. | Text exactly matches the input. |
| 3 | Keep the comment for the booking flow. | Value is ready to be submitted. |

### CURA-APT-007 — Prevent booking without a visit date

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Negative / Required-field validation |
| Tags | `@regression` `@appointment` |
| Preconditions | Appointment form is displayed. |
| Test data | Valid facility and program; empty date |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Select a valid facility. | Facility is selected. |
| 2 | Select a healthcare program. | Program is selected. |
| 3 | Set readmission to either state. | Checkbox has the intended state. |
| 4 | Leave Visit Date empty. | Date field remains empty. |
| 5 | Enter a comment if desired. | Comment is accepted. |
| 6 | Click **Book Appointment**. | Submission is blocked by required-date validation. |
| 7 | Verify the page and date field. | Summary page is not shown; required-date validation is visible or the date input is focused by browser validation. |

### CURA-APT-008 — Verify a date outside the accepted range

| Attribute | Details |
|---|---|
| Priority | P2 |
| Type | Negative / Boundary |
| Tags | `@regression` `@appointment` |
| Preconditions | Appointment form is displayed. |
| Test data | Past date or malformed date, depending on what the input control permits |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Attempt to enter a past date or malformed date. | Input control accepts or rejects it according to its type and browser behavior. |
| 2 | If the field accepts the value, attempt to book with all other valid fields. | Application validation is triggered. |
| 3 | Verify the outcome against the documented business rule. | Invalid dates are rejected if the application specifies that only future dates are allowed. If the application permits past dates, record this as a requirement gap rather than assuming a defect. |

## D. Appointment Booking and Summary

### CURA-APT-010 — Book an appointment with valid data

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | Positive / End-to-end |
| Tags | `@smoke` `@appointment` |
| Preconditions | Valid login credentials and a complete appointment record are available. |
| Test data | One record from the appointment data matrix |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Navigate to the homepage. | Homepage loads successfully. |
| 2 | Click **Make Appointment**. | Login page opens. |
| 3 | Enter valid credentials and click **Login**. | Appointment form opens. |
| 4 | Select the facility from the test record. | Correct facility is selected. |
| 5 | Set the readmission checkbox to the test record value. | Checkbox state matches the record. |
| 6 | Select the healthcare program from the test record. | Correct radio option is selected. |
| 7 | Enter the visit date from the test record. | Date is displayed correctly in the field. |
| 8 | Enter the comment from the test record. | Comment is displayed correctly. |
| 9 | Store all submitted values as expected values. | Test has the exact values to compare against the summary. |
| 10 | Click **Book Appointment**. | Application submits the appointment. |
| 11 | Verify the summary URL or confirmation heading. | Appointment summary page is displayed. |

### CURA-SUM-001 — Verify Facility on appointment summary

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | End-to-end assertion |
| Tags | `@smoke` `@appointment` |
| Preconditions | Appointment has been booked successfully. |
| Test data | Selected facility |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Read the Facility value on the summary page. | Summary value is available. |
| 2 | Compare it with the selected facility. | Values match exactly. |

### CURA-SUM-002 — Verify readmission value on summary

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | Data-driven assertion |
| Tags | `@smoke` `@appointment` |
| Preconditions | Appointment has been booked. |
| Test data | Checked and unchecked scenarios |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Read Apply for hospital readmission on the summary page. | Summary value is available. |
| 2 | Normalize the UI value if it uses labels such as Yes/No. | Value is converted to a comparable boolean. |
| 3 | Compare the summary value with the submitted checkbox state. | The summary reflects the submitted state. |

### CURA-SUM-003 — Verify healthcare program on summary

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | Data-driven assertion |
| Tags | `@smoke` `@appointment` |
| Preconditions | Appointment has been booked. |
| Test data | Medicare, Medicaid, None |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Read Healthcare Program on the summary page. | Program value is available. |
| 2 | Compare it with the selected radio option. | Values match exactly. |

### CURA-SUM-004 — Verify visit date on summary

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | End-to-end assertion |
| Tags | `@smoke` `@appointment` |
| Preconditions | Appointment has been booked. |
| Test data | Submitted visit date |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Read Visit Date on the summary page. | Summary date is available. |
| 2 | Normalize date formatting if the UI uses a different display format. | Both dates represent the same calendar date. |
| 3 | Compare summary date with submitted date. | Dates match. |

### CURA-SUM-005 — Verify comment on summary

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | End-to-end assertion |
| Tags | `@smoke` `@appointment` |
| Preconditions | Appointment has been booked. |
| Test data | Unique comment string |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Read Comment on the summary page. | Summary comment is available. |
| 2 | Compare it with the submitted comment. | Text matches exactly, including punctuation. |

### CURA-SUM-006 — Verify all five appointment values

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | End-to-end / Smoke |
| Tags | `@smoke` `@appointment` |
| Preconditions | Appointment is successfully booked. |
| Test data | Complete appointment data record |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Capture expected Facility before submission. | Expected facility is stored. |
| 2 | Capture expected readmission state before submission. | Expected boolean is stored. |
| 3 | Capture expected Healthcare Program before submission. | Expected program is stored. |
| 4 | Capture expected Visit Date before submission. | Expected date is stored. |
| 5 | Capture expected Comment before submission. | Expected comment is stored. |
| 6 | Submit the appointment. | Summary page opens. |
| 7 | Assert Facility. | Matches expected facility. |
| 8 | Assert readmission value. | Matches expected checkbox state. |
| 9 | Assert Healthcare Program. | Matches expected program. |
| 10 | Assert Visit Date. | Matches expected date. |
| 11 | Assert Comment. | Matches expected comment. |

### CURA-SUM-007 — Verify summary URL and confirmation heading

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Positive |
| Tags | `@regression` `@appointment` |
| Preconditions | Appointment has been booked. |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Complete a valid appointment booking. | Summary page is displayed. |
| 2 | Verify the URL contains `/appointment.php#summary`. | URL matches the expected summary route. |
| 3 | Verify the confirmation heading. | Appointment confirmation heading is visible. |

## E. Test Data Readers and Randomization

### CURA-DATA-001 — Execute appointment scenarios from JSON

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Data-driven |
| Tags | `@regression` `@data-driven` |
| Preconditions | JSON data file exists and follows the shared appointment schema. |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Load `test-data/appointments.json`. | File is read successfully. |
| 2 | Validate required fields and allowed option values. | Invalid records fail validation before browser execution. |
| 3 | Convert records to the shared TypeScript appointment type. | Records are normalized. |
| 4 | Run the booking test for each valid record. | Each record executes independently. |
| 5 | Compare summary values with the record. | All expected values match. |

### CURA-DATA-002 — Execute appointment scenarios from CSV

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Data-driven |
| Tags | `@regression` `@data-driven` |
| Preconditions | CSV file has a header row and valid records. |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Load `test-data/appointments.csv` using a CSV parser. | CSV is parsed. |
| 2 | Validate header names and required columns. | Missing columns are reported clearly. |
| 3 | Convert strings such as `true` and `false` to booleans. | Field types are correct. |
| 4 | Validate facility, program, date, and comment. | Records meet the shared schema. |
| 5 | Execute the appointment test for each valid row. | Each row is tested independently. |
| 6 | Assert all summary values. | Summary matches the corresponding row. |

### CURA-DATA-003 — Execute appointment scenarios from Excel

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Data-driven |
| Tags | `@regression` `@data-driven` |
| Preconditions | `.xlsx` file contains a worksheet with appointment headers. |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Open the `.xlsx` workbook with the Excel reader. | Workbook is loaded. |
| 2 | Select the configured worksheet. | Correct worksheet is read. |
| 3 | Convert rows to objects using the header row. | Each row becomes a data record. |
| 4 | Normalize Excel date values and boolean fields. | Data matches the shared TypeScript type. |
| 5 | Validate records before starting the browser. | Invalid rows are reported and do not silently become valid tests. |
| 6 | Execute booking tests for valid records. | Each record is tested. |
| 7 | Assert all summary values. | Summary matches the Excel record. |

### CURA-DATA-004 — Book appointment using randomized valid data

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Randomized end-to-end |
| Tags | `@regression` `@data-driven` |
| Preconditions | Appointment form is available after login. |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Choose one facility randomly from the three allowed facilities. | Facility belongs to the allowed list. |
| 2 | Choose a boolean readmission value randomly. | Value is either `true` or `false`. |
| 3 | Choose one program randomly from Medicare, Medicaid, and None. | Program belongs to the allowed list. |
| 4 | Generate a valid future visit date. | Date satisfies the application's date rules. |
| 5 | Generate a comment with a unique identifier. | Comment is non-empty and can be traced to this run. |
| 6 | Log the seed and all generated values. | The test can be reproduced. |
| 7 | Fill and submit the appointment form. | Appointment is submitted successfully. |
| 8 | Assert all five values on the summary page. | Summary matches the generated data. |

### CURA-DATA-005 — Reject malformed test data before browser execution

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Data validation |
| Tags | `@regression` `@data-driven` |
| Preconditions | Test data validator is implemented. |
| Test data | Missing facility, unsupported program, malformed date, or missing required field |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Load a deliberately invalid record. | Record is read. |
| 2 | Run schema and business-rule validation. | Validator identifies the invalid field. |
| 3 | Verify validation output. | Error identifies the record and field. |
| 4 | Verify no booking flow is started for that record. | Invalid data cannot cause an unintended appointment submission. |

## F. Browser and Environment Configuration

### CURA-CI-001 — Execute smoke tests on Chromium

| Attribute | Details |
|---|---|
| Priority | P0 |
| Type | CI / Smoke |
| Tags | `@smoke` `@cross-browser` |
| Configuration | `ENV=qa`, project `chromium` |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Start the GitHub Actions workflow or run locally. | Job starts successfully. |
| 2 | Install dependencies and Chromium. | Browser setup succeeds. |
| 3 | Run the smoke suite with the Chromium project. | Smoke tests execute against QA. |
| 4 | Review the test result and report. | Pass/fail status is reported and artifacts are available if configured. |

### CURA-CI-002 — Execute regression tests on Firefox and WebKit

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Cross-browser |
| Tags | `@regression` `@cross-browser` |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Select the Firefox project. | Regression suite runs in Firefox. |
| 2 | Review failures and browser-specific diagnostics. | Failures are attributable to application behavior or test setup. |
| 3 | Select the WebKit project. | Regression suite runs in WebKit. |
| 4 | Compare key journey results across browsers. | Supported workflows behave consistently. |

### CURA-CI-003 — Verify QA, UAT, and Staging environment selection

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | Configuration |
| Tags | `@regression` `@environment` |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Run with `ENV=qa`. | Playwright uses the configured QA URL. |
| 2 | Run with `ENV=uat`. | Playwright uses the configured UAT URL. |
| 3 | Run with `ENV=staging`. | Playwright uses the configured Staging URL. |
| 4 | Run with an unsupported value such as `ENV=production`. | Configuration stops with a clear error instead of silently using another environment. |

### CURA-CI-004 — Upload test artifacts after a failure

| Attribute | Details |
|---|---|
| Priority | P1 |
| Type | CI / Diagnostics |
| Tags | `@regression` `@ci` |
| Preconditions | GitHub Actions artifact upload is configured. |

**Test steps**

| Step | Action | Expected result |
|---:|---|---|
| 1 | Run a deliberately failing test in a safe branch. | Test fails as expected. |
| 2 | Allow the workflow to finish its post-test steps. | Artifact upload step still executes. |
| 3 | Open the workflow run's artifacts. | HTML report and available traces/screenshots are attached. |
| 4 | Inspect the failure artifacts. | Failure can be diagnosed without rerunning solely to collect evidence. |

---

# 5. Recommended Execution Matrix

| Trigger | Environment | Browser | Test scope |
|---|---|---|---|
| Pull request | QA | Chromium | P0 smoke tests, lint, type checking |
| Push to main | QA | Chromium, Firefox, WebKit | Smoke or selected regression |
| Nightly schedule | QA | Chromium, Firefox, WebKit | Full regression suite |
| Release candidate | UAT | Chromium, Firefox, WebKit | Acceptance and regression |
| Pre-release validation | Staging | Chromium, Firefox, WebKit | Smoke and release-critical regression |
| Manual workflow dispatch | Selected environment | Selected browser(s) | Targeted test or debugging |

# 6. Definition of Done

- [ ] Each test has a unique ID, priority, preconditions, test data, detailed steps, and expected results.
- [ ] Login positive and negative scenarios are covered.
- [ ] Appointment facility, readmission, healthcare program, visit date, and comment are covered.
- [ ] Successful booking asserts all five values on the summary page.
- [ ] JSON, CSV, and Excel records normalize to a shared typed model.
- [ ] Randomized test data is valid and reproducible.
- [ ] QA, UAT, and Staging are selectable by configuration.
- [ ] Chromium, Firefox, and WebKit projects are configured.
- [ ] GitHub Actions publishes reports and failure artifacts.
- [ ] Test data and credentials are handled safely.

## 7. References

- CURA Healthcare Service demo: https://katalon-demo-cura.herokuapp.com/
- Playwright documentation: https://playwright.dev/docs/intro
- Page Object Models: https://playwright.dev/docs/pom
- Playwright projects: https://playwright.dev/docs/test-projects
- GitHub Actions: https://docs.github.com/actions
