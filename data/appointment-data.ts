import { Appointment } from "../interfaces/appointment";
import { CsvReader } from "../utilities/csv-reader";
import type { AppointmentSource } from "../interfaces/appointment";
import { Constants } from "../utilities/constants";
import { ExcelReader } from "../utilities/excel-reader";
import { JsonReader } from "../utilities/json-reader";


export const futureVisitDate = (): string =>
    faker.date.future({ years: 1 }).toLocaleDateString('en-GB');
export const appointment: Appointment = {
    facility: 'Tokyo CURA Healthcare Center',
    hospitalReadmission: true,
    healthcareProgram: 'Medicare',
    visitDate: futureVisitDate(),
    comment: 'Regular checkup',
};
export const toHospitalReadmission = (value: unknown, source: string): boolean => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();

        if (normalized === 'true') {
            return true;
        }

        if (normalized === 'false') {
            return false;
        }
    }

    throw new Error(
        `Invalid hospitalReadmission value ${JSON.stringify(value)} in ${source}. Expected true or false.`,
    );
};
const withVisitDate = (row: AppointmentSource): Appointment => ({
    ...row,
    visitDate: futureVisitDate(),
});
export const getCsvAppointments = (): Appointment[] =>
    CsvReader.read<Record<string, unknown>>(Constants.TEST_DATA.APPOINTMENTS_CSV)
        .map((row) => withVisitDate({
            ...row,
            hospitalReadmission: toHospitalReadmission(row['hospitalReadmission'], 'appointments.csv'),
        } as AppointmentSource));
export const getJsonAppointments = (): Appointment[] =>
    JsonReader.read<AppointmentSource[]>(Constants.TEST_DATA.APPOINTMENTS_JSON)
        .map(withVisitDate);

export const getExcelAppointments = (): Appointment[] => {
    const rows = ExcelReader.read(
        Constants.TEST_DATA.APPOINTMENTS_EXCEL,
    );

    if (rows.length === 0) {
        throw new Error(
            `No appointment test data found. File: ${Constants.TEST_DATA.APPOINTMENTS_EXCEL}, sheet: Sheet1`,
        );
    }

    return rows.map((row) => withVisitDate({
        ...row,
        hospitalReadmission: toHospitalReadmission(row['hospitalReadmission'], 'appointments.xlsx'),
    } as AppointmentSource));
};
