import test, { expect } from '@playwright/test';
import { AppointmentSource } from '@interfaces/appointment';
import { JsonReader } from '@utilities/json-reader';
import { Constants } from '@utilities/constants';
import { getCsvAppointments, getExcelAppointments, getJsonAppointments } from '@data/appointment-data';


test.describe('Appointment data source', {
    tag: ['@data', '@regression'],
}, () => {
    const fields: (keyof AppointmentSource)[] = [
        'facility',
        'hospitalReadmission',
        'healthcareProgram',
        'comment',
    ];
    test('JSON, CSV and Excel hold the same number of rown', {
        tag: ['@P1'],
    }, async() => {
        const jsonRows = JsonReader.read<AppointmentSource[]>(Constants.TEST_DATA.APPOINTMENTS_JSON);
        expect(getCsvAppointments().length, 'CSV rows').toBe(jsonRows.length);
        expect(getExcelAppointments().length, 'Excel rows').toBe(jsonRows.length);
    });
    test('CSV and Excel readmission values are booleans', {
        tag: ['@P1'],

    }, async() => {
        for (const row of [...getCsvAppointments(), ...getExcelAppointments()]) {
            expect(typeof row.hospitalReadmission).toBe('boolean');
        }
    });

    test('every CSV and Excel row matches the JSON row at the same position', {
        tag: ['@P1'],
    }, async() => {
        const jsonRows = JsonReader.read<AppointmentSource[]>(Constants.TEST_DATA.APPOINTMENTS_JSON);
        const csvRows = getCsvAppointments();
        const excelRows = getExcelAppointments();

        jsonRows.forEach((expected, index) => {
            const csv = csvRows[index];
            const excel = excelRows[index];

            expect(csv, `CSV row ${index + 1} exists`).toBeDefined();
            expect(excel, `Excel row ${index + 1} exists`).toBeDefined();

            for (const field of fields) {
                const want = String(expected[field]);
                expect(String(csv?.[field]), `CSV row ${index + 1} ${field}`).toBe(want);
                expect(String(excel?.[field]), `Excel row ${index + 1} ${field}`).toBe(want);
            }
        });
    });

    test('every loaded row gets a future visit date in dd/mm/yyyy', {
        tag: ['@P1'],
    }, async() => {
        const now = new Date();
        const rows = [...getJsonAppointments(), ...getCsvAppointments(), ...getExcelAppointments()];

        for (const row of rows) {
            expect(row.visitDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

            const [day, month, year] = row.visitDate.split('/').map(Number);
            const visit = new Date(year!, month! - 1, day!);
            expect(visit.getTime(), `${row.visitDate} is after today`).toBeGreaterThanOrEqual(
                new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
            );
        }
    });
});
