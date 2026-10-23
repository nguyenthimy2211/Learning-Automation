import { expect, Locator, Page, test, type Browser, type Download, type FrameLocator, type Response } from '@playwright/test';
import { CommonLocators } from '@locators/common-locators';
import { step } from '@utilities/logging';
import { Logger } from '@utilities/logger';
import { Constants } from '@utilities/constants';
import { Utility } from '@utilities/utility';

export class CommonPage extends CommonLocators {

    constructor(page: Page) {
        super(page);
    }

    /**
     * Best-effort human-readable locator description for logs.
     */
    private describeLocator(locator: Locator): string {
        try {
            return locator.first().toString();
        } catch {
            return '[locator]';
        }
    }

    /**
    * Go to the URL
    * @param {string} url
    * @param {boolean} isWait - Add a short settle delay after the load state (default true)
    * @param {'load'|'domcontentloaded'|'commit'} waitUntil - Navigation wait condition
    * @param {number} [timeout] - Navigation timeout in ms. Pass a short value when the
    *   caller wraps this goto in a retry (`toPass`): a navigation left on Playwright's
    *   30s default can consume the whole outer budget in one attempt, so the retry never
    *   gets a second try. Omit to keep the default.
    */
    @step('Go to the URL')
    async goto(
        url: string,
        isWait: boolean = true,
        waitUntil: 'load' | 'domcontentloaded' | 'commit' = 'load',
        timeout: number = Constants.TIMEOUTS.DEFAULT,
    ): Promise<void> {
        await this.page.goto(url, { waitUntil, ...(timeout === undefined ? {} : { timeout }) });
        if (waitUntil !== 'commit') {
            await this.page.waitForLoadState(waitUntil, timeout === undefined ? undefined : { timeout });
        }
        if (isWait) {
            await Utility.delay(waitUntil === 'commit' ? 5 : 3);
        }
    }

    /**
     * Clicks the "Continue" button.
     */
    @step('Click on Continue button')
    async clickContinue(): Promise<void> {
        await this.click(this.btnContinue);
        await this.waitForPageLoad();
    }

    /**
     * Click on Locator
     * @param {Locator} locator
     * @param {object} [option] - Passed through to Playwright's `click()`. `timeout` defaults to WAIT_ELEMENT_VISIBLE; a caller-supplied `option.timeout` wins.
     */
    @step('Click on Locator')
    async click(locator: Locator, option?: Parameters<Locator['click']>[0]): Promise<void> {
        const target = locator.first();
        Utility.logAction('CommonPage', 'click', this.describeLocator(target));

        await expect(target).toBeVisible({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
        await expect(target).toBeEnabled({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });

        await target.scrollIntoViewIfNeeded().catch(() => {});

        try {
            // Caller-supplied option.timeout still wins (spread after the default).
            await target.click({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE, ...option });
        } catch (error: unknown) {
            if (
              error instanceof Error &&
              /Timeout|intercepts pointer events|not attached/i.test(error.message)
            ) {
              Utility.logAction('CommonPage', 'force-click', this.describeLocator(target));
              await target.click({
                  ...option,
                  force: true,
                  timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE,
              });
            } else {
              throw error;
            }
        }
        await this.page.waitForLoadState();
        await Utility.delay(1);
    }

    /**
     * Clicks a locator by dispatching a native "click" event directly on the element,
     * bypassing Playwright's hit-testing and actionability checks entirely.
     *
     * Use only when a known, unrelated element (e.g. an adjacent canvas/overlay) sits on top
     * of the target at its real screen coordinate, so neither a normal click nor a force-click
     * (which still dispatches via real mouse coordinates, respecting whatever's stacked on top)
     * can ever reach it. dispatchEvent invokes the target's own bound listeners directly,
     * regardless of what's visually on top of it.
     *
     * @param {Locator} locator
     * @returns {Promise<void>}
     */
    @step('Click Locator by dispatching event (bypasses overlay interception)')
    async clickBypassingOverlay(locator: Locator): Promise<void> {
        const target = locator.first();
        Utility.logAction('CommonPage', 'clickBypassingOverlay', this.describeLocator(target));
        await expect(target).toBeVisible();
        await target.dispatchEvent('click');
    }

    /**
     * Force-clicks a locator at its screen position without waiting for it to be
     * enabled — for checking what a user's click does on a disabled control (e.g.
     * an aria-disabled option with `pointer-events: none`). Unlike
     * {@link clickBypassingOverlay}, it goes through real mouse coordinates, so it
     * reaches only what a user's click would.
     *
     * @param {Locator} locator
     * @returns {Promise<void>}
     */
    @step('Force-click Locator (no enabled check)')
    async forceClick(locator: Locator): Promise<void> {
        const target = locator.first();
        Utility.logAction('CommonPage', 'forceClick', this.describeLocator(target));
        await expect(target).toBeVisible({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
        await target.click({ force: true, timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
    }


    /**
     * Click `clickTarget`, then confirm it took effect by waiting for `appears`
     * to attach, re-clicking if it doesn't within {@link Constants.TIMEOUTS.WAIT_ELEMENT_TIMEOUT}.
     * Encapsulates the "a UI click can be silently dropped while the page is
     * mid-render, so re-click rather than just wait longer" pattern that the
     * forecasting worksheet's lock/unlock buttons both need.
     *
     * @param {Locator} clickTarget - The control to click on each attempt.
     * @param {Locator} appears - The element that attaches once the click takes effect.
     * @param {number} [timeout] - Total budget across all re-click attempts.
     * @returns {Promise<void>}
     */
    @step('Click until the expected element appears')
    async clickUntil(clickTarget: Locator, appears: Locator, timeout: number = Constants.TIMEOUTS.WAIT_LOCATOR): Promise<void> {
        await expect(async() => {
            await this.click(clickTarget);
            await this.waitForAttached(appears, Constants.TIMEOUTS.WAIT_ELEMENT_TIMEOUT);
        }).toPass({ timeout });
    }

    /**
     * Double Click on Locator
     * @param {Locator} locator
     */
    @step('Double Click on Locator')
    async dblclick(locator: Locator, option?: object): Promise<void> {
        const target = locator.first();
        Utility.logAction('CommonPage', 'dblclick', this.describeLocator(target));
        await expect(target).toBeVisible();
        await expect(target).toBeEnabled();
        if (await target.isEnabled()) {
            const att = await this.getAttribute(locator, 'disabled');
            if (att !== 'disabled') {
                await target.scrollIntoViewIfNeeded();
                try {
                    await target.dblclick(option);
                } catch {
                    await target.dblclick({ ...(option as Record<string, unknown>), force: true });
                }
                await this.page.waitForLoadState();
            }
        }
    }

    /**
     * Check Locator
     * @param {Locator} locator
     */
    @step('Check Locator')
    async check(locator: Locator): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
        await expect(target).toBeEnabled({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
        // On CI the underlying framework (MUI) may re-render the checkbox right after
        // a click and revert its state, so `check` throws "did not change its state".
        // Retry until the element is actually checked, letting each render settle.
        await expect(async() => {
            if (!(await target.isChecked())) {
                await target.check({ force: true });
            }
            await expect(target).toBeChecked();
        }).toPass({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
    }

    /**
     * Uncheck Locator
     * @param {Locator} locator
     */
    @step('Uncheck Locator')
    async uncheck(locator: Locator): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
        await expect(target).toBeEnabled({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
        // Mirror `check`: retry through framework re-renders that revert the state.
        await expect(async() => {
            if (await target.isChecked()) {
                await target.uncheck({ force: true });
            }
            await expect(target).not.toBeChecked();
        }).toPass({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
    }

    /**
     * Focuses the element, and then uses keyevents
     * @param {Locator} locator
     * @param {string} key
     */
    @step('Focuses the element, and then uses keyevents')
    async press(locator: Locator, key: string): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        await target.press(key);
        await this.page.waitForLoadState();
    }

    /**
     * Input value into field
     * @param {Locator} locator
     * @param {string} value
     * @param {boolean} force
     */
    @step('Input value into field')
    async fill(locator: Locator, value: string, force: boolean = true, isClear?: boolean): Promise<void> {
        const target = locator.first();
        Utility.logAction('CommonPage', 'fill', `${this.describeLocator(target)} <= "${value}"`);
        await expect(target).toBeVisible();
        if (await target.isEditable() && await target.isEnabled()) {
            if (isClear) {
                await target.clear();
                await target.click();
            }
            await target.fill(value, { force });
        } else {
            Logger.warn('The locator is not editable or enabled');
        }
    }

    /**
    * Input value into field
    * @param {Locator} locator
    * @param {string} value
    */
    @step('Input value into field')
    async pressSequentially(locator: Locator, value: string): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        if (await target.isEditable() && await target.isEnabled()) {
            await target.pressSequentially(value, { delay: 100 });
            await Utility.delay(2);
        }
    }

    /**
     * Clear Text Field
     * @param {Locator} locator
     */
    @step('Clear Text Field')
    async clear(locator: Locator): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        if (await target.isEditable() && await target.isEnabled()) {
            await target.fill('');
        }
    }

    /**
     * Hover over a Locator
     * @param {Locator} locator
     */
    @step('Hover over a Locator')
    async hover(locator: Locator): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        await target.hover({ force: true });
    }

    /**
     * Check Locator is visible or not
     * @param {Locator} locator
     * @param {number} timeout - ms to poll for the element to become enabled (default: no wait, single immediate check)
     * @returns
     */
    @step('Check Locator is visible or not')
    async isVisible(locator: Locator, timeout?: number): Promise<boolean> {
        return await locator.first().isVisible(timeout === undefined ? undefined : { timeout });
    }

    /**
     * Check Locator is enabled or not
     * @param {Locator} locator
     * @param {number} timeout - ms to poll for the element to become enabled (default: no wait, single immediate check)
     * @returns
     */
    @step('Check Locator is enabled or not')
    async isEnabled(locator: Locator, timeout?: number): Promise<boolean> {
        return await locator.first().isEnabled(timeout === undefined ? undefined : { timeout });
    }

    /**
     * Check Locator is editable or not
     * @param {Locator} locator
     * @returns
     */
    @step('Check Locator is editable or not')
    async isEditable(locator: Locator): Promise<boolean> {
        return await locator.first().isEditable();
    }

    /**
     * Wait Locator with visible state
     * @param {Locator} locator
     * @returns
     */
    @step('Wait Locator with visible state')
    async waitForVisible(locator: Locator, timeout: number = Constants.TIMEOUTS.WAIT_LOCATOR): Promise<void> {
        Utility.logAction('CommonPage', 'waitForVisible', this.describeLocator(locator));
        await locator.first().waitFor({ state: 'visible', timeout });
    }

    /**
     * Click the generic Dismiss button if present.
     * @param timeout
     */
    @step('Click Dismiss button if present')
    async clickDismiss(timeout: number = 2000): Promise<void> {
        if (await this.isVisible(this.btnDismiss, timeout) && await this.isEnabled(this.btnDismiss)) {
            await this.click(this.btnDismiss);
        }

        // Handle case if the popup show Cancel to Dismiss
        await this.clickCancel();
    }

    /**
     * Click the generic Cancel button if present.
     *
     * "If present" means present AND actionable: some surfaces (e.g. the Quick Service ticket
     * footer) always render a "Cancel" button but leave it disabled until there is something to
     * cancel, so a visibility-only guard would try to click a disabled control and time out in
     * click()'s toBeEnabled assertion. Require enabled as well so the helper safely no-ops.
     * @param timeout
     */
    @step('Click Cancel button if present')
    async clickCancel(timeout: number = 2000): Promise<void> {
        if (await this.isVisible(this.btnCancel, timeout) && await this.isEnabled(this.btnCancel)) {
            await this.click(this.btnCancel);
        }
    }

    /**
     * Wait Locator with attached state
     * @param {Locator} locator
     * @returns
     */
    @step('Wait Locator with attached state')
    async waitForAttached(locator: Locator, timeout: number = Constants.TIMEOUTS.WAIT_LOCATOR): Promise<void> {
        await locator.first().waitFor({ state: 'attached', timeout });
    }

    /**
     * Wait Locator with detached state
     * @param {Locator} locator
     * @returns
     */
    @step('Wait Locator with detached state')
    async waitForDetached(locator: Locator, timeout: number = Constants.TIMEOUTS.WAIT_LOCATOR): Promise<void> {
        await locator.first().waitFor({ state: 'detached', timeout });
    }

    /**
     * Wait Locator with hidden state
     * @param {Locator} locator
     * @returns
     */
    @step('Wait Locator with hidden state')
    async waitForHidden(locator: Locator, timeout: number = Constants.TIMEOUTS.WAIT_LOCATOR): Promise<void> {
        await locator.first().waitFor({ state: 'hidden', timeout });
    }

    /**
     * Wait Locator with disabled state
     * @param {Locator} locator
     * @param [timeout=Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE]
     */
    @step('Wait Locator with disabled state')
    async waitForDisabled(locator: Locator, timeout: number = Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE): Promise<void> {
        await expect(locator.first()).toBeDisabled({ timeout });
    }

    /**
     * Wait Locator with enabled state (e.g. a submit button that stays disabled
     * until an async validation completes).
     * @param {Locator} locator
     * @param [timeout=Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE]
     */
    @step('Wait Locator with enabled state')
    async waitForEnabled(locator: Locator, timeout: number = Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE): Promise<void> {
        await expect(locator.first()).toBeEnabled({ timeout });
    }
    /**
     * Wait for page load
     */
    @step('Wait for page load')
    async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
        await this.page.waitForLoadState(state);
    }

    /**
     * Scroll an element into view
     * @param {Locator} locator
     */
    @step('Scroll an element into view')
    async scrollIntoView(locator: Locator): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        await target.scrollIntoViewIfNeeded();
        await Utility.delay(1);
    }

    /**
     * Get the count of elements matching the locator
     * @param {Locator} locator
     * @returns
     */
    @step('Get the count of elements matching the locator')
    async count(locator: Locator): Promise<number> {
        return await locator.count();
    }

    /**
     * Get Text of Locator, if errors, return ''
     * @param {Locator} locator
     * @param {boolean} trim - Whether to trim whitespace (default: true)
     * @returns
     */
    @step('Get Text of Locator')
    async textContent(locator: Locator, trim: boolean = true): Promise<string> {
        const target = locator.first();
        if (!(await this.isVisible(target))) {
            return '';
        }
        const content = await target.textContent() ?? '';
        return trim ? content.trim() : content;
    }

    /**
     * Get Inner Text of Locator, if errors, return ''
     * @param {Locator} locator
     * @returns
     */
    @step('Get Inner Text of Locator')
    async innerText(locator: Locator): Promise<string> {
        const target = locator.first();
        if (!(await this.isVisible(target))) {
            return '';
        }
        return (await target.innerText())?.trim() ?? '';
    }

    /**
     * Check Locator attribute
     * @param {Locator} locator
     * @param {string} attribute Default: value
     * @returns
     */
    @step('Get Attribute Value')
    async getAttribute(locator: Locator, attribute: string = 'value'): Promise<string> {
        const target = locator.first();
        if (!(await this.isVisible(target))) {
            return '';
        }
        return await target.getAttribute(attribute) ?? '';
    }

    /**
     * Wait for an element to disappear
     * @param {Locator} locator
     * @param timeout
     */
    @step('Wait for an element to disappear')
    async waitForElementToDisappear(locator: Locator, timeout: number = Constants.TIMEOUTS.DEFAULT): Promise<void> {
        await locator.first().waitFor({ state: 'hidden', timeout });
    }

    /**
     * Expect Locator to be hidden
     * @param {Locator} locator
     */
    @step('Expect Locator to be hidden')
    async toBeHidden(locator: Locator): Promise<void> {
        await expect.soft(locator.first()).toBeHidden();
    }

    // New Functions
    /**
     * Upload a file to a file input field
     * @param {Locator} locator
     * @param {string} filePath
     */
    @step('Upload a file to a file input field')
    async uploadFile(locator: Locator, filePath: string): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        await target.setInputFiles(filePath);
    }

    /**
     * Set files on a file input without requiring it to be visible. Many file
     * inputs are visually hidden behind a "Browse"/"Choose file" button, so the
     * visibility assertion in {@link uploadFile} would fail; this waits for the
     * input to be attached to the DOM and then sets the files.
     * @param {Locator} locator
     * @param {string | string[]} filePath
     */
    @step('Set files on a (possibly hidden) file input')
    async setInputFiles(locator: Locator, filePath: string | string[]): Promise<void> {
        const target = locator.first();
        await target.waitFor({ state: 'attached' });
        await target.setInputFiles(filePath);
    }

    /**
     * Upload a file via the native file chooser triggered by clicking a locator
     * (e.g. an "Upload file" link/button that doesn't expose a file input directly).
     * @param {Locator} triggerLocator - Element that opens the file chooser when clicked
     * @param {string | string[]} filePath
     */
    @step('Upload a file via file chooser')
    async uploadFileViaChooser(triggerLocator: Locator, filePath: string | string[]): Promise<void> {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.click(triggerLocator);
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);
    }

    /**
     * Check if an element has an attribute
     * @param {Locator} locator
     * @param {string} attribute
     * @returns
     */
    @step('Check if an element has an attribute')
    async isAttributeExist(locator: Locator, attribute: string): Promise<boolean> {
        const target = locator.first();
        if (!(await this.isVisible(target))) {
            return false;
        }
        const isHasAttribute = await target.getAttribute(attribute);
        return isHasAttribute !== null;
    }

    /**
     * Validate Option
     * @param {string[]} conditionMethods
     * @param {string} option
     */
    @step('Validate Options')
    validateOption(conditionMethods: { [key: string]: string }, option: string): void {
        // Validate the option
        if (!Object.hasOwn(conditionMethods, option)) {
            throw new Error(`Invalid option: "${option}". No corresponding method found.`);
        }
    }

    /**
     * Close the browser context owning the given Page (defaults to this
     * instance's own `this.page`) — tests rarely need this, the Page is
     * normally closed automatically when the test fixture tears down. Also
     * the counterpart to {@link openNewContextPage}: pass that page's
     * return value directly, no `setPage()` redirect required first.
     * @param {Page} [page] - The page whose context to close (defaults to `this.page`)
     * @returns {Promise<void>}
     */
    @step('Close Browser')
    async closeBrowser(page: Page = this.page): Promise<void> {
        await page.context().close();
    }

    /**
     * Reload page
     */
    @step('Reload page')
    async reload(): Promise<void> {
        await this.page.reload();
        await this.page.waitForLoadState();
        await Utility.delay(3);
    }

    /**
     * Navigate to url
     * @param {string} url
     */
    @step('Navigate to URL')
    async navigate(url: string, isWait: boolean = true): Promise<void> {
        Utility.logAction('CommonPage', 'navigate', url);
        await this.goto(url, isWait);
    }

    /**
     * Scroll to Locator
     * @param {Locator} locator
     */
    @step('Scroll to Locator')
    async scrollTo(locator: Locator): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        await target.scrollIntoViewIfNeeded();
    }

    /**
     * Check if Locator is Checked
     * @param {Locator} locator
     * @param {number} timeout - ms to wait for the checkbox to settle before checking (default: WAIT_LOCATOR)
     * @returns
     */
    @step('Check if Locator is Checked')
    async isChecked(locator: Locator, timeout: number = Constants.TIMEOUTS.WAIT_LOCATOR): Promise<boolean> {
        const target = locator.first();
        // isChecked() has no timeout of its own and can hang for the entire
        // test timeout if the element stays obscured (e.g. by an undismissed
        // report-ready modal). Bound the wait explicitly so a stuck overlay
        // fails fast instead of silently consuming the whole test budget.
        await target.waitFor({ state: 'visible', timeout });
        return await target.isChecked();
    }

    /**
     * Set locator check or unchecked
     * @param locator
     * @param checked
     * @param timeout
     */
    @step('Set locator check or unchecked')
    async setChecked(locator: Locator, checked: boolean, timeout: number = Constants.TIMEOUTS.WAIT_LOCATOR): Promise<void> {
        const target = locator.first();
        await target.waitFor({ state: 'visible', timeout });
        await target.setChecked(checked);
    }

    /**
     * Select an option from a dropdown.
     * @param locator - Dropdown locator
     * @param option - Option value, label, index, or multiple selections
     */
    @step('Select Option from Dropdown')
    async selectOption(
        locator: Locator,
        option: Parameters<Locator['selectOption']>[0],
    ): Promise<void> {
        await expect(locator.first()).toBeVisible();
        await locator.first().selectOption(option);
    }

    /**
     * Wait Until Element Contains Text
     * @param {Locator} locator
     * @param {string} text
     * @param {number} timeout - ms (default: DEFAULT)
     */
    @step('Wait Until Element Contains Text')
    async waitUntilContainsText(locator: Locator, text: string, timeout: number = Constants.TIMEOUTS.DEFAULT): Promise<void> {
        await expect(locator.first()).toHaveText(text, { timeout });
    }

    /**
     * Wait Until a Polled Condition Reports the Expected State
     *
     * For a settling condition that no single locator assertion can express — a
     * list that has to be both non-empty AND free of stale rows, say, where
     * either half on its own resolves on the wrong render. `probe` returns the
     * state it observes as a string: `expectedState` once settled, otherwise a
     * description of what it actually saw, which is what the failure reports.
     *
     * Feature page objects call this instead of `expect.poll` directly: raw
     * `expect` belongs to this layer and `assertHelper` (see
     * `prompts/core/pom-generator.md` → "ASSERTION ROUTING — FORBIDDEN").
     *
     * Polling, not asserting — a `verify<X>` method still owns the assertion
     * that the settled state is the RIGHT state.
     * @param {() => Promise<string>} probe - Re-run until it returns `expectedState`
     * @param {string} expectedState - The value `probe` returns once settled
     * @param {string} message - Reported when the condition never settles
     * @param {number} timeout - ms (default: DEFAULT). Keep the probe's own waits
     *   short: a probe left on the 30–60s defaults spends this whole budget on
     *   one pass, so nothing is ever polled a second time.
     */
    @step('Wait Until a Polled Condition Reports the Expected State')
    async waitForCondition(
        probe: () => Promise<string>,
        expectedState: string,
        message: string,
        timeout: number = Constants.TIMEOUTS.DEFAULT,
    ): Promise<void> {
        await expect.poll(probe, { timeout, message }).toBe(expectedState);
    }

    /**
     * Accept dialog popup
    */
    @step('Accept dialog popup')
    dialogAccept(): void {
        this.page.on('dialog', dialog => dialog.accept());
    }

    /**
     * Verify dialog's message
     * @param {number} timeout - ms (default: WAIT_ELEMENT_INVISIBLE)
     */
    @step('Verify message in a dialog')
    async dialogMessage(
        timeout: number = Constants.TIMEOUTS.WAIT_ELEMENT_INVISIBLE
    ): Promise<string> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(
            () => reject(new Error('No dialog appeared')),
            timeout
        );

        this.page.once('dialog', (dialog) => {
            clearTimeout(timer);
            resolve(dialog.message());
        });
    });
}

    /**
     * Reload page
     */
    @step('Reload Page')
    async reloadPage(): Promise<void> {
        await this.page.reload();
        await Utility.delay(1);
    }

    /**
     * Go Back Page
     */
    @step('Go Back Page')
    async goBackPage(): Promise<void> {
        await this.page.goBack();
        await Utility.delay(1);
    }

    /**
     * Go Forward Page
     */
    @step('Go Forward Page')
    async goForwardPage(): Promise<void> {
        await this.page.goForward();
        await Utility.delay(1);
    }

    /**
     * Press Keyboard
    * @param {string} key eg: Enter, Shift+A
     */
    @step('Press Keyboard')
    async pressKeyboard(key: string = 'Enter'): Promise<void> {
        await this.page.keyboard.press(key);
    }

    /**
     * Type a text
    * @param {string} text
     */
    @step('Type a text')
    async type(text: string, delay: number = 0): Promise<void> {
        await this.page.keyboard.type(text, { delay: delay });
    }

    /**
     * getAllTextContents: Returns an array of node.textContent values for all matching nodes.
     * @param {Locator} locator
     * @returns
     */
    @step('Get All Text Contents')
    async getAllTextContents(locator: Locator): Promise<Array<string>> {
        if (!(await this.isVisible(locator))) {
            return [];
        }
        return await locator.first().allTextContents();
    }

    /**
     * Extract Protocol and Hostname
     * Then Navigate to subfix
     * @param {string} path
     */
    @step('Navigate to URL')
    async openPage(path: string = ''): Promise<void> {
        const currentURL = this.page.url();
        const { protocol, hostname } = Utility.getDomainFromUrl(currentURL);

        await this.navigate(`${protocol}//${hostname}${path}`);
    }

    /**
     * Click to Hyperlink Text
     * @param {string} text
     */
    @step('Click to Hyperlink Text')
    async clickToHyperlink(text: string): Promise<void> {
        await this.click(this.linkText(text).first());
    }

    /**
     * Get color of Locator
     * @param {string} selector
     * @param {string} styleValue
     * @param {string} pseudoElement
     * @returns
     */
    @step('Get color of Locator')
    async getColor(selector: string, styleValue: string = 'background-color', pseudoElement: string = ''): Promise<string> {
        const params = {
            selector,
            styleValue,
            pseudoElement
        };

        const rgb = await this.page.evaluate(
            ({ selector, styleValue, pseudoElement }) => {
                const element: Element | null = document.querySelector(selector);
                if (!element) {
                    return ''; // or any default value like 'transparent'
                }

                let style: CSSStyleDeclaration;
                if (pseudoElement && pseudoElement !== '') {
                    style = globalThis.getComputedStyle(element, pseudoElement);
                } else {
                    style = globalThis.getComputedStyle(element);
                }
                return style.getPropertyValue(styleValue);
            }, params
        );

        return this.convertRgbToHex(rgb);
    }

    /**
     * Convert Rgb to Hex
     * @param {string} color
     * @returns
     */
    @step('Convert Rgb to Hex')
    convertRgbToHex(color: string = ''): string {
        // `color.match(...)` returns `string[] | null`; defaulting each component
        // to 0 keeps the helper total-functional even when the input is empty or
        // doesn't match the rgb shape (e.g. "transparent").
        const [r = 0, g = 0, b = 0] = color.match(/\d+/g)?.map(Number) ?? [];
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Wait for a period of time (in seconds).
     *
     * @deprecated Hard sleeps cause flakiness. Prefer Playwright auto-waiting via locator
     * actions, `expect(locator).toBeVisible()`, `expect.poll(...)`, or `assertHelper.assertElementVisible(...)`.
     * Existing call sites should be migrated to deterministic waits over time.
     *
     * @param {number} timeout - seconds
     */
    @step('Wait for a period of time')
    async waitFor(timeout: number): Promise<void> {
        await this.page.waitForTimeout(timeout * 1000);
    }

    /**
     * Wait for a period of time in milliseconds.
     *
     * @deprecated Hard sleeps cause flakiness. Prefer Playwright auto-waiting via locator
     * actions, `expect(locator).toBeVisible()`, `expect.poll(...)`, or `assertHelper.assertElementVisible(...)`.
     * Existing call sites should be migrated to deterministic waits over time.
     *
     * @param {number} ms - milliseconds
     */
    @step('Wait for milliseconds')
    async waitForMillis(ms: number): Promise<void> {
        await this.page.waitForTimeout(ms);
    }

    /**
     * Get API Response
     * @param {string} url - Substring matched against response URL
     * @param {string} method - HTTP method (default GET)
     * @param {string} expectedStatus
     * @param {number} timeout - Timeout in milliseconds (default 60000)
     * @returns
     */
    @step('Wait for API Response')
    async getAPIResponse(
        url: string,
        method: string = 'GET',
        expectedStatus: number = 200,
        timeout: number = Constants.TIMEOUTS.DEFAULT
    ): Promise<{ response: Response; body: unknown } | null> {
        try {
            const response = await this.page.waitForResponse(
                res =>
                    res.url().includes(url) &&
                    res.request().method() === method &&
                    res.status() === expectedStatus,
                { timeout }
            );

            const body = await response.json();

            return { response, body };
        } catch {
            return null;
        }
    }

    /**
         * Verify page loaded by checking title or load state
         * @param {string | RegExp} expectedTitle - Expected title of the page (can be string or regex)
         */
    @step('Verify page loaded')
    async verifyPageLoaded(expectedTitle?: string | RegExp): Promise<void> {
        if (expectedTitle) {
            // Wait for title match
            await expect(this.page).toHaveTitle(expectedTitle);
        } else {
            // Wait for DOM to load
            await this.page.waitForLoadState('domcontentloaded');
        }
    }

    /**
    * Get Current URL
    * @returns
    */
    @step('Get Current URL')
    getCurrentUrl(): string {
        return this.page.url();
    }

    /**
     * Returns the current page title.
     * @returns {Promise<string>}
     */
    @step('Get Page Title')
    async getTitle(): Promise<string> {
        return this.page.title();
    }

    // ── Input / Interaction ────────────────────────────────────────────────────

    /**
     * Get the current value of an input, textarea, or select element.
     * Use this instead of `textContent` for form fields — `textContent` returns
     * empty on `<input>` elements.
     * @param {Locator} locator
     */
    @step('Get input value')
    async inputValue(locator: Locator): Promise<string> {
        const target = locator.first();
        await expect(target).toBeVisible();
        return target.inputValue();
    }

    /**
     * Drag source locator and drop onto target locator.
     * @param {Locator} source
     * @param {Locator} target
     */
    @step('Drag and drop')
    async dragTo(source: Locator, target: Locator): Promise<void> {
        const src = source.first();
        const tgt = target.first();
        await expect(src).toBeVisible();
        await expect(tgt).toBeVisible();
        await src.dragTo(tgt);
    }

    /**
     * Drag source onto target using native HTML5 drag-and-drop events.
     *
     * Sensor libraries built on the HTML5 DnD API (e.g. react-dnd with its
     * HTML5Backend — draggable rows carry `draggable="true"` and a
     * `data-handler-id`) react ONLY to real `dragstart`/`dragenter`/`dragover`/
     * `drop`/`dragend` events, not to the mouse move/down/up sequence that
     * {@link dragToManually} and Playwright's built-in `dragTo` emit — so those
     * approaches silently no-op against such widgets. This dispatches the HTML5
     * events with a single shared `DataTransfer`, which is the reliable recipe
     * for driving react-dnd's HTML5 backend.
     *
     * @param {Locator} source - Element to pick up (must be draggable)
     * @param {Locator} target - Drop-zone element to drop onto
     */
    @step('Drag and drop (native HTML5 events)')
    async dragAndDropHTML5(source: Locator, target: Locator): Promise<void> {
        const src = source.first();
        const tgt = target.first();
        await expect(src).toBeVisible();
        await expect(tgt).toBeVisible();
        await src.scrollIntoViewIfNeeded();

        // A single DataTransfer must be shared across every event of one drag so
        // the backend treats them as the same operation.
        const dataTransfer = await this.page.evaluateHandle(() => new DataTransfer());

        // Passing the target's centre coordinates helps backends that compute a
        // drop position from the pointer location.
        const box = await tgt.boundingBox();
        const pos = box ? { clientX: box.x + box.width / 2, clientY: box.y + box.height / 2 } : {};

        await src.dispatchEvent('dragstart', { dataTransfer });
        await tgt.dispatchEvent('dragenter', { dataTransfer, ...pos });
        await tgt.dispatchEvent('dragover', { dataTransfer, ...pos });
        await tgt.dispatchEvent('drop', { dataTransfer, ...pos });
        // 'dragend' fires on the drag source, but for a move-between-lists drop
        // (as opposed to a reorder within one list) many backends —
        // react-beautiful-dnd included — unmount/relocate that source node the
        // moment 'drop' commits, so re-resolving `src` here can hang forever
        // waiting for an element that will never reappear in this scope. The
        // state change already took effect at 'drop'; 'dragend' is just source-
        // side cleanup (e.g. removing a "dragging" class), so make it best-effort
        // with a short timeout instead of letting it block the whole test.
        await src.dispatchEvent('dragend', { dataTransfer }, { timeout: 2000 }).catch(() => undefined);
    }

    /**
     * Begin a drag on an element and hold it, without dropping.
     *
     * Pair with {@link dragPointerOver} and {@link endDrag} to drive a drag that
     * has to travel over intermediate elements — a reorderable list that swaps its
     * rows while they are hovered, for instance, where the destination depends on
     * what the list has already done and so cannot be passed up front (as
     * {@link dragTo} and {@link dragAndDropHTML5} require).
     *
     * Playwright turns a press plus movement on a `draggable` element into a real
     * HTML5 drag, so every later {@link dragPointerOver} is delivered as a
     * `dragover`.
     * @param {Locator} source - Element to pick up
     * @param {number} nudge - Pixels to move after pressing, to start the drag
     * @returns {Promise<void>}
     */
    @step('Start dragging an element')
    async startDrag(source: Locator, nudge: number = 12): Promise<void> {
        const box = await this.boundingBox(source);
        if (!box) {
            throw new Error(`startDrag: ${this.describeLocator(source)} has no bounding box (not rendered/visible).`);
        }
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        await this.page.mouse.move(centerX, centerY);
        await this.page.mouse.down();
        await this.page.mouse.move(centerX, centerY + nudge, { steps: 6 });
    }

    /**
     * Move a held drag over an element. Only meaningful between {@link startDrag}
     * and {@link endDrag}.
     * @param {Locator} locator - Element to move the pointer onto
     * @param {number} verticalRatio - Where to aim inside the element, 0 (top) to
     *                                 1 (bottom). Reorderable lists typically only
     *                                 react once the pointer passes the midpoint,
     *                                 so aim past it in the direction of travel.
     * @returns {Promise<void>}
     */
    @step('Drag the held pointer over an element')
    async dragPointerOver(locator: Locator, verticalRatio: number = 0.75): Promise<void> {
        const box = await this.boundingBox(locator);
        if (!box) {
            throw new Error(`dragPointerOver: ${this.describeLocator(locator)} has no bounding box (not rendered/visible).`);
        }
        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height * verticalRatio, { steps: 8 });
    }

    /**
     * Drop whatever {@link startDrag} picked up. Safe to call when no drag is in
     * progress, so it can be used to clean up after a failed step.
     * @returns {Promise<void>}
     */
    @step('Drop the dragged element')
    async endDrag(): Promise<void> {
        await this.page.mouse.up();
    }

    /**
     * Focus an element (e.g. before a keyboard sequence that needs focus).
     * @param {Locator} locator
     */
    @step('Focus element')
    async focus(locator: Locator): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        await target.focus();
    }

    /**
     * Tap an element (mobile / touchscreen).
     * @param {Locator} locator
     */
    @step('Tap element')
    async tap(locator: Locator): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        await target.tap();
    }

    /**
     * Fire a custom DOM event on an element.
     * @param {Locator} locator
     * @param {string} type - Event type, e.g. 'change', 'input', 'dragstart'
     * @param {Record<string, unknown>} eventInit - Optional event init properties
     */
    @step('Dispatch DOM event')
    async dispatchEvent(locator: Locator, type: string, eventInit?: Record<string, unknown>): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        await target.dispatchEvent(type, eventInit);
    }

    // ── Locator Queries ────────────────────────────────────────────────────────

    /**
     * Get the inner HTML of an element.
     * @param {Locator} locator
     */
    @step('Get inner HTML')
    async innerHTML(locator: Locator): Promise<string> {
        if (!(await this.isVisible(locator))) {
            return '';
        }
        return locator.first().innerHTML();
    }

    /**
     * Get the bounding box (position and size) of an element.
     * Returns null if the element is not visible in the layout.
     * @param {Locator} locator
     */
    @step('Get bounding box')
    async boundingBox(locator: Locator): Promise<{ x: number; y: number; width: number; height: number } | null> {
        return locator.first().boundingBox();
    }

    /**
     * Run a JavaScript function in the browser on a specific DOM element.
     * @param {Locator} locator
     * @param {Function} fn - Receives the DOM element as its first argument
     */
    @step('Evaluate on element')
    async evaluateElement<T>(locator: Locator, fn: (el: Element) => T): Promise<T> {
        const target = locator.first();
        await expect(target).toBeVisible();
        return target.evaluate(fn);
    }

    // ── Page-level ─────────────────────────────────────────────────────────────

    /**
     * Run a JavaScript function in the page context.
     * @param {Function | string} fn
     * @param arg - Optional argument passed to fn
     */
    @step('Evaluate in page context')

    async evaluate(fn: ((arg: any) => unknown) | string, arg?: unknown): Promise<unknown> {
        return this.page.evaluate(fn, arg);
    }

    /**
     * Wait for the page URL to match a string, regex, or predicate.
     * Useful after login redirects or SPA route transitions.
     * @param {string | RegExp} url
     * @param {number} timeout - ms (default: WAIT_LOCATOR)
     */
    @step('Wait for URL')
    async waitForURL(url: string | RegExp, timeout: number = Constants.TIMEOUTS.WAIT_LOCATOR): Promise<void> {
        Utility.logAction('CommonPage', 'waitForURL', `${String(url)} (timeout=${timeout})`);
        await this.page.waitForURL(url, { timeout });
    }

    /**
     * Wait for a network response matching a URL substring or regex.
     * @param {string | RegExp} url
     * @param {number} timeout - ms (default: DEFAULT)
     */
    @step('Wait for network response')
    async waitForNetworkResponse(
    url: string | RegExp,
    timeout: number = Constants.TIMEOUTS.DEFAULT,
    ): Promise<Response> {
    try {
        return await this.page.waitForResponse(
        res =>
            typeof url === 'string'
            ? res.url().includes(url)
            : url.test(res.url()),
        { timeout },
        );
    } catch (error) {
        const message =
        `Failed to receive a network response matching "${url.toString()}" ` +
        `within ${timeout}ms. ` +
        `Reason: ${error instanceof Error ? error.message : String(error)}`;

        Logger.error(message);
        throw new Error(message, { cause: error });
    }
    }

    /**
     * Returns a promise that resolves with the next file download triggered on
     * the page. Create this promise BEFORE performing the action that starts the
     * download so the event is not missed.
     * @param {number} timeout - Max time to wait for the download event (ms).
     * @returns {Promise<Download>}
     */
    waitForDownloadEvent(timeout: number = Constants.TIMEOUTS.DEFAULT): Promise<Download> {
        return this.page.waitForEvent('download', { timeout });
    }

    /**
     * Attach a file (e.g. a downloaded export or print output) to the current
     * test's report, so it appears in the Allure/Playwright HTML report and
     * can be opened after the run. Centralizes access to Playwright's global
     * `test.info()` here rather than importing `test` as a runtime value into
     * individual feature page objects.
     * @param {string} name - Attachment name shown in the report.
     * @param {{ path: string; contentType: string }} options - Local file path and MIME content type.
     * @returns {Promise<void>}
     */
    @step('Attach file to test report: {name}')
    async attachFile(name: string, options: { path: string; contentType: string }): Promise<void> {
        await test.info().attach(name, options);
    }

    /**
     * Returns a promise that resolves once the next popup (new tab) opened by
     * the page has navigated off `about:blank` (any scheme, incl. `blob:`), with
     * the tab and its settled URL. Used when the app delivers output in a new tab
     * (e.g. an inline PDF) instead of a download. Create this promise BEFORE
     * performing the action that opens the tab so the event is not missed.
     * @param {number} timeout - Max time to wait for the popup and its navigation (ms).
     * @returns {Promise<{ page: Page; url: string }>} The opened tab and its settled URL.
     */
    async waitForPopupEvent(timeout: number = Constants.TIMEOUTS.DEFAULT): Promise<{ page: Page; url: string }> {
        const popup = await this.page.waitForEvent('popup', { timeout });
        // The tab starts on about:blank and is navigated to the output URL; wait
        // for that navigation so callers see the settled URL. A tab that never
        // navigates still resolves (best-effort) — its mere existence is the signal.
        await popup
            .waitForURL(url => url.toString() !== 'about:blank', { timeout })
            .catch(() => undefined);
        return { page: popup, url: popup.url() };
    }

    /**
     * Opens a fresh, isolated browser context (no cookies/storage from the
     * calling test's session) and returns its first page. Used when a test
     * needs to verify unauthenticated behavior (e.g. a login attempt)
     * without disturbing an already-authenticated session on the current
     * page.
     *
     * Callers must close the returned page's context when done — call
     * `setPage()` on this same instance (or another page object) with the
     * returned page, then {@link closeBrowser} closes it via `this.page`.
     * @param {Browser} browser - The test's browser fixture
     * @returns {Promise<Page>} The first page of the new, isolated context
     */
    @step('Open a fresh, isolated browser context')
    async openNewContextPage(browser: Browser): Promise<Page> {
        const context = await browser.newContext();
        return context.newPage();
    }

    /**
     * Capture a full-page screenshot.
     * @param {string} path - Optional file path to save (e.g. 'screenshots/foo.png')
     */
    @step('Take screenshot')
    async screenshot(path?: string): Promise<Buffer> {
        const opts = path ? { path, fullPage: true } : { fullPage: true };
        return this.page.screenshot(opts);
    }

    /**
     * Capture a screenshot of a single element.
     * @param {Locator} locator
     * @param {string} path - Optional file path to save
     */
    @step('Take element screenshot')
    async screenshotElement(locator: Locator, path?: string): Promise<Buffer> {
        const target = locator.first();
        await expect(target).toBeVisible();
        const opts = path ? { path } : {};
        return target.screenshot(opts);
    }

    /**
     * Resize the browser viewport.
     * @param {number} width
     * @param {number} height
     */
    @step('Set viewport size')
    async setViewportSize(width: number, height: number): Promise<void> {
        await this.page.setViewportSize({ width, height });
    }

    /**
     * Intercept network requests matching a URL pattern.
     * @param {string | RegExp} url
     * @param {Parameters<Page['route']>[1]} handler
     */
    @step('Intercept network route')
    async route(url: string | RegExp, handler: Parameters<Page['route']>[1]): Promise<void> {
        await this.page.route(url, handler);
    }

    /**
     * Remove a previously registered network interception.
     * @param {string | RegExp} url
     */
    @step('Remove network route')
    async unroute(url: string | RegExp): Promise<void> {
        await this.page.unroute(url);
    }

    /**
     * Get a FrameLocator for querying elements inside an iframe.
     * @param {string} selector - CSS selector targeting the iframe element
     */
    frameLocator(selector: string): FrameLocator {
        return this.page.frameLocator(selector);
    }

}
