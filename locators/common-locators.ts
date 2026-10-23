import type { Locator, FrameLocator, Page } from '@playwright/test';

export class CommonLocators {
    protected page: Page;
    setPage(page: Page): void {
        this.page = page;
        this.locatorInitialization();
    }

    getPage(): Page {
        return this.page;
    }

    // Buttons
    btnSave!: Locator;
    btnClose!: Locator;
    btnCancel!: Locator;
    btnOk!: Locator;
    btnEdit!: Locator;
    btnDelete!: Locator;
    btnDismiss!: Locator;
    btnDownload!: Locator;
    btnAddNew!: Locator;
    btnSubmit!: Locator;
    btnContinue!: Locator;
    btnNext!: Locator;
    btnBack!: Locator;
    btnConfirmDelete!: Locator;
    btnCancelDelete!: Locator;
    inputSearch!: Locator;
    ddlOption!: Locator;
    ddlOptionItem!: (option: string) => Locator;
    linkText!: (name: string) => Locator;
    labelForInput!: (id: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.locatorInitialization();
    }

    protected locatorInitialization(): void {
        this.btnSave = this.page.getByRole('button', { name: 'Save' });
        this.btnCancel = this.page.getByRole('button', { name: 'Cancel' });
        this.btnOk = this.page.getByRole('button', { name: 'OK' });
        this.btnEdit = this.page.getByRole('link', { name: 'Edit' });
        this.btnDelete = this.page.getByRole('button', { name: 'Delete' });
        this.btnDismiss = this.page.getByRole('button', { name: 'Dismiss' });
        this.btnDownload = this.page.getByRole('button', { name: 'Download' });
        this.btnAddNew = this.page.getByRole('button', { name: 'Add New' });
        this.btnSubmit = this.page.locator('input[type="submit"]');
        this.btnContinue = this.page.getByRole('link', { name: 'Continue' }).or(this.page.locator('input[value="Continue"]'));
        this.btnConfirmDelete = this.page.getByLabel('confirm-button').or(this.page.locator('button[aria-label="confirm-button"]'));
        this.btnCancelDelete = this.page.getByRole('button', { name: 'Cancel Delete' });
        this.btnNext = this.page.getByRole('button', { name: 'Next' });
        this.btnBack = this.page.getByRole('button', { name: /back/i });
        this.inputSearch = this.page.locator('input[placeholder="Search"]');
        this.ddlOption = this.page.locator('ul[role="listbox"]');
        this.linkText = (name: string): Locator => {
            return this.page.getByRole('link', { name });
        };

        this.ddlOptionItem = (optionName: string): Locator => {
            return this.page.locator('li').filter({ hasText: optionName });
        };

        this.labelForInput = (id: string): Locator => {
            return this.page.locator(`label[for="${id}"]`);
        };
    }

    /**
     * Find Locator By Xpath
     * @param xpath
     * @returns
     */
    locatorByXpath(xpath: string): Locator {
        return this.page.locator(`xpath=${xpath}`);
    }

    /**
     * Find Locator By Id
     * @param id
     * @returns
     */
    locatorById(id: string): Locator {
        return this.page.locator(`[id*="${id}"]`);
    }

    /**
     * Find Locator By text
     * @param text
     * @returns
     */
    locatorByText(text: string): Locator {
        return this.page.getByText(text);
    }

    /**
     * Identify iFrame
     * @param iframe
     * @returns
     */
    iframe(iframe: string): FrameLocator {
        return this.page.frameLocator(iframe);
    }

    /**
     * Find element by text
     * @param text
     * @param exact
     * @returns
     */
    text(text: string, exact: boolean = true): Locator {
        return this.page.getByText(text, { exact });
    }

    /**
     * Find element by checkbox
     * @param name
     * @returns
     */
    checkbox(name: string): Locator {
        return this.page.getByRole('checkbox', { name: name });
    }

    /**
     * Find element by text
     * @param text
     * @param exact
     * @returns
     */
    textIframe(iframe: string, text: string, exact: boolean = true): Locator {
        return this.page.frameLocator(iframe).getByText(text, { exact });
    }

    /**
     * Find element by text
     * @param locator
     * @param text
     * @param exact
     * @returns
     */
    locatorText(locator: Locator, text: string, exact: boolean = true): Locator {
        return locator.getByText(text, { exact });
    }

    /**
     * Find element by alt text
     * @param label
     * @param exact
     * @returns
     */
    altText(text: string, exact: boolean = true): Locator {
        return this.page.getByAltText(text, { exact });
    }

    /**
     * Find element by label
     * @param label
     * @param exact
     * @returns
     */
    label(label: string, exact: boolean = true): Locator {
        return this.page.getByLabel(label, { exact });
    }

    /**
     * Find element by title
     * @param title
     * @param exact
     * @returns
     */
    title(text: string, exact: boolean = true): Locator {
        return this.page.getByTitle(text, { exact });
    }

    /**
     * Find element by link name
     * @param name
     * @param exact
     * @returns
     */
    roleLinkName(name: string, exact: boolean = true): Locator {
        return this.page.getByRole('link', { name, exact });
    }

    /**
     * Find element by link name
     * @param iframe
     * @param name
     * @param exact
     * @returns
     */
    roleLinkNameIframe(iframe: string, name: string, exact: boolean = true): Locator {
        return this.page.frameLocator(iframe).getByRole('link', { name, exact });
    }

    /**
     * Find element by button name
     * @param name
     * @param exact
     * @returns
     */
    roleButtonName(name: string, exact: boolean = false): Locator {
        return this.page.getByRole('button', { name: name, exact: exact });
    }

    /**
     * Find element by textarea name
     * @param name
     * @returns
     */
    roleTextareaName(name: string): Locator {
        return this.page.locator(`textarea[name="${name}"]`);
    }

    /**
     * Find element by textarea name
     * @param name
     * @param exact
     * @returns
     */
    roleTextboxName(name: string, exact: boolean = true): Locator {
        return this.page.getByRole('textbox', { name, exact });
    }

    /**
     * Find element by option name
     * @param name
     * @param exact
     * @returns
     */
    roleOptionName(name: string, exact: boolean = true): Locator {
        return this.page.getByRole('option', { name, exact });
    }

    /**
     * Find element by radio name
     * @param name
     * @param exact
     * @returns
     */
    roleRadioName(name: string, exact: boolean = true): Locator {
        return this.page.getByRole('radio', { name, exact });
    }

    /**
     * Find element by tab name
     * @param tab
     * @param exact
     * @returns
     */
    roleTabName(tab: string, exact: boolean = true): Locator {
        return this.page.getByRole('tab', { name: tab, exact });
    }

    /**
     * Find element by heading name
     * @param name
     * @param exact
     * @returns
     */
    roleByHeading(name: string, exact: boolean = true): Locator {
        return this.page.getByRole('heading', { name, exact });
    }

    /**
     * Find element by button name
     * @param iframe
     * @param name
     * @param exact
     * @returns
     */
    roleButtonNameIframe(iframe: string, name: string, exact: boolean = true): Locator {
        return this.page.frameLocator(iframe).getByRole('button', { name, exact });
    }

    /**
     * Find element by locator
     * @param element
     * @returns
     */
    locatorIframe(iframe: string, element: string): Locator {
        return this.page.frameLocator(iframe).locator(element);
    }

    /**
     * Find element by label
     * @param iframe
     * @param label
     * @param exact
     * @returns
     */
    labelIframe(iframe: string, label: string, exact: boolean = true): Locator {
        return this.page.frameLocator(iframe).getByLabel(label, { exact });
    }

    /**
     * Find element by iframe in iframe
     * @param iframe1
     * @param iframe2
     * @param element
     * @returns
     */
    locatorIframeIframe(iframe1: string, iframe2: string, element: string): Locator {
        return this.page.frameLocator(iframe1).frameLocator(iframe2).locator(element);
    }
}
