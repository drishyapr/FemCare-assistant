import { useState, useEffect, useRef } from 'react';

export default function TopHeader({ activeView, onLock, onChangePin, onResetVault, onEditProfile, userName }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close settings dropdown if clicking outside the element
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetClick = () => {
    setIsDropdownOpen(false);
    const confirmReset = window.confirm(
      "⚠️ WARNING: Are you sure you want to reset your vault?\n\nThis will permanently delete all logs, cycle tracking entries, chat history, and your security PIN. This operation is irreversible."
    );
    if (confirmReset) {
      onResetVault();
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'chat':
        return { icon: '💬', label: 'Health Assistant' };
      case 'tracker':
        return { icon: '📊', label: 'Wellness Tracker' };
      case 'lifestyle':
        return { icon: '🌿', label: 'Phase & Lifestyle' };
      case 'mental':
        return { icon: '🧠', label: 'Mental Health' };
      default:
        return { icon: '🌸', label: 'FemCare Assistant' };
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Good Evening";
    let emoji = "🌙";
    if (hour < 12) {
      timeGreeting = "Good Morning";
      emoji = "🌅";
    } else if (hour < 17) {
      timeGreeting = "Good Afternoon";
      emoji = "☀️";
    }
    
    const name = userName ? userName : "Welcome back";
    return `${timeGreeting}, ${name} ${emoji}`;
  };

  const titleInfo = getTitle();
  const greetingText = getGreeting();

  return (
    <header className="h-14 bg-sage-card border-b border-sage-border px-6 flex items-center justify-between text-charcoal relative z-40 flex-shrink-0 select-none shadow-sm">
      {/* Left side: Dynamic Title Badge & Greeting */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <span className="text-lg leading-none">{titleInfo.icon}</span>
          <h1 className="text-sm font-extrabold tracking-wider text-charcoal uppercase">
            {titleInfo.label}
          </h1>
        </div>
        <div className="hidden sm:block h-4 w-px bg-sage-border" />
        <span className="hidden sm:inline text-xs font-semibold text-charcoal-muted">
          {greetingText}
        </span>
      </div>

      {/* Right side: Security Controls */}
      <div className="flex items-center gap-3 relative">
        {/* Settings Dropdown Container */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sage-hover border border-sage-border text-charcoal-muted hover:text-charcoal hover:bg-sage-bg rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Settings"
          >
            <span>⚙️ Settings</span>
            <span className="text-[10px] text-charcoal-muted">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-sage-card border border-sage-border rounded-2xl shadow-xl py-2 z-50 flex flex-col overflow-hidden animate-fadeIn">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onEditProfile();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-charcoal-muted hover:bg-sage-hover hover:text-charcoal transition-colors cursor-pointer text-left"
              >
                <span>👤 Edit Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onChangePin();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-charcoal-muted hover:bg-sage-hover hover:text-charcoal transition-colors border-t border-sage-border cursor-pointer text-left"
              >
                <span>🔒 Change PIN</span>
              </button>
              <button
                onClick={handleResetClick}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border-t border-sage-border cursor-pointer text-left"
              >
                <span>⚠️ Reset Vault</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Lock Button */}
        <button
          onClick={onLock}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-sage-hover border border-sage-border text-moss hover:bg-moss hover:text-white hover:border-moss transition-all cursor-pointer active:scale-95 shadow-sm"
          title="Quick Lock App"
        >
          <span className="text-sm">🔒</span>
        </button>
      </div>
    </header>
  );
}
