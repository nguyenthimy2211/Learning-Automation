import { APIResponse, Download, expect, Locator, Page } from "@playwright/test";
import { step } from "./logging";
import { Constants } from "./constants";

export class AssertHelper {
    protected page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    /**
         * Asserts that an element is attached to the DOM.
         * @param Locator - The element locator.
         * @param message - Optional custom message.
         */
    @step('Asserts that an element is attached to the DOM.')
    async assertElementAttached(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be attached to the DOM').toBeAttached();
    }

    /**
     * Asserts that an element is not attached to the DOM.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is not attached to the DOM.')
    async assertElementNotAttached(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element not to be attached to the DOM').not.toBeAttached();
    }

    /**
    * Asserts that a checkbox is checked.
    * @param locator - The checkbox locator.
    * @param message - Optional custom message.
    */
    @step('Asserts that a checkbox is checked.')
    async assertCheckboxChecked(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected checkbox to be checked').toBeChecked();
    }

    /**
     * Asserts that a checkbox is unchecked.
     * @param locator - The checkbox locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that a checkbox is unchecked.')
    async assertCheckboxUnchecked(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected checkbox to be unchecked').not.toBeChecked();
    }

    /**
     * Asserts that an element is disabled.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is disabled.')
    async assertElementDisabled(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be disabled').toBeDisabled();
    }

    /**
     * Asserts that an element is visible.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is visible.')
    async assertElementVisible(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be visible').toBeVisible();
    }

    /**
     * Asserts that an element is not visible.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is not visible.')
    async assertElementNotVisible(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be visible').not.toBeVisible();
    }

    /**
     * Asserts that an element is editable.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is editable.')
    async assertElementEditable(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be editable').toBeEditable();
    }

    /**
     * Asserts that an element is not editable.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is not editable.')
    async assertElementNotEditable(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to not be editable').not.toBeEditable();
    }

    /**
     * Asserts that an element is empty.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is empty.')
    async assertElementEmpty(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be empty').toBeEmpty();
    }

    /**
     * Asserts that an element is enabled.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is enabled.')
    async assertElementEnabled(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be enabled').toBeEnabled();
    }

    /**
     * Asserts that an element is focused.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is focused.')
    async assertElementFocused(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be focused').toBeFocused();
    }

    /**
     * Asserts that an element is in the viewport.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is in the viewport.')
    async assertElementInViewport(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be in the viewport').toBeInViewport();
    }

    /**
     * Asserts that an element is hidden.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element is hidden.')
    async assertElementHidden(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? 'Expected element to be hidden').toBeHidden();
    }

    /**
     * Asserts that an element has a specific attribute with the expected value.
     * @param locator - The element locator.
     * @param attribute - The attribute name to check.
     * @param expectedValue - The expected value of the attribute.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element has a specific attribute with the expected value.')
    async assertElementHasAttribute(locator: Locator, attribute: string, expectedValue?: string | RegExp, message?: string): Promise<void> {
        if (expectedValue) {
            await expect.soft(locator.first(), message ?? `Expected element to have attribute '${attribute}' with value '${expectedValue}'`)
                .toHaveAttribute(attribute, expectedValue);
        } else {
            await expect.soft(locator.first(), message ?? `Expected element to have attribute '${attribute}'`)
                .toHaveAttribute(attribute);
        }
    }

    /**
     * Asserts that an element's attibute is not existing or not equal an expected value.
     * @param locator - The element locator.
     * @param attribute - The attribute name to check.
     * @param expectedValue - The expected value of the attribute.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element attibute is not existing or not equal an expected value.')
    async assertElementNoAttribute(locator: Locator, attribute: string, expectedValue?: string, message?: string): Promise<void> {
        if (expectedValue) {
            await expect.soft(locator.first(), message ?? `Expected element to have attribute '${attribute}' but different from the value '${expectedValue}'`)
                .not.toHaveAttribute(attribute, expectedValue);
        } else {
            await expect.soft(locator.first(), message ?? `Expected element to have no attribute '${attribute}'`)
                .not.toHaveAttribute(attribute);
        }
    }

    /**
     * Asserts that the class property of an element should contain an expected value.
     * @param locator - The element locator.
     * @param expectedValue - The expected value of the class.
     * @param message - Optional custom message.
     */
    @step('Asserts that the class property of an element should contain an expected value.')
    async assertElementContainClass(locator: Locator, expectedValue: string | Array<string>, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? `Expected element to contains the class '${expectedValue}'`)
            .toContainClass(expectedValue);
    }

    /**
     * Asserts that the class property of an element should not contain an expected value.
     * @param locator - The element locator.
     * @param expectedValue - The expected value of the class.
     * @param message - Optional custom message.
     */
    @step('Asserts that the class property of an element should not contain an expected value.')
    async assertElementNotContainClass(locator: Locator, expectedValue: string | Array<string>, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? `Expected an element not contain the class '${expectedValue}'`)
            .not.toContainClass(expectedValue);
    }

    /**
     * Asserts that an element contains a specific text.
     *
     * Soft by default, like the rest of this helper, so a run collects every
     * failure instead of stopping at the first. Pass `soft: false` when the
     * assertion sits inside a retry — `toPass` / `expect.poll` treat an attempt
     * that did not throw as a PASSED attempt, so a soft assertion there silently
     * disables the retry and the failure only surfaces at the end of the test.
     *
     * @param locator - The element locator.
     * @param text - The expected text.
     * @param message - Optional custom message.
     * @param options - `soft: false` to throw on failure; `timeout` to override
     *                  the global expect timeout for slow-settling text.
     */
    @step('Asserts that an element contains a specific text.')
    async assertElementContainsText(
        locator: Locator,
        text: string | RegExp,
        message?: string,
        options?: { soft?: boolean; timeout?: number },
    ): Promise<void> {
        const description = message ?? `Expected element to contain text: "${text}"`;
        const assertion = options?.soft === false
            ? expect(locator.first(), description)
            : expect.soft(locator.first(), description);
        await assertion.toContainText(text, options?.timeout === undefined ? undefined : { timeout: options.timeout });
    }

    /**
     * Asserts that an element does not contain a specific text.
     * @param locator - The element locator.
     * @param text - The text expected to be absent.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element does not contain a specific text.')
    async assertElementNotContainsText(locator: Locator, text: string | RegExp, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? `Expected element not to contain text: "${text}"`).not.toContainText(text);
    }

    /**
     * Asserts that a locator has a specific number of elements.
     * @param locator - The element locator.
     * @param expectedCount - The expected number of elements.
     * @param message - Optional custom message.
     */
    @step('Asserts that a locator has a specific number of elements.')
    async assertElementCount(locator: Locator, expectedCount: number, message?: string): Promise<void> {
        await expect.soft(locator, message ?? `Expected element count to be ${expectedCount}`).toHaveCount(expectedCount);
    }

    /**
     * Asserts that a locator does not resolve to zero elements.
     * @param locator - The element locator.
     * @param message - Optional custom message.
     */
    @step('Asserts that a locator does not resolve to zero elements.')
    async assertElementCountNotZero(locator: Locator, message?: string): Promise<void> {
        await expect.soft(locator, message ?? 'Expected element count not to be 0').not.toHaveCount(0);
    }

    /**
     * Asserts that an element has a specific text. When passed an array, asserts
     * the locator resolves to that many elements with the given texts, in order.
     * @param locator - The element locator.
     * @param expectedText - The expected text, regular expression, or ordered list of them.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element has a specific text.')
    async assertElementHasText(locator: Locator, expectedText: string | RegExp | Array<string | RegExp>, message?: string): Promise<void> {
        // The array form asserts the locator resolves to that many elements,
        // in order — narrowing to .first() would silently collapse it to a
        // single-element comparison, contradicting the docstring above.
        // Confirmed no existing caller passes an array today, so this only
        // activates behavior that was previously broken, not one anyone
        // observed working — the string/RegExp form keeps .first() unchanged.
        const target = Array.isArray(expectedText) ? locator : locator.first();
        await expect.soft(target, message ?? `Expected element to have text '${expectedText}'`).toHaveText(expectedText);
    }

    /**
     * Asserts that an input field has a specific value.
     * @param locator - The element locator.
     * @param expectedValue - The expected value of the input field.
     * @param message - Optional custom message.
     */
    @step('Asserts that an input field has a specific value.')
    async assertElementHasValue(locator: Locator, expectedValue: string | RegExp, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? `Expected element to have value '${expectedValue}'`)
            .toHaveValue(expectedValue);
    }

    /**
     * Asserts that an element's value differs from a previously captured value.
     * Useful when the expected new value can't be predicted (e.g. it depends
     * on an item's unit/increment step), so the caller passes in a snapshot
     * taken before the action instead of a hardcoded target.
     * @param locator - The element locator.
     * @param previousValue - The value captured before the action, expected to differ now.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element value changed from a previous value.')
    async assertElementValueChanged(locator: Locator, previousValue: string, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? `Expected element value to change from '${previousValue}'`)
            .not.toHaveValue(previousValue);
    }

    /**
     * Asserts that an element's text differs from a previously captured value.
     * @param locator - The element locator.
     * @param previousText - The text captured before the action, expected to differ now.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element text changed from a previous value.')
    async assertElementTextChanged(locator: Locator, previousText: string, message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? `Expected element text to change from '${previousText}'`)
            .not.toHaveText(previousText);
    }

    /**
     * Asserts that a multi-select dropdown has specific selected values.
     * @param locator - The select element locator.
     * @param expectedValues - The expected selected values.
     * @param message - Optional custom message.
     */
    @step('Asserts that a multi-select dropdown has specific selected values.')
    async assertElementHasValues(locator: Locator, expectedValues: string[], message?: string): Promise<void> {
        await expect.soft(locator.first(), message ?? `Expected element to have selected values '${expectedValues.join(', ')}'`)
            .toHaveValues(expectedValues);
    }

    /**
     * Asserts that a page has a specific title.
     * @param page
     * @param title - The expected title.
     * @param message - Optional custom message.
     */
    @step('Asserts that a page has a specific title.')
    async assertPageHasTitle(page: Page, title: string | RegExp, message?: string): Promise<void> {
        await expect.soft(page, message ?? `Expected page title to be "${title}"`).toHaveTitle(title);
    }

    /**
     * Asserts that a page has a specific URL.
     * @param page
     * @param url - The expected URL.
     * @param message - Optional custom message.
     */
    @step('Asserts that a page has a specific URL.')
    async assertPageHasURL(page: Page, url: string | RegExp, message?: string): Promise<void> {
        await expect.soft(page, message ?? `Expected page URL to be "${url}"`).toHaveURL(url);
    }

    /**
     * Asserts that a page does not have a specific URL.
     * @param page
     * @param url - The URL expected not to match.
     * @param message - Optional custom message.
     */
    @step('Asserts that a page does not have a specific URL.')
    async assertPageNotHasURL(page: Page, url: string | RegExp, message?: string): Promise<void> {
        await expect.soft(page, message ?? `Expected page URL not to be "${url}"`).not.toHaveURL(url);
    }

    /**
     * Asserts that an API response is OK (status 200-299).
     * @param response - The API response object.
     * @param message - Optional custom message.
     */
    @step('Asserts that an API response is OK (status 200-299).')
    async assertResponseOK(response: APIResponse, message?: string): Promise<void> {
        await expect.soft(response, message ?? 'Expected API response to be OK (status 200-299)').toBeOK();
    }

    /**
     * Asserts that an element matches a stored screenshot.
     * @param locator - The element locator.
     * @param screenshotPath - The path to store the screenshot or compare against.
     * @param options - Optional Playwright screenshot comparison options.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element matches a stored screenshot.')
    async assertElementHasScreenshot(
        locator: Locator,
        screenshotPath: string,
        options?: { threshold?: number; animations?: 'disabled' | 'allow' },
        message?: string
    ): Promise<void> {
        await expect.soft(locator, message ?? `Expected element to match screenshot '${screenshotPath}'`)
            .toHaveScreenshot(screenshotPath, options);
    }

    /**
     * Asserts that the full page matches a stored screenshot.
     *
     * @param page - The Playwright page instance.
     * @param screenshotPath - The path to store the screenshot or compare against.
     * @param options - Optional Playwright screenshot comparison options.
     * @param message - Optional custom message.
     */
    @step('Asserts that the page matches a stored screenshot.')
    async assertPageHasScreenshot(
        page: Page,
        screenshotPath: string,
        options?: { threshold?: number; animations?: 'disabled' | 'allow' },
        message?: string
    ): Promise<void> {
        await expect.soft(page, message ?? `Expected page to match screenshot '${screenshotPath}'`)
            .toHaveScreenshot(screenshotPath, options);
    }

    /**
     * Asserts that an element has a specific CSS property value.
     * @param locator - The element locator.
     * @param property - The CSS property to check.
     * @param expectedValue - The expected value of the CSS property.
     * @param message - Optional custom message.
     */
    @step('Asserts that an element has a specific CSS property value.')
    async assertElementHasCSS(
        locator: Locator,
        property: string,
        expectedValue: string,
        message?: string
    ): Promise<void> {
        await expect.soft(locator, message ?? `Expected element to have CSS '${property}: ${expectedValue}'`)
            .toHaveCSS(property, expectedValue);
    }

    /**
     * Assert the current value of an input/textarea/select matches expected.
     * @param {Locator} locator
     * @param {string | RegExp} value
     * @param {number} timeout
     */
    @step('Expect input to have value')
    async expectToHaveValue(locator: Locator, value: string | RegExp, timeout: number = Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE): Promise<void> {
        await expect(locator.first()).toHaveValue(value, { timeout });
    }

    /**
     * Assert the current locator has text
     * @param {Locator} locator
     * @param {string | RegExp} value
     * @param {number} timeout
     */
    @step('Expect to have text')
    async expectToHaveText(locator: Locator, value: string | RegExp, timeout: number = Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE): Promise<void> {
        await expect(locator.first()).toHaveText(value, { timeout });
    }

    /**
     * Assert an element has a specific attribute value.
     * @param {Locator} locator
     * @param {string} attribute
     * @param {string | RegExp} value
     * @param {number} timeout
     */
    @step('Expect element to have attribute')
    async expectToHaveAttribute(locator: Locator, attribute: string, value: string | RegExp, timeout: number): Promise<void> {
        await expect(locator.first()).toHaveAttribute(attribute, value, { timeout });
    }

    /**
     * Assert an element has a CSS class (or matches a class regex).
     * @param {Locator} locator
     * @param {string | RegExp} className
     * @param {number} timeout
     */
    @step('Expect element to have class')
    async expectToHaveClass(locator: Locator, className: string | RegExp, timeout: number = Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE): Promise<void> {
        await expect(locator.first()).toHaveClass(className, { timeout });
    }

    /**
     * Assert the number of elements matching a locator.
     * @param {Locator} locator
     * @param {number} count
     * @param {number} timeout
     */
    @step('Expect element count')
    async expectToHaveCount(locator: Locator, count: number, timeout: number = Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE): Promise<void> {
        await expect(locator).toHaveCount(count, { timeout });
    }

    /**
     * Assert the page URL matches a string or regex.
     * @param {string | RegExp} url
     */
    @step('Expect page URL')
    async expectToHaveURL(url: string | RegExp): Promise<void> {
        await expect(this.page).toHaveURL(url);
    }

    /**
     * Assert a checkbox or radio input is checked (or not checked).
     * @param {Locator} locator
     * @param {boolean} checked - Default true (checked)
     * @param {number} timeout
     */
    @step('Expect element to be checked')
    async expectToBeChecked(locator: Locator, checked: boolean, timeout: number = Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE): Promise<void> {
        await expect(locator.first()).toBeChecked({ checked, timeout });
    }

    /**
     * Verify the validation message text directly from the element
     * @param locator
     * @param message
     */
    @step('Verify the validation message text directly from the element')
    async expectToHaveJSProperty(locator: Locator, message: string = 'Please fill out this field.'): Promise<void> {
        await expect(locator.first()).toHaveJSProperty('validationMessage', message);
    }

    /**
     * Asserts that a download has the expected filename.
     * @param download - The Playwright download object.
     * @param expectedFilename - The expected filename.
     * @param message - Optional custom message.
     */
    @step('Asserts that download has expected filename.')
    assertDownloadFilename(download: Download, expectedFilename: string, message?: string): void {
        expect.soft(download.suggestedFilename(), message ?? `Expected download filename to be '${expectedFilename}'`)
            .toBe(expectedFilename);
    }

    /**
     * Asserts that a download filename matches a regex pattern.
     * @param download - The Playwright download object.
     * @param pattern - The regex pattern to match.
     * @param message - Optional custom message.
     */
    @step('Asserts that download filename matches pattern.')
    assertDownloadFilenameMatches(download: Download, pattern: RegExp, message?: string): void {
        const filename = download.suggestedFilename();
        expect.soft(
            pattern.test(filename),
            message ?? `Expected filename '${filename}' to match pattern ${pattern}`
        ).toBe(true);
    }

}
