/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Patient {
  dni: string; // Unique Identifier (DNI)
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
}

export type AppointmentStatus = 'free' | 'pending' | 'confirmed';

export interface Appointment {
  id: string; // formatted as "YYYY-MM-DD_HH:MM"
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  patientDni: string | null;
  patientName: string | null;
  treatmentReason?: string;
  notes?: string;
}

export interface HistoryEntry {
  id: string;
  patientDni: string;
  date: string;
  treatmentType: string;
  description: string;
  podologistNotes?: string;
  image?: string; // Base64 representation of foot photo
}

export type UserRole = 'patient' | 'podologist' | 'guest';

export interface AppState {
  currentUser: Patient | null;
  role: UserRole;
  selectedDate: string; // YYYY-MM-DD
  appointments: Record<string, Appointment>; // key: appointment.id
  patients: Record<string, Patient>; // key: dni
  histories: HistoryEntry[];
}
