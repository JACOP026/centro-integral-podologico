/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Patient, Appointment, HistoryEntry } from '../types';
import { WORK_HOURS, getWorkHoursForDate, TREATMENTS, formatToSpanishDate, formatDayAndNumber, getWeekDates } from '../utils/storage';
import { CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, User, HelpCircle, Sparkles, X, Eye, BookOpen, Award, Phone, MapPin, Mail, Compass, MessageCircle, Instagram } from 'lucide-react';
import { PodologiaLogo } from './PodologiaLogo';

// ================= PATIENT VIEW - LEFT PAGE =================
interface PatientViewLeftProps {
  patient: Patient;
  appointments: Record<string, Appointment>;
  tentativeSlot: string | null;
  setTentativeSlot: (slot: string | null) => void;
  selectedReason: string;
  setSelectedReason: (reason: string) => void;
  onBookAppointment: (appointmentId: string, reason: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onLogout: () => void;
  activeTab: 'booking' | 'info';
  setActiveTab: (tab: 'booking' | 'info') => void;
}

export function PatientViewLeft({
  patient,
  appointments,
  tentativeSlot,
  setTentativeSlot,
  selectedReason,
  setSelectedReason,
  onBookAppointment,
  onCancelAppointment,
  onLogout,
  activeTab,
  setActiveTab,
}: PatientViewLeftProps) {
  // Get current patient's active appointments
  const myAppointments = Object.values(appointments).filter(
    (app) => app.patientDni === patient.dni && app.status !== 'free'
  );

  const handleConfirmBooking = () => {
    if (tentativeSlot) {
      onBookAppointment(tentativeSlot, selectedReason);
      setTentativeSlot(null);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      
      {/* Welcome Section with Logo */}
      <div className="border-b border-dashed border-[#bae6fd] pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-[#0e7490]">
            <div className="p-1.5 bg-[#e0f2fe] rounded-lg text-[#0e7490]">
              <User className="w-5 h-5" />
            </div>
            <span className="font-serif italic font-bold text-[#0f4c5c] text-xl">
              ¡Hola, {patient.nombre}!
            </span>
          </div>
          <button
            id="patient-btn-logout"
            onClick={onLogout}
            className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all cursor-pointer"
          >
            Salir
          </button>
        </div>
        <p className="text-xs text-[#0e7490] leading-relaxed font-medium">
          DNI: <span className="font-mono font-bold text-[#0f4c5c]">{patient.dni}</span> • Cel: {patient.telefono}
        </p>
      </div>

      {/* Navigation Tabs inside the Notebook Spread */}
      <div className="flex bg-[#e0f2fe]/70 p-1 rounded-xl gap-1 border border-[#bae6fd]">
        <button
          id="patient-tab-booking"
          onClick={() => setActiveTab('booking')}
          className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'booking'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'text-[#0e7490] hover:bg-white/60'
          }`}
        >
          📅 Reservar Turno
        </button>
        <button
          id="patient-tab-info"
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'info'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'text-[#0e7490] hover:bg-white/60'
          }`}
        >
          👩‍⚕️ Podóloga & Contacto
        </button>
      </div>

      {/* Dynamic Action Panel */}
      <div className="flex-1 flex flex-col justify-center">
        {activeTab === 'booking' ? (
          tentativeSlot ? (
            // Form to confirm appointment
            <div className="bg-[#e0f2fe]/60 border-2 border-dashed border-[#0891b2]/40 rounded-2xl p-4 shadow-xs animate-fadeIn">
              <div className="flex items-center space-x-2 text-[#0e7490] mb-2.5">
                <Sparkles className="w-5 h-5 text-[#0891b2] animate-pulse" />
                <span className="font-bold text-sm uppercase">Confirmar Turno</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/90 p-3 rounded-xl border border-[#bae6fd]">
                  <p className="text-[10px] text-[#0e7490] font-bold uppercase">Día Seleccionado:</p>
                  <p className="text-sm font-bold text-[#0f4c5c]">
                    {formatToSpanishDate(tentativeSlot.split('_')[0])}
                  </p>
                  <p className="text-base font-mono font-extrabold text-[#0284c7] mt-0.5">
                    🕒 {tentativeSlot.split('_')[1]} hs
                  </p>
                </div>

                <div className="space-y-1">
                  <label htmlFor="treatment-select" className="block text-[9px] font-bold text-[#0e7490] uppercase">
                    Motivo de Consulta:
                  </label>
                  <select
                    id="treatment-select"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full bg-white border border-[#bae6fd] rounded-xl px-2.5 py-1.5 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#0891b2] font-semibold text-[#0f4c5c]"
                  >
                    {TREATMENTS.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2 pt-1">
                  <button
                    id="btn-confirm-turn"
                    onClick={handleConfirmBooking}
                    className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2 rounded-xl shadow-md text-xs transition-all cursor-pointer border border-[#0284c7] uppercase tracking-wider transform hover:scale-[1.01]"
                  >
                    Confirmar Turno
                  </button>
                  <button
                    id="btn-cancel-selection"
                    onClick={() => setTentativeSlot(null)}
                    className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-medium text-xs transition-all cursor-pointer"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // No selected slot: Show active bookings list
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2 text-[#0e7490] mb-0.5">
                <CalendarDays className="w-4 h-4 text-[#0891b2]" />
                <span className="font-bold text-xs uppercase tracking-wider font-sans">Mis Turnos Pendientes</span>
              </div>
              
              {myAppointments.length === 0 ? (
                <div className="bg-[#f0fdfa] rounded-xl p-3.5 text-center border border-dashed border-[#bae6fd]">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    No tienes ningún turno reservado todavía.
                  </p>
                  <p className="text-xs text-[#0e7490] font-bold mt-1">
                    👉 Elige un horario verde a la derecha para agendar tu consulta.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {myAppointments.map((app) => (
                    <div key={app.id} className="bg-[#e0f2fe]/50 border border-[#bae6fd] rounded-xl p-2.5 flex justify-between items-start text-xs shadow-2xs">
                      <div>
                        <p className="font-bold text-[#0f4c5c]">
                          {formatToSpanishDate(app.date)}
                        </p>
                        <p className="font-mono text-[#0891b2] font-bold mt-0.5">
                          🕒 {app.time} hs
                        </p>
                        <p className="text-slate-600 mt-0.5 italic text-[11px]">
                          • {app.treatmentReason}
                        </p>
                      </div>
                      <button
                        id={`btn-cancel-app-${app.id}`}
                        onClick={() => onCancelAppointment(app.id)}
                        className="p-1 px-2 text-red-700 hover:bg-red-50 hover:text-red-800 rounded-md font-bold text-[10px] border border-red-200 transition-all cursor-pointer"
                        title="Cancelar turno"
                      >
                        Cancelar
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-[#e0f2fe]/40 rounded-xl p-2.5 border border-[#bae6fd] text-[10px] leading-relaxed text-[#0e7490] flex items-start space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#0891b2] mt-0.5 shrink-0" />
                <span>
                  <strong>Tip:</strong> Puedes navegar entre semanas con los botones <strong>Ant.</strong> y <strong>Sig.</strong> en la página de la derecha.
                </span>
              </div>
            </div>
          )
        ) : (
          // Professional info helper block active on Left Page
          <div className="flex-1 flex flex-col justify-center space-y-3 animate-fadeIn">
            <div className="flex items-center space-x-1.5 text-[#0e7490] mb-0.5">
              <Sparkles className="w-4 h-4 text-[#0891b2] animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider font-sans">Centro Integral Podológico</span>
            </div>
            
            <div className="bg-[#e0f2fe]/60 border border-[#bae6fd] rounded-xl p-3 text-xs text-[#0f4c5c] leading-relaxed shadow-3xs space-y-1">
              <p className="font-bold text-[#0e7490] flex items-center gap-1 text-sm">
                <Award className="w-4 h-4 text-[#0891b2]" /> Lic. Yesica Gisel Camacho
              </p>
              <p className="text-[11px] font-semibold text-[#0284c7]">
                Doctorado • Título Universitario • Licenciada en Podología
              </p>
              <p className="text-[10px] italic text-[#0f4c5c] font-serif pt-1">
                "✨ Pies sanos es igual a pies felices ✨"
              </p>
            </div>

            <div className="bg-[#f0fdfa] p-2.5 rounded-xl text-[10px] leading-relaxed text-[#0e7490] border border-[#bae6fd]">
              <strong>Atención en Consultorio:</strong> Ubicados en Pasaje Avelino Figueroa 255, Salta. Tratamiento integral de quiropodía, pie diabético y reconstrucción ungueal.
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM LEFT CORNER: Working Hours & Direct WhatsApp Contact */}
      <div className="space-y-2 mt-auto">
        <div className="bg-[#e0f2fe]/40 border border-[#bae6fd] p-2.5 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-[#0f4c5c] mb-1 flex items-center gap-1.5 font-sans uppercase tracking-wider">
            🕒 Nuestros Horarios (Image 1)
          </p>
          <div className="space-y-1 font-mono text-[10px] text-[#0e7490]">
            <div className="flex justify-between items-center bg-white/70 p-1 px-1.5 rounded border border-[#bae6fd]">
              <span>Lun, Mié y Vie:</span>
              <span className="font-bold text-[#0f4c5c]">9.40hs a 16hs</span>
            </div>
            <div className="flex justify-between items-center bg-white/70 p-1 px-1.5 rounded border border-[#bae6fd]">
              <span>Mar y Jue:</span>
              <span className="font-bold text-[#0f4c5c]">15hs a 20hs</span>
            </div>
            <div className="flex justify-between text-red-600 font-semibold px-1">
              <span>Sábados y Domingos:</span>
              <span>Cerrado</span>
            </div>
          </div>
        </div>

        {/* Direct WhatsApp Button (Sacá tu turno - Image 2) */}
        <div className="bg-[#f0fdfa] border-2 border-[#bae6fd] p-2 rounded-xl shadow-3xs text-center">
          <p className="text-[9px] font-bold text-[#0e7490] uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
            📱 SACÁ TU TURNO POR WHATSAPP
          </p>
          <a
            href="https://wa.me/5493874103008"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all shadow-xs cursor-pointer border border-[#1da851]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Escribinos al WhatsApp 387-4103008</span>
          </a>
        </div>
      </div>

    </div>
  );
}

// ================= PATIENT VIEW - RIGHT PAGE =================
interface PatientViewRightProps {
  patient: Patient;
  appointments: Record<string, Appointment>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  tentativeSlot: string | null;
  setTentativeSlot: (slot: string | null) => void;
  activeTab: 'booking' | 'info';
}

export function PatientViewRight({
  patient,
  appointments,
  selectedDate,
  onSelectDate,
  tentativeSlot,
  setTentativeSlot,
  activeTab,
}: PatientViewRightProps) {
  const weekDates = getWeekDates(selectedDate);

  // Navigate week
  const handlePrevWeek = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 7);
    const prevWeekDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onSelectDate(prevWeekDateStr);
    setTentativeSlot(null);
  };

  const handleNextWeek = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 7);
    const nextWeekDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onSelectDate(nextWeekDateStr);
    setTentativeSlot(null);
  };

  const handleSlotSelect = (time: string, status: string, isMine: boolean) => {
    const fullId = `${selectedDate}_${time}`;
    if (status === 'free' || !status) {
      setTentativeSlot(fullId);
    } else if (isMine) {
      setTentativeSlot(null);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      
      {activeTab === 'booking' ? (
        <>
          {/* Day / Week Header */}
          <div className="border-b border-dashed border-[#bae6fd] pb-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <button
                id="btn-prev-week"
                onClick={handlePrevWeek}
                className="p-1 px-2.5 bg-white border border-[#bae6fd] hover:bg-[#e0f2fe] rounded-lg text-[#0e7490] transition-all flex items-center justify-center cursor-pointer shadow-2xs font-sans text-xs font-bold"
                title="Semana Anterior"
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" />
                <span>Ant.</span>
              </button>

              <div className="text-center">
                <h3 className="text-xs font-bold text-[#0891b2] tracking-widest uppercase leading-none font-sans">
                  Reserva de Turnos
                </h3>
                <p className="text-xs font-bold text-[#0f4c5c] uppercase tracking-wider mt-1.5">
                  Semana del {formatDayAndNumber(weekDates[0])} al {formatDayAndNumber(weekDates[4])}
                </p>
              </div>

              <button
                id="btn-next-week"
                onClick={handleNextWeek}
                className="p-1 px-2.5 bg-white border border-[#bae6fd] hover:bg-[#e0f2fe] rounded-lg text-[#0e7490] transition-all flex items-center justify-center cursor-pointer shadow-2xs font-sans text-xs font-bold"
                title="Siguiente Semana"
              >
                <span>Sig.</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            {/* Weekdays quick selector tabs */}
            <div className="grid grid-cols-5 gap-1 pt-1.5">
              {weekDates.map((dateStr) => {
                const isActive = selectedDate === dateStr;
                return (
                  <button
                    id={`weekday-tab-${dateStr}`}
                    key={dateStr}
                    onClick={() => {
                      onSelectDate(dateStr);
                      setTentativeSlot(null);
                    }}
                    className={`py-1 px-0.5 rounded-lg text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isActive
                        ? 'bg-[#0e7490] text-white font-bold shadow-sm scale-102'
                        : 'bg-white text-[#0e7490] hover:bg-[#e0f2fe] text-xs font-semibold border border-[#bae6fd]'
                    }`}
                  >
                    <span className="text-[10px] uppercase leading-none opacity-85">
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

          {/* Active Day Headline */}
          <div className="text-center py-1">
            <p className="text-xs text-[#0891b2] uppercase font-bold tracking-wider">
              Día Seleccionado:
            </p>
            <h4 className="text-lg font-serif italic font-bold text-[#0f4c5c] tracking-tight">
              📅 {formatToSpanishDate(selectedDate)}
            </h4>
          </div>

          {/* Turn Grid */}
          <div className="flex-1 overflow-y-auto max-h-[340px] pr-1 scrollbar-thin">
            {(() => {
              const dayHours = getWorkHoursForDate(selectedDate);
              
              if (dayHours.length === 0) {
                return (
                  <div className="bg-[#fff1f2] border-2 border-dashed border-rose-200 rounded-2xl p-5 text-center my-4 space-y-2">
                    <p className="text-sm font-bold text-rose-800 flex items-center justify-center gap-1.5">
                      🚫 Día No Laborable / Consultorio Cerrado
                    </p>
                    <p className="text-xs text-rose-700 leading-relaxed">
                      El consultorio permanece cerrado los fines de semana (sábados y domingos).
                    </p>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200 text-xs text-[#0f4c5c] space-y-1 font-mono text-left">
                      <p className="font-bold text-[#0891b2] font-sans">📅 Horarios de Atención:</p>
                      <p>• Lunes, Miércoles y Viernes: <span className="font-bold">9.40hs a 16hs</span></p>
                      <p>• Martes y Jueves: <span className="font-bold">15hs a 20hs</span></p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 gap-2.5">
                  {dayHours.map((time) => {
                    const fullId = `${selectedDate}_${time}`;
                    const app = appointments[fullId];
                    
                    // Determine state properties
                    const isFree = !app || app.status === 'free';
                    const isMine = app?.patientDni === patient.dni;
                    const isTentative = tentativeSlot === fullId;
                    
                    let bgColor = 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900'; // Green: Free / Disponible
                    let statusText = 'Disponible';
                    
                    if (isTentative) {
                      bgColor = 'bg-[#e0f2fe] hover:bg-[#bae6fd] border-[#0891b2] text-[#0f4c5c] animate-pulse ring-2 ring-[#0891b2]/60 shadow-xs font-bold'; // Confirming
                      statusText = 'Confirmar Cita';
                    } else if (!isFree) {
                      if (isMine) {
                        bgColor = 'bg-[#0e7490] border-[#0f4c5c] text-white font-bold shadow-xs'; // Mine
                        statusText = `Mi Turno: ${app.treatmentReason || 'Reservado'}`;
                      } else {
                        bgColor = 'bg-rose-50 border-rose-200 text-rose-800 opacity-90 cursor-not-allowed'; // Red: Occupied
                        statusText = 'Ocupado';
                      }
                    }

                    return (
                      <button
                        id={`slot-${time}`}
                        key={time}
                        disabled={!isFree && !isMine}
                        onClick={() => handleSlotSelect(time, app?.status || 'free', isMine)}
                        className={`p-3 rounded-xl border flex flex-col justify-between items-start text-left transition-all h-20 relative overflow-hidden group ${
                          isFree || isMine ? 'cursor-pointer hover:scale-102 hover:shadow-2xs' : ''
                        } ${bgColor}`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-sans text-sm font-bold tracking-wide">
                            🕒 {time} hs
                          </span>
                          {isMine && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>

                        <span className="text-[11px] font-bold tracking-wide leading-tight truncate w-full">
                          {statusText}
                        </span>

                        {isFree && !isTentative && (
                          <span className="absolute bottom-1 right-2 text-[10px] opacity-0 group-hover:opacity-70 transition-all font-bold text-[#0e7490]">
                            Elegir ✎
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Color clarification legend */}
          <div className="border-t border-dashed border-[#bae6fd] pt-3 mt-auto">
            <p className="text-[10px] text-[#0891b2] font-bold uppercase tracking-widest mb-2 text-center font-sans">
              Significado de los Colores
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-[#0f4c5c]">
              <div className="flex items-center space-x-1.5 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-200">
                <span className="w-3.5 h-3.5 bg-emerald-400 border border-emerald-600/30 rounded-md shrink-0" />
                <span className="text-emerald-900">Libre</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#e0f2fe] px-2 py-1.5 rounded-lg border border-[#bae6fd]">
                <span className="w-3.5 h-3.5 bg-[#38bdf8] border border-[#0891b2]/30 rounded-md shrink-0" />
                <span className="text-[#0e7490]">Confirmar</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-rose-50 px-2 py-1.5 rounded-lg border border-rose-200">
                <span className="w-3.5 h-3.5 bg-rose-400 border border-rose-600/30 rounded-md shrink-0" />
                <span className="text-rose-900">Ocupado</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Professional Profile Tab with Lic. Yesica Gisel Camacho Info (Images 1, 2, 3)
        <div className="flex-1 flex flex-col justify-between h-full space-y-3 animate-fadeIn">
          
          <div className="border-b border-dashed border-[#bae6fd] pb-2 text-center">
            <h3 className="text-xs font-bold text-[#0891b2] tracking-widest uppercase leading-none font-sans">
              Profesional a Cargo
            </h3>
            <p className="text-xs font-serif italic text-[#0f4c5c] font-bold mt-1">
              Centro Integral Podológico
            </p>
          </div>

          {/* Practitioner Info & Contact Details (Images 1, 2, 3) */}
          <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 space-y-3 scrollbar-thin">
            
            {/* Main Podologist Card */}
            <div className="bg-white p-3.5 rounded-xl border-2 border-[#bae6fd] text-xs shadow-2xs space-y-2">
              <div className="flex items-start justify-between border-b border-[#e0f2fe] pb-2">
                <div>
                  <h4 className="font-bold text-[#0f4c5c] text-base">Lic. Yesica Gisel Camacho</h4>
                  <p className="text-[11px] text-[#0284c7] font-bold uppercase tracking-wider mt-0.5">
                    Doctorado • Título Universitario • Licenciada en Podología
                  </p>
                </div>
                <span className="bg-[#0284c7] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                  Universitaria
                </span>
              </div>

              <div className="bg-[#f0fdfa] p-2 rounded-lg border border-[#bae6fd] text-center italic text-[#0f4c5c] font-serif text-xs">
                ✨ Pies sanos es igual a pies felices ✨
              </div>

              {/* Direct Contact Links */}
              <div className="space-y-1.5 pt-1">
                <a
                  href="https://wa.me/5493874103008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg border border-emerald-200 w-full"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp: +54 9 387 410-3008 (387-4103008)</span>
                </a>

                <a
                  href="tel:03874103008"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0f4c5c] hover:text-[#0e7490] bg-[#e0f2fe]/60 p-2 rounded-lg border border-[#bae6fd] w-full"
                >
                  <Phone className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Llamar: 0387 15-410-3008</span>
                </a>

                <a
                  href="mailto:giselcamacho40@gmail.com"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0f4c5c] hover:text-[#0e7490] bg-white p-2 rounded-lg border border-[#bae6fd] w-full"
                >
                  <Mail className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Email: giselcamacho40@gmail.com</span>
                </a>

                <a
                  href="https://instagram.com/centrointegralpodologico"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-pink-700 hover:text-pink-800 bg-pink-50 p-2 rounded-lg border border-pink-200 w-full"
                >
                  <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>Instagram: @centrointegralpodologico</span>
                </a>
              </div>
            </div>

            {/* Schedule Info Box (Image 1) */}
            <div className="bg-[#e0f2fe]/60 p-3 rounded-xl border border-[#bae6fd] text-xs space-y-1.5">
              <p className="font-bold text-[#0f4c5c] flex items-center gap-1.5 text-xs">
                🕒 Horarios de Atención (Image 1)
              </p>
              <div className="space-y-1 font-mono text-[11px] text-[#0e7490]">
                <p className="flex justify-between bg-white/80 p-1.5 rounded border border-[#bae6fd]">
                  <span className="font-sans font-semibold text-[#0f4c5c]">Lunes, Miércoles y Viernes:</span>
                  <span className="font-bold text-[#0284c7]">9.40hs a 16hs</span>
                </p>
                <p className="flex justify-between bg-white/80 p-1.5 rounded border border-[#bae6fd]">
                  <span className="font-sans font-semibold text-[#0f4c5c]">Martes y Jueves:</span>
                  <span className="font-bold text-[#0284c7]">15hs a 20hs</span>
                </p>
              </div>
            </div>

            {/* Location (Image 3) */}
            <div className="bg-white p-3 rounded-xl border border-[#bae6fd] text-xs space-y-1 text-center">
              <p className="font-bold text-[#0f4c5c] flex items-center justify-center gap-1 text-xs">
                <MapPin className="w-4 h-4 text-[#0284c7]" /> Pasaje Avelino Figueroa 255, Salta, Argentina (4400)
              </p>
              <p className="text-[11px] text-[#0e7490]">Atención profesional solo por nuestro celular / turnos agendados.</p>
            </div>

          </div>

          <div className="border-t border-dashed border-[#bae6fd] pt-2 mt-auto text-center">
            <span className="text-[10px] text-[#0891b2] uppercase font-bold tracking-widest font-sans">
              ★ Consultorio Integral Podológico ★
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
