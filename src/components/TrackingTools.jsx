import { useState, useEffect } from 'react';

// Static defaults and helpers defined outside component to maintain purity
const tenDaysAgoDefault = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const calculateCycleDay = (dateStr) => {
  if (!dateStr) return 1;
  // Parse date using local time parts to prevent UTC offset glitches
  const [year, month, day] = dateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 1;
  return (diffDays % 28) + 1;
};

const getPhaseAndColor = (day) => {
  if (day >= 1 && day <= 5) {
    return { phase: 'Menstrual', color: 'bg-pink-600 border-pink-500 shadow-pink-200/50' };
  } else if (day >= 6 && day <= 13) {
    return { phase: 'Follicular', color: 'bg-purple-600 border-purple-500 shadow-purple-200/50' };
  } else if (day >= 14 && day <= 17) {
    return { phase: 'Ovulatory', color: 'bg-emerald-600 border-emerald-500 shadow-emerald-200/50' };
  } else {
    return { phase: 'Luteal', color: 'bg-amber-600 border-amber-500 shadow-amber-200/50' };
  }
};

const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getNextPeriodStartDate = (lastDateStr) => {
  if (!lastDateStr) return null;
  const [year, month, day] = lastDateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 28);
  return date;
};

const isPredictedPeriodDay = (dateToCheck, lastDateStr) => {
  const start = getNextPeriodStartDate(lastDateStr);
  if (!start) return false;
  
  const end = new Date(start);
  end.setDate(start.getDate() + 4);
  
  const checkTime = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate()).getTime();
  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  
  return checkTime >= startTime && checkTime <= endTime;
};

const formatPredictionWindow = (lastDateStr) => {
  const start = getNextPeriodStartDate(lastDateStr);
  if (!start) return "";
  const end = new Date(start);
  end.setDate(start.getDate() + 4);
  
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `Predicted Next Period: ${startStr} – ${endStr}`;
};

const getOvulationDate = (lastDateStr) => {
  const nextPeriod = getNextPeriodStartDate(lastDateStr);
  if (!nextPeriod) return null;
  const ovulation = new Date(nextPeriod);
  ovulation.setDate(nextPeriod.getDate() - 14);
  return ovulation;
};

const isOvulationDay = (dateToCheck, lastDateStr) => {
  const ovulation = getOvulationDate(lastDateStr);
  if (!ovulation) return false;
  return dateToCheck.getFullYear() === ovulation.getFullYear() &&
         dateToCheck.getMonth() === ovulation.getMonth() &&
         dateToCheck.getDate() === ovulation.getDate();
};

const isFertileDay = (dateToCheck, lastDateStr) => {
  const ovulation = getOvulationDate(lastDateStr);
  if (!ovulation) return false;
  const startFertile = new Date(ovulation);
  startFertile.setDate(ovulation.getDate() - 5);
  
  const checkTime = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate()).getTime();
  const startTime = new Date(startFertile.getFullYear(), startFertile.getMonth(), startFertile.getDate()).getTime();
  const endTime = new Date(ovulation.getFullYear(), ovulation.getMonth(), ovulation.getDate()).getTime();
  
  return checkTime >= startTime && checkTime <= endTime;
};

const formatFertilityWindow = (lastDateStr) => {
  const ovulation = getOvulationDate(lastDateStr);
  if (!ovulation) return "";
  const startFertile = new Date(ovulation);
  startFertile.setDate(ovulation.getDate() - 5);
  
  const startStr = startFertile.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = ovulation.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const peakStr = ovulation.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return `Estimated Fertile Window: ${startStr} – ${endStr} | Peak Ovulation: ${peakStr}`;
};

export default function TrackingTools() {
  const [cycleLogs, setCycleLogs] = useState(() => {
    const saved = localStorage.getItem('femcare_cycle_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading cycle logs from localStorage", e);
      }
    }
    return {
      '2026-06-03': { flow: 'light', symptoms: ['Fatigue'] },
      '2026-06-04': { flow: 'medium', symptoms: ['Cramps'] },
      '2026-06-05': { flow: 'heavy', symptoms: ['Cramps', 'Fatigue'] },
      '2026-06-06': { flow: 'medium', symptoms: ['Fatigue'] },
      '2026-06-07': { flow: 'light', symptoms: [] },
      '2026-07-20': { flow: 'light', symptoms: ['Fatigue'] },
      '2026-07-21': { flow: 'medium', symptoms: ['Cramps'] },
      '2026-07-22': { flow: 'heavy', symptoms: ['Cramps', 'Fatigue'] }
    };
  });

  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 6, 1)); // July 2026
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 6, 25)); // July 25, 2026
  
  const [waterGlasses, setWaterGlasses] = useState([true, true, true, false, false, false, false, false]); // 3/8 filled
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState(6);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cycle Phase Visualizer State and Logic
  const [lastPeriodDate, setLastPeriodDate] = useState(tenDaysAgoDefault);
  const [currentDayOfCycle, setCurrentDayOfCycle] = useState(() => calculateCycleDay(tenDaysAgoDefault));
  const [tempInputDate, setTempInputDate] = useState(tenDaysAgoDefault);

  const { phase: currentPhase, color: badgeColorClass } = getPhaseAndColor(currentDayOfCycle);
  const progressPercent = ((currentDayOfCycle - 0.5) / 28) * 100;

  useEffect(() => {
    localStorage.setItem('femcare_cycle_logs', JSON.stringify(cycleLogs));
  }, [cycleLogs]);

  const handleUpdateCycle = () => {
    setLastPeriodDate(tempInputDate);
    setCurrentDayOfCycle(calculateCycleDay(tempInputDate));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleDayClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const logFlow = (flowLevel) => {
    const dateKey = formatDateKey(selectedDate);
    const currentLog = cycleLogs[dateKey] || { flow: 'none', symptoms: [] };
    setCycleLogs({
      ...cycleLogs,
      [dateKey]: { ...currentLog, flow: flowLevel }
    });
  };

  const toggleSymptom = (symptom) => {
    const dateKey = formatDateKey(selectedDate);
    const currentLog = cycleLogs[dateKey] || { flow: 'none', symptoms: [] };
    const hasSymptom = currentLog.symptoms.includes(symptom);
    const updatedSymptoms = hasSymptom
      ? currentLog.symptoms.filter(s => s !== symptom)
      : [...currentLog.symptoms, symptom];

    setCycleLogs({
      ...cycleLogs,
      [dateKey]: { ...currentLog, symptoms: updatedSymptoms }
    });
  };

  const handleWaterClick = (index) => {
    const newGlasses = [...waterGlasses];
    newGlasses[index] = !newGlasses[index];
    setWaterGlasses(newGlasses);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = () => {
    const exportPayload = {
      timestamp: new Date().toISOString(),
      cycleLogs,
      waterGlasses,
      mood,
      energy,
      lastPeriodDate,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'femcare_wellness_backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFlowColor = (flow) => {
    switch (flow) {
      case 'heavy': return 'bg-rose-500 text-white font-bold ring-2 ring-rose-300';
      case 'medium': return 'bg-pink-500 text-white font-medium ring-2 ring-pink-300';
      case 'light': return 'bg-pink-300 text-slate-900 ring-2 ring-pink-100';
      default: return '';
    }
  };

  const getMoodEmoji = (val) => {
    if (val <= 2) return '😰 Anxious';
    if (val <= 4) return '😐 Fatigue';
    if (val <= 6) return '🙂 Calm';
    if (val <= 8) return '😊 Happy';
    return '✨ Radiant';
  };

  const getEnergyEmoji = (val) => {
    if (val <= 2) return '😴 Exhausted';
    if (val <= 4) return '🥱 Low';
    if (val <= 6) return '🔋 Balanced';
    if (val <= 8) return '🏃‍♀️ Active';
    return '⚡ High Energy';
  };

  const activeDayLog = cycleLogs[formatDateKey(selectedDate)] || { flow: 'none', symptoms: [] };
  const waterCount = waterGlasses.filter(Boolean).length;

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-screen overflow-y-auto text-slate-100 p-8 select-none">
      {/* Header Panel */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-wide text-slate-200">Wellness & Cycle Analytics</h2>
            <button
              onClick={handleExportData}
              className="bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export Data
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">Private client-side wellness log & cyclical pattern tracker</p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-2.5 rounded-xl font-medium shadow-lg animate-pulse">
            ✓ Log entry saved successfully!
          </div>
        )}
      </header>

      {/* Cycle Phase Visualizer Card */}
      <div className="bg-white text-slate-800 border border-slate-200 rounded-3xl p-6 shadow-xl mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-wide">Cycle Phase Visualizer</h3>
            <p className="text-xs text-slate-500 mt-0.5">Understand your current phase and physiological cycle rhythm (Last period: {lastPeriodDate})</p>
          </div>

          {/* Last Period Start Date & Update Button */}
          <div className="flex flex-wrap items-end gap-3 w-full md:w-auto">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Period Start Date</label>
              <input
                type="date"
                value={tempInputDate}
                onChange={(e) => setTempInputDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all shadow-inner"
              />
            </div>
            <button
              type="button"
              onClick={handleUpdateCycle}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Update Cycle
            </button>
          </div>
        </div>

        {/* Visual Progress Bar Section */}
        <div className="space-y-6 relative pt-6">
          {/* Floating Indicator Badge pointing to current phase day */}
          <div
            className="absolute top-[-8px] -translate-x-1/2 z-10 flex flex-col items-center transition-all duration-500 ease-in-out"
            style={{ left: `${progressPercent}%` }}
          >
            <div className={`text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border whitespace-nowrap transition-colors duration-500 ${badgeColorClass}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-ping"></span>
              Current Phase: {currentPhase} (Day {currentDayOfCycle})
            </div>
            <div className={`w-2 h-2 rotate-45 -mt-1 shadow-sm transition-colors duration-500 ${badgeColorClass.split(' ')[0]}`}></div>
          </div>

          {/* Color Coded Bar Segments */}
          <div className="w-full h-3.5 rounded-full overflow-hidden bg-slate-100 flex shadow-inner border border-slate-200/60">
            {/* Menstrual Phase */}
            <div className="flex-[5] bg-pink-400 hover:opacity-90 transition-opacity cursor-pointer relative group" title="Menstrual Phase: Days 1-5">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent"></div>
            </div>
            {/* Follicular Phase */}
            <div className="flex-[8] bg-purple-400 hover:opacity-90 transition-opacity cursor-pointer relative group" title="Follicular Phase: Days 6-13">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"></div>
            </div>
            {/* Ovulatory Phase */}
            <div className="flex-[4] bg-emerald-400 hover:opacity-90 transition-opacity cursor-pointer relative group" title="Ovulatory Phase: Days 14-17">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
            </div>
            {/* Luteal Phase */}
            <div className="flex-[11] bg-amber-400 hover:opacity-90 transition-opacity cursor-pointer relative group" title="Luteal Phase: Days 18-28">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent"></div>
            </div>
          </div>

          {/* Grid Labels & Day Ranges */}
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-pink-50/50 rounded-2xl p-3 border border-pink-100/40">
              <span className="font-semibold text-pink-700 block">Menstrual</span>
              <span className="text-[10px] text-pink-500">Days 1-5</span>
            </div>
            <div className="bg-purple-50/50 rounded-2xl p-3 border border-purple-100/40">
              <span className="font-semibold text-purple-700 block">Follicular</span>
              <span className="text-[10px] text-purple-500">Days 6-13</span>
            </div>
            <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100/40">
              <span className="font-semibold text-emerald-700 block">Ovulatory</span>
              <span className="text-[10px] text-emerald-500">Days 14-17</span>
            </div>
            <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100/40">
              <span className="font-semibold text-amber-700 block">Luteal</span>
              <span className="text-[10px] text-amber-500">Days 18-28</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 flex-1">

        {/* Left Side: Cycle Logging (Col Span: 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                  title="Previous Month"
                >
                  &lt;
                </button>
                <h3 className="font-semibold text-slate-200 text-xs sm:text-sm uppercase tracking-wider">
                  {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} Log
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                  title="Next Month"
                >
                  &gt;
                </button>
              </div>
              <span className="text-[10px] text-pink-400 font-semibold bg-pink-950/40 px-2 py-0.5 rounded-full border border-pink-900/30">Active Cycle Log</span>
            </div>

            {/* Prediction Banner */}
            <div className="bg-pink-950/30 border border-pink-900/40 text-pink-300 text-[11px] px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-2">
              <span className="text-sm">🔮</span>
              <span>{formatPredictionWindow(lastPeriodDate)}</span>
            </div>

            {/* Fertility Banner */}
            <div className="bg-teal-950/30 border border-teal-900/40 text-teal-300 text-[11px] px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-2">
              <span className="text-sm">✨</span>
              <span>{formatFertilityWindow(lastPeriodDate)}</span>
            </div>

            {/* Calendar grid */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 shadow-inner">
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {weekDays.map((day, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-slate-500">{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth();
                  const firstDayOfMonth = new Date(year, month, 1);
                  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
                  const firstDayDayIndex = firstDayOfMonth.getDay();
                  const startOffset = (firstDayDayIndex - 1 + 7) % 7;

                  return (
                    <>
                      {Array.from({ length: startOffset }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="aspect-square" />
                      ))}
                      {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
                        const day = idx + 1;
                        const dateToCheck = new Date(year, month, day);
                        const dateKey = formatDateKey(dateToCheck);
                        const log = cycleLogs[dateKey];
                        const isSelected = selectedDate.getFullYear() === year &&
                                           selectedDate.getMonth() === month &&
                                           selectedDate.getDate() === day;
                        const isPredicted = isPredictedPeriodDay(dateToCheck, lastPeriodDate);
                        const isOvulation = isOvulationDay(dateToCheck, lastPeriodDate);
                        const isFertile = isFertileDay(dateToCheck, lastPeriodDate);
                        const flowClass = log ? getFlowColor(log.flow) : '';

                        const cellClass = flowClass
                          ? flowClass
                          : isPredicted
                          ? "bg-pink-500/10 border border-dashed border-pink-500/40 text-pink-300 hover:bg-pink-500/20"
                          : isOvulation
                          ? "bg-teal-500/20 border-2 border-teal-400 text-teal-300 font-bold shadow-md shadow-teal-500/10 hover:bg-teal-500/30"
                          : isFertile
                          ? "bg-teal-500/15 border border-teal-500/30 text-teal-300 hover:bg-teal-500/25"
                          : "hover:bg-slate-800 text-slate-400";

                        return (
                          <button
                            key={day}
                            onClick={() => handleDayClick(day)}
                            className={`aspect-square text-xs rounded-xl flex items-center justify-center transition-all relative ${
                              isSelected 
                                ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-slate-950 shadow-md shadow-pink-500/30 scale-105 z-10 text-white font-bold' 
                                : ''
                            } ${cellClass}`}
                          >
                            <span className="relative">
                              {day}
                              {isPredicted && (
                                <span className="absolute -top-1.5 -right-2 text-[8px]" title="Predicted Period Day">💧</span>
                              )}
                              {isOvulation && (
                                <span className="absolute -top-1.5 -right-2 text-[8px]" title="Peak Ovulation Day">⭐</span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              {/* Calendar Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-4 mt-4 border-t border-slate-800/80 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-pink-500 inline-block"></span>
                  <span>Logged Period</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded border border-dashed border-pink-500 bg-pink-500/10 inline-block"></span>
                  <span>Predicted Period</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-teal-500/20 border border-teal-500/30 inline-block"></span>
                  <span>Fertile Window</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-teal-400 text-[10px]">⭐</span>
                  <span>Ovulation Day</span>
                </div>
              </div>
            </div>

            {/* Selected Day Status Input Area */}
            <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 space-y-4">
              <div className="text-xs font-semibold text-slate-300">
                Log Details for <span className="text-pink-400">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Flow Selector */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Flow Intensity</span>
                <div className="grid grid-cols-4 gap-2">
                  {['none', 'light', 'medium', 'heavy'].map((flow) => (
                    <button
                      key={flow}
                      onClick={() => logFlow(flow)}
                      className={`text-[11px] py-2 capitalize rounded-xl transition-all border cursor-pointer ${activeDayLog.flow === flow
                        ? 'bg-pink-600/30 text-pink-300 border-pink-500 font-medium'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                      {flow}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms Selector */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Logged Symptoms</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Cramps', 'Fatigue', 'Headache', 'Bloating'].map((symptom) => {
                    const isActive = activeDayLog.symptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`text-[10px] px-3 py-1 rounded-full transition-all border cursor-pointer ${isActive
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-medium'
                          : 'bg-slate-900/40 text-slate-500 border-slate-800/60 hover:text-slate-400 hover:border-slate-700'
                          }`}
                      >
                        {symptom}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Hydration & Sliders (Col Span: 7) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Hydration Log */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-200 text-sm uppercase tracking-wider">Hydration Log</h3>
              <span className="text-sky-400 lowercase text-xs font-semibold bg-sky-950/40 border border-sky-900/30 px-3 py-0.5 rounded-full">
                {waterCount}/8 glasses ({(waterCount * 0.25).toFixed(2)}L)
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-4">
                {waterGlasses.map((filled, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWaterClick(idx)}
                    className={`w-8 h-11 border-2 rounded-b-xl rounded-t-sm flex items-end justify-center transition-all cursor-pointer ${filled
                      ? 'border-sky-400 bg-sky-500/30 text-sky-400 scale-105 shadow-md shadow-sky-500/10'
                      : 'border-slate-700 hover:border-slate-500 text-slate-600'
                      }`}
                    title={`Glass ${idx + 1}`}
                  >
                    <div className={`w-full transition-all rounded-b-lg ${filled ? 'h-7 bg-sky-400/80' : 'h-0'}`}></div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setWaterGlasses([false, false, false, false, false, false, false, false])}
                className="text-[10px] text-slate-500 hover:text-sky-400 uppercase tracking-widest font-bold transition-colors cursor-pointer"
              >
                Reset Hydration
              </button>
            </div>
          </div>

          {/* Daily Vitals */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-semibold text-slate-200 text-sm uppercase tracking-wider">Daily Vitals</h3>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-inner">
              {/* Mood Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Overall Mood</span>
                  <span className="text-pink-400 font-semibold">{getMoodEmoji(mood)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value))}
                  className="w-full accent-pink-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Energy Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Energy Level</span>
                  <span className="text-amber-400 font-semibold">{getEnergyEmoji(energy)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-650 hover:to-rose-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-pink-950/20 active:scale-[0.98] cursor-pointer"
          >
            Save Daily Journal Entry
          </button>
        </div>

      </div>
    </div>
  );
}