import { useState, useEffect } from 'react';

const tenDaysAgoDefault = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const calculateCycleDay = (dateStr) => {
  if (!dateStr) return 1;
  const [year, month, day] = dateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 1;
  return (diffDays % 28) + 1;
};

const getPhaseKey = (day) => {
  if (day >= 1 && day <= 5) return 'Menstrual';
  if (day >= 6 && day <= 13) return 'Follicular';
  if (day >= 14 && day <= 17) return 'Ovulatory';
  return 'Luteal';
};

const PHASE_DETAILS = {
  Menstrual: {
    name: "Menstrual Phase",
    days: "Days 1–5",
    color: "pink",
    themeClasses: {
      text: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      accent: "from-pink-500 to-rose-600",
      badge: "bg-pink-950/40 border border-pink-900/30 text-pink-300",
      lightBadge: "bg-pink-500/20 text-pink-300"
    },
    tagline: "A time of rest, release, and physical renewal. Treat your body with extra gentleness.",
    nutrition: {
      nutrient: "Iron-Rich Foods & B-Complex",
      foods: [
        "Dark leafy greens (spinach, kale) to restore iron levels lost during bleeding",
        "Lean red meat, dark poultry, or lentils paired with Vitamin C to double absorption",
        "Warm, comforting liquids like organic bone broth, ginger tea, or chamomile tea",
        "Magnesium-dense dark chocolate (70%+ cocoa) to naturally soothe uterine cramping"
      ]
    },
    movement: {
      activity: "Gentle Yoga & Rest",
      intensity: 15,
      intensityLabel: "15% - Very Low (Rest & Recovery)",
      details: "Focus on restorative yoga flows (such as legs-up-the-wall or child's pose), deep breathing practices, and light walking. Avoid heavy weights or high-impact training."
    },
    insights: {
      hormones: "Estrogen and progesterone decline to their lowest baseline levels, initiating menstruation.",
      energy: "Physical stamina is naturally low. Guard your boundaries, schedule downtime, and prioritize sleep.",
      focus: "Introspective capacities are heightened. Excellent phase for journaling, intuitive reflection, and setting intentions."
    }
  },
  Follicular: {
    name: "Follicular Phase",
    days: "Days 6–13",
    color: "purple",
    themeClasses: {
      text: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      accent: "from-purple-500 to-indigo-600",
      badge: "bg-purple-950/40 border border-purple-900/30 text-purple-300",
      lightBadge: "bg-purple-500/20 text-purple-300"
    },
    tagline: "Energy rises, creativity sparks, and estrogen begins building your baseline stamina.",
    nutrition: {
      nutrient: "Fresh Veggies & Lean Protein",
      foods: [
        "Fermented inputs (kimchi, kefir, sauerkraut) to support optimal estrogen metabolism",
        "Vibrant cruciferous salads, broccoli, sprouts, and leafy green veggies",
        "High-quality clean proteins: organic chicken, wild-caught salmon, beans, and lentils",
        "Pumpkin and flax seeds to support natural cycle phase cycling"
      ]
    },
    movement: {
      activity: "HIIT & Strength Training",
      intensity: 85,
      intensityLabel: "85% - High (Build & Sculpt)",
      details: "Take advantage of rising estrogen levels. Ideal time for resistance training, strength exercises, HIIT classes, and building lean muscle tissue."
    },
    insights: {
      hormones: "FSH prompts ovarian follicular growth, triggering a steady surge in estrogen levels.",
      energy: "Energy levels, cognitive agility, and positive mood increase daily. You will feel outgoing and capable.",
      focus: "Creative thinking, learning, and planning are at their baseline peak. Pitch new ideas and start fresh projects."
    }
  },
  Ovulatory: {
    name: "Ovulatory Phase",
    days: "Days 14–17",
    color: "emerald",
    themeClasses: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      accent: "from-emerald-500 to-teal-600",
      badge: "bg-emerald-950/40 border border-emerald-900/30 text-emerald-300",
      lightBadge: "bg-emerald-500/20 text-emerald-300"
    },
    tagline: "Your biological, metabolic, and social peak. Make connections and optimize your stamina.",
    nutrition: {
      nutrient: "Anti-inflammatory Fiber & Hydration",
      foods: [
        "Light grains (quinoa, wild rice) that provide steady glucose without sluggishness",
        "Antioxidant-filled fruits: organic raspberries, blueberries, blackberries, and figs",
        "Avocado, extra virgin olive oil, and walnuts to supply clean, healthy fats",
        "Hydration support: coconut water, infused water, and lots of fresh greens"
      ]
    },
    movement: {
      activity: "Cardio & Peak Workouts",
      intensity: 100,
      intensityLabel: "100% - Peak Capacity (Maximum Performance)",
      details: "Stamina and muscle recovery are at their cyclical peak. Excellent for running, spin classes, high-intensity workouts, or setting personal records in strength exercises."
    },
    insights: {
      hormones: "Estrogen peaks and a sharp surge of LH (Luteinizing Hormone) triggers egg release.",
      energy: "Physical stamina, social confidence, and libido peak. You will feel highly communicative and dynamic.",
      focus: "Verbal and collaborative skills are maximized. Best phase for negotiations, public speaking, and community networking."
    }
  },
  Luteal: {
    name: "Luteal Phase",
    days: "Days 18–28",
    color: "amber",
    themeClasses: {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      accent: "from-amber-500 to-orange-600",
      badge: "bg-amber-950/40 border border-amber-900/30 text-amber-300",
      lightBadge: "bg-amber-500/20 text-amber-300"
    },
    tagline: "Winding down external output. Progesterone rises to calm the nervous system.",
    nutrition: {
      nutrient: "Complex Carbs & Magnesium",
      foods: [
        "Slow-burning complex carbs (sweet potato, squash, carrots) to keep blood sugar stable",
        "Magnesium-dense inputs: raw almonds, cashews, Swiss chard, and organic seeds",
        "Sesame and sunflower seeds to aid estrogen/progesterone balance",
        "Hydrating, fiber-rich fruits and veggies to prevent water retention and bloating"
      ]
    },
    movement: {
      activity: "Low-Impact Pilates & Walking",
      intensity: 50,
      intensityLabel: "50% - Moderate (Flow & Maintenance)",
      details: "Transition from heavy workouts to low-impact strength maintenance: mat Pilates, barre class, yoga flow, and walking. Listen to your body as energy declines near Day 28."
    },
    insights: {
      hormones: "Progesterone rises to prepare the body. If no fertilisation occurs, progesterone and estrogen levels drop.",
      energy: "Stamina draws inward. You may feel a nesting instinct, a desire for quiet environments, and moderate physical fatigue.",
      focus: "Detail-oriented, organizing, and analytical focus. Great time to complete tasks, clean, and organize administrative files."
    }
  }
};

export default function PhaseLifestyle({ onCrisisSOS }) {
  const [lastPeriodDate, setLastPeriodDate] = useState(() => {
    return localStorage.getItem('femcare_last_period_date') || tenDaysAgoDefault;
  });

  // Automatically sync/update if changed in tracker
  useEffect(() => {
    const handleStorageChange = () => {
      const savedDate = localStorage.getItem('femcare_last_period_date');
      if (savedDate) setLastPeriodDate(savedDate);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const cycleDay = calculateCycleDay(lastPeriodDate);
  const phaseKey = getPhaseKey(cycleDay);
  const details = PHASE_DETAILS[phaseKey];

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-screen overflow-y-auto text-slate-100 p-8 select-none">
      {/* Header Panel */}
      <header className="flex flex-col pb-6 border-b border-slate-800 gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-wide text-slate-200">Phase-Synced Lifestyle Guide</h2>
            {onCrisisSOS && (
              <button
                onClick={onCrisisSOS}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-650 hover:bg-red-750 text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 flex-shrink-0 animate-pulse"
              >
                🚨 Crisis SOS
              </button>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
            Reflecting Cycle Start: {lastPeriodDate}
          </span>
        </div>
        <p className="text-xs text-slate-400">Align nutrition, movement, and wellness parameters with your active biological rhythms.</p>
      </header>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 flex-1 pb-4">
        
        {/* Left Column: Phase Summary (Col Span: 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Main Active Phase Highlight Card */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between min-h-[300px]">
            {/* Ambient Background Gradient Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${details.themeClasses.accent}`} />
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${details.themeClasses.badge}`}>
                  {details.days}
                </span>
                <span className="text-2xl">🌸</span>
              </div>

              <div>
                <h3 className={`text-3xl font-extrabold tracking-tight ${details.themeClasses.text}`}>
                  {details.name}
                </h3>
                <p className="text-2xl font-bold text-slate-300 mt-1">Day {cycleDay} of 28</p>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed font-medium mt-3 italic border-l-2 border-slate-750 pl-3">
                "{details.tagline}"
              </p>
            </div>

            {/* Visual Timeline Progress Bar */}
            <div className="space-y-2 mt-6 relative z-10">
              <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                <span>Cycle Day 1</span>
                <span>Day 28</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950/80 border border-slate-800/60 overflow-hidden flex">
                <div 
                  className={`h-full bg-gradient-to-r ${details.themeClasses.accent} transition-all duration-700 ease-out`}
                  style={{ width: `${(cycleDay / 28) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center font-medium">
                You are currently {Math.round((cycleDay / 28) * 100)}% through this cycle
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Recommendations (Col Span: 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Card 2: Recommended Diet & Nutrition */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🥗</span>
                <h4 className="font-semibold text-slate-200 text-sm uppercase tracking-wider">Nutrition & Diet Plan</h4>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${details.themeClasses.lightBadge}`}>
                {details.nutrition.nutrient}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 shadow-inner">
              <ul className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-medium">
                {details.nutrition.foods.map((food, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-emerald-500 text-sm mt-0.5">•</span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3: Workout & Movement Guide */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🏃‍♀️</span>
                <h4 className="font-semibold text-slate-200 text-sm uppercase tracking-wider">Workout & Movement</h4>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${details.themeClasses.lightBadge}`}>
                {details.movement.activity}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-5 shadow-inner">
              <p className="text-xs text-slate-350 leading-relaxed font-medium">
                {details.movement.details}
              </p>

              {/* Intensity Gauge */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>Intensity Gauge</span>
                  <span className={details.themeClasses.text}>{details.movement.intensityLabel}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${details.themeClasses.accent} transition-all duration-700`}
                    style={{ width: `${details.movement.intensity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Hormonal & Energy Insights */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🧬</span>
              <h4 className="font-semibold text-slate-200 text-sm uppercase tracking-wider">Hormonal & Energy Insights</h4>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 shadow-inner grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Hormone Shift</span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{details.insights.hormones}</p>
              </div>
              <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Energy & Stamina</span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{details.insights.energy}</p>
              </div>
              <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cognitive & Mood</span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{details.insights.focus}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
