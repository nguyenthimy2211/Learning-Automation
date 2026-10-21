import type { Locator, Page } from '@playwright/test';

export class CommonLocators {

    protected page: Page;
    setPage(page: Page): void {
        this.page = page;
        this.locatorInitialization();
    }
    getPage(): Page {
        return this.page;
    }

    //Buttons
    btnSave!: Locator;
    btnCancel!: Locator;
    btnDelete!: Locator;
    btnEdit!: Locator;
    btnContinue!: Locator;
    btnOk!: Locator;
    btnDismiss!: Locator;
    btnDownload!: Locator;
    btnAddNew!: Locator;
    btnSubmit!: Locator;
    btnNext!: Locator;
    btnBack!: Locator;
    btnConfirmDelete!: Locator;
    btnCancelDelete!: Locator;
    inputSearch!: Locator;
    ddlOptions!: Locator;
    


    constructor(page: Page) {
        this.page = page;
        this.locatorInitialization();
    }

    protected locatorInitialization(): void {
        this.btnSave = this.page.getByRole('button', { name: 'Save' });
        this.btnCancel = this.page.getByRole('button', { name: 'Cancel' });
        this.btnDelete = this.page.getByRole('button', { name: 'Delete' });
        this.btnEdit = this.page.getByRole('button', { name: 'Edit' });

    }
}
