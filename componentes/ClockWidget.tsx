/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-[#f5f2e8] p-3.5 border-2 border-[#e5e0d0] rounded-xl flex flex-col items-start min-w-[80px] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center space-x-2 text-slate-700">
        <Clock className="w-5 h-5 text-[#5a5a40] animate-pulse" />
        <span className="font-sans text-2xl font-bold tracking-wider text-[#2c2c1c]">
          {formatTime(time)}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-xs text-[#8a8a6a] capitalize font-medium">
        <Calendar className="w-4 h-4 text-[#8a8a6a]" />
        <span>{formatDate(time)}</span>
      </div>
    </div>
  );
}
