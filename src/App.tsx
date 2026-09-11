import React, { useState, useMemo } from 'react';
import { days, timeSlots } from './data';
import { ScheduleState } from './types';
import { Clock, CalendarDays, Calculator, AlertCircle, Settings2, Info, X } from 'lucide-react';

export default function App() {
  const [schedule, setSchedule] = useState<ScheduleState>({});
  const [workedHours, setWorkedHours] = useState<number>(24);
  const [baseHours, setBaseHours] = useState<number>(24);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  const toggleCell = (dayId: string, slotId: number) => {
    const key = `${dayId}-${slotId}`;
    setSchedule(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const dailyCalculations = useMemo(() => {
    return days.map(day => {
      const selectedSlots = timeSlots.filter(slot => schedule[`${day.id}-${slot.id}`]);
      
      if (selectedSlots.length === 0) {
        return { day, durationMin: 0, startText: '', endText: '' };
      }

      // Slots are already ordered 1-8
      const firstSlot = selectedSlots[0];
      const lastSlot = selectedSlots[selectedSlots.length - 1];

      const durationMin = lastSlot.endMin - firstSlot.startMin;
      const isDailyExceeded = durationMin > 360; // 6 hours limit

      return {
        day,
        durationMin,
        startText: firstSlot.start,
        endText: lastSlot.end,
        isDailyExceeded,
      };
    });
  }, [schedule]);

  const totalWeeklyMinutes = useMemo(() => {
    return dailyCalculations.reduce((sum, current) => sum + current.durationMin, 0);
  }, [dailyCalculations]);

  const maxWeeklyMinutes = useMemo(() => {
    const safeBase = baseHours > 0 ? baseHours : 1;
    return (workedHours / safeBase) * 30 * 60;
  }, [workedHours, baseHours]);

  const isWeeklyExceeded = totalWeeklyMinutes > maxWeeklyMinutes;

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return '0 λεπτά';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    
    if (h === 0) return `${m} λεπτά`;
    if (m === 0) return `${h} ${h === 1 ? 'ώρα' : 'ώρες'}`;
    return `${h} ${h === 1 ? 'ώρα' : 'ώρες'} και ${m} λεπτά`;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-2xl">
              <CalendarDays className="w-8 h-8 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Ωρολόγιο Πρόγραμμα</h1>
              <p className="text-slate-500">Υπολογισμός ωρών παραμονής εκπαιδευτικού</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="p-2.5 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors shadow-sm flex-shrink-0"
            title="Πληροφορίες (About)"
          >
            <Info className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Timetable Grid */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr>
                    <th className="bg-slate-50 border-b border-r border-slate-100 p-4 text-sm font-medium text-slate-500 sticky left-0 z-10 min-w-[140px]">
                      Διδακτική Ώρα
                    </th>
                    {days.map(day => (
                      <th key={day.id} className="bg-slate-50 border-b border-r last:border-r-0 border-slate-100 p-4 text-center text-sm font-medium text-slate-700 w-1/5">
                        {day.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, index) => (
                    <tr key={slot.id} className="group">
                      <td className="bg-slate-50 border-b border-r border-slate-100 p-3 text-xs md:text-sm text-slate-600 font-medium sticky left-0 z-10 group-hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-900">{slot.id}η ώρα</span>
                          <span className="text-slate-400">{slot.start} - {slot.end}</span>
                        </div>
                      </td>
                      {days.map(day => {
                        const isSelected = schedule[`${day.id}-${slot.id}`] || false;
                        return (
                          <td 
                            key={`${day.id}-${slot.id}`}
                            onClick={() => toggleCell(day.id, slot.id)}
                            className={`
                              border-b border-r border-slate-100 last:border-r-0 p-2 cursor-pointer transition-all duration-200
                              ${index === timeSlots.length - 1 ? 'border-b-0' : ''}
                            `}
                          >
                            <div 
                              className={`
                                h-14 md:h-16 w-full rounded-xl flex items-center justify-center transition-all duration-200 select-none
                                ${isSelected 
                                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-500 ring-offset-2' 
                                  : 'bg-slate-50/50 hover:bg-slate-100 text-transparent hover:text-slate-300'
                                }
                              `}
                            >
                              {isSelected ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="text-xl">+</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 p-4 text-sm text-slate-500 text-center border-t border-slate-100">
              Κάντε κλικ στα κελιά για να προσθέσετε ή να αφαιρέσετε διδακτικές ώρες.
            </div>
          </div>

          {/* Sidebar / Results */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            
            {/* Settings Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-100 p-2.5 rounded-xl">
                  <Settings2 className="w-5 h-5 text-blue-700" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Παράμετροι Ωραρίου</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Διδακτικό Ωράριο (Κλάσμα)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      min="1"
                      value={workedHours} 
                      onChange={(e) => setWorkedHours(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 text-center font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <span className="text-slate-400 font-medium text-lg">/</span>
                    <input 
                      type="number" 
                      min="1"
                      value={baseHours} 
                      onChange={(e) => setBaseHours(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 text-center font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                  <span className="block font-medium mb-0.5">Μέγιστο Εβδομαδιαίο Όριο:</span>
                  <span>{formatDuration(maxWeeklyMinutes)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 p-2.5 rounded-xl">
                  <Calculator className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Αναλυτικά</h2>
              </div>
              
              <div className="space-y-4">
                {dailyCalculations.map((calc) => (
                  <div key={calc.day.id} className="flex flex-col gap-1.5 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{calc.day.name}</span>
                      <span className={`font-semibold text-sm ${calc.durationMin > 0 ? (calc.isDailyExceeded ? 'text-rose-600' : 'text-indigo-600') : 'text-slate-400'}`}>
                        {formatDuration(calc.durationMin)}
                      </span>
                    </div>
                    {calc.durationMin > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Παραμονή: {calc.startText} έως {calc.endText}</span>
                      </div>
                    )}
                    {calc.isDailyExceeded && (
                      <div className="flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-md mt-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Υπέρβαση ημερήσιου ορίου 6 ωρών</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-3xl shadow-lg p-6 text-white relative overflow-hidden ${isWeeklyExceeded ? 'bg-rose-600 shadow-rose-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
              <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full opacity-50 blur-2xl ${isWeeklyExceeded ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
              <h3 className={`text-sm font-medium mb-1 relative z-10 ${isWeeklyExceeded ? 'text-rose-100' : 'text-indigo-100'}`}>Σύνολο Εβδομάδας</h3>
              <div className="text-2xl font-bold tracking-tight relative z-10 mb-2">
                {formatDuration(totalWeeklyMinutes)}
              </div>
              {isWeeklyExceeded && (
                <div className="relative z-10 flex items-start gap-2 text-sm bg-black/20 p-3 rounded-xl mt-3 backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-100" />
                  <span className="text-rose-50">Υπέρβαση μέγιστου επιτρεπτού ορίου ({formatDuration(maxWeeklyMinutes)})</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Κλείσιμο"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8 text-center space-y-4">
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                <CalendarDays className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Υπολογισμός Ωραρίου Εκπαιδευτικού</h2>
              <div className="space-y-2 text-sm text-slate-500 pt-2">
                <p className="font-medium bg-slate-100 inline-block px-3 py-1 rounded-full text-slate-600">Έκδοση 1.0.0</p>
                <div className="w-12 h-px bg-slate-200 mx-auto my-5"></div>
                <p className="text-slate-500 uppercase tracking-wider text-xs font-semibold">Program Architect</p>
                <p className="font-bold text-slate-800 text-lg">George Petrakis</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
