/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Patient } from '../types';
import { User, ShieldAlert, Key, ClipboardList, Phone, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { PodologiaLogo } from './PodologiaLogo';

interface LoginViewProps {
  onLoginPatient: (dni: string) => void;
  onRegisterPatient: (patient: Patient) => void;
  onLoginPodologist: (user: string, pass: string) => void;
  patients: Record<string, Patient>;
}

export default function LoginView({
  onLoginPatient,
  onRegisterPatient,
  onLoginPodologist,
  patients,
}: LoginViewProps) {
  // Tabs: 'patient_login' | 'patient_register' | 'podologist'
  const [activeTab, setActiveTab] = useState<'patient_login' | 'patient_register' | 'podologist'>('patient_login');
  
  // Patient Login Form State
  const [patientDni, setPatientDni] = useState('');
  const [loginError, setLoginError] = useState('');

  // Patient Register Form State
  const [regDni, setRegDni] = useState('');
  const [regName, setRegName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Podologist Form State
  const [pUser, setPUser] = useState('');
  const [pPass, setPPass] = useState('');
  const [pError, setPError] = useState('');

  const handlePatientLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const cleanDni = patientDni.trim();
    if (!cleanDni) {
      setLoginError('Por favor ingrese su número de DNI.');
      return;
    }

    if (patients[cleanDni]) {
      onLoginPatient(cleanDni);
    } else {
      setLoginError('El DNI ingresado no está registrado. ¿Es la primera vez que viene? Regístrese abajo.');
    }
  };

  const handlePatientRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    const cleanDni = regDni.trim();
    const cleanName = regName.trim();
    const cleanLastName = regLastName.trim();
    const cleanPhone = regPhone.trim();

    if (!cleanDni || !cleanName || !cleanLastName || !cleanPhone) {
      setRegError('Todos los campos con (*) son obligatorios.');
      return;
    }

    if (patients[cleanDni]) {
      setRegError('Este DNI ya se encuentra registrado. Ingrese con DNI en la pestaña anterior.');
      return;
    }

    const newPatient: Patient = {
      dni: cleanDni,
      nombre: cleanName,
      apellido: cleanLastName,
      telefono: cleanPhone,
      email: regEmail.trim() || undefined,
    };

    onRegisterPatient(newPatient);
    setRegSuccess('¡Usuario creado correctamente! Ahora puede iniciar sesión.');
    
    // Clear registration form and switch to login with prefilled DNI
    setPatientDni(cleanDni);
    setRegDni('');
    setRegName('');
    setRegLastName('');
    setRegPhone('');
    setRegEmail('');
    setTimeout(() => {
      setActiveTab('patient_login');
    }, 1500);
  };

  const handlePodologistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPError('');

    if (!pUser || !pPass) {
      setPError('Ingrese usuario y contraseña.');
      return;
    }

    // Try login
    onLoginPodologist(pUser, pPass);
  };

  return (
    <div className="w-full max-w-md mx-auto py-3 sm:py-5">
      
      {/* Top Banner / Logo displaying Image 2 logo with Image 1 palette */}
      <div className="text-center mb-5">
        <div className="inline-block p-2 bg-gradient-to-br from-[#e0f2fe] to-[#f0fdfa] rounded-2xl border border-[#bae6fd] shadow-sm mb-3">
          <PodologiaLogo size="lg" variant="card" showSubtitle={true} />
        </div>
        <p className="text-xs text-[#0e7490] font-bold tracking-widest uppercase flex items-center justify-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#0891b2]" />
          Pasaje Avelino Figueroa 258
        </p>
      </div>

      {/* Main Authentication Container */}
      <div className="bg-white rounded-2xl border-2 border-[#bae6fd] shadow-lg overflow-hidden">
        
        {/* Acceso Podóloga Toggle (UPPERMOST selector - "arriba, antes de pedir DNI") */}
        <div className="bg-[#e0f2fe]/60 px-4 py-2.5 border-b border-[#bae6fd] flex justify-between items-center text-xs">
          <span className="text-[#0e7490] font-bold tracking-widest uppercase font-sans">
            Área Técnica
          </span>
          <button
            id="login-tab-podologa"
            onClick={() => {
              setActiveTab('podologist');
              setPError('');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'podologist'
                ? 'bg-[#0e7490] text-white shadow-xs'
                : 'text-[#0e7490] hover:text-[#0f4c5c] hover:bg-white/60'
            }`}
          >
            🔑 Ingresar como Podóloga
          </button>
        </div>

        {/* Client Access Tabs */}
        <div className="flex border-b border-[#bae6fd] bg-[#f0fdfa]/60">
          <button
            id="login-tab-patient"
            onClick={() => {
              setActiveTab('patient_login');
              setLoginError('');
            }}
            className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'patient_login'
                ? 'border-[#0891b2] text-[#0e7490] bg-white'
                : 'border-transparent text-[#64748b] hover:text-[#0e7490] hover:bg-white/40'
            }`}
          >
            Entrar con DNI
          </button>
          <button
            id="register-tab-patient"
            onClick={() => {
              setActiveTab('patient_register');
              setRegError('');
              setRegSuccess('');
            }}
            className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'patient_register'
                ? 'border-[#0891b2] text-[#0e7490] bg-white'
                : 'border-transparent text-[#64748b] hover:text-[#0e7490] hover:bg-white/40'
            }`}
          >
            Nuevo Paciente
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 bg-white">
          
          {/* 1. PATIENT LOGIN FORM */}
          {activeTab === 'patient_login' && (
            <form onSubmit={handlePatientLoginSubmit} className="space-y-4">
              <div className="text-center pb-1">
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Ingresa tu número de DNI para acceder a la libreta de turnos del Centro Podológico.
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="dni-input" className="block text-xs font-bold text-[#0e7490] uppercase tracking-wide">
                  Número de DNI / Documento *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0891b2]">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <input
                    id="dni-input"
                    type="number"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    required
                    placeholder="Ej: 12345678"
                    value={patientDni}
                    onChange={(e) => setPatientDni(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[#bae6fd] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] text-base font-medium shadow-2xs"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-100/70 border border-red-300 rounded-xl flex items-start space-x-2 text-xs text-red-800 font-medium">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                id="btn-login-patient"
                type="submit"
                className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 text-base cursor-pointer border border-[#0284c7] transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Siguiente (Ver Agenda)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Friendly Help */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium italic">
                  Escribe los números de tu documento sin puntos ni espacios y presiona el botón azul para ingresar.
                </p>
              </div>
            </form>
          )}

          {/* 2. PATIENT REGISTER FORM */}
          {activeTab === 'patient_register' && (
            <form onSubmit={handlePatientRegisterSubmit} className="space-y-3.5">
              <div className="text-center pb-1">
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Completa tus datos una sola vez para agendar turnos y consultar tu ficha.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="reg-name" className="block text-[11px] font-bold text-[#0e7490] uppercase">
                    Nombre *
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="Ej: Yésica"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="block w-full px-3 py-2 border border-[#bae6fd] rounded-xl focus:ring-2 focus:ring-[#0891b2] text-sm shadow-2xs"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="reg-lastname" className="block text-[11px] font-bold text-[#0e7490] uppercase">
                    Apellido *
                  </label>
                  <input
                    id="reg-lastname"
                    type="text"
                    required
                    placeholder="Ej: Camacho"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="block w-full px-3 py-2 border border-[#bae6fd] rounded-xl focus:ring-2 focus:ring-[#0891b2] text-sm shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-dni" className="block text-[11px] font-bold text-[#0e7490] uppercase">
                  DNI (Documento Nacional de Identidad) *
                </label>
                <input
                  id="reg-dni"
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                  placeholder="Ej: 12345678"
                  value={regDni}
                  onChange={(e) => setRegDni(e.target.value)}
                  className="block w-full px-3 py-2 border border-[#bae6fd] rounded-xl focus:ring-2 focus:ring-[#0891b2] text-sm shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-phone" className="block text-[11px] font-bold text-[#0e7490] uppercase">
                  Teléfono de Contacto *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0891b2]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    placeholder="Ej: 387 410 3006"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-[#bae6fd] rounded-xl focus:ring-2 focus:ring-[#0891b2] text-sm shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-email" className="block text-[11px] font-bold text-[#0e7490] uppercase">
                  Correo Electrónico <span className="text-slate-400 font-normal">(Opcional)</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="Ej: contacto@podologia.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="block w-full px-3 py-2 border border-[#bae6fd] rounded-xl focus:ring-2 focus:ring-[#0891b2] text-sm shadow-2xs"
                />
              </div>

              {regError && (
                <div className="p-2.5 bg-red-100/70 border border-red-300 rounded-xl text-xs text-red-800 font-medium">
                  {regError}
                </div>
              )}

              {regSuccess && (
                <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-medium">
                  {regSuccess}
                </div>
              )}

              <button
                id="btn-register-patient"
                type="submit"
                className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all text-sm cursor-pointer border border-[#0284c7] transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Crear Mi Usuario & Guardar
              </button>
            </form>
          )}

          {/* 3. PODOLOGIST LOGIN FORM */}
          {activeTab === 'podologist' && (
            <form onSubmit={handlePodologistSubmit} className="space-y-4">
              <div className="text-center bg-[#e0f2fe]/50 p-3 rounded-xl border border-[#bae6fd]">
                <p className="text-xs text-[#0e7490] font-bold">
                  🔐 Ingreso al Panel Profesional para las Podólogas:
                </p>
                <p className="text-xs font-mono text-slate-800 mt-1 font-semibold">
                  Usuario: <span className="bg-white px-1.5 py-0.5 rounded border border-[#bae6fd]">podologa</span> • Clave: <span className="bg-white px-1.5 py-0.5 rounded border border-[#bae6fd]">123</span>
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="p-user" className="block text-xs font-bold text-[#0e7490] uppercase">
                  Usuario Profesional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0891b2]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="p-user"
                    type="text"
                    required
                    placeholder="podologa"
                    value={pUser}
                    onChange={(e) => setPUser(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-[#bae6fd] rounded-xl focus:ring-2 focus:ring-[#0891b2] text-sm shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="p-pass" className="block text-xs font-bold text-[#0e7490] uppercase">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0891b2]">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    id="p-pass"
                    type="password"
                    required
                    placeholder="•••••"
                    value={pPass}
                    onChange={(e) => setPPass(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-[#bae6fd] rounded-xl focus:ring-2 focus:ring-[#0891b2] text-sm shadow-2xs"
                  />
                </div>
              </div>

              {pError && (
                <div className="p-2.5 bg-red-100/70 border border-red-300 rounded-xl text-xs text-red-800 font-medium">
                  {pError}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  id="btn-login-podologa-submit"
                  type="submit"
                  className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all text-sm cursor-pointer border border-[#0284c7] transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Ingresar a Panel Profesional
                </button>
                <button
                  id="btn-login-cancel"
                  type="button"
                  onClick={() => setActiveTab('patient_login')}
                  className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-medium text-sm transition-all cursor-pointer"
                >
                  Volver
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
