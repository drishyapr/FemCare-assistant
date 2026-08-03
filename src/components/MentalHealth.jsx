import { useState, useEffect, useRef } from 'react';

const COMPASSION_ANCHORS = [
  "Your only job right now is to exist. You don't have to fix everything today.",
  "You are safe in this moment. Take it one breath, one step, one second at a time.",
  "It is okay that you feel this way. This feeling is a wave, and like all waves, it will peak and pass.",
  "You are not a burden. Your struggles are real, and you deserve patience and care.",
  "Give yourself permission to pause. The world can wait while you steady yourself."
];

const MICRO_ACTIONS = [
  { id: 'water', text: "Drink half a glass of water", icon: "💧" },
  { id: 'posture', text: "Gently roll your shoulders back and drop them", icon: "🧘‍♀️" },
  { id: 'feet', text: "Place both feet flat on the floor and feel the solid ground", icon: "🦶" },
  { id: 'stretch', text: "Do a slow 10-second stretch (reach your arms high)", icon: "🙆‍♀️" },
  { id: 'hands', text: "Wash your face or wrists with cool water", icon: "🧼" }
];

const GROUNDING_STEPS = [
  { count: 5, label: "5 - SIGHT", text: "Look around you. Name 5 distinct things you can see (e.g., a chair, a pen, a spot on the wall)." },
  { count: 4, label: "4 - TOUCH", text: "Pay attention to your body. Name 4 things you can physically feel (e.g., your shirt on your back, the keyboard under your fingers, the seat beneath you)." },
  { count: 3, label: "3 - SOUND", text: "Listen closely. Name 3 sounds you can hear in your environment (e.g., traffic hum, clock ticking, a fan blowing)." },
  { count: 2, label: "2 - SMELL", text: "Inhale slowly. Name 2 things you can smell, or 2 smells you love (e.g., coffee, soap, flowers)." },
  { count: 1, label: "1 - TASTE", text: "Focus inward. Name 1 thing you can taste, or 1 pleasant taste you can imagine (e.g., mint, chocolate, water)." }
];

const BREATH_STEPS = [
  { name: "Inhale Deeply", duration: 4, instruction: "Breathe in deeply through your nose, expanding your stomach...", scale: 1.4, color: "border-indigo-400 bg-indigo-500/20" },
  { name: "Sip More Air", duration: 1, instruction: "Take a quick, sharp extra sip of air through your nose!", scale: 1.55, color: "border-pink-400 bg-pink-500/20" },
  { name: "Exhale Slowly", duration: 6, instruction: "Sigh out slowly through your mouth, letting all tension dissolve...", scale: 1.0, color: "border-emerald-400 bg-emerald-500/20" }
];

const SLEEP_BREATH_STEPS = [
  { name: "Inhale", duration: 4, instruction: "Breathe in quietly through your nose...", scale: 1.3, color: "border-indigo-400 bg-indigo-500/20" },
  { name: "Hold", duration: 7, instruction: "Hold your breath, resting in complete stillness...", scale: 1.3, color: "border-purple-400 bg-purple-500/20" },
  { name: "Exhale", duration: 8, instruction: "Exhale slowly through your mouth, making a soft 'whoosh' sound...", scale: 1.0, color: "border-emerald-400 bg-emerald-500/20" }
];

const PMR_STEPS = [
  { area: "Feet & Toes", instruction: "Curl your toes tightly downward. Hold for 5 seconds, feeling the tension, then release fully. Let them go limp." },
  { area: "Calves & Knees", instruction: "Pull your toes up toward your shins to tense your calves. Hold for 5 seconds, then let go completely." },
  { area: "Thighs & Glutes", instruction: "Squeeze your thigh muscles and glutes as hard as you can. Hold for 5 seconds, then release, letting them sink into the bed." },
  { area: "Stomach & Chest", instruction: "Tense your abdomen by pulling it in. Take a deep breath and hold, tensing your chest. Hold for 5 seconds, then release." },
  { area: "Shoulders & Neck", instruction: "Shrug your shoulders up toward your ears. Hold for 5 seconds, feeling the tightness, then let them drop completely." },
  { area: "Face & Jaw", instruction: "Clench your jaw and squeeze your eyes closed. Hold for 5 seconds, then relax every muscle in your face." }
];

const TIPP_STEPS = [
  { title: "T - Temperature", desc: "Splash ice-cold water on your face, hold an ice pack on your chest/eyes, or grab an ice cube. This triggers the mammalian dive reflex to drop your heart rate rapidly." },
  { title: "I - Intense Exercise", desc: "Engage in short, high-energy exercise. Do 25 jumping jacks, run up a flight of stairs, do 10 pushups, or punch a pillow. This burns off excess adrenaline and cortisol." },
  { title: "P - Paced Breathing", desc: "Breathe deeply and slowly. Inhale for 4 seconds, exhale for 6 seconds. Ensure your exhale is longer than your inhale to activate the parasympathetic nervous system." },
  { title: "P - Paired Muscle Relaxation", desc: "Tense a muscle group as you inhale. Release the tension completely as you exhale, noticing the physical sensation of letting go." }
];

export default function MentalHealth() {
  const [activeTab, setActiveTab] = useState('panic'); // 'panic', 'depression', 'somatic', 'stress', 'insomnia', 'anger'

  // Breathing State (Physiological Sigh)
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathStepIdx, setBreathStepIdx] = useState(0);
  const [breathTimer, setBreathTimer] = useState(BREATH_STEPS[0].duration);
  const breathIntervalRef = useRef(null);

  // Grounding State
  const [groundingIdx, setGroundingIdx] = useState(0);

  // Micro-action state
  const [completedActions, setCompletedActions] = useState({});

  // Self-compassion index
  const [compassionIdx, setCompassionIdx] = useState(0);

  // Bilateral Tapping State
  const [isTapping, setIsTapping] = useState(false);
  const [tappingSide, setTappingSide] = useState('left'); // 'left' or 'right'
  const [tappingSpeed, setTappingSpeed] = useState(600); // ms per tap
  const [tappingTimer, setTappingTimer] = useState(60); // 60s countdown
  const tappingIntervalRef = useRef(null);
  const tappingCountdownRef = useRef(null);

  // 🌀 Stress & Overthinking State
  const [racingThought, setRacingThought] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [worryTime, setWorryTime] = useState('18:00');
  const [isWorryScheduled, setIsWorryScheduled] = useState(false);

  // 🌙 Insomnia & Sleep Breathing State
  const [isSleepBreathing, setIsSleepBreathing] = useState(false);
  const [sleepBreathStepIdx, setSleepBreathStepIdx] = useState(0);
  const [sleepBreathTimer, setSleepBreathTimer] = useState(SLEEP_BREATH_STEPS[0].duration);
  const sleepBreathIntervalRef = useRef(null);

  // PMR state
  const [pmrStepIdx, setPmrStepIdx] = useState(0);

  // ⚡ Anger State
  const [angerCountdown, setAngerCountdown] = useState(30);
  const [isAngerTimerRunning, setIsAngerTimerRunning] = useState(false);
  const angerIntervalRef = useRef(null);

  // Physiological sigh logic hook
  useEffect(() => {
    if (isBreathing) {
      breathIntervalRef.current = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            const nextIdx = (breathStepIdx + 1) % BREATH_STEPS.length;
            setBreathStepIdx(nextIdx);
            return BREATH_STEPS[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(breathIntervalRef.current);
    }
    return () => clearInterval(breathIntervalRef.current);
  }, [isBreathing, breathStepIdx]);

  // 4-7-8 Sleep breathing logic hook
  useEffect(() => {
    if (isSleepBreathing) {
      sleepBreathIntervalRef.current = setInterval(() => {
        setSleepBreathTimer((prev) => {
          if (prev <= 1) {
            const nextIdx = (sleepBreathStepIdx + 1) % SLEEP_BREATH_STEPS.length;
            setSleepBreathStepIdx(nextIdx);
            return SLEEP_BREATH_STEPS[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(sleepBreathIntervalRef.current);
    }
    return () => clearInterval(sleepBreathIntervalRef.current);
  }, [isSleepBreathing, sleepBreathStepIdx]);

  // Bilateral tapping logic
  useEffect(() => {
    if (isTapping) {
      tappingIntervalRef.current = setInterval(() => {
        setTappingSide((prev) => (prev === 'left' ? 'right' : 'left'));
      }, tappingSpeed);

      tappingCountdownRef.current = setInterval(() => {
        setTappingTimer((prev) => {
          if (prev <= 1) {
            setIsTapping(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(tappingIntervalRef.current);
      clearInterval(tappingCountdownRef.current);
    }
    return () => {
      clearInterval(tappingIntervalRef.current);
      clearInterval(tappingCountdownRef.current);
    };
  }, [isTapping, tappingSpeed]);

  // Anger countdown logic hook
  useEffect(() => {
    if (isAngerTimerRunning) {
      angerIntervalRef.current = setInterval(() => {
        setAngerCountdown((prev) => {
          if (prev <= 1) {
            setIsAngerTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(angerIntervalRef.current);
    }
    return () => clearInterval(angerIntervalRef.current);
  }, [isAngerTimerRunning]);

  // Reset states on tab change to prevent running intervals
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'panic') {
      setIsBreathing(false);
      setBreathStepIdx(0);
      setBreathTimer(BREATH_STEPS[0].duration);
      setGroundingIdx(0);
    }
    if (tab !== 'somatic') {
      setIsTapping(false);
      setTappingTimer(60);
    }
    if (tab !== 'insomnia') {
      setIsSleepBreathing(false);
      setSleepBreathStepIdx(0);
      setSleepBreathTimer(SLEEP_BREATH_STEPS[0].duration);
      setPmrStepIdx(0);
    }
    if (tab !== 'anger') {
      setIsAngerTimerRunning(false);
      setAngerCountdown(30);
    }
    if (tab !== 'stress') {
      setRacingThought('');
      setIsDissolving(false);
      setIsWorryScheduled(false);
    }
  };

  const handleToggleAction = (id) => {
    setCompletedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetBreathing = () => {
    setIsBreathing(false);
    setBreathStepIdx(0);
    setBreathTimer(BREATH_STEPS[0].duration);
  };

  const handleResetSleepBreathing = () => {
    setIsSleepBreathing(false);
    setSleepBreathStepIdx(0);
    setSleepBreathTimer(SLEEP_BREATH_STEPS[0].duration);
  };

  const handleDissolveThought = () => {
    if (!racingThought.trim()) return;
    setIsDissolving(true);
    setTimeout(() => {
      setRacingThought('');
      setIsDissolving(false);
    }, 3000);
  };

  const handleScheduleWorry = (e) => {
    e.preventDefault();
    setIsWorryScheduled(true);
    setTimeout(() => {
      setIsWorryScheduled(false);
    }, 5000);
  };

  const handleToggleAngerTimer = () => {
    setIsAngerTimerRunning(!isAngerTimerRunning);
  };

  const handleResetAngerTimer = () => {
    setIsAngerTimerRunning(false);
    setAngerCountdown(30);
  };

  const currentBreathStep = BREATH_STEPS[breathStepIdx];
  const currentSleepBreathStep = SLEEP_BREATH_STEPS[sleepBreathStepIdx];

  // Circle path logic for Anger Countdown Ring
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (angerCountdown / 30) * circumference;

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-y-auto text-slate-100 p-8 select-none">
      
      {/* 1. Emergency Crisis Header Card */}
      <div className="bg-gradient-to-r from-red-950/40 to-rose-900/10 border border-red-900/40 rounded-3xl p-6 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 flex-shrink-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-pulse">🚨</span>
            <h2 className="text-xl font-bold text-red-200 tracking-wide">Crisis & SOS Support</h2>
          </div>
          <p className="text-xs text-red-300/80 leading-relaxed max-w-xl">
            If you are in immediate physical danger, experiencing a severe medical emergency, or having thoughts of self-harm, please connect with professional assistance immediately. These lifelines are confidential, free, and available 24/7.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <a
            href="tel:911"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-red-950/50 hover:scale-[1.02] active:scale-95 text-center whitespace-nowrap"
          >
            📞 Call Emergency Services (911)
          </a>
          <a
            href="tel:988"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-850 text-slate-100 border border-red-900/30 hover:border-red-500/40 rounded-2xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 text-center whitespace-nowrap"
          >
            ☎️ Call/Text 988 (Crisis Line)
          </a>
          <a
            href="sms:741741?body=HOME"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-850 text-slate-100 border border-red-900/30 hover:border-red-500/40 rounded-2xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 text-center whitespace-nowrap"
          >
            💬 SMS HOME to 741741
          </a>
        </div>
      </div>

      {/* Workspace Menu Bar / Tabs */}
      <div className="flex border-b border-slate-800 gap-2 mb-6 overflow-x-auto scrollbar-none flex-nowrap flex-shrink-0">
        <button
          onClick={() => handleTabChange('panic')}
          className={`px-5 py-3 font-semibold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'panic'
              ? 'border-pink-500 text-pink-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🚨 Panic & Anxiety
        </button>
        <button
          onClick={() => handleTabChange('depression')}
          className={`px-5 py-3 font-semibold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'depression'
              ? 'border-purple-500 text-purple-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🌧️ Depression & Low Energy
        </button>
        <button
          onClick={() => handleTabChange('somatic')}
          className={`px-5 py-3 font-semibold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'somatic'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ❄️ Physical Reset & Somatic
        </button>
        <button
          onClick={() => handleTabChange('stress')}
          className={`px-5 py-3 font-semibold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'stress'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🌀 Stress & Overthinking
        </button>
        <button
          onClick={() => handleTabChange('insomnia')}
          className={`px-5 py-3 font-semibold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'insomnia'
              ? 'border-teal-500 text-teal-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🌙 Insomnia & Night Anxiety
        </button>
        <button
          onClick={() => handleTabChange('anger')}
          className={`px-5 py-3 font-semibold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'anger'
              ? 'border-rose-500 text-rose-455 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ Anger & Frustration
        </button>
      </div>

      {/* Content panes */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-4">
        
        {activeTab === 'panic' && (
          <>
            {/* Left Box: Breathing (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col items-center justify-between min-h-[400px]">
                
                <div className="text-center w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Physiological Sigh Respiration
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Rapid Nervous System De-escalation</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Two quick deep inhales to fully inflate lung sacs, followed by a long, slow sighing exhale. Repeat 3-5 times.
                  </p>
                </div>

                <div className="my-8 flex items-center justify-center relative">
                  <div
                    className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center text-center p-4 transition-all duration-700 ease-in-out ${currentBreathStep.color}`}
                    style={{ transform: `scale(${isBreathing ? currentBreathStep.scale : 1.0})` }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-350">
                      {isBreathing ? currentBreathStep.name : "Ready"}
                    </span>
                    <span className="text-3xl font-extrabold text-white mt-1.5">
                      {isBreathing ? `${breathTimer}s` : "••"}
                    </span>
                  </div>
                </div>

                <div className="w-full text-center space-y-4">
                  <p className="text-xs text-slate-300 font-medium px-4 min-h-[36px] flex items-center justify-center">
                    {isBreathing ? currentBreathStep.instruction : "Click Start to begin the guided breathing cycle."}
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setIsBreathing(!isBreathing)}
                      className={`px-6 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all active:scale-95 cursor-pointer ${
                        isBreathing 
                          ? 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750' 
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-950/20'
                      }`}
                    >
                      {isBreathing ? "Pause Cycle ⏸️" : "Start Breathing ▶️"}
                    </button>
                    {isBreathing && (
                      <button
                        onClick={handleResetBreathing}
                        className="px-5 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-350 text-xs font-semibold rounded-2xl transition-all cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Box: Grounding (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    5-4-3-2-1 Sensory Grounding
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Anxiety Anchor Sequence</h3>
                  <p className="text-xs text-slate-400">
                    Bring yourself back into the present moment by engaging all five of your physical senses.
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-6 my-6 flex-1 flex flex-col justify-center space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-pink-400 bg-pink-950/40 border border-pink-900/30 px-3.5 py-1 rounded-full">
                      {GROUNDING_STEPS[groundingIdx].label}
                    </span>
                    <span className="text-slate-500 text-xs">Step {groundingIdx + 1} of 5</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                    {GROUNDING_STEPS[groundingIdx].text}
                  </p>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <button
                    onClick={() => setGroundingIdx((prev) => (prev > 0 ? prev - 1 : 4))}
                    className="px-4 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setGroundingIdx((prev) => (prev + 1) % 5)}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-650 hover:to-rose-700 text-white text-xs font-bold tracking-wide rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
                  >
                    Next Anchor 👉
                  </button>
                </div>

              </div>
            </div>
          </>
        )}

        {activeTab === 'depression' && (
          <>
            {/* Left Box: Micro-Actions (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Micro-Action Activation
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Gentle Physical Catalyst Tasks</h3>
                  <p className="text-xs text-slate-400">
                    When motivation is depleted, skip looking at the big picture. Focus on completing just one simple, non-demanding physical activity.
                  </p>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {MICRO_ACTIONS.map((action) => {
                    const isDone = !!completedActions[action.id];
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleToggleAction(action.id)}
                        className={`w-full flex items-center justify-between p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                          isDone 
                            ? 'bg-purple-950/20 border-purple-500/60 shadow-lg shadow-purple-950/10' 
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{action.icon}</span>
                          <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : ''}`}>
                            {action.text}
                          </span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                          isDone 
                            ? 'border-purple-400 bg-purple-500 text-white' 
                            : 'border-slate-700'
                        }`}>
                          {isDone ? "✓" : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Progress: {Object.values(completedActions).filter(Boolean).length} / {MICRO_ACTIONS.length} completed</span>
                  <button 
                    onClick={() => setCompletedActions({})}
                    className="text-slate-400 hover:text-purple-400 transition-colors"
                  >
                    Reset List
                  </button>
                </div>

              </div>
            </div>

            {/* Right Box: Compassion Anchors (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Self-Compassion Anchors
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Gentle Affirmation & Presence</h3>
                  <p className="text-xs text-slate-400">
                    Read these validating statements. Let them settle in without needing to solve or adjust anything right now.
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-8 my-6 flex-1 flex flex-col justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-purple-500/5 blur-2xl" />
                  <p className="text-sm md:text-base text-slate-200 leading-relaxed font-semibold italic">
                    "{COMPASSION_ANCHORS[compassionIdx]}"
                  </p>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                    Anchor {compassionIdx + 1} of {COMPASSION_ANCHORS.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCompassionIdx((prev) => (prev > 0 ? prev - 1 : COMPASSION_ANCHORS.length - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center text-sm font-semibold cursor-pointer"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCompassionIdx((prev) => (prev + 1) % COMPASSION_ANCHORS.length)}
                      className="w-10 h-10 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center text-sm font-semibold cursor-pointer"
                    >
                      ›
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {activeTab === 'somatic' && (
          <>
            {/* Left Box: Bilateral Tapping (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-1 text-center w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Bilateral Somatic Tapping
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Dissociation Interrupt Timer</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Cross your arms and tap your left and right shoulders alternatingly in sync with the visual cues to recheck body boundaries.
                  </p>
                </div>

                <div className="my-8 flex justify-center items-center gap-12 w-full">
                  <div className="flex flex-col items-center gap-2.5">
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 font-bold text-xs ${
                      isTapping && tappingSide === 'left' 
                        ? 'border-emerald-400 bg-emerald-500/25 scale-110 shadow-lg shadow-emerald-500/10 text-white' 
                        : 'border-slate-800 bg-slate-950/40 text-slate-500'
                    }`}>
                      LEFT TAP
                    </div>
                  </div>

                  <div className="text-xl font-bold text-slate-500 animate-pulse">
                    {isTapping ? `${tappingTimer}s` : "Ready"}
                  </div>

                  <div className="flex flex-col items-center gap-2.5">
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 font-bold text-xs ${
                      isTapping && tappingSide === 'right' 
                        ? 'border-emerald-400 bg-emerald-500/25 scale-110 shadow-lg shadow-emerald-500/10 text-white' 
                        : 'border-slate-800 bg-slate-950/40 text-slate-500'
                    }`}>
                      RIGHT TAP
                    </div>
                  </div>
                </div>

                <div className="space-y-4 w-full">
                  <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      <span>Tapping Rhythmic Speed</span>
                      <span className="text-emerald-400">
                        {tappingSpeed === 800 ? "Slow" : tappingSpeed === 500 ? "Medium" : "Fast"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { speed: 800, label: "Slow (800ms)" },
                        { speed: 500, label: "Medium (500ms)" },
                        { speed: 300, label: "Fast (300ms)" }
                      ].map((item) => (
                        <button
                          key={item.speed}
                          onClick={() => setTappingSpeed(item.speed)}
                          disabled={isTapping}
                          className={`text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer border ${
                            tappingSpeed === item.speed
                              ? 'bg-emerald-600/25 text-emerald-300 border-emerald-500'
                              : 'bg-slate-900/60 text-slate-550 border-slate-800 hover:border-slate-700 disabled:opacity-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsTapping(!isTapping)}
                      className={`flex-1 py-3.5 rounded-2xl text-xs font-bold tracking-wide transition-all active:scale-[0.98] cursor-pointer text-center ${
                        isTapping 
                          ? 'bg-slate-850 hover:bg-slate-800 text-slate-350 border border-slate-750' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                      }`}
                    >
                      {isTapping ? "Stop Tapping Timer ⏹️" : "Start Somatic Tapping Timer ▶️"}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Box: Cold Reset & Somatic Info (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Vagus Nerve Cold Shock Reset
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Mammalian Dive Reflex Guide</h3>
                  <p className="text-xs text-slate-400">
                    Somatic techniques to bypass mental loops and trigger physiological parasympathetic activation instantly.
                  </p>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🧊</span>
                      <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Cold Water Submersion</h4>
                    </div>
                    <p className="text-[11px] text-slate-350 leading-relaxed font-medium">
                      Fill a bowl with cold water (or grab an ice pack). Splash water on your face, or hold the ice pack against your eyes, cheeks, or chest for 15–30 seconds while holding your breath. This lowers your heart rate rapidly and stops acute hyperarousal.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🧠</span>
                      <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Sensory Wrist Cooldown</h4>
                    </div>
                    <p className="text-[11px] text-slate-350 leading-relaxed font-medium">
                      Run freezing cold water over the inside of your wrists or rub an ice cube on them. The major blood vessels near the skin surface cool down, delivering a sudden sensory redirect to the autonomic nervous system.
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Note: Consult a cardiologist if you have active heart conditions before using cold shock resets.</span>
                </div>

              </div>
            </div>
          </>
        )}

        {activeTab === 'stress' && (
          <>
            {/* Left Box: Thought-Dissolver Canvas (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Thought-Dissolver Canvas
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">racing thought release</h3>
                  <p className="text-xs text-slate-400">
                    Type out whatever is racing through your mind. Once typed, click Dissolve to watch your worries fade away.
                  </p>
                </div>

                {/* Textarea canvas */}
                <div className="flex-1 flex flex-col justify-center">
                  <textarea
                    value={racingThought}
                    onChange={(e) => setRacingThought(e.target.value)}
                    disabled={isDissolving}
                    placeholder="Type a heavy or stressful thought here..."
                    className={`w-full h-36 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none transition-all duration-[3000ms] ${
                      isDissolving 
                        ? 'opacity-0 blur-md scale-95 select-none pointer-events-none' 
                        : 'opacity-100 blur-none scale-100'
                    }`}
                  />
                </div>

                <div className="pt-6 w-full">
                  <button
                    onClick={handleDissolveThought}
                    disabled={isDissolving || !racingThought.trim()}
                    className={`w-full py-3.5 rounded-2xl text-xs font-bold tracking-wide transition-all active:scale-[0.98] cursor-pointer text-center disabled:opacity-40 ${
                      isDissolving
                        ? 'bg-indigo-950/40 text-indigo-455 border border-indigo-900/40'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white'
                    }`}
                  >
                    {isDissolving ? "Dissolving and releasing thought... 🌀" : "Dissolve & Release ✨"}
                  </button>
                </div>

              </div>
            </div>

            {/* Right Box: Worry Postponement (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Worry Postponement Guide
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Cyclical Boundary Setting</h3>
                  <p className="text-xs text-slate-400">
                    Postponing worries helps break the cycle of acute anxiety. By scheduling a time for later, you free your cognitive capacity now.
                  </p>
                </div>

                {/* Steps and worry time scheduler */}
                <div className="space-y-4 flex-1 justify-center flex flex-col">
                  <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-2 text-xs">
                    <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">Worry Postponement Steps:</span>
                    <ol className="list-decimal pl-4 space-y-2 text-slate-300 leading-relaxed font-medium">
                      <li>Identify a thought that is causing repetitive worry.</li>
                      <li>Acknowledge it and explicitly tell yourself: "I will process this during my dedicated Worry Window."</li>
                      <li>Schedule a 15-minute window later in the day.</li>
                      <li>Redirect your focus to the immediate physical present.</li>
                    </ol>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-3">
                    <span className="font-bold text-slate-300 text-xs block">Set Your Dedicated Worry Window:</span>
                    <form onSubmit={handleScheduleWorry} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                      <input 
                        type="time" 
                        value={worryTime}
                        onChange={(e) => setWorryTime(e.target.value)}
                        className="w-full sm:w-auto bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-455 text-center font-bold"
                      />
                      <button 
                        type="submit"
                        className="w-full sm:flex-1 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 rounded-xl text-xs font-semibold hover:border-indigo-500/40 transition-all cursor-pointer active:scale-95"
                      >
                        Schedule Window
                      </button>
                    </form>
                    {isWorryScheduled && (
                      <p className="text-[11px] text-indigo-400 font-semibold animate-pulse">
                        ✓ Worry scheduled for {worryTime}. You can safely let this thought go for now.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Rule: Never schedule worry time right before sleeping.</span>
                </div>

              </div>
            </div>
          </>
        )}

        {activeTab === 'insomnia' && (
          <>
            {/* Left Box: 4-7-8 Breathing (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col items-center justify-between min-h-[400px]">
                
                <div className="text-center w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    4-7-8 Sleep Breathing Pacer
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Natural Nervous System Tranquilizer</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Inhale for 4s, hold for 7s, and exhale for 8s to trigger rapid parasympathetic heart rate deceleration.
                  </p>
                </div>

                <div className="my-8 flex items-center justify-center relative">
                  <div
                    className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center text-center p-4 transition-all duration-700 ease-in-out ${currentSleepBreathStep.color}`}
                    style={{ transform: `scale(${isSleepBreathing ? currentSleepBreathStep.scale : 1.0})` }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-355">
                      {isSleepBreathing ? currentSleepBreathStep.name : "Sleep Pacer"}
                    </span>
                    <span className="text-3xl font-extrabold text-white mt-1.5">
                      {isSleepBreathing ? `${sleepBreathTimer}s` : "••"}
                    </span>
                  </div>
                </div>

                <div className="w-full text-center space-y-4">
                  <p className="text-xs text-slate-300 font-medium px-4 min-h-[36px] flex items-center justify-center">
                    {isSleepBreathing ? currentSleepBreathStep.instruction : "Click Start to initiate sleep-induction breathing."}
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setIsSleepBreathing(!isSleepBreathing)}
                      className={`px-6 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all active:scale-95 cursor-pointer ${
                        isSleepBreathing 
                          ? 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750' 
                          : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-650 hover:to-emerald-700 text-white shadow-lg shadow-teal-950/20'
                      }`}
                    >
                      {isSleepBreathing ? "Pause Sleep Breath ⏸️" : "Start Sleep Pacer ▶️"}
                    </button>
                    {isSleepBreathing && (
                      <button
                        onClick={handleResetSleepBreathing}
                        className="px-5 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-350 text-xs font-semibold rounded-2xl transition-all cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Box: PMR Checklist (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    Progressive Muscle Relaxation (PMR)
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Somatotopic Tension Release</h3>
                  <p className="text-xs text-slate-400">
                    Systematically tense and release muscle groups from feet to face to eliminate latent physical stress.
                  </p>
                </div>

                {/* Active PMR card */}
                <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-6 my-6 flex-1 flex flex-col justify-center space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-teal-400 bg-teal-950/40 border border-teal-900/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
                      {PMR_STEPS[pmrStepIdx].area}
                    </span>
                    <span className="text-slate-500 text-xs">Group {pmrStepIdx + 1} of {PMR_STEPS.length}</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                    {PMR_STEPS[pmrStepIdx].instruction}
                  </p>
                </div>

                {/* Navigation PMR steps */}
                <div className="flex justify-between items-center gap-4">
                  <button
                    onClick={() => setPmrStepIdx((prev) => (prev > 0 ? prev - 1 : PMR_STEPS.length - 1))}
                    className="px-4 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    ← Previous Group
                  </button>
                  <button
                    onClick={() => setPmrStepIdx((prev) => (prev + 1) % PMR_STEPS.length)}
                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-650 hover:to-emerald-700 text-white text-xs font-bold tracking-wide rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
                  >
                    {pmrStepIdx === PMR_STEPS.length - 1 ? "Start Over" : "Next Group →"}
                  </button>
                </div>

              </div>
            </div>
          </>
        )}

        {activeTab === 'anger' && (
          <>
            {/* Left Box: 30s Countdown Ring (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col items-center justify-between min-h-[400px]">
                
                <div className="text-center w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    30-Second Cooling Impulse Pause
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">Impulsivity Interrupt Timer</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    When feeling an surge of anger, commit to taking a 30-second pause before acting or replying. Let your nervous system settle.
                  </p>
                </div>

                {/* Visual SVG Progress Countdown Ring */}
                <div className="relative w-36 h-36 flex items-center justify-center my-6">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-slate-950"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-red-650 transition-all duration-1000"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="z-10 flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-white">
                      {angerCountdown}s
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 mt-1 font-bold">
                      {angerCountdown > 0 ? "Pause Reaction" : "Ready"}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="w-full text-center space-y-4">
                  <p className="text-xs text-slate-300 font-medium px-4 min-h-[36px] flex items-center justify-center">
                    {angerCountdown === 30 
                      ? "Hit Start to trigger a 30-second cooling pause." 
                      : angerCountdown === 0 
                      ? "Pause complete. Reassess your impulse with clean oxygen." 
                      : "Concentrate on breathing. Let the countdown tick down."}
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleToggleAngerTimer}
                      disabled={angerCountdown === 0}
                      className={`px-6 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all active:scale-95 cursor-pointer disabled:opacity-40 ${
                        isAngerTimerRunning 
                          ? 'bg-slate-850 hover:bg-slate-800 text-slate-350 border border-slate-750' 
                          : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-650 hover:to-rose-700 text-white'
                      }`}
                    >
                      {isAngerTimerRunning ? "Pause Timer ⏸️" : "Start 30s Pause ▶️"}
                    </button>
                    <button
                      onClick={handleResetAngerTimer}
                      className="px-5 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-350 text-xs font-semibold rounded-2xl transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Box: DBT TIPP Protocol (Col Span: 6) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    DBT TIPP Crisis Protocol
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 mt-3">High-Frustration Crisis Interventions</h3>
                  <p className="text-xs text-slate-400">
                    Dialectical Behavior Therapy (DBT) tools designed to bring you down from extreme emotional distress.
                  </p>
                </div>

                {/* TIPP details cards stack */}
                <div className="space-y-3.5 flex-1 overflow-y-auto my-6 pr-1">
                  {TIPP_STEPS.map((step, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-1">
                      <h4 className="font-bold text-red-400 text-xs uppercase tracking-wider">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-350 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Use TIPP when emotions feel 8/10 or higher.</span>
                </div>

              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
