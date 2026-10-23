import path from 'node:path';
import process from 'node:process';

export class Constants {
    public static readonly BASE_URL = (process.env['BASE_URL'] ?? 'https://katalon-demo-cura.herokuapp.com/');
    static readonly WORKERS = Number(process.env['WORKERS'] ?? 5);
    static readonly LOCAL_WORKERS = Number(process.env['LOCAL_WORKERS'] ?? 3);

     public static readonly TIMEOUTS = {
        DEFAULT: 120000,
        WAIT_LOCATOR: 60000,
        WAIT_ELEMENT_TIMEOUT: 70000,
        WAIT_ELEMENT_VISIBLE: 10000,
        WAIT_ELEMENT_INVISIBLE: 5000,
        PAGE_EVENT_LOAD: 60000,
        PAGE_NAVIGATE: 60000,
    };
     public static readonly DOWNLOAD_FOLDER = 'downloads';

     public static readonly TEST_DATA = {
        DIRECTORY: path.resolve(process.cwd(), 'data'),
        LOGIN_JSON: path.resolve(process.cwd(), 'test-data/users/users.json'),
        APPOINTMENTS_JSON: path.resolve(process.cwd(), 'test-data/appointments/appointments.json'),
        APPOINTMENTS_CSV: path.resolve(process.cwd(), 'test-data/appointments/appointments.csv'),
        APPOINTMENTS_EXCEL: path.resolve(process.cwd(), 'test-data/appointments/appointments.xlsx'),
    };
}
