

export class ExcelReader {
    /**
     * Read rows from an Excel sheet.
     * Throws if the file, sheet or rows cannot be read, with the file path in the message.
     */
    static read(
        filePath: string,
        sheetName?: string,
    ): Record<string, unknown>[] {
        const absolutePath = path.resolve(process.cwd(), filePath);

        try {
            const workbook = XLSX.readFile(absolutePath);
            const targetSheet = sheetName ?? workbook.SheetNames[0];

            if (!targetSheet) {
                throw new Error(
                    `No worksheets found in Excel file: ${absolutePath}`,
                );
            }

            const worksheet = workbook.Sheets[targetSheet];

            if (!worksheet) {
                throw new Error(
                    `Worksheet "${targetSheet}" not found. Available worksheets: ${workbook.SheetNames.join(', ')}`,
                );
            }

            const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
                worksheet,
                { defval: '' },
            );

            Logger.log(
                'ExcelReader.read',
                `Read ${rows.length} rows from ${absolutePath}`,
            );

            return rows;
        } catch (error: unknown) {
            const reason = error instanceof Error ? error.message : String(error);
            const message = `Failed to read Excel: ${absolutePath}. ${reason}`;

            Logger.log('ExcelReader.read', message);
            throw new Error(message, { cause: error });
        }
    }
}
