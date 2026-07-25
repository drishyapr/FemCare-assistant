import { useState } from 'react';

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
    <div className="flex-1 bg-slate-950 flex flex-col h-screen overflow-y-auto text-slate-100 p-8 select-none">
      {/* Header Panel */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wide text-slate-200">Wellness & Cycle Analytics</h2>
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
            <p className="text-xs text-slate-500 mt-0.5">Understand your current phase and physiological cycle rhythm</p>
          </div>
          
          {/* Last Period Start Date & Update Button */}
          <div className="flex flex-wrap items-end gap-3 w-full md:w-auto">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Period Start Date</label>
              <input 
                type="date" 
                defaultValue="2026-07-16" 
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all shadow-inner"
              />
            </div>
            <button 
              type="button" 
              onClick={(e) => e.preventDefault()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Update Cycle
            </button>
          </div>
        </div>

        {/* Visual Progress Bar Section */}
        <div className="space-y-6 relative pt-6">
          {/* Floating Indicator Badge pointing to Follicular (Day 9) */}
          <div className="absolute top-[-8px] left-[30.3%] -translate-x-1/2 z-10 flex flex-col items-center">
            <div className="bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-200/50 flex items-center gap-1.5 border border-purple-500 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-ping"></span>
              Current Phase: Follicular (Day 9)
            </div>
            <div className="w-2 h-2 bg-purple-600 rotate-45 -mt-1 shadow-sm"></div>
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
            <div className="flex-[2] bg-emerald-400 hover:opacity-90 transition-opacity cursor-pointer relative group" title="Ovulatory Phase: Days 14-15">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
            </div>
            {/* Luteal Phase */}
            <div className="flex-[13] bg-amber-400 hover:opacity-90 transition-opacity cursor-pointer relative group" title="Luteal Phase: Days 16-28">
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
              <span className="text-[10px] text-emerald-500">Days 14-15</span>
            </div>
            <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100/40">
              <span className="font-semibold text-amber-700 block">Luteal</span>
              <span className="text-[10px] text-amber-500">Days 16-28</span>
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
              <h3 className="font-semibold text-slate-200 text-sm uppercase tracking-wider">June 2026 Log</h3>
              <span className="text-[10px] text-pink-400 font-semibold bg-pink-950/40 px-2 py-0.5 rounded-full border border-pink-900/30">Active Cycle Log</span>
            </div>

            {/* Calendar grid */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 shadow-inner">
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {weekDays.map((day, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-slate-500">{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const log = cycleLogs[day];
                  const isSelected = selectedDay === day;
                  const flowClass = log ? getFlowColor(log.flow) : '';
                  
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`aspect-square text-xs rounded-xl flex items-center justify-center transition-all ${
                        isSelected ? 'ring-2 ring-pink-500 font-bold text-white scale-105 z-10 shadow-lg shadow-pink-500/20' : ''
                      } ${flowClass || 'hover:bg-slate-800 text-slate-400'}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Status Input Area */}
            <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 space-y-4">
              <div className="text-xs font-semibold text-slate-300">
                Log Details for <span className="text-pink-400">June {selectedDay}</span>
              </div>

              {/* Flow Selector */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Flow Intensity</span>
                <div className="grid grid-cols-4 gap-2">
                  {['none', 'light', 'medium', 'heavy'].map((flow) => (
                    <button
                      key={flow}
                      onClick={() => logFlow(flow)}
                      className={`text-[11px] py-2 capitalize rounded-xl transition-all border cursor-pointer ${
                        activeDayLog.flow === flow
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
                        className={`text-[10px] px-3 py-1 rounded-full transition-all border cursor-pointer ${
                          isActive
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
                    className={`w-8 h-11 border-2 rounded-b-xl rounded-t-sm flex items-end justify-center transition-all cursor-pointer ${
                      filled
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
