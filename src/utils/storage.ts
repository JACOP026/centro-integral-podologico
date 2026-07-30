/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient, Appointment, HistoryEntry } from '../types';

// Standard clinic work hours across the week
export const WORK_HOURS = [
  '09:40',
  '10:30',
  '11:20',
  '12:10',
  '13:00',
  '13:50',
  '14:40',
  '15:00',
  '15:30',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

/**
 * Get exact working hours for a specific date based on clinic schedule (Image 1):
 * - Lunes, Miércoles y Viernes: 9.40hs a 16.00hs
 * - Martes y Jueves: 15.00hs a 20.00hs
 * - Sábados y Domingos: Cerrado
 */
export function getWorkHoursForDate(dateStr: string): string[] {
  if (!dateStr) return WORK_HOURS;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat

  if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
    // Lunes, Miércoles, Viernes: 9.40hs a 16hs
    return ['09:40', '10:30', '11:20', '12:10', '13:00', '13:50', '14:40', '15:30'];
  } else if (dayOfWeek === 2 || dayOfWeek === 4) {
    // Martes y Jueves: 15hs a 20hs
    return ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  }
  return []; // Cerrado fines de semana
}

export const TREATMENTS = [
  'Quiropodía Básica',
  'Tratamiento de Uña Encarnada (Onicocriptosis)',
  'Tratamiento de Hongos (Onicomicosis)',
  'Estudio de la Pisada y Marcha',
  'Confección de Plantillas Ortopédicas',
  'Tratamiento de Verruga Plantar',
  'Pie Diabético - Control y Prevención',
  'Reconstrucción Ungueal',
];

// Helper to get formatted date string for today
export function getTodayString(): string {
  // Returns in YYYY-MM-DD format
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format date to friendly Spanish string: "Lunes, 29 de Junio de 2026"
export function formatToSpanishDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const daysOfWeek = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return `${daysOfWeek[date.getDay()]}, ${day} de ${months[date.getMonth()]} de ${year}`;
}

// Get standard Spanish day name: "Lunes 29"
export function formatDayAndNumber(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const daysOfWeekShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return `${daysOfWeekShort[date.getDay()]} ${day}`;
}

// Get the date range for the current week starting on Monday
export function getWeekDates(baseDateStr: string): string[] {
  const [year, month, day] = baseDateStr.split('-').map(Number);
  const baseDate = new Date(year, month - 1, day);
  
  // Calculate Monday of this week
  const dayOfWeek = baseDate.getDay(); // 0 is Sunday, 1 is Monday...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + diffToMonday);

  const dates: string[] = [];
  for (let i = 0; i < 5; i++) { // Monday to Friday
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    const y = nextDay.getFullYear();
    const m = String(nextDay.getMonth() + 1).padStart(2, '0');
    const d = String(nextDay.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
  }
  return dates;
}

// LocalStorage Keys
const KEYS = {
  PATIENTS: 'podologia_patients',
  APPOINTMENTS: 'podologia_appointments',
  HISTORIES: 'podologia_histories',
};

// Initial Seeding Data
const initialPatients: Record<string, Patient> = {
  '12345678': {
    dni: '12345678',
    nombre: 'Carlos',
    apellido: 'Gómez',
    telefono: '1134225588',
    email: 'carlos.gomez@email.com',
  },
  '87654321': {
    dni: '87654321',
    nombre: 'María',
    apellido: 'Rodríguez',
    telefono: '1144990022',
    email: 'maria.rod@email.com',
  },
  '11223344': {
    dni: '11223344',
    nombre: 'Juana',
    apellido: 'Paz',
    telefono: '1155667788',
    email: 'juana.paz@email.com',
  },
  '99887766': {
    dni: '99887766',
    nombre: 'Alberto',
    apellido: 'Sosa',
    telefono: '1166443322',
    email: 'alberto.sosa@email.com',
  },
};

// Function to seed initial appointments for a given week around today
function generateInitialAppointments(todayStr: string): Record<string, Appointment> {
  const appointments: Record<string, Appointment> = {};
  const weekDates = getWeekDates(todayStr);

  const mon = weekDates[0];
  const tue = weekDates[1];
  const wed = weekDates[2];
  const thu = weekDates[3];
  const fri = weekDates[4];

  const bookings = [
    // Monday bookings (Hours: 09:40 - 16:00)
    { date: mon, time: '09:40', status: 'confirmed' as const, dni: '12345678', name: 'Carlos Gómez', reason: 'Estudio de la Pisada' },
    { date: mon, time: '10:30', status: 'confirmed' as const, dni: '87654321', name: 'María Rodríguez', reason: 'Uña Encarnada' },
    { date: mon, time: '12:10', status: 'pending' as const, dni: '11223344', name: 'Juana Paz', reason: 'Consulta General' },
    
    // Tuesday bookings (Hours: 15:00 - 20:00)
    { date: tue, time: '15:00', status: 'confirmed' as const, dni: '99887766', name: 'Alberto Sosa', reason: 'Pie Diabético' },
    { date: tue, time: '17:00', status: 'pending' as const, dni: '12345678', name: 'Carlos Gómez', reason: 'Control de Plantillas' },
    
    // Wednesday bookings (Hours: 09:40 - 16:00)
    { date: wed, time: '09:40', status: 'confirmed' as const, dni: '87654321', name: 'María Rodríguez', reason: 'Tratamiento Verruga Plantar' },
    { date: wed, time: '14:40', status: 'confirmed' as const, dni: '11223344', name: 'Juana Paz', reason: 'Quiropodía Básica' },
    
    // Thursday bookings (Hours: 15:00 - 20:00)
    { date: thu, time: '16:00', status: 'confirmed' as const, dni: '99887766', name: 'Alberto Sosa', reason: 'Estudio de la Pisada' },
    { date: thu, time: '18:00', status: 'pending' as const, dni: '87654321', name: 'María Rodríguez', reason: 'Quiropodía Básica' },

    // Friday bookings (Hours: 09:40 - 16:00)
    { date: fri, time: '11:20', status: 'confirmed' as const, dni: '12345678', name: 'Carlos Gómez', reason: 'Reconstrucción Ungueal' },
  ];

  // Initialize all slots as free first for these days according to daily schedule
  for (const date of weekDates) {
    const hours = getWorkHoursForDate(date);
    for (const time of hours) {
      const id = `${date}_${time}`;
      appointments[id] = {
        id,
        date,
        time,
        status: 'free',
        patientDni: null,
        patientName: null,
      };
    }
  }

  // Inject seeded bookings
  for (const b of bookings) {
    const id = `${b.date}_${b.time}`;
    appointments[id] = {
      id,
      date: b.date,
      time: b.time,
      status: b.status,
      patientDni: b.dni,
      patientName: b.name,
      treatmentReason: b.reason,
    };
  }

  return appointments;
}

const initialHistories: HistoryEntry[] = [
  {
    id: 'h1',
    patientDni: '12345678',
    date: '2026-06-15',
    treatmentType: 'Estudio de la Pisada y Marcha',
    description: 'Se observa hiperpronación en el pie izquierdo durante la fase de apoyo medio. Se recomienda plantillas de soporte arco medial.',
    podologistNotes: 'Paciente refiere dolor leve en fascia plantar al despertar.',
  },
  {
    id: 'h2',
    patientDni: '12345678',
    date: '2026-06-22',
    treatmentType: 'Confección de Plantillas Ortopédicas',
    description: 'Entrega de plantillas personalizadas impresas en resina flexible con soporte subastragalino.',
    podologistNotes: 'Revisión pautada en 1 mes.',
  },
  {
    id: 'h3',
    patientDni: '87654321',
    date: '2026-06-18',
    treatmentType: 'Tratamiento de Uña Encarnada (Onicocriptosis)',
    description: 'Extirpación de espícula en lateral externo del primer dedo del pie derecho. Limpieza de canal periungueal y desinfección.',
    podologistNotes: 'Colocación de vendaje oclusivo. Se recomienda uso de calzado ancho.',
  },
  {
    id: 'h4',
    patientDni: '99887766',
    date: '2026-06-10',
    treatmentType: 'Pie Diabético - Control y Prevención',
    description: 'Inspección de pulsos pedios y sensibilidad con monofilamento (10g). Sensibilidad conservada. Hiperqueratosis en zona metatarsal talón izquierdo removida.',
    podologistNotes: 'Hidratación con crema de urea al 20%. Se recalca la importancia del autocontrol diario.',
  }
];

// Read from Storage or Init
export function loadDatabase(): {
  patients: Record<string, Patient>;
  appointments: Record<string, Appointment>;
  histories: HistoryEntry[];
} {
  const storedPatients = localStorage.getItem(KEYS.PATIENTS);
  const storedAppointments = localStorage.getItem(KEYS.APPOINTMENTS);
  const storedHistories = localStorage.getItem(KEYS.HISTORIES);

  let patients = initialPatients;
  if (storedPatients) {
    try {
      patients = JSON.parse(storedPatients);
    } catch (e) {
      console.error('Error parsing stored patients, re-initializing', e);
    }
  } else {
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
  }

  let appointments: Record<string, Appointment> = {};
  if (storedAppointments) {
    try {
      appointments = JSON.parse(storedAppointments);
    } catch (e) {
      console.error('Error parsing stored appointments, re-initializing', e);
    }
  }
  
  // If no appointments or missing entries for this week, we generate them dynamically
  const todayStr = getTodayString();
  const weekDates = getWeekDates(todayStr);
  let needsSeeding = Object.keys(appointments).length === 0;

  // Check if current week is covered, if not, initialize free slots for it
  for (const date of weekDates) {
    const checkId = `${date}_${WORK_HOURS[0]}`;
    if (!appointments[checkId]) {
      needsSeeding = true;
      break;
    }
  }

  if (needsSeeding) {
    const seeded = generateInitialAppointments(todayStr);
    appointments = { ...seeded, ...appointments }; // Merge existing, priorized existing
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }

  let histories = initialHistories;
  if (storedHistories) {
    try {
      histories = JSON.parse(storedHistories);
    } catch (e) {
      console.error('Error parsing stored histories, re-initializing', e);
    }
  } else {
    localStorage.setItem(KEYS.HISTORIES, JSON.stringify(histories));
  }

  return { patients, appointments, histories };
}

// Write to Storage
export function savePatients(patients: Record<string, Patient>) {
  localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
}

export function saveAppointments(appointments: Record<string, Appointment>) {
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

export function saveHistories(histories: HistoryEntry[]) {
  localStorage.setItem(KEYS.HISTORIES, JSON.stringify(histories));
}

// Generate appointment slots for any dynamic day (e.g. user browses other weeks)
export function ensureDaySlots(dateStr: string, currentAppointments: Record<string, Appointment>): Record<string, Appointment> {
  const updated = { ...currentAppointments };
  let modified = false;
  const hours = getWorkHoursForDate(dateStr);
  
  for (const time of hours) {
    const id = `${dateStr}_${time}`;
    if (!updated[id]) {
      updated[id] = {
        id,
        date: dateStr,
        time,
        status: 'free',
        patientDni: null,
        patientName: null,
      };
      modified = true;
    }
  }
  
  if (modified) {
    saveAppointments(updated);
  }
  return updated;
}
