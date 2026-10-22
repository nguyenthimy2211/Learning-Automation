
export type HealthcareProgram = 'Medicaid' | 'Medicare' | 'None';

export interface Appointment {
  facility: string;
  hospitalReadmission: boolean;
  healthcareProgram: HealthcareProgram;
  visitDate: string;
  comment: string;
}
export type AppointmentSource = Omit<Appointment, 'visitDate'>;
export interface AppointmentSummary extends Omit<Appointment, 'healthcareProgram'> {
  healthcareProgram: string;
}
