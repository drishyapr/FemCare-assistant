import { useState, useEffect, useRef } from 'react';

export default function TopHeader({ activeView, onLock, onChangePin, onResetVault }) {
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

  const titleInfo = getTitle();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800/80 px-6 flex items-center justify-between text-white relative z-40 flex-shrink-0 select-none">
      {/* Left side: Dynamic Title Badge */}
      <div className="flex items-center space-x-2.5">
        <span className="text-lg leading-none">{titleInfo.icon}</span>
        <h1 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
          {titleInfo.label}
        </h1>
      </div>

      {/* Right side: Security Controls */}
      <div className="flex items-center gap-3 relative">
        {/* Settings Dropdown Container */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700/60 hover:bg-slate-850/60 text-slate-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-inner"
            title="Settings"
          >
            <span>⚙️ Settings</span>
            <span className="text-[10px] text-slate-500">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50 flex flex-col overflow-hidden animate-fadeIn">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onChangePin();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>🔒 Change PIN</span>
              </button>
              <button
                onClick={handleResetClick}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors border-t border-slate-800/50 cursor-pointer text-left"
              >
                <span>⚠️ Reset Vault</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Lock Button */}
        <button
          onClick={onLock}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-pink-955/25 border border-pink-900/40 text-pink-300 hover:bg-pink-900/30 hover:border-pink-500/40 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
          title="Quick Lock App"
        >
          <span className="text-sm">🔒</span>
        </button>
      </div>
    </header>
  );
}
