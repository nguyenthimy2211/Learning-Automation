
export class JsonReader {

    /**
     * Read JSON file.
     * @param filePath Path to the JSON file
     * @returns Parsed JSON data
     */
    static read<T>(filePath: string): T {
        const absolutePath = path.resolve(process.cwd(), filePath);

        try {
            const content = readFileSync(absolutePath, 'utf-8');
            return JSON.parse(content) as T;
        } catch (ex: unknown) {
            const error = ex as NodeJS.ErrnoException;

            if (error.code === 'ENOENT') {
                const message = `JSON file not found: ${absolutePath}`;
                Logger.log('JsonReader.read', message);
                throw new Error(message);
            }

            if (ex instanceof SyntaxError) {
                const message = `Invalid JSON in file: ${absolutePath}`;
                Logger.log('JsonReader.read', message);
                throw new Error(message, { cause: ex });
            }

            const message = ex instanceof Error
                ? ex.message
                : String(ex);

            Logger.log('JsonReader.read', message);
            throw ex;
        }
    }
}
