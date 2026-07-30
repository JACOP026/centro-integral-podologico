/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, HelpCircle, Phone, MapPin, Calendar, Sparkles } from 'lucide-react';
import { PodologiaLogo } from './PodologiaLogo';

interface NotebookBackgroundProps {
  childrenLeft: React.ReactNode;
  childrenRight: React.ReactNode;
  activeMobilePage: 'left' | 'right';
  setActiveMobilePage: (page: 'left' | 'right') => void;
}

export default function NotebookBackground({
  childrenLeft,
  childrenRight,
  activeMobilePage,
  setActiveMobilePage,
}: NotebookBackgroundProps) {
  // Generate binder rings
  const ringsCount = 8;
  const rings = Array.from({ length: ringsCount });

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-[#f8fafc] via-[#f0f9ff] to-[#e0f2fe] p-3 sm:p-6 lg:p-8 flex flex-col items-center justify-start font-sans text-[#0f4c5c] relative overflow-x-hidden">
      {/* Decorative Ocean Teal & Electric Blue ambient gradients */}
      <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-linear-to-bl from-[#0284c7]/15 via-[#0891b2]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[550px] h-[550px] bg-linear-to-tr from-[#0f4c5c]/15 via-[#00a8cc]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Wrapper */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 relative z-10">
        
        {/* ================= HERO SECTION (TOP CENTERED LOGO & IDENTITY) ================= */}
        <header className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#bae6fd] text-center relative overflow-hidden flex flex-col items-center justify-center">
          {/* Top electric blue bar accent */}
          <div className="absolute top-0 left-0 w-full h-2.5 bg-linear-to-r from-[#0f4c5c] via-[#0284c7] to-[#06b6d4]" />

          {/* Centered Logo from the uploaded image */}
          <div className="transform hover:scale-102 transition-transform duration-300 cursor-pointer my-1">
            <PodologiaLogo size="xl" variant="card" showSubtitle={true} />
          </div>

          {/* Subtitle / Tagline in Deep Cyan */}
          <h2 className="text-sm sm:text-base font-medium text-[#0f4c5c] mt-2 max-w-2xl mx-auto leading-relaxed">
            <span className="font-serif italic font-bold text-[#0284c7]">✨ Pies sanos es igual a pies felices ✨</span> • <span className="font-bold text-[#0f4c5c]">Lic. Yesica Gisel Camacho</span>
          </h2>
          <p className="text-xs text-[#0e7490] font-semibold mt-0.5">
            Doctorado • Título Universitario • Licenciada en Podología
          </p>

          {/* Quick Info Badge Bar */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-[#0e7490]">
            <span className="bg-[#e0f2fe] border border-[#bae6fd] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
              Pje. Avelino Figueroa 255, Salta
            </span>
            <span className="bg-[#e0f2fe] border border-[#bae6fd] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
              Lun, Mié, Vie: 9:40-16:00 | Mar, Jue: 15:00-20:00
            </span>
            <span className="bg-[#0284c7] text-white px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              Lic. Yesica Gisel Camacho
            </span>
          </div>
        </header>

        {/* Outer Desk Binder Wrapper */}
        <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-[#bae6fd] overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8 relative">
          
          {/* Mobile Page Switcher */}
          <div className="flex lg:hidden justify-center items-center mb-4 bg-[#e0f2fe]/80 p-1.5 rounded-full max-w-sm mx-auto shadow-inner border border-[#bae6fd]">
            <button
              id="mobile-btn-info"
              onClick={() => setActiveMobilePage('left')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMobilePage === 'left'
                  ? 'bg-[#0284c7] text-white shadow-md scale-102 font-bold'
                  : 'text-[#0e7490] hover:text-[#0f4c5c]'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-white" />
              Información & Ayuda
            </button>
            <button
              id="mobile-btn-agenda"
              onClick={() => setActiveMobilePage('right')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMobilePage === 'right'
                  ? 'bg-[#0284c7] text-white shadow-md scale-102 font-bold'
                  : 'text-[#0e7490] hover:text-[#0f4c5c]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-white" />
              Ver Libreta (Turnos)
            </button>
          </div>

          {/* Notebook container: Deep Ocean Teal hard cover */}
          <div className="relative bg-linear-to-br from-[#0f4c5c] via-[#0e7490] to-[#155e75] rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl border-2 border-[#0284c7]/40 overflow-hidden select-none">
            {/* Cover decorative stitch pattern */}
            <div className="absolute inset-1 rounded-xl border border-dashed border-[#e0f2fe]/30 pointer-events-none" />
            
            <div className="relative flex flex-col lg:flex-row min-h-[640px] md:min-h-[680px] lg:min-h-[720px] rounded-xl overflow-hidden gap-1 lg:gap-0">
              
              {/* LEFT PAGE */}
              <div
                className={`flex-1 bg-[#ffffff] shadow-[inset_-10px_0_20px_rgba(14,116,144,0.05)] p-4 sm:p-6 md:p-8 flex flex-col justify-between relative transition-all duration-500 border-r border-[#e0f2fe] ${
                  activeMobilePage === 'left' ? 'block' : 'hidden lg:flex'
                }`}
              >
                {/* Paper background tint */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0284c7]/2 to-[#0284c7]/5 pointer-events-none opacity-60" />
                {/* Notebook Margins */}
                <div className="absolute left-10 md:left-14 top-0 bottom-0 w-[1.5px] bg-[#bae6fd]/60 pointer-events-none" />
                
                {/* Actual Page Content */}
                <div className="relative z-10 pl-4 sm:pl-8 flex flex-col h-full justify-between">
                  {childrenLeft}
                </div>
              </div>

              {/* THE CENTRAL RING-BINDER SPINE */}
              <div className="hidden lg:flex absolute left-1/2 top-0 bottom-0 w-8 -ml-4 z-20 flex-col justify-around py-8 pointer-events-none">
                {rings.map((_, i) => (
                  <div key={i} className="relative w-full h-8 flex items-center justify-center">
                    {/* Metal wire ring rendering with cyan metallic sheen */}
                    <div className="w-12 h-6 border-4 border-slate-300 rounded-full bg-linear-to-r from-slate-200 via-cyan-100 to-slate-400 shadow-lg transform rotate-[-12deg] z-20 relative flex items-center justify-center">
                      <div className="absolute top-0.5 left-1/3 w-3 h-1 bg-white rounded-full opacity-80 blur-[0.5px]" />
                    </div>
                    {/* Paper punch holes */}
                    <div className="absolute -left-3 w-3.5 h-3.5 bg-slate-900 rounded-full shadow-inner z-10 opacity-90 border border-[#0284c7]/40" />
                    <div className="absolute -right-3 w-3.5 h-3.5 bg-slate-900 rounded-full shadow-inner z-10 opacity-90 border border-[#0284c7]/40" />
                  </div>
                ))}
              </div>

              {/* RIGHT PAGE */}
              <div
                className={`flex-1 bg-[#ffffff] shadow-[inset_10px_0_20px_rgba(14,116,144,0.05)] p-4 sm:p-6 md:p-8 flex flex-col transition-all duration-500 relative ${
                  activeMobilePage === 'right' ? 'block' : 'hidden lg:flex'
                }`}
              >
                {/* Paper background tint */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0284c7]/2 to-[#0284c7]/5 pointer-events-none opacity-60" />
                {/* Notebook Margins */}
                <div className="absolute right-10 md:right-14 top-0 bottom-0 w-[1.5px] bg-[#bae6fd]/60 pointer-events-none" />
                
                {/* Actual Page Content */}
                <div className="relative z-10 pr-4 sm:pr-8 flex flex-col h-full justify-between">
                  {childrenRight}
                </div>
              </div>

            </div>
          </div>

          {/* Footer signature */}
          <div className="mt-4 text-center text-xs text-[#0e7490] font-bold font-sans tracking-wide">
            Centro Integral Podológico • Lic. Yesica Gisel Camacho • Pje. Avelino Figueroa 255 • WA: 387-4103008
          </div>

        </div>
      </div>
    </div>
  );
}

