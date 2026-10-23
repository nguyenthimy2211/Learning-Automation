import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { Logger } from './logger';


export class CsvReader {

    /**
     * Read and parse a CSV file.
     * Throws if the file is missing or cannot be parsed, with the file path in the message.
     */
    static read<T = Record<string, string>>(
        filePath: string
    ): T[] {
        const absolutePath = path.resolve(process.cwd(), filePath);

        try {
            const content = readFileSync(absolutePath, 'utf-8');

            return parse(content, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            }) as T[];
        } catch (ex: unknown) {
            const error = ex as NodeJS.ErrnoException;
            let message: string;

            if (error.code === 'ENOENT') {
                message = `CSV file not found: ${absolutePath}`;
            } else {
                const reason = ex instanceof Error ? ex.message : String(ex);
                message = `Failed to read CSV: ${absolutePath}. ${reason}`;
            }

            Logger.log('CsvReader.read', message);
            throw new Error(message, { cause: ex });
        }
    }
}
