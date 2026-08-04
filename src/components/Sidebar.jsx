

export default function Sidebar({ isCollapsed, onToggleCollapse, activeView, onChangeView }) {
  return (
    <div className={`bg-sage-card text-charcoal flex flex-col h-screen flex-shrink-0 p-4 border-r border-sage-border transition-all duration-300 ease-in-out relative z-30 shadow-sm ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-5 w-6 h-6 bg-sage-card border border-sage-border hover:bg-sage-hover text-charcoal-muted rounded-full flex items-center justify-center text-xs cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all z-50"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? '▶' : '◀'}
      </button>

      {/* Header Logo */}
      <div className={`mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
        <span className="text-2xl font-bold text-moss select-none animate-pulse">🌸</span>
        {!isCollapsed && (
          <span className="text-base font-extrabold tracking-wider text-moss whitespace-nowrap overflow-hidden transition-all duration-300 uppercase">
            FemCare RAG
          </span>
        )}
      </div>

      {/* Workspace Menu */}
      <div className="flex-1 space-y-4 overflow-hidden">
        <div className={`text-[10px] uppercase text-charcoal-muted font-bold tracking-wider ${isCollapsed ? 'text-center' : 'px-1'}`}>
          {isCollapsed ? '•••' : 'Workspace'}
        </div>
        
        <nav className="space-y-1.5">
          {/* Health Assistant tab */}
          <button
            onClick={() => onChangeView('chat')}
            className={`w-full flex items-center rounded-xl font-semibold transition-all cursor-pointer ${
              activeView === 'chat'
                ? 'bg-moss text-white shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sage-hover border border-transparent'
            } ${isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5'}`}
            title="Health Assistant"
          >
            <span className="text-base">💬</span>
            {!isCollapsed && <span className="text-xs whitespace-nowrap overflow-hidden transition-all duration-300">Health Assistant</span>}
          </button>

          {/* Wellness Tracker tab */}
          <button
            onClick={() => onChangeView('tracker')}
            className={`w-full flex items-center rounded-xl font-semibold transition-all cursor-pointer ${
              activeView === 'tracker'
                ? 'bg-moss text-white shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sage-hover border border-transparent'
            } ${isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5'}`}
            title="Wellness Tracker"
          >
            <span className="text-base">📊</span>
            {!isCollapsed && <span className="text-xs whitespace-nowrap overflow-hidden transition-all duration-300">Wellness Tracker</span>}
          </button>

          {/* Phase & Lifestyle tab */}
          <button
            onClick={() => onChangeView('lifestyle')}
            className={`w-full flex items-center rounded-xl font-semibold transition-all cursor-pointer ${
              activeView === 'lifestyle'
                ? 'bg-moss text-white shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sage-hover border border-transparent'
            } ${isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5'}`}
            title="Phase & Lifestyle"
          >
            <span className="text-base">🌿</span>
            {!isCollapsed && <span className="text-xs whitespace-nowrap overflow-hidden transition-all duration-300">Phase & Lifestyle</span>}
          </button>

          {/* Mental Health tab */}
          <button
            onClick={() => onChangeView('mental')}
            className={`w-full flex items-center rounded-xl font-semibold transition-all cursor-pointer ${
              activeView === 'mental'
                ? 'bg-moss text-white shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sage-hover border border-transparent'
            } ${isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5'}`}
            title="Mental Health"
          >
            <span className="text-base">🧠</span>
            {!isCollapsed && <span className="text-xs whitespace-nowrap overflow-hidden transition-all duration-300">Mental Health</span>}
          </button>
        </nav>
      </div>

      {/* Footer Disclaimer/Status */}
      <div className="border-t border-sage-border pt-4 flex items-center justify-center">
        {isCollapsed ? (
          <span className="text-moss text-xs" title="Connection is private and secure">🔒</span>
        ) : (
          <span className="text-[10px] text-charcoal-muted text-center font-bold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 uppercase">
            🔒 Private & Secure Connection
          </span>
        )}
      </div>
    </div>
  );
}
