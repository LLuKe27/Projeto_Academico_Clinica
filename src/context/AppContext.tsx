import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Doctor, Appointment, MedicalRecord, AppointmentStatus } from '../types';

interface AppContextType {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  records: MedicalRecord[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addRecord: (record: Omit<MedicalRecord, 'id' | 'date'>) => void;
}

const mockPatients: Patient[] = [
  { id: 'p1', name: 'Maria Silva', cpf: '111.222.333-44', birthDate: '1980-05-15', phone: '(11) 98765-4321' },
  { id: 'p2', name: 'João Santos', cpf: '222.333.444-55', birthDate: '1992-10-20', phone: '(11) 91234-5678' },
  { id: 'p3', name: 'Ana Oliveira', cpf: '333.444.555-66', birthDate: '1975-03-08', phone: '(11) 99999-8888' },
];

const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Carlos Mendes', specialty: 'Clínico Geral', room: 'Sala 1' },
  { id: 'd2', name: 'Dra. Fernanda Costa', specialty: 'Pediatria', room: 'Sala 2' },
];

const today = new Date().toISOString().split('T')[0];

const mockAppointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', doctorId: 'd1', date: today, time: '09:00', status: 'waiting', createdAt: new Date().toISOString() },
  { id: 'a2', patientId: 'p2', doctorId: 'd1', date: today, time: '09:30', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a3', patientId: 'p3', doctorId: 'd2', date: today, time: '10:00', status: 'waiting', createdAt: new Date().toISOString() },
];

const mockRecords: MedicalRecord[] = [
  { id: 'r1', patientId: 'p1', doctorId: 'd1', appointmentId: 'old1', date: '2023-01-15', notes: 'Paciente relata dores de cabeça frequentes. Pressão arterial normal.', prescription: 'Paracetamol 500mg se dor.' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords);

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = { ...patient, id: `p${Date.now()}` };
    setPatients([...patients, newPatient]);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `a${Date.now()}`,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(appointments.map(app => app.id === id ? { ...app, status } : app));
  };

  const addRecord = (record: Omit<MedicalRecord, 'id' | 'date'>) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: `r${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setRecords([...records, newRecord]);
  };

  return (
    <AppContext.Provider value={{ patients, doctors, appointments, records, addPatient, addAppointment, updateAppointmentStatus, addRecord }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
