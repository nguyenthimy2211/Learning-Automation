import { Appointment } from "../interfaces/appointment";


export const futureVisitDate = (): string =>
    faker.date.future({ years: 1 }).toLocaleDateString('en-GB');
export const appointment: Appointment = {
    facility: 'Tokyo CURA Healthcare Center',
    hospitalReadmission: true,
    healthcareProgram: 'Medicare',
    visitDate: futureVisitDate(),
    comment: 'Regular checkup',
};
