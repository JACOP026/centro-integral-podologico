/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Patient, Appointment, HistoryEntry } from '../types';
import { WORK_HOURS, getWorkHoursForDate, TREATMENTS, formatToSpanishDate, formatDayAndNumber, getWeekDates } from '../utils/storage';
import { Calendar, Users, ChevronLeft, ChevronRight, Check, Trash2, Search, FileText, PlusCircle, LogOut, UserCheck, AlertTriangle, Camera, Sparkles, X, Eye, Image } from 'lucide-react';
import { PodologiaLogo } from './PodologiaLogo';

// ================= PODOLOGIST VIEW - LEFT PAGE =================
interface PodologistViewLeftProps {
  patients: Record<string, Patient>;
  appointments: Record<string, Appointment>;
  activeSubView: 'agenda' | 'patients';
  setActiveSubView: (view: 'agenda' | 'patients') => void;
  selectedSlotId: string | null;
  setSelectedSlotId: (id: string | null) => void;
  selectedPatientDni: string;
  setSelectedPatientDni: (dni: string) => void;
  manualReason: string;
  setManualReason: (reason: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPatientForHistory: string | null;
  setSelectedPatientForHistory: (dni: string | null) => void;
  onUpdateAppointmentStatus: (id: string, status: 'free' | 'pending' | 'confirmed', patientDni: string | null, patientName: string | null, reason?: string) => void;
  onLogout: () => void;
  selectedDate: string;
}

export function PodologistViewLeft({
  patients,
  appointments,
  activeSubView,
  setActiveSubView,
  selectedSlotId,
  setSelectedSlotId,
  selectedPatientDni,
  setSelectedPatientDni,
  manualReason,
  setManualReason,
  searchQuery,
  setSearchQuery,
  selectedPatientForHistory,
  setSelectedPatientForHistory,
  onUpdateAppointmentStatus,
  onLogout,
  selectedDate,
}: PodologistViewLeftProps) {
  const totalPatients = Object.keys(patients).length;
  
  // Day stats
  const currentDayApps = Object.values(appointments).filter((app) => app.date === selectedDate);
  const occupiedCount = currentDayApps.filter((app) => app.status === 'confirmed').length;
  const pendingCount = currentDayApps.filter((app) => app.status === 'pending').length;

  const handleManualBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId || !selectedPatientDni) return;

    const pat = patients[selectedPatientDni];
    if (!pat) return;

    onUpdateAppointmentStatus(
      selectedSlotId,
      'confirmed',
      pat.dni,
      `${pat.nombre} ${pat.apellido}`,
      manualReason
    );
    setSelectedSlotId(null);
    setSelectedPatientDni('');
  };

  const handleConfirmPending = (slotId: string) => {
    const app = appointments[slotId];
    if (!app) return;
    onUpdateAppointmentStatus(slotId, 'confirmed', app.patientDni, app.patientName, app.treatmentReason);
    setSelectedSlotId(null);
  };

  const handleReleaseSlot = (slotId: string) => {
    onUpdateAppointmentStatus(slotId, 'free', null, null);
    setSelectedSlotId(null);
  };

  // Filter patients by search
  const patientList = Object.values(patients).filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(query) ||
      p.apellido.toLowerCase().includes(query) ||
      p.dni.includes(query)
    );
  });

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      
      {/* Professional Header with Logo */}
      <div className="border-b border-dashed border-[#bae6fd] pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="bg-[#e0f2fe] text-[#0e7490] border border-[#bae6fd] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
            🩺 PANEL PROFESIONAL
          </span>
          <button
            id="podologist-btn-logout"
            onClick={onLogout}
            className="p-1 px-2.5 text-xs font-bold text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-red-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
        <div className="flex items-center gap-2">
          <PodologiaLogo size="sm" variant="card" showSubtitle={false} />
        </div>
        <p className="text-xs text-[#0e7490] mt-1 font-medium">
          Lic. Yesica Gisel Camacho • Pasaje Avelino Figueroa 255 • {totalPatients} pacientes registrados
        </p>
      </div>

      {/* View Selection Tab List */}
      <div className="flex bg-[#e0f2fe]/70 p-1 rounded-xl gap-1 border border-[#bae6fd]">
        <button
          id="subview-btn-agenda"
          onClick={() => {
            setActiveSubView('agenda');
            setSelectedSlotId(null);
          }}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubView === 'agenda'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-[#0e7490] hover:bg-white/50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Agenda de Turnos
        </button>
        <button
          id="subview-btn-historial"
          onClick={() => {
            setActiveSubView('patients');
            if (Object.keys(patients).length > 0 && !selectedPatientForHistory) {
              setSelectedPatientForHistory(Object.keys(patients)[0]);
            }
          }}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubView === 'patients'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-[#0e7490] hover:bg-white/50'
          }`}
        >
          <Users className="w-4 h-4" />
          Historial Clínico
        </button>
      </div>

      {/* Dynamic Context Panel */}
      <div className="flex-1 flex flex-col justify-center min-h-[220px]">
        
        {/* VIEW A: AGENDA DETAILS */}
        {activeSubView === 'agenda' && (
          <div className="space-y-4">
            {selectedSlotId ? (
              (() => {
                const app = appointments[selectedSlotId];
                const time = selectedSlotId.split('_')[1];
                const isFree = !app || app.status === 'free';
                const isPending = app?.status === 'pending';

                return (
                  <div className="bg-white border-2 border-[#bae6fd] rounded-2xl p-4 shadow-sm space-y-3.5 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="font-sans text-sm font-bold text-[#0f4c5c] bg-[#e0f2fe] px-2.5 py-0.5 rounded-lg">
                        🕒 {time} hs
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isFree ? 'bg-emerald-100 text-emerald-900' : isPending ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                      }`}>
                        {isFree ? 'Libre' : isPending ? 'Por Confirmar' : 'Reservado'}
                      </span>
                    </div>

                    {/* If Free: Manual Booking Selector */}
                    {isFree ? (
                      <form onSubmit={handleManualBookSubmit} className="space-y-2.5">
                        <p className="text-xs font-bold text-[#0e7490] uppercase tracking-wider">
                          Asignar Turno Manualmente
                        </p>
                        
                        <div className="space-y-1">
                          <label htmlFor="manual-patient" className="block text-[10px] font-bold text-[#0e7490]">
                            Seleccionar Paciente:
                          </label>
                          <select
                            id="manual-patient"
                            required
                            value={selectedPatientDni}
                            onChange={(e) => setSelectedPatientDni(e.target.value)}
                            className="w-full bg-white border border-[#bae6fd] rounded-xl px-2 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#0891b2] text-[#0f4c5c]"
                          >
                            <option value="">-- Elegir Paciente --</option>
                            {Object.values(patients).map((p) => (
                              <option key={p.dni} value={p.dni}>
                                {p.apellido}, {p.nombre} (DNI: {p.dni})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="manual-treatment" className="block text-[10px] font-bold text-[#0e7490]">
                            Tratamiento/Razón:
                          </label>
                          <select
                            id="manual-treatment"
                            value={manualReason}
                            onChange={(e) => setManualReason(e.target.value)}
                            className="w-full bg-white border border-[#bae6fd] rounded-xl px-2 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#0891b2] text-[#0f4c5c]"
                          >
                            {TREATMENTS.map((t, idx) => (
                              <option key={idx} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex space-x-1.5 pt-1.5">
                          <button
                            id="btn-manual-book-submit"
                            type="submit"
                            disabled={!selectedPatientDni}
                            className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] disabled:bg-[#e0f2fe] disabled:text-[#0e7490] text-white font-bold py-1.5 rounded-lg text-xs transition-all cursor-pointer border border-[#0284c7]"
                          >
                            Agendar Turno
                          </button>
                          <button
                            id="btn-manual-cancel"
                            type="button"
                            onClick={() => setSelectedSlotId(null)}
                            className="px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                          >
                            Atrás
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Display booking details & action buttons
                      <div className="space-y-2.5">
                        <div className="bg-[#e0f2fe]/40 p-2.5 rounded-xl border border-[#bae6fd] text-xs">
                          <p className="text-[10px] font-bold text-[#0891b2] uppercase">Paciente:</p>
                          <p className="font-bold text-sm text-[#0f4c5c] mt-0.5">{app.patientName}</p>
                          <p className="text-[#0e7490] font-mono mt-0.5">DNI: {app.patientDni}</p>
                          <p className="text-[#0e7490] mt-0.5">Cel: {patients[app.patientDni || '']?.telefono || 'No registrado'}</p>
                          <p className="text-slate-800 mt-1.5 italic border-t border-dashed border-[#bae6fd] pt-1.5">
                            • Tratamiento: <strong>{app.treatmentReason}</strong>
                          </p>
                        </div>

                        <div className="flex gap-2 pt-1">
                          {isPending && (
                            <button
                              id="btn-podologist-confirm"
                              onClick={() => handleConfirmPending(selectedSlotId)}
                              className="flex-1 bg-[#0e7490] hover:bg-[#0f4c5c] text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer border border-[#0891b2]"
                            >
                              Confirmar Turno
                            </button>
                          )}
                          <button
                            id="btn-podologist-delete"
                            onClick={() => handleReleaseSlot(selectedSlotId)}
                            className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            Liberar Horario
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="bg-[#e0f2fe]/40 rounded-xl p-4 border border-dashed border-[#bae6fd] text-center space-y-1">
                <p className="text-xs text-[#0f4c5c] font-bold">
                  🔍 Gestión de Citas
                </p>
                <p className="text-[11px] text-[#0e7490] leading-relaxed">
                  Haz clic en cualquier turno de la derecha para administrar, agendar manualmente, o liberar los horarios seleccionados.
                </p>
              </div>
            )}

            {/* Day stats */}
            <div className="bg-[#e0f2fe]/30 border border-[#bae6fd] rounded-xl p-3 text-xs space-y-1.5">
              <p className="font-bold text-[#0f4c5c] uppercase tracking-wider text-[10px] mb-1.5 font-sans">
                Resumen Diario
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-1 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-emerald-900 font-bold font-sans text-base">{WORK_HOURS.length - occupiedCount - pendingCount}</p>
                  <p className="text-[9px] text-emerald-800 font-semibold">Libres</p>
                </div>
                <div className="p-1 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-900 font-bold font-sans text-base">{pendingCount}</p>
                  <p className="text-[9px] text-amber-800 font-semibold">Pendientes</p>
                </div>
                <div className="p-1 bg-rose-50 rounded-lg border border-rose-200">
                  <p className="text-rose-900 font-bold font-sans text-base">{occupiedCount}</p>
                  <p className="text-[9px] text-rose-800 font-semibold">Ocupados</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: PATIENT DIRECTORY */}
        {activeSubView === 'patients' && (
          <div className="space-y-3.5 h-full flex flex-col">
            {/* Search input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#0891b2]">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="patient-search"
                type="text"
                placeholder="Buscar por DNI o Nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#bae6fd] rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#0891b2] text-[#0f4c5c]"
              />
            </div>

            {/* Patients list panel */}
            <div className="overflow-y-auto max-h-[220px] bg-white border-2 border-[#bae6fd] rounded-xl p-1.5 space-y-1">
              {patientList.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 text-center">No se encontraron pacientes.</p>
              ) : (
                patientList.map((p) => {
                  const isSelected = selectedPatientForHistory === p.dni;
                  return (
                    <button
                      id={`patient-row-${p.dni}`}
                      key={p.dni}
                      onClick={() => setSelectedPatientForHistory(p.dni)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex justify-between items-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0e7490] text-white font-bold'
                          : 'hover:bg-[#e0f2fe]/60 text-slate-800'
                      }`}
                    >
                      <div>
                        <p className="font-bold leading-none">{p.apellido}, {p.nombre}</p>
                        <p className={`font-mono text-[10px] mt-0.5 ${isSelected ? 'text-[#e0f2fe]' : 'text-[#0e7490]'}`}>DNI: {p.dni}</p>
                      </div>
                      <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#0891b2]'}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Advice tips */}
      <div className="bg-[#e0f2fe]/50 border border-[#bae6fd] p-3 rounded-xl text-[10px] leading-relaxed text-[#0e7490] flex items-start gap-1.5">
        <UserCheck className="w-4 h-4 text-[#0891b2] shrink-0 mt-0.5" />
        <span>
          <strong>Consejo:</strong> Selecciona <strong>Agenda de Turnos</strong> para verificar el día, u <strong>Historial Clínico</strong> para ver las fichas de tratamiento e historia de cada paciente.
        </span>
      </div>

    </div>
  );
}

// ================= PODOLOGIST VIEW - RIGHT PAGE =================
interface PodologistViewRightProps {
  patients: Record<string, Patient>;
  appointments: Record<string, Appointment>;
  histories: HistoryEntry[];
  activeSubView: 'agenda' | 'patients';
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlotId: string | null;
  setSelectedSlotId: (id: string | null) => void;
  selectedPatientForHistory: string | null;
  onAddHistoryEntry: (entry: Omit<HistoryEntry, 'id'>) => void;
}

export function PodologistViewRight({
  patients,
  appointments,
  histories,
  activeSubView,
  selectedDate,
  onSelectDate,
  selectedSlotId,
  setSelectedSlotId,
  selectedPatientForHistory,
  onAddHistoryEntry,
}: PodologistViewRightProps) {
  const [newHistTreatment, setNewHistTreatment] = useState(TREATMENTS[0]);
  const [newHistDescription, setNewHistDescription] = useState('');
  const [newHistNotes, setNewHistNotes] = useState('');
  const [newHistDate, setNewHistDate] = useState(new Date().toISOString().split('T')[0]);
  const [newHistImage, setNewHistImage] = useState<string | undefined>(undefined);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [histSuccess, setHistSuccess] = useState('');

  const weekDates = getWeekDates(selectedDate);

  const handlePrevWeek = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 7);
    const prevWeekDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onSelectDate(prevWeekDateStr);
    setSelectedSlotId(null);
  };

  const handleNextWeek = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 7);
    const nextWeekDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onSelectDate(nextWeekDateStr);
    setSelectedSlotId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewHistImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClinicalHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientForHistory || !newHistDescription.trim()) return;

    onAddHistoryEntry({
      patientDni: selectedPatientForHistory,
      date: newHistDate,
      treatmentType: newHistTreatment,
      description: newHistDescription.trim(),
      podologistNotes: newHistNotes.trim() || undefined,
      image: newHistImage,
    });

    setNewHistDescription('');
    setNewHistNotes('');
    setNewHistImage(undefined);
    setNewHistDate(new Date().toISOString().split('T')[0]);
    setHistSuccess('¡Ficha clínica actualizada!');
    setTimeout(() => setHistSuccess(''), 2000);
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      
      {/* 1. VIEW A: AGENDA CALENDAR GRID */}
      {activeSubView === 'agenda' && (
        <div className="space-y-4 h-full flex flex-col justify-between">
          
          {/* Week navigation bar */}
          <div className="border-b border-dashed border-[#bae6fd] pb-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <button
                id="pod-prev-week"
                onClick={handlePrevWeek}
                className="p-1 px-2.5 bg-white border border-[#bae6fd] hover:bg-[#e0f2fe] rounded-lg text-[#0e7490] transition-all flex items-center justify-center cursor-pointer shadow-2xs font-sans text-xs font-bold"
                title="Semana Anterior"
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" />
                <span>Ant.</span>
              </button>

              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase bg-[#e0f2fe] text-[#0e7490] px-2.5 py-0.5 rounded-full border border-[#bae6fd] tracking-wider font-sans">
                  Calendario Técnico
                </span>
                <p className="text-xs font-bold text-[#0f4c5c] mt-1.5 uppercase tracking-wide">
                  Del {formatDayAndNumber(weekDates[0])} al {formatDayAndNumber(weekDates[4])}
                </p>
              </div>

              <button
                id="pod-next-week"
                onClick={handleNextWeek}
                className="p-1 px-2.5 bg-white border border-[#bae6fd] hover:bg-[#e0f2fe] rounded-lg text-[#0e7490] transition-all flex items-center justify-center cursor-pointer shadow-2xs font-sans text-xs font-bold"
                title="Siguiente Semana"
              >
                <span>Sig.</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            {/* Weekdays switcher */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {weekDates.map((dateStr) => {
                const isActive = selectedDate === dateStr;
                return (
                  <button
                    id={`pod-day-${dateStr}`}
                    key={dateStr}
                    onClick={() => {
                      onSelectDate(dateStr);
                      setSelectedSlotId(null);
                    }}
                    className={`py-1.5 px-0.5 rounded-lg text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isActive
                        ? 'bg-[#0e7490] text-white font-bold shadow-sm scale-102'
                        : 'bg-white text-[#0e7490] hover:bg-[#e0f2fe] text-xs font-semibold border border-[#bae6fd]'
                    }`}
                  >
                    <span className="text-[9px] uppercase leading-none opacity-85">
                      {formatDayAndNumber(dateStr).split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold leading-none mt-1">
                      {formatDayAndNumber(dateStr).split(' ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date */}
          <div className="text-center py-1">
            <p className="text-xs text-[#0e7490] uppercase font-bold tracking-wider">Mostrando Turnos de:</p>
            <h4 className="text-lg font-serif italic font-bold text-[#0f4c5c]">
              📅 {formatToSpanishDate(selectedDate)}
            </h4>
          </div>

          {/* Slots list */}
          <div className="flex-1 overflow-y-auto max-h-[340px] pr-1 scrollbar-thin">
            {(() => {
              const dayHours = getWorkHoursForDate(selectedDate);
              
              if (dayHours.length === 0) {
                return (
                  <div className="bg-[#fff1f2] border-2 border-dashed border-rose-200 rounded-2xl p-4 text-center my-3 space-y-1">
                    <p className="text-xs font-bold text-rose-800">
                      🚫 Día No Laborable (Consultorio Cerrado)
                    </p>
                    <p className="text-[11px] text-rose-700">
                      Sábados y Domingos no se agendan turnos.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 gap-2.5">
                  {dayHours.map((time) => {
                    const fullId = `${selectedDate}_${time}`;
                    const app = appointments[fullId];
                    const isFree = !app || app.status === 'free';
                    const isPending = app?.status === 'pending';
                    const isSelected = selectedSlotId === fullId;

                    let cardStyle = 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900';
                    let detailLabel = 'Libre / Agendar';

                    if (isSelected) {
                      cardStyle = 'bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-900 ring-2 ring-cyan-400 scale-102 font-bold shadow-md';
                      detailLabel = 'Configurando...';
                    } else if (!isFree) {
                      if (isPending) {
                        cardStyle = 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 animate-pulse';
                        detailLabel = `🟠 Por Confirmar: ${app.patientName}`;
                      } else {
                        cardStyle = 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-900';
                        detailLabel = `🔴 Ocupado: ${app.patientName?.split(' ')[0]}`;
                      }
                    }

                    return (
                      <button
                        id={`pod-slot-${time}`}
                        key={time}
                        onClick={() => setSelectedSlotId(fullId)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer hover:shadow-2xs ${cardStyle}`}
                      >
                        <span className="font-sans text-xs font-bold">🕒 {time} hs</span>
                        <span className="text-[10px] font-bold truncate w-full leading-tight mt-1">
                          {detailLabel}
                        </span>
                        {app?.treatmentReason && !isSelected && (
                          <span className="text-[9px] opacity-75 truncate w-full mt-0.5 italic font-medium">
                            • {app.treatmentReason}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 2. VIEW B: HISTORIES TIMELINE & REPORT FORMS */}
      {activeSubView === 'patients' && (
        <div className="space-y-4 h-full flex flex-col justify-between">
          {selectedPatientForHistory ? (
            (() => {
              const pat = patients[selectedPatientForHistory];
              const patientHistories = histories.filter((h) => h.patientDni === selectedPatientForHistory);
              const sortedHistories = [...patientHistories].sort((a, b) => b.date.localeCompare(a.date));
              const latestUpdate = sortedHistories[0];

              return (
                <div className="flex-1 flex flex-col justify-between h-full space-y-3 animate-fadeIn">
                  
                  {/* Selected Patient Banner */}
                  <div className="bg-[#e0f2fe] p-2.5 rounded-xl border border-[#bae6fd] flex justify-between items-center shadow-3xs">
                    <div>
                      <h4 className="text-sm font-bold text-[#0f4c5c]">
                        📋 Historial Clínico: {pat.apellido}, {pat.nombre}
                      </h4>
                      <p className="text-[10px] font-mono text-[#0e7490] mt-0.5">
                        DNI: {pat.dni} • Teléfono: {pat.telefono}
                      </p>
                    </div>
                    <span className="bg-[#0e7490] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                      {patientHistories.length} Reportes
                    </span>
                  </div>

                  {/* HIGHLIGHTED LATEST UPDATE: "Resumen completo de la última actualización" */}
                  <div className="bg-cyan-50/90 border border-cyan-200 p-3 rounded-xl shadow-3xs">
                    <div className="flex items-center gap-1.5 text-[#0f4c5c] font-bold uppercase text-[10px] tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#0891b2] animate-pulse" />
                      <span>Última Actualización de Evolución (Resumen)</span>
                    </div>
                    {latestUpdate ? (
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-[#0f4c5c]">
                          📅 {formatToSpanishDate(latestUpdate.date)} — <span className="text-[#0e7490] font-sans">{latestUpdate.treatmentType}</span>
                        </p>
                        <p className="text-xs text-slate-800 italic leading-relaxed font-medium">
                          "{latestUpdate.description}"
                        </p>
                        {latestUpdate.podologistNotes && (
                          <p className="text-[10px] text-slate-600 font-medium">
                            <strong className="text-[#0e7490]">Obs:</strong> {latestUpdate.podologistNotes}
                          </p>
                        )}
                        {latestUpdate.image && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <img 
                              src={latestUpdate.image} 
                              alt="Última evolución del pie" 
                              className="w-10 h-10 object-cover rounded-lg border border-[#bae6fd] cursor-pointer hover:scale-105 transition-all shadow-3xs"
                              onClick={() => setSelectedPhotoUrl(latestUpdate.image || null)}
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-[10px] text-[#0e7490] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Click para ampliar foto
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#0e7490] italic">
                        Sin reportes registrados. Redacte el primer reporte de evolución abajo.
                      </p>
                    )}
                  </div>

                  {/* Treatments Timeline */}
                  <div className="flex-1 overflow-y-auto max-h-[140px] pr-1 space-y-2 scrollbar-thin">
                    <p className="text-[10px] font-bold text-[#0e7490] uppercase tracking-wider mb-1 font-sans">
                      ⏳ Línea de Tiempo de Curación
                    </p>
                    {sortedHistories.length === 0 ? (
                      <div className="p-4 bg-white border border-dashed border-[#bae6fd] rounded-xl text-center">
                        <p className="text-xs text-[#0e7490] italic">No hay registros de tratamientos previos para este paciente.</p>
                      </div>
                    ) : (
                      sortedHistories.map((h) => (
                        <div key={h.id} className="bg-white p-2.5 rounded-xl border border-[#bae6fd] text-xs shadow-2xs space-y-2 animate-fadeIn">
                          <div className="flex justify-between items-center text-[10px] border-b border-dashed border-[#bae6fd] pb-1">
                            <span className="font-bold text-[#0f4c5c] bg-[#e0f2fe] px-2 py-0.5 rounded border border-[#bae6fd]">
                              {h.treatmentType}
                            </span>
                            <span className="font-mono font-semibold text-[#0e7490]">{formatToSpanishDate(h.date)}</span>
                          </div>
                          
                          <p className="text-slate-800 leading-relaxed font-medium">{h.description}</p>
                          
                          {h.image && (
                            <div className="relative rounded-lg overflow-hidden border border-[#bae6fd] bg-[#e0f2fe]/40 max-w-[140px] group cursor-pointer" onClick={() => setSelectedPhotoUrl(h.image || null)}>
                              <img src={h.image} alt="Evolución del pie por día" className="w-full h-16 object-cover group-hover:scale-102 transition-transform" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[9px] uppercase gap-1">
                                <Eye className="w-3 h-3" /> Ampliar
                              </div>
                            </div>
                          )}

                          {h.podologistNotes && (
                            <p className="text-[#0e7490] text-[11px] bg-[#e0f2fe]/50 p-1.5 rounded-lg border border-[#bae6fd] italic">
                              <strong>Obs:</strong> {h.podologistNotes}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add report form */}
                  <form onSubmit={handleAddClinicalHistory} className="border-t border-dashed border-[#bae6fd] pt-2 space-y-2 bg-white/60 p-2 rounded-xl border border-[#bae6fd]">
                    <p className="text-[10px] font-bold text-[#0f4c5c] uppercase tracking-wider flex items-center gap-1 font-sans">
                      <PlusCircle className="w-3.5 h-3.5 text-[#0e7490]" />
                      Nuevo Reporte Diario / Foto de Curación
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1">
                        <label htmlFor="hist-treatment" className="block text-[9px] font-bold text-[#0e7490] uppercase">
                          Tratamiento Realizado *
                        </label>
                        <select
                          id="hist-treatment"
                          value={newHistTreatment}
                          onChange={(e) => setNewHistTreatment(e.target.value)}
                          className="w-full bg-white border border-[#bae6fd] rounded-lg p-1 text-xs font-semibold focus:ring-1 focus:ring-[#0891b2] text-[#0f4c5c]"
                        >
                          {TREATMENTS.map((t, idx) => (
                            <option key={idx} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* DATE SELECTOR: "se pueda guardar el día" */}
                      <div className="space-y-1">
                        <label htmlFor="hist-date" className="block text-[9px] font-bold text-[#0e7490] uppercase">
                          Fecha *
                        </label>
                        <input
                          id="hist-date"
                          type="date"
                          required
                          value={newHistDate}
                          onChange={(e) => setNewHistDate(e.target.value)}
                          className="w-full bg-white border border-[#bae6fd] rounded-lg p-1 text-xs font-semibold focus:ring-1 focus:ring-[#0891b2] text-[#0f4c5c]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label htmlFor="hist-notes" className="block text-[9px] font-bold text-[#0e7490] uppercase">
                          Indicación Corta
                        </label>
                        <input
                          id="hist-notes"
                          type="text"
                          placeholder="Ej: Crema urea 20%"
                          value={newHistNotes}
                          onChange={(e) => setNewHistNotes(e.target.value)}
                          className="w-full bg-white border border-[#bae6fd] rounded-lg p-1 text-xs focus:ring-1 focus:ring-[#0891b2] text-[#0f4c5c]"
                        />
                      </div>

                      {/* PHOTO UPLOAD / CELLULAR CAPTURE */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-[#0e7490] uppercase">
                          Capturar/Subir Foto
                        </label>
                        <div className="flex items-center gap-1.5">
                          <label
                            htmlFor="hist-photo-upload"
                            className="flex items-center justify-center gap-1 w-full bg-[#e0f2fe] hover:bg-[#bae6fd] border border-[#bae6fd] text-[#0f4c5c] font-bold py-1 px-1 rounded-lg text-[9px] cursor-pointer transition-all shadow-3xs uppercase tracking-wide"
                          >
                            <Camera className="w-3 h-3 text-[#0e7490]" />
                            <span>{newHistImage ? "Cambiar" : "Cámara / Foto"}</span>
                          </label>
                          <input
                            id="hist-photo-upload"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          {newHistImage && (
                            <button
                              id="btn-remove-photo"
                              type="button"
                              onClick={() => setNewHistImage(undefined)}
                              className="p-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg"
                              title="Eliminar foto"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Loaded image preview */}
                    {newHistImage && (
                      <div className="flex items-center gap-2 p-1 bg-[#e0f2fe] border border-[#bae6fd] rounded-lg animate-fadeIn text-[10px] text-[#0f4c5c]">
                        <img src={newHistImage} alt="Preview" className="w-8 h-8 object-cover rounded-md border border-[#bae6fd]" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold">¡Imagen cargada!</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label htmlFor="hist-desc" className="block text-[9px] font-bold text-[#0e7490] uppercase">
                        Descripción de Curación del Pie *
                      </label>
                      <textarea
                        id="hist-desc"
                        required
                        placeholder="Escribe la evolución del pie de hoy..."
                        rows={1}
                        value={newHistDescription}
                        onChange={(e) => setNewHistDescription(e.target.value)}
                        className="w-full bg-white border border-[#bae6fd] rounded-lg p-1 text-xs focus:ring-1 focus:ring-[#0891b2] text-[#0f4c5c]"
                      />
                    </div>

                    {histSuccess && (
                      <div className="p-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[10px] text-emerald-800 font-bold text-center">
                        {histSuccess}
                      </div>
                    )}

                    <button
                      id="btn-add-history"
                      type="submit"
                      disabled={!newHistDescription.trim()}
                      className="w-full bg-[#0284c7] hover:bg-[#0369a1] disabled:bg-[#e0f2fe] disabled:text-[#0e7490] text-white font-bold py-1.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1 cursor-pointer border border-[#0284c7] uppercase tracking-wider shadow-xs"
                    >
                      Guardar Evolución de Curación
                    </button>
                  </form>

                </div>
              );
            })()
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border border-dashed border-[#bae6fd] rounded-2xl bg-[#e0f2fe]/30">
              <AlertTriangle className="w-8 h-8 text-[#0e7490] mb-2" />
              <p className="text-sm font-bold text-[#0f4c5c]">Ningún Paciente Seleccionado</p>
              <p className="text-xs text-[#0e7490] mt-1 leading-relaxed">
                Por favor, selecciona un paciente del directorio a la izquierda para visualizar su historial clínico y agendar sus reportes de consulta.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PHOTO LIGHTBOX MODAL */}
      {selectedPhotoUrl && (
        <div className="fixed inset-0 bg-black/85 z-50 flex flex-col items-center justify-center p-4 animate-fadeIn pointer-events-auto">
          <button
            id="btn-close-lightbox"
            onClick={() => setSelectedPhotoUrl(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all cursor-pointer z-55"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-xl bg-white p-2 border border-slate-300 shadow-2xl relative">
            <img src={selectedPhotoUrl} alt="Foto de evolución en grande" className="max-w-full max-h-[80vh] object-contain rounded-lg" referrerPolicy="no-referrer" />
          </div>
          <p className="text-white text-xs font-bold mt-3 bg-black/40 px-3 py-1.5 rounded-full uppercase tracking-wider">
            Visualización de Seguimiento de Curación
          </p>
        </div>
      )}

    </div>
  );
}
