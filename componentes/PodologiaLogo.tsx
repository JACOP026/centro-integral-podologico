/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PodologiaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'card' | 'building' | 'header';
}

/**
 * PodologiaLogo: Recreates the exact logo from Image 2
 * (Foot silhouette forming the letter "P" in "Podología" / "Podológico" with 5 floating toes)
 * rendered using the Ocean Teal / Cyan color palette from Image 1.
 */
export function PodologiaLogo({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'card',
}: PodologiaLogoProps) {
  // Scaling factors based on size
  const sizes = {
    sm: { footHeight: 40, textSize: 'text-xl', subTextSize: 'text-[9px]' },
    md: { footHeight: 56, textSize: 'text-2xl sm:text-3xl', subTextSize: 'text-[10px] sm:text-xs' },
    lg: { footHeight: 72, textSize: 'text-3xl sm:text-4xl', subTextSize: 'text-xs sm:text-sm' },
    xl: { footHeight: 96, textSize: 'text-4xl sm:text-5xl', subTextSize: 'text-sm sm:text-base' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Top Header Label: CENTRO INTEGRAL (as seen in Card Image 1) */}
      {showSubtitle && variant !== 'building' && (
        <span className={`font-sans font-extrabold uppercase tracking-[0.2em] text-[#0891b2] mb-0.5 ${currentSize.subTextSize}`}>
          Centro Integral
        </span>
      )}

      {/* Main Logo Mark: Foot "P" + "odología" / "odológico" */}
      <div className="flex items-center justify-center gap-0.5">
        {/* The Foot "P" Vector SVG Icon */}
        <svg
          width={currentSize.footHeight * 0.75}
          height={currentSize.footHeight}
          viewBox="0 0 100 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs"
        >
          <defs>
            {/* Color Palette Gradient from Image 1: Deep Ocean Teal to Bright Cyan Blue */}
            <linearGradient id="footTealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="toeCyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Toes (5 distinct rounded toe pads floating above the P loop in an arch) */}
          {/* Toe 1 - Big Toe (Leftmost/Inner) */}
          <circle cx="22" cy="16" r="10.5" fill="url(#toeCyanGradient)" />
          {/* Toe 2 */}
          <circle cx="43" cy="11" r="8.5" fill="url(#toeCyanGradient)" />
          {/* Toe 3 */}
          <circle cx="61" cy="14" r="7.5" fill="url(#toeCyanGradient)" />
          {/* Toe 4 */}
          <circle cx="76" cy="22" r="6.5" fill="url(#toeCyanGradient)" />
          {/* Toe 5 - Little Toe */}
          <circle cx="88" cy="33" r="5.5" fill="url(#toeCyanGradient)" />

          {/* Foot Sole & Arch forming the letter "P" */}
          {/* 
            - Left heel stem going down to y=125
            - Outer lateral curve of foot
            - Loop of the P swooping out right and returning to mid-stem
          */}
          <path
            d="M 28 40 
               C 15 42, 6 56, 8 75 
               C 10 92, 20 105, 26 125 
               C 34 125, 42 118, 40 104 
               C 38 92, 32 80, 42 74 
               C 56 66, 88 78, 92 56 
               C 96 34, 62 28, 40 33 
               C 33 34, 30 37, 28 40 Z
               M 38 48 
               C 48 44, 76 46, 74 58 
               C 72 68, 48 60, 38 58 Z"
            fill="url(#footTealGradient)"
          />
        </svg>

        {/* Remaining letters of the word: "odología" or "odológico" */}
        <span className={`font-serif font-bold text-[#0f4c5c] tracking-tight ml-[-2px] ${currentSize.textSize}`}>
          {variant === 'card' ? 'odológico' : 'odología'}
        </span>
      </div>

      {showSubtitle && variant === 'building' && (
        <span className={`font-sans font-bold text-[#0891b2] tracking-wider uppercase mt-1 ${currentSize.subTextSize}`}>
          Centro Integral Podológico
        </span>
      )}
    </div>
  );
}
