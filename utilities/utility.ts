import { Logger } from './logger';

export class Utility {
    /**
     * delay timeout
     * @param second
     * @returns
     */
    static delay(second: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }

    /**
     * Log an action to the debug log with any environment secret masked.
     *
     * Playwright's `fill` logs the value it types, which for a password field
     * wrote the credential in clear text into the trace and the CI log — both
     * downloadable artifacts. Masking here covers every caller, including ones
     * added later.
     *
     * @param {string} scope - The class doing the logging, e.g. 'CommonPage'.
     * @param {string} action - The action being logged, e.g. 'click'.
     * @param {string} [details] - Anything describing it; masked before logging.
     * @returns {void}
     */
    static logAction(scope: string, action: string, details?: string): void {
        const suffix = details ? ': ' + Utility.redactSecrets(details) : '';
        Logger.debug(`[${scope}] ${action}${suffix}`);
    }

     /**
     * Secret values pulled from the environment, longest first so a longer
     * secret is masked before a shorter one that is a substring of it.
     *
     * Read once: process.env does not change mid-run (env.loader.ts runs on the
     * first line of playwright.config.ts), and rebuilding this on every logged
     * action would put the cost on a hot path.
     */
    private static readonly SECRET_VALUES: string[] = Object.entries(process.env)
        .filter(([key]) => /PASSWORD|SECRET|TOKEN/i.test(key))
        // Guard against empty values: replacing '' would mask the entire string.
        .map(([, value]) => value ?? '')
        .filter(value => value.length > 0)
        .sort((a, b) => b.length - a.length);

    /**
     * Mask any environment secret appearing in text destined for a log.
     *
     * Playwright's `fill` logs the value it types, which for a password field
     * wrote the credential in clear text into the trace and the CI log — both
     * downloadable artifacts. Callers pass anything they are about to log.
     *
     * @param {string} text - The text about to be logged.
     * @returns {string} The text with any known secret replaced by ***.
     */
    private static redactSecrets(text: string): string {
        return Utility.SECRET_VALUES.reduce(
            (masked, secret) => masked.split(secret).join('***'),
            text,
        );
    }

    /**
     * Extract the domain from a URL
     * @param url
     * @returns
     */
    static getDomainFromUrl(url: string): any {
        try {
            const parsedUrl = new URL(url);
            return { protocol: parsedUrl.protocol, hostname: parsedUrl.hostname }; // Returns the domain (e.g., "www.example.com")
        } catch (error: any) {
            console.error('Invalid URL:', error);
            return {};
        }
    }
}
