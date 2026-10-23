import './env.loader';
import { Constants } from '@utilities/constants';
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env['BASE_URL'];

if (!baseURL) {
    throw new Error(
        'BASE_URL is not defined. Check your profiles/.env.<ENV> file.'
    );
}

export default defineConfig({
    testDir: './tests',

    // Test execution
    fullyParallel: true,
    forbidOnly: !!process.env['CI'],
    retries: process.env['CI'] ? 2 : 0,
    workers: process.env['CI'] ? Constants.WORKERS : Constants.LOCAL_WORKERS,

    // Reporters
    reporter: [
        ['list'],
        [
            'allure-playwright',
            {
                detail: true,
                outputFolder: 'allure-results',
                suiteTitle: true,
            },
        ],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['json', { outputFile: 'test-results/results.json' }],
    ],

    // Shared browser settings
    use: {
        baseURL,
        launchOptions: {
            args: ['--start-maximized', '--disable-popup-blocking'],
        },
        colorScheme: 'dark',
        geolocation: {
            longitude: 12.492507,
            latitude: 41.889938,
        },
        locale: 'en-GB',
        viewport: null,
        permissions: ['geolocation'],
        headless: process.env['HEADLESS'] === 'true',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: process.env['CI'] ? 'off' : 'on-first-retry',
    },

    // Timeouts
    timeout: Constants.TIMEOUTS.DEFAULT * 4,
    expect: {
        timeout: Constants.TIMEOUTS.WAIT_ELEMENT_TIMEOUT,
    },

    // Browser projects
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
