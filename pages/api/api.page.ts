import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { uuidv7 } from 'uuidv7';
import * as https from 'node:https';
import { Constants } from '@utilities/constants';
import { step } from '@utilities/logging';
import fs from 'node:fs';
import * as path from 'node:path';
import { Logger } from '@utilities/logger';

/** Default login path for open-console. */
export const LOGIN_PATH = '/api/v1/client/login';

type FetchOptions = NonNullable<Parameters<APIRequestContext['fetch']>[1]>;

type ApiRequestOptions = Pick<
  FetchOptions,
  'data' | 'form' | 'multipart' | 'headers'
>;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export class APIPage {
  /**
   * Default headers used by API requests.
   *
   * This object should not be mutated per request because API tests
   * may execute in parallel.
   */
  protected readonly headers: Record<string, string> = {
    Accept: '*/*',
  };

  protected readonly port: number = 443;

  protected readonly getMethod: HttpMethod = 'GET';
  protected readonly postMethod: HttpMethod = 'POST';
  protected readonly putMethod: HttpMethod = 'PUT';
  protected readonly deleteMethod: HttpMethod = 'DELETE';
  protected readonly patchMethod: HttpMethod = 'PATCH';

  /**
   * Optional custom base URL.
   *
   * When not provided, Constants.BASE_URL is used.
   */
  baseUrl?: string;

  /**
   * Existing Playwright API request context.
   *
   * Prefer reusing the context when one is supplied by the test framework.
   */
  protected requestContext?: APIRequestContext;

  /**
   * Returns request headers with an optional Bearer token.
   *
   * This method is intentionally pure and does not mutate this.headers.
   * This makes it safe for parallel requests.
   */
  protected addAuthTokenToHeaders(
    token?: string | null,
  ): Record<string, string> {
    return {
      ...this.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Returns the configured base hostname.
   */
  protected getBaseHostname(): string {
    return this.baseUrl ?? Constants.BASE_URL;
  }

  /**
   * Validates that a URL uses HTTP or HTTPS.
   */
  private validateBaseUrl(url: string): void {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch (error: unknown) {
      throw new Error(`Invalid BASE_API_URL: '${url}'`, {
        cause: error,
      });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error(
        `Invalid BASE_API_URL protocol: '${parsedUrl.protocol}'`,
      );
    }
  }

  /**
   * Generates a readable timestamp used as part of the trace ID.
   *
   * Format:
   * YYYYMMDD-HHmmss-mmm
   *
   * Example:
   * 20260818-141530-123
   */
  private generateSeasonId(): string {
    const now = new Date();

    const pad = (value: number, length = 2): string =>
      String(value).padStart(length, '0');

    return [
      `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`,
      `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`,
      pad(now.getMilliseconds(), 3),
    ].join('-');
  }

  /**
   * Generates a unique trace ID for every API request.
   */
  private generateTraceId(): string {
    return `${uuidv7()}_${this.generateSeasonId()}`;
  }

  /**
   * Normalizes a hostname into a URL.
   *
   * Examples:
   * api.example.com -> https://api.example.com
   * http://api.example.com -> http://api.example.com
   * https://api.example.com -> https://api.example.com
   */
  private normalizeBaseUrl(hostname: string, port: number): string {
    const trimmedHostname = hostname.trim();

    if (
      trimmedHostname.startsWith('http://') ||
      trimmedHostname.startsWith('https://')
    ) {
      return trimmedHostname.replace(/\/$/, '');
    }

    const protocol = port === 443 ? 'https' : 'http';

    return `${protocol}://${trimmedHostname}`.replace(/\/$/, '');
  }

  /**
   * Builds the complete API base URL.
   */
  private getBaseUrl(): string {
    const normalizedBaseUrl = this.normalizeBaseUrl(
      this.getBaseHostname(),
      this.port,
    );

    const url = new URL(normalizedBaseUrl);

    // Only add the port when it is non-default.
    if (
      (url.protocol === 'https:' && this.port !== 443) ||
      (url.protocol === 'http:' && this.port !== 80)
    ) {
      url.port = String(this.port);
    }

    const baseURL = url.toString().replace(/\/$/, '');

    this.validateBaseUrl(baseURL);

    return baseURL;
  }

  /**
   * Determines whether the supplied object represents Playwright
   * request options rather than a raw request payload.
   *
   * An options object can contain headers even when no body is supplied.
   */
  private isApiRequestOptions(value: unknown): value is ApiRequestOptions {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return false;
    }

    const options = value as Record<string, unknown>;

    return (
      'data' in options ||
      'form' in options ||
      'multipart' in options ||
      'headers' in options
    );
  }

  /**
   * Adds __trace_id to the request URL while preserving existing
   * query parameters and URL encoding.
   */
  private addTraceId(requestPath: string): string {
    const traceId = this.generateTraceId();

    const url = new URL(
      requestPath,
      `${this.getBaseUrl()}/`,
    );

    url.searchParams.set('__trace_id', traceId);

    return `${url.pathname}${url.search}${url.hash}`;
  }

  /**
   * Makes an asynchronous API request.
   *
   * The request body may either be:
   *
   * 1. A Playwright request-options object:
   *    { data, form, multipart, headers }
   *
   * 2. A raw payload:
   *    { name: 'test' }
   *
   * Raw payloads are passed through as `data`.
   */
  private async apiRequest(
    requestPath: string,
    method: HttpMethod,
    requestBody?: unknown,
    token?: string,
  ): Promise<APIResponse> {
    const normalizedPath = requestPath.startsWith('/')
      ? requestPath
      : `/${requestPath}`;

    const baseURL = this.getBaseUrl();
    const tracedPath = this.addTraceId(normalizedPath);

    let options: ApiRequestOptions;

    if (this.isApiRequestOptions(requestBody)) {
      options = requestBody;
    } else if (requestBody !== undefined) {
      options = { data: requestBody };
    } else {
      options = {};
    }

    const requestHeaders = {
      ...this.addAuthTokenToHeaders(token),
      ...options.headers,
    };

    Logger.log(
      `Making ${method} request to: ${baseURL}${tracedPath}`,
    );

    try {
      const context =
        this.requestContext ??
        (await request.newContext({
          baseURL,
          extraHTTPHeaders: this.headers,
          ignoreHTTPSErrors: true,
        }));

      return await context.fetch(tracedPath, {
        method,
        ...options,
        headers: requestHeaders,
      });
    } catch (error: unknown) {
      Logger.error(
        `Error making ${method} request to ${baseURL}${tracedPath}:`,
        error,
      );

      throw new Error(
        `Failed to make ${method} request: ${baseURL}${tracedPath}`,
        {
          cause: error,
        },
      );
    }
  }

  /**
   * Makes an asynchronous POST request.
   */
  @step(
    'Makes an asynchronous POST request to the specified path with the given request body.',
  )
  async apiPostRequest<T = unknown>(
    requestPath: string,
    token?: string,
    requestBody?: T,
  ): Promise<APIResponse> {
    Logger.log(
      'apiPostRequest',
      `${this.getBaseUrl()}${requestPath}`,
    );

    return this.apiRequest(
      requestPath,
      this.postMethod,
      requestBody,
      token,
    );
  }

  /**
   * Makes an asynchronous GET request.
   */
  @step('Makes an asynchronous GET request to the specified path.')
  async apiGetRequest(
    requestPath = '',
    token?: string,
  ): Promise<APIResponse> {
    Logger.log(
      'apiGetRequest',
      this.getBaseUrl(),
      requestPath,
    );

    return this.apiRequest(
      requestPath,
      this.getMethod,
      undefined,
      token,
    );
  }

  /**
   * Makes an asynchronous PUT request.
   */
  @step(
    'Makes an asynchronous PUT request to the specified path with the given request body.',
  )
  async apiPutRequest<T = unknown>(
    requestPath: string,
    token?: string,
    requestBody?: T,
  ): Promise<APIResponse> {
    Logger.log(
      'apiPutRequest',
      `${this.getBaseUrl()}${requestPath}`,
    );

    return this.apiRequest(
      requestPath,
      this.putMethod,
      requestBody,
      token,
    );
  }

  /**
   * Makes an asynchronous DELETE request.
   */
  @step(
    'Makes an asynchronous DELETE request to the specified path with the given request body.',
  )
  async apiDeleteRequest<T = unknown>(
    requestPath: string,
    token?: string,
    requestBody?: T,
  ): Promise<APIResponse> {
    Logger.log(
      'apiDeleteRequest',
      `${this.getBaseUrl()}${requestPath}`,
    );

    return this.apiRequest(
      requestPath,
      this.deleteMethod,
      requestBody,
      token,
    );
  }

  /**
   * Makes an asynchronous PATCH request.
   */
  @step(
    'Makes an asynchronous PATCH request to the specified path with the given request body.',
  )
  async apiPatchRequest<T = unknown>(
    requestPath: string,
    token?: string,
    requestBody?: T,
  ): Promise<APIResponse> {
    Logger.log(
      'apiPatchRequest',
      `${this.getBaseUrl()}${requestPath}`,
    );

    return this.apiRequest(
      requestPath,
      this.patchMethod,
      requestBody,
      token,
    );
  }

  /**
   * Downloads a file using HTTPS.
   *
   * Returns the downloaded file name.
   */
  @step('Makes an asynchronous GET request to download file.')
  async downloadFile(endpoint: string): Promise<string> {
    const baseURL = this.getBaseUrl();

    const url = new URL(
      endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
      `${baseURL}/`,
    );

    const traceId = this.generateTraceId();
    url.searchParams.set('__trace_id', traceId);

    const downloadFolder = path.resolve(
      __dirname,
      Constants.DOWNLOAD_FOLDER,
    );

    await fs.promises.mkdir(downloadFolder, {
      recursive: true,
    });

    return new Promise<string>((resolve, reject) => {
      const request = https.get(
        url,
        {
          rejectUnauthorized: false,
          headers: this.headers,
        },
        (response) => {
          if (
            response.statusCode === undefined ||
            response.statusCode < 200 ||
            response.statusCode >= 300
          ) {
            response.resume();

            reject(
              new Error(
                `File download failed with HTTP status ${response.statusCode}`,
              ),
            );

            return;
          }

          const disposition =
            response.headers['content-disposition'];

          let fileName = this.extractFileName(disposition);

          if (!fileName) {
            fileName = path.basename(url.pathname) || 'download';
          }

          fileName = this.sanitizeFileName(fileName);

          const fullPath = path.join(
            downloadFolder,
            fileName,
          );

          const file = fs.createWriteStream(fullPath);

          response.pipe(file);

          file.on('finish', () => {
            file.close(() => {
              Logger.log(
                `Download completed: ${fileName}`,
              );

              resolve(fileName);
            });
          });

          file.on('error', (error) => {
            file.destroy();

            void fs.promises
              .unlink(fullPath)
              .catch(() => undefined);

            reject(
              new Error(
                `File download failed: ${error.message}`,
                {
                  cause: error,
                },
              ),
            );
          });

          response.on('error', (error) => {
            file.destroy();

            void fs.promises
              .unlink(fullPath)
              .catch(() => undefined);

            reject(
              new Error(
                `File download response failed: ${error.message}`,
                {
                  cause: error,
                },
              ),
            );
          });
        },
      );

      request.on('error', (error) => {
        reject(
          new Error(
            `File download request failed: ${error.message}`,
            {
              cause: error,
            },
          ),
        );
      });
    });
  }

  /**
   * Extracts a filename from Content-Disposition.
   *
   * Supports:
   * filename="file.pdf"
   * filename=file.pdf
   * filename*=UTF-8''file%20name.pdf
   */
  private extractFileName(
    disposition?: string,
  ): string | undefined {
    if (!disposition) {
      return undefined;
    }

    const encodedMatch =
      /filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i.exec(
        disposition,
      );

    if (encodedMatch?.[1]) {
      try {
        return decodeURIComponent(
          encodedMatch[1].trim().replace(/^["']|["']$/g, ''),
        );
      } catch {
        return encodedMatch[1]
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    }

    const match =
      /filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(
        disposition,
      );

    return (
      match?.[1]?.trim() ??
      match?.[2]?.trim()
    );
  }

  /**
   * Prevents path traversal or invalid filename characters from
   * being used when creating downloaded files.
   */
  private sanitizeFileName(fileName: string): string {
    const sanitized = path
      .basename(fileName)
      // eslint-disable-next-line no-control-regex -- intentionally strips ASCII control chars (0x00-0x1F) from filenames
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
      .trim();

    return sanitized || 'download';
  }
}
