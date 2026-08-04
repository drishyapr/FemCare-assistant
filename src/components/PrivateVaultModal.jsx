import { useState } from 'react';

// Self-contained keyframe animation styling for the shake effect
const shakeStyle = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    15%, 45%, 75% { transform: translateX(-8px); }
    30%, 60%, 90% { transform: translateX(8px); }
  }
  .shake-animation {
    animation: shake 0.4s ease-in-out;
  }
`;

export default function PrivateVaultModal({ isLocked, onUnlock, isChangingPin, onCancelChangePin }) {
  const [pin, setPin] = useState('');
  const [step, setStep] = useState(() => {
    if (isChangingPin) {
      return 'change_verify';
    } else if (!localStorage.getItem('femcare_vault_pin')) {
      return 'setup';
    } else {
      return 'enter';
    }
  }); // 'setup', 'confirm', 'enter', 'change_verify', 'change_new', 'change_confirm'
  const [setupPin, setSetupPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Check saved PIN in localStorage
  const savedPin = localStorage.getItem('femcare_vault_pin');

  const handleKeyPress = (num) => {
    if (pin.length >= 4) return;
    setError('');
    const nextPin = pin + num;
    setPin(nextPin);

    // Trigger check immediately upon entering 4 digits
    if (nextPin.length === 4) {
      setTimeout(() => {
        handlePinSubmit(nextPin);
      }, 250);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handlePinSubmit = (enteredPin) => {
    if (step === 'setup') {
      setSetupPin(enteredPin);
      setPin('');
      setStep('confirm');
    } else if (step === 'confirm') {
      if (enteredPin === setupPin) {
        localStorage.setItem('femcare_vault_pin', enteredPin);
        onUnlock();
      } else {
        triggerError('PINs do not match. Please start over.');
        setSetupPin('');
        setPin('');
        setStep('setup');
      }
    } else if (step === 'enter') {
      if (enteredPin === savedPin) {
        onUnlock();
      } else {
        triggerError('Incorrect PIN. Please try again.');
        setPin('');
      }
    } else if (step === 'change_verify') {
      if (enteredPin === savedPin) {
        setPin('');
        setStep('change_new');
      } else {
        triggerError('Incorrect current PIN. Please try again.');
        setPin('');
      }
    } else if (step === 'change_new') {
      setNewPin(enteredPin);
      setPin('');
      setStep('change_confirm');
    } else if (step === 'change_confirm') {
      if (enteredPin === newPin) {
        localStorage.setItem('femcare_vault_pin', enteredPin);
        onUnlock();
      } else {
        triggerError('New PINs do not match. Please try again.');
        setNewPin('');
        setPin('');
        setStep('change_new');
      }
    }
  };

  const triggerError = (msg) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  };

  const getStepText = () => {
    switch (step) {
      case 'setup':
        return {
          badge: 'Setup Required',
          title: 'Create Your Private Vault PIN',
          desc: 'Establish a 4-digit PIN to secure cycle logs and clinical assessments.',
        };
      case 'confirm':
        return {
          badge: 'PIN Verification',
          title: 'Confirm Your Security PIN',
          desc: 'Please re-enter the 4-digit PIN to complete the activation.',
        };
      case 'change_verify':
        return {
          badge: 'Change PIN',
          title: 'Enter Current Security PIN',
          desc: 'Verify authorization by providing your active 4-digit passcode.',
        };
      case 'change_new':
        return {
          badge: 'Change PIN',
          title: 'Enter New Security PIN',
          desc: 'Specify a new 4-digit PIN for future authorization access.',
        };
      case 'change_confirm':
        return {
          badge: 'Change PIN',
          title: 'Confirm New Security PIN',
          desc: 'Verify and re-enter the new 4-digit passcode.',
        };
      case 'enter':
      default:
        return {
          badge: 'Vault Locked',
          title: 'Enter Private Vault PIN',
          desc: 'Provide your 4-digit authorization passcode to access FemCare.',
        };
    }
  };

  if (!isLocked) return null;

  const currentStepInfo = getStepText();

  return (
    <>
      <style>{shakeStyle}</style>
      <div className="fixed inset-0 z-[9999] bg-[#232d25]/60 backdrop-blur-md flex items-center justify-center select-none overflow-y-auto p-4 animate-fadeIn">
        {/* Animated Background Decorative Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-moss/10 to-sage/10 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-moss/5 to-sage/10 blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

        {/* Content Box */}
        <div className={`bg-sage-card border border-sage-border rounded-3xl p-8 shadow-xl max-w-sm w-full relative overflow-hidden flex flex-col items-center transition-all duration-300 ${
          isShaking ? 'shake-animation' : ''
        }`}>
          {/* Top Header/Badge */}
          <div className="flex flex-col items-center text-center space-y-2.5 w-full">
            <span className="text-[10px] uppercase font-bold tracking-widest px-3.5 py-1 bg-sage-hover border border-sage-border text-moss rounded-full shadow-sm">
              🔒 {currentStepInfo.badge}
            </span>
            <h3 className="text-xl font-extrabold tracking-tight text-charcoal mt-1">
              {currentStepInfo.title}
            </h3>
            <p className="text-xs text-charcoal-muted font-semibold leading-relaxed px-2">
              {currentStepInfo.desc}
            </p>
          </div>

          {/* Dots Indicator Screen */}
          <div className="flex items-center justify-center gap-4 my-7">
            {[0, 1, 2, 3].map((index) => {
              const hasDigit = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                    hasDigit
                      ? 'bg-moss border border-moss-hover scale-110 shadow-sm'
                      : 'border-2 border-sage-border bg-sage-bg'
                  }`}
                />
              );
            })}
          </div>

          {/* Feedback & Error Area */}
          <div className="h-6 w-full text-center mb-4">
            {error && (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl shadow-sm">
                ⚠️ {error}
              </span>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-y-3.5 gap-x-6 w-full max-w-[260px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num.toString())}
                className="w-16 h-16 rounded-full bg-sage-bg border border-sage-border hover:bg-sage-hover text-charcoal font-bold text-xl flex items-center justify-center cursor-pointer transition-all active:scale-95 duration-100 shadow-sm"
              >
                {num}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="w-16 h-16 rounded-full text-charcoal-muted hover:text-charcoal text-xs font-bold uppercase tracking-wider flex items-center justify-center cursor-pointer transition-colors active:scale-95"
            >
              Clear
            </button>

            {/* Zero Button */}
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="w-16 h-16 rounded-full bg-sage-bg border border-sage-border hover:bg-sage-hover text-charcoal font-bold text-xl flex items-center justify-center cursor-pointer transition-all active:scale-95 duration-100 shadow-sm"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleBackspace}
              className="w-16 h-16 rounded-full text-charcoal-muted hover:text-charcoal text-base flex items-center justify-center cursor-pointer transition-colors active:scale-95 font-bold"
              title="Delete Digit"
            >
              ⌫
            </button>
          </div>

          {/* Cancel Option (Visible only in change-PIN mode to return to app safety) */}
          {isChangingPin && onCancelChangePin && (
            <button
              type="button"
              onClick={onCancelChangePin}
              className="mt-6 text-xs text-charcoal-muted hover:text-moss font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel Change
            </button>
          )}
        </div>
      </div>
    </>
  );
}
