/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import NotebookBackground from './components/NotebookBackground';
import ClockWidget from './components/ClockWidget';
import LoginView from './components/LoginView';
import { PatientViewLeft, PatientViewRight } from './components/PatientView';
import { PodologistViewLeft, PodologistViewRight } from './components/PodologistView';
import {
  Patient,
  Appointment,
  HistoryEntry,
  UserRole
} from './types';
import {
  loadDatabase,
  savePatients,
  saveAppointments,
  saveHistories,
  getTodayString,
  ensureDaySlots,
  TREATMENTS
} from './utils/storage';
import { HelpCircle, Stethoscope, Sparkles } from 'lucide-react';

export default function App() {
  // Global Database state
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [appointments, setAppointments] = useState<Record<string, Appointment>>({});
  const [histories, setHistories] = useState<HistoryEntry[]>([]);

  // User Auth & Session States
  const [role, setRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<Patient | null>(null);

  // Active dates / Calendar states
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [activeMobilePage, setActiveMobilePage] = useState<'left' | 'right'>('right');

  // Interactive patient tentative booking states
  const [tentativeSlot, setTentativeSlot] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>(TREATMENTS[0]);

  // Podologist Sub-view Navigation states (shared in App to allow Left & Right page communication)
  const [podologistActiveSubView, setPodologistActiveSubView] = useState<'agenda' | 'patients'>('agenda');
  const [podologistSelectedSlotId, setPodologistSelectedSlotId] = useState<string | null>(null);
  const [podologistSelectedPatientDni, setPodologistSelectedPatientDni] = useState<string>('');
  const [podologistManualReason, setPodologistManualReason] = useState<string>(TREATMENTS[0]);
  const [podologistSearchQuery, setPodologistSearchQuery] = useState<string>('');
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<string | null>(null);

  // Patient active view choice
  const [patientActiveTab, setPatientActiveTab] = useState<'booking' | 'info'>('booking');

  // Initialize and load database
  useEffect(() => {
    const db = loadDatabase();
    setPatients(db.patients);
    setAppointments(db.appointments);
    setHistories(db.histories);
    
    const today = getTodayString();
    setSelectedDate(today);
  }, []);

  // When selected date changes, ensure slots for that date exist (creates free slots if browsing future weeks)
  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setAppointments((prev) => ensureDaySlots(dateStr, prev));
  };

  // --- ACTIONS ---

  // 1. Patient Login
  const handleLoginPatient = (dni: string) => {
    const foundPatient = patients[dni];
    if (foundPatient) {
      setCurrentUser(foundPatient);
      setRole('patient');
      setPatientActiveTab('booking');
      setTentativeSlot(null);
      setActiveMobilePage('right'); // show the schedule directly
    }
  };

  // 2. Patient Register
  const handleRegisterPatient = (newPatient: Patient) => {
    const updatedPatients = { ...patients, [newPatient.dni]: newPatient };
    setPatients(updatedPatients);
    savePatients(updatedPatients);
  };

  // 3. Podologist Login
  const handleLoginPodologist = (user: string, pass: string) => {
    if (user.toLowerCase() === 'podologa' && pass === '123') {
      setRole('podologist');
      setPodologistSelectedSlotId(null);
      setPodologistActiveSubView('agenda');
      setActiveMobilePage('right'); // show the agenda immediately
    }
  };

  // 4. Logout
  const handleLogout = () => {
    setRole('guest');
    setCurrentUser(null);
    setTentativeSlot(null);
    setPatientActiveTab('booking');
    setPodologistSelectedSlotId(null);
    setActiveMobilePage('right'); // resets to login form right page
  };

  // 5. Patient Books Slot
  const handleBookAppointment = (slotId: string, reason: string) => {
    if (!currentUser) return;

    const updated = { ...appointments };
    updated[slotId] = {
      ...updated[slotId],
      status: 'confirmed',
      patientDni: currentUser.dni,
      patientName: `${currentUser.nombre} ${currentUser.apellido}`,
      treatmentReason: reason,
    };

    setAppointments(updated);
    saveAppointments(updated);
  };

  // 6. Patient Cancels Slot
  const handleCancelAppointment = (slotId: string) => {
    const updated = { ...appointments };
    updated[slotId] = {
      id: slotId,
      date: slotId.split('_')[0],
      time: slotId.split('_')[1],
      status: 'free',
      patientDni: null,
      patientName: null,
    };

    setAppointments(updated);
    saveAppointments(updated);
  };

  // 7. Podologist updates status / Manual bookings / Releases slots
  const handleUpdateAppointmentStatus = (
    slotId: string,
    status: 'free' | 'pending' | 'confirmed',
    patientDni: string | null,
    patientName: string | null,
    reason?: string
  ) => {
    const updated = { ...appointments };
    updated[slotId] = {
      id: slotId,
      date: slotId.split('_')[0],
      time: slotId.split('_')[1],
      status,
      patientDni,
      patientName,
      treatmentReason: reason || undefined,
    };

    setAppointments(updated);
    saveAppointments(updated);
  };

  // 8. Podologist adds a patient medical history entry
  const handleAddHistoryEntry = (newEntry: Omit<HistoryEntry, 'id'>) => {
    const entryId = 'h_' + Math.random().toString(36).substring(2, 11);
    const fullEntry: HistoryEntry = {
      ...newEntry,
      id: entryId,
    };

    const updatedHistories = [fullEntry, ...histories];
    setHistories(updatedHistories);
    saveHistories(updatedHistories);
  };

  // --- RENDERING ZONE (DOUBLE PAGE BINDER CONTENTS) ---

  let childrenLeft: React.ReactNode = null;
  let childrenRight: React.ReactNode = null;

  if (role === 'guest') {
    // Left Page: Welcome message, Clock, List of service descriptions
    childrenLeft = (
      <div className="flex flex-col justify-between h-full space-y-6">
        <div>
          <div className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#e0f2fe] border border-[#bae6fd] rounded-full mb-3 text-[#0e7490] text-xs font-bold uppercase">
            <Stethoscope className="w-4 h-4 text-[#0891b2]" />
            <span>Consultorio de Podología</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-[#0f4c5c] tracking-tight leading-none mb-2">
            Agenda de Turnos
          </h1>
          <p className="text-xs text-[#0e7490] font-medium uppercase tracking-wide">
            Elegir y Confirmar Citas Médicas
          </p>
        </div>

        {/* Real-time Clock Widget */}
        <div className="py-2">
          <p className="text-xs text-[#0e7490] font-bold uppercase tracking-wider mb-2">
            🕒 Hora y Fecha de la Libreta:
          </p>
          <ClockWidget />
        </div>

        {/* Beautiful post-it style handwritten instructions list */}
        <div className="bg-white/80 border border-[#bae6fd] p-4 rounded-xl shadow-2xs relative">
          <div className="absolute top-1.5 right-2 text-xs font-bold text-[#0891b2] font-hand text-base">
            ¡Importante! 📌
          </div>
          <p className="text-xs font-bold text-[#0f4c5c] uppercase tracking-wider mb-2">
            ¿Cómo reservar mi turno?
          </p>
          <ul className="space-y-2 text-xs text-slate-700 font-medium">
            <li className="flex items-start">
              <span className="text-[#0891b2] font-extrabold mr-1.5">1.</span>
              <span>Ingresa tu número de <strong>DNI</strong> en la pantalla derecha.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#0891b2] font-extrabold mr-1.5">2.</span>
              <span>Si eres nuevo, presiona la pestaña <strong>"Registrarse"</strong> para crear tu usuario.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#0891b2] font-extrabold mr-1.5">3.</span>
              <span>Elige cualquier casillero de color <strong>verde (libre)</strong> en el horario que prefieras.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#0891b2] font-extrabold mr-1.5">4.</span>
              <span>Elige el motivo de consulta, presiona <strong>Confirmar</strong> ¡y listo!</span>
            </li>
          </ul>
        </div>

        {/* Clinic info and work hours (bottom-left) */}
        <div className="bg-[#e0f2fe]/70 border border-[#bae6fd] p-3.5 rounded-xl text-xs font-medium text-[#0f4c5c] flex flex-col mt-auto shadow-3xs">
          <p className="font-bold text-[#0f4c5c] mb-1 flex items-center gap-1.5">
            📅 Horario Semanal de Atención
          </p>
          <p className="text-[11px] leading-relaxed">
            Lunes a Viernes: <strong>08:00 a 12:00</strong> y de <strong>14:00 a 19:00 hs</strong>.
          </p>
          <p className="text-[10px] text-[#0e7490] mt-1 italic leading-none">
            • Atendido por la Dra. Sol, Podóloga Universitaria.
          </p>
        </div>
      </div>
    );

    // Right Page: The login/register form panel
    childrenRight = (
      <LoginView
        onLoginPatient={handleLoginPatient}
        onRegisterPatient={handleRegisterPatient}
        onLoginPodologist={handleLoginPodologist}
        patients={patients}
      />
    );
  } else if (role === 'patient' && currentUser) {
    // Patient flows
    childrenLeft = (
      <PatientViewLeft
        patient={currentUser}
        appointments={appointments}
        tentativeSlot={tentativeSlot}
        setTentativeSlot={setTentativeSlot}
        selectedReason={selectedReason}
        setSelectedReason={setSelectedReason}
        onBookAppointment={handleBookAppointment}
        onCancelAppointment={handleCancelAppointment}
        onLogout={handleLogout}
        activeTab={patientActiveTab}
        setActiveTab={setPatientActiveTab}
      />
    );

    childrenRight = (
      <PatientViewRight
        patient={currentUser}
        appointments={appointments}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        tentativeSlot={tentativeSlot}
        setTentativeSlot={setTentativeSlot}
        activeTab={patientActiveTab}
      />
    );
  } else if (role === 'podologist') {
    // Podologist flows
    childrenLeft = (
      <PodologistViewLeft
        patients={patients}
        appointments={appointments}
        activeSubView={podologistActiveSubView}
        setActiveSubView={setPodologistActiveSubView}
        selectedSlotId={podologistSelectedSlotId}
        setSelectedSlotId={setPodologistSelectedSlotId}
        selectedPatientDni={podologistSelectedPatientDni}
        setSelectedPatientDni={setPodologistSelectedPatientDni}
        manualReason={podologistManualReason}
        setManualReason={setPodologistManualReason}
        searchQuery={podologistSearchQuery}
        setSearchQuery={setPodologistSearchQuery}
        selectedPatientForHistory={selectedPatientForHistory}
        setSelectedPatientForHistory={setSelectedPatientForHistory}
        onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
        onLogout={handleLogout}
        selectedDate={selectedDate}
      />
    );

    childrenRight = (
      <PodologistViewRight
        patients={patients}
        appointments={appointments}
        histories={histories}
        activeSubView={podologistActiveSubView}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        selectedSlotId={podologistSelectedSlotId}
        setSelectedSlotId={setPodologistSelectedSlotId}
        selectedPatientForHistory={selectedPatientForHistory}
        onAddHistoryEntry={handleAddHistoryEntry}
      />
    );
  }

  return (
    <NotebookBackground
      childrenLeft={childrenLeft}
      childrenRight={childrenRight}
      activeMobilePage={activeMobilePage}
      setActiveMobilePage={setActiveMobilePage}
    />
  );
}
