import { expect, Locator, Page } from "@playwright/test";
import { CommonLocators } from "../../locators/common-locators";
import { Constants } from "../../utilities/constants";
import { Utility } from "../../utilities/utility";
import { step } from "../../utilities/logging";



export class CommonPage extends CommonLocators {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Best-effort human-readable locator description for logs.
     * @param locator
     * @returns
     */
    private describeLoactor(locator: Locator): string {
        try {
            return locator.toString();
        }
        catch (error) {
            return "Locator not found";
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
    @step('Go To The URL')
    async goto(url: string, isWait: boolean = true, waitUntil: 'load' | 'domcontentloaded' | 'commit' = 'load', timeout?: number): Promise<void> {
        await this.page.goto(url, { waitUntil: waitUntil, timeout: timeout });
    }

    /**
     * Click
     * @param locator
     * @param options
     */
    @step('Go To The Click')
    async click(locator: Locator, options?: { timeout?: number }): Promise<void> {
        try {
            await locator.click(options);
        } catch (error) {
            throw new Error(`Failed to click on locator: ${this.describeLoactor(locator)}. Error: ${error}`);
        }
    }

    /**
     * Wailt For Page Load
     * @returns
     */
    @step('Wait For Page Load')
    async waitForPageLoad(): Promise<void> {
        return this.page.waitForLoadState('load');
    }

    /**
     * Fill
     * @param locator
     * @param value
     * @param options
     */
    @step('Fill For Locator')
    async fill(locator: Locator, value: string, options?: { timeout?: number }): Promise<void> {
        try {
            await locator.fill(value, options);
        } catch (error) {
            throw new Error(`Failed to fill locator: ${this.describeLoactor(locator)} with value: ${value}. Error: ${error}`);
        }
    }

    /**
     * Check Locator is visible or not
     * @param {Locator} locator
     * @param {number} timeout - ms to poll for the element to become enabled (default: no wait, single immediate check)
     * @returns
     */
    @step('Show Visible For Page')
    async isVisible(locator: Locator, timeout?: number): Promise<boolean> {
        return await locator.first().isVisible({ timeout: timeout });
    }

    /**
    * Get Text of Locator, if errors, return ''
    * @param {Locator} locator
    * @param {boolean} trim - Whether to trim whitespace (default: true)
    * @returns
    */
    @step('Get Text For Locator')
    async textContent(locator: Locator, trim: boolean = true): Promise<string> {
        const target = locator.first();
        if (!(await this.isVisible(target))) {
            return '';
        }
        const content = await target.textContent();
        return trim ? content?.trim() ?? '' : content ?? '';
    }

    /**
    * Select an option from a dropdown.
    * @param locator - Dropdown locator
    * @param option - Option value, label, index, or multiple selections
    */
    @step('Select Option For Locator')
    async selectOption(
        locator: Locator,
        option: Parameters<Locator['selectOption']>[0],
    ): Promise<void> {
        await expect(locator.first()).toBeVisible();
        await locator.first().selectOption(option);
    }

    /**
     * Select Checked/UnChecked
     * @param locator
     * @param checked
     * @param timeout
     */
    @step('Select Checked/UnChecked For Locator')
    async setChecked(locator: Locator, checked: boolean, timeout: number = Constants.TIMEOUTS.WAIT_LOCATOR): Promise<void> {
        const target = locator.first();
        await target.waitFor({ state: 'visible', timeout });
        await target.setChecked(checked);
    }

    /**
     * Select Check
     * @param locator
     */
    @step('Select Check For Locator')
    async check(locator: Locator): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
        await expect(target).toBeEnabled({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
        // On CI the underlying framework (MUI) may re-render the checkbox right after
        // a click and revert its state, so `check` throws "did not change its state".
        // Retry until the element is actually checked, letting each render settle.
        await expect(async () => {
            if (!(await target.isChecked())) {
                await target.check({ force: true });
            }
            await expect(target).toBeChecked();
        }).toPass({ timeout: Constants.TIMEOUTS.WAIT_ELEMENT_VISIBLE });
    }

    /**
     * Press Sequentially
     * @param locator
     * @param value
     */
    @step('Press Sequentially For Locator')
    async pressSequentially(locator: Locator, value: string): Promise<void> {
        const target = locator.first();
        await expect(target).toBeVisible();
        if (await target.isEditable() && await target.isEnabled()) {
            await target.pressSequentially(value, { delay: 100 });
            await Utility.delay(2);
        }
    }

    /**
     * Press Keyboard
     * @param key
     */
    @step('Press Keyborad For Locator')
    async pressKeyboard(key: string = 'Enter'): Promise<void> {
        await this.page.keyboard.press(key);
    }

}
