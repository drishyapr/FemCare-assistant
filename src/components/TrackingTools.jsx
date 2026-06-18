import React, { useState } from 'react';

export default function TrackingTools() {
  // Cycle logs: { [day]: { flow: 'none'|'light'|'medium'|'heavy', symptoms: [] } }
  const [cycleLogs, setCycleLogs] = useState({
    3: { flow: 'light', symptoms: ['Fatigue'] },
    4: { flow: 'medium', symptoms: ['Cramps'] },
    5: { flow: 'heavy', symptoms: ['Cramps', 'Fatigue'] },
    6: { flow: 'medium', symptoms: ['Fatigue'] },
    7: { flow: 'light', symptoms: [] },
  });

  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [waterGlasses, setWaterGlasses] = useState([true, true, true, false, false, false, false, false]); // 3/8 filled
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState(6);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Month stats for June 2026 (Starts on Monday, 30 Days)
  const daysInMonth = 30;
  const startOffset = 0; // Monday start offset is 0 for calendar grid alignment
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const logFlow = (flowLevel) => {
    const currentLog = cycleLogs[selectedDay] || { flow: 'none', symptoms: [] };
    setCycleLogs({
      ...cycleLogs,
      [selectedDay]: { ...currentLog, flow: flowLevel }
    });
  };

  const toggleSymptom = (symptom) => {
    const currentLog = cycleLogs[selectedDay] || { flow: 'none', symptoms: [] };
    const hasSymptom = currentLog.symptoms.includes(symptom);
    const updatedSymptoms = hasSymptom
      ? currentLog.symptoms.filter(s => s !== symptom)
      : [...currentLog.symptoms, symptom];

    setCycleLogs({
      ...cycleLogs,
      [selectedDay]: { ...currentLog, symptoms: updatedSymptoms }
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

  const activeDayLog = cycleLogs[selectedDay] || { flow: 'none', symptoms: [] };
  const waterCount = waterGlasses.filter(Boolean).length;

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-screen overflow-y-auto text-slate-100 p-5 select-none scrollbar-thin">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-4 border-b border-slate-800 mb-5">
        <span className="text-xl">📊</span>
        <h3 className="font-bold text-slate-200 tracking-wide text-base">Wellness Tracker</h3>
      </div>

      {/* Save indicator alert */}
      {saveSuccess && (
        <div className="mb-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs text-center py-2 rounded-xl animate-pulse font-medium">
          ✓ Wellness entry saved successfully!
        </div>
      )}

      {/* Cycle Log Section */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">June 2026 Cycle Log</span>
          <span className="text-[10px] text-pink-400 font-medium bg-pink-950/40 px-2 py-0.5 rounded-full border border-pink-900/30">Active Log</span>
        </div>

        {/* Calendar Grid */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 shadow-inner">
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {weekDays.map((day, idx) => (
              <span key={idx} className="text-[10px] font-bold text-slate-600">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const log = cycleLogs[day];
              const isSelected = selectedDay === day;
              const flowClass = log ? getFlowColor(log.flow) : '';
              
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square text-xs rounded-lg flex items-center justify-center transition-all ${
                    isSelected ? 'ring-2 ring-pink-500 font-semibold text-white scale-105 z-10' : ''
                  } ${flowClass || 'hover:bg-slate-800 text-slate-400'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Logger Panel */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-3.5 space-y-3">
          <div className="text-xs font-medium text-slate-300">
            Log for June {selectedDay}:
          </div>

          {/* Flow Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Flow Intensity</span>
            <div className="grid grid-cols-4 gap-1.5">
              {['none', 'light', 'medium', 'heavy'].map((flow) => (
                <button
                  key={flow}
                  onClick={() => logFlow(flow)}
                  className={`text-[10px] py-1 capitalize rounded-lg transition-colors border ${
                    activeDayLog.flow === flow
                      ? 'bg-pink-600/30 text-pink-300 border-pink-500'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {flow}
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Toggle */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Logged Symptoms</span>
            <div className="flex flex-wrap gap-1">
              {['Cramps', 'Fatigue', 'Headache', 'Bloating'].map((symptom) => {
                const isActive = activeDayLog.symptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`text-[10px] px-2 py-0.5 rounded-full transition-colors border ${
                      isActive
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-900/40 text-slate-500 border-slate-800/60 hover:text-slate-400'
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

      {/* Hydration Tracker */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Hydration Log</span>
          <span className="text-sky-400 lowercase text-[11px] font-sans font-medium">{waterCount}/8 glasses ({(waterCount * 0.25).toFixed(2)}L)</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center">
          {/* Glass Grid */}
          <div className="grid grid-cols-8 gap-2 mb-3">
            {waterGlasses.map((filled, idx) => (
              <button
                key={idx}
                onClick={() => handleWaterClick(idx)}
                className={`w-6 h-8 border-2 rounded-b-lg rounded-t-sm flex items-end justify-center transition-all ${
                  filled
                    ? 'border-sky-400 bg-sky-500/30 text-sky-400 scale-105'
                    : 'border-slate-700 hover:border-slate-500 text-slate-600'
                }`}
                title={`Glass ${idx + 1}`}
              >
                <div className={`w-full transition-all rounded-b-md ${filled ? 'h-5 bg-sky-400/70' : 'h-0'}`}></div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setWaterGlasses([false, false, false, false, false, false, false, false])}
            className="text-[10px] text-slate-500 hover:text-slate-400 uppercase tracking-widest font-semibold transition-colors"
          >
            Reset Hydration
          </button>
        </div>
      </div>

      {/* Mood & Energy */}
      <div className="space-y-4 mb-6">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Daily Vitals</span>
        
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-4 shadow-inner">
          {/* Mood Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Mood</span>
              <span className="text-pink-400 font-medium">{getMoodEmoji(mood)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full accent-pink-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Energy Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Energy</span>
              <span className="text-amber-400 font-medium">{getEnergyEmoji(energy)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <button
        onClick={handleSave}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-pink-950/20 active:scale-[0.98]"
      >
        Save Daily Entry
      </button>
    </div>
  );
}
