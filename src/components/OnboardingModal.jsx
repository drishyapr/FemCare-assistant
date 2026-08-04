import { useState } from 'react';

const HEALTH_CONDITION_TAGS = [
  'PCOS',
  'Endometriosis',
  'Thyroid Imbalance',
  'Migraines',
  'Irregular Cycles',
  'Anxiety'
];

export default function OnboardingModal({ 
  profileData, 
  isEditing = false, 
  onComplete, 
  onCancel 
}) {
  const [step, setStep] = useState(1); // 1, 2, or 3

  // Form states initialized function-wise or via profileData
  const [name, setName] = useState(profileData?.name || '');
  const [email, setEmail] = useState(profileData?.email || '');
  const [age, setAge] = useState(profileData?.age || '');

  const [heightUnit, setHeightUnit] = useState(profileData?.heightUnit || 'cm');
  const [heightCm, setHeightCm] = useState(profileData?.heightCm || '');
  const [heightFeet, setHeightFeet] = useState(profileData?.heightFeet || '');
  const [heightInches, setHeightInches] = useState(profileData?.heightInches || '');

  const [weightUnit, setWeightUnit] = useState(profileData?.weightUnit || 'kg');
  const [weight, setWeight] = useState(profileData?.weight || '');

  const [healthConditions, setHealthConditions] = useState(profileData?.healthConditions || []);
  const [customHealthNotes, setCustomHealthNotes] = useState(profileData?.customHealthNotes || '');

  const [cycleLength, setCycleLength] = useState(profileData?.cycleLength || '28');
  const [lastPeriodDate, setLastPeriodDate] = useState(profileData?.lastPeriodDate || '');
  const [goals, setGoals] = useState(profileData?.goals || '');

  const [errors, setErrors] = useState({});

  // Form validations
  const validateStep = (currentStep) => {
    const nextErrors = {};
    if (currentStep === 1) {
      if (!name.trim()) nextErrors.name = 'Name/Nickname is required';
      if (!email.trim()) {
        nextErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        nextErrors.email = 'Invalid email format';
      }
      if (!age) {
        nextErrors.age = 'Age is required';
      } else if (isNaN(age) || parseInt(age) <= 0 || parseInt(age) > 120) {
        nextErrors.age = 'Please enter a valid age (1-120)';
      }
    } else if (currentStep === 2) {
      if (heightUnit === 'cm') {
        if (!heightCm) {
          nextErrors.height = 'Height is required';
        } else if (isNaN(heightCm) || parseFloat(heightCm) <= 0) {
          nextErrors.height = 'Enter a valid height';
        }
      } else {
        if (!heightFeet) {
          nextErrors.height = 'Feet and inches are required';
        } else if (isNaN(heightFeet) || parseInt(heightFeet) < 0) {
          nextErrors.height = 'Enter a valid feet value';
        }
        if (heightInches && (isNaN(heightInches) || parseInt(heightInches) < 0 || parseInt(heightInches) >= 12)) {
          nextErrors.height = 'Inches must be between 0 and 11';
        }
      }

      if (!weight) {
        nextErrors.weight = 'Weight is required';
      } else if (isNaN(weight) || parseFloat(weight) <= 0) {
        nextErrors.weight = 'Enter a valid weight';
      }
    } else if (currentStep === 3) {
      if (!cycleLength) {
        nextErrors.cycleLength = 'Average cycle length is required';
      } else if (isNaN(cycleLength) || parseInt(cycleLength) < 15 || parseInt(cycleLength) > 50) {
        nextErrors.cycleLength = 'Cycle length must be between 15 and 50 days';
      }
      if (!lastPeriodDate) {
        nextErrors.lastPeriodDate = 'Last period start date is required';
      } else {
        const selected = new Date(lastPeriodDate);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selected > today) {
          nextErrors.lastPeriodDate = 'Date cannot be in the future';
        }
      }
      if (!goals.trim()) nextErrors.goals = 'Primary wellness goal is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSave = () => {
    if (validateStep(step)) {
      const profile = {
        name: name.trim(),
        email: email.trim(),
        age: parseInt(age),
        heightUnit,
        heightCm: heightUnit === 'cm' ? parseFloat(heightCm) : null,
        heightFeet: heightUnit === 'ft/in' ? parseInt(heightFeet) : null,
        heightInches: heightUnit === 'ft/in' ? (heightInches ? parseInt(heightInches) : 0) : null,
        weightUnit,
        weight: parseFloat(weight),
        healthConditions,
        customHealthNotes: customHealthNotes.trim(),
        cycleLength: parseInt(cycleLength),
        lastPeriodDate,
        goals: goals.trim()
      };
      onComplete(profile);
    }
  };

  const toggleCondition = (condition) => {
    if (healthConditions.includes(condition)) {
      setHealthConditions(healthConditions.filter((c) => c !== condition));
    } else {
      setHealthConditions([...healthConditions, condition]);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-[#232d25]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none animate-fadeIn">
      
      {/* Content Bento Card */}
      <div className="bg-sage-card border border-sage-border rounded-3xl p-8 shadow-xl max-w-lg w-full relative overflow-hidden flex flex-col my-auto transition-all">
        
        {/* Decorative Orb Hues */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-moss pointer-events-none" />
        
        {/* Header Indicators */}
        <div className="flex justify-between items-center mb-6 border-b border-sage-border pb-4 flex-shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-moss bg-sage-hover border border-sage-border px-3 py-1 rounded-full">
              {isEditing ? '👤 Update Profile' : '🌱 Welcome to FemCare'}
            </span>
            <h3 className="text-lg font-extrabold text-charcoal mt-2.5">
              {isEditing ? 'Edit Profile & Baseline Metrics' : 'Let\'s set up your profile'}
            </h3>
          </div>
          
          {/* Close button for Edit Mode */}
          {isEditing && onCancel && (
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-xl bg-sage-hover hover:bg-rose-50 text-charcoal-muted hover:text-rose-600 border border-sage-border flex items-center justify-center font-bold cursor-pointer transition-all active:scale-95"
              title="Close without saving"
            >
              ✕
            </button>
          )}
        </div>

        {/* Progress steps index */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-1.5">
              <div className={`h-1.5 rounded-full flex-1 transition-all ${
                step >= s ? 'bg-moss' : 'bg-sage-border'
              }`} />
              <span className={`text-[10px] font-bold ${
                step === s ? 'text-moss' : 'text-charcoal-muted'
              }`}>
                0{s}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body steps */}
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Nickname / Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold"
                />
                {errors.name && <span className="text-[10px] font-bold text-rose-600 mt-1">⚠️ {errors.name}</span>}
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold"
                />
                {errors.email && <span className="text-[10px] font-bold text-rose-600 mt-1">⚠️ {errors.email}</span>}
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Age (Years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                  className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold"
                />
                {errors.age && <span className="text-[10px] font-bold text-rose-600 mt-1">⚠️ {errors.age}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Physical & Health Baseline */}
          {step === 2 && (
            <div className="space-y-4">
              
              {/* Height Configuration */}
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Height</label>
                  <div className="flex bg-sage-bg border border-sage-border rounded-lg overflow-hidden p-0.5 shadow-sm">
                    {['cm', 'ft/in'].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setHeightUnit(unit)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${
                          heightUnit === unit 
                            ? 'bg-moss text-white shadow-sm' 
                            : 'text-charcoal-muted hover:text-charcoal'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                {heightUnit === 'cm' ? (
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold w-full"
                  />
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold flex-1 text-center"
                    />
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold flex-1 text-center"
                    />
                  </div>
                )}
                {errors.height && <span className="text-[10px] font-bold text-rose-600 mt-0.5">⚠️ {errors.height}</span>}
              </div>

              {/* Weight Configuration */}
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Weight</label>
                  <div className="flex bg-sage-bg border border-sage-border rounded-lg overflow-hidden p-0.5 shadow-sm">
                    {['kg', 'lbs'].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setWeightUnit(unit)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${
                          weightUnit === unit 
                            ? 'bg-moss text-white shadow-sm' 
                            : 'text-charcoal-muted hover:text-charcoal'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold w-full"
                />
                {errors.weight && <span className="text-[10px] font-bold text-rose-600 mt-0.5">⚠️ {errors.weight}</span>}
              </div>

              {/* Health Conditions Multi-Select Grid */}
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Current Health Conditions / Medical History</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {HEALTH_CONDITION_TAGS.map((tag) => {
                    const isSelected = healthConditions.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleCondition(tag)}
                        className={`text-[10px] font-bold py-2 px-3 border rounded-xl transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-moss text-white border-moss shadow-sm font-extrabold'
                            : 'bg-sage-bg border-sage-border text-charcoal hover:bg-sage-hover'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Medical Notes Field */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Additional Conditions / Medical Notes</label>
                <textarea
                  value={customHealthNotes}
                  onChange={(e) => setCustomHealthNotes(e.target.value)}
                  className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 h-20 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold resize-none"
                />
              </div>

            </div>
          )}

          {/* Step 3: Cycle Baseline & Goals */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Average Cycle Length (Days)</label>
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  min="15"
                  max="50"
                  className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold"
                />
                {errors.cycleLength && <span className="text-[10px] font-bold text-rose-600 mt-1">⚠️ {errors.cycleLength}</span>}
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Last Period Start Date</label>
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold"
                />
                {errors.lastPeriodDate && <span className="text-[10px] font-bold text-rose-600 mt-1">⚠️ {errors.lastPeriodDate}</span>}
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">Primary Wellness Goal</label>
                <input
                  type="text"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="bg-sage-bg border border-sage-border text-charcoal text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss focus:bg-sage-card transition-all font-semibold"
                />
                {errors.goals && <span className="text-[10px] font-bold text-rose-600 mt-1">⚠️ {errors.goals}</span>}
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between items-center border-t border-sage-border pt-4 mt-6 flex-shrink-0 gap-3">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-5 py-3 bg-sage-hover hover:bg-sage-bg border border-sage-border text-charcoal-muted hover:text-charcoal text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-moss hover:bg-moss-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm ml-auto"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-moss hover:bg-moss-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm ml-auto"
            >
              {isEditing ? 'Save & Close ✓' : 'Complete Setup ✓'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
