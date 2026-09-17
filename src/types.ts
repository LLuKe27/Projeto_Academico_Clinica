export type Role = 'reception' | 'doctor' | 'monitor' | null;

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  room: string;
}

export type AppointmentStatus = 'scheduled' | 'waiting' | 'called' | 'in-progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  date: string;
  notes: string;
  prescription?: string;
}
