import React from 'react';

export default function Sidebar({ isCollapsed, onToggleCollapse }) {
  return (
    <div className={`bg-slate-900 text-white flex flex-col h-screen p-4 border-r border-slate-800 transition-all duration-300 ease-in-out relative ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-5 w-6 h-6 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-white rounded-full flex items-center justify-center text-xs cursor-pointer shadow-md shadow-slate-950/50 hover:scale-105 active:scale-95 transition-all z-50"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? '▶' : '◀'}
      </button>

      {/* Header Logo */}
      <div className={`mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
        <span className="text-2xl font-bold text-pink-505 select-none animate-pulse">🌸</span>
        {!isCollapsed && (
          <span className="text-lg font-bold font-sans tracking-wider text-pink-100 whitespace-nowrap overflow-hidden transition-all duration-300">
            FemCare RAG
          </span>
        )}
      </div>

      {/* Workspace Menu */}
      <div className="flex-1 space-y-4 overflow-hidden">
        <div className={`text-[10px] uppercase text-slate-500 font-semibold tracking-wider ${isCollapsed ? 'text-center' : 'px-1'}`}>
          {isCollapsed ? '•••' : 'Workspace'}
        </div>
        
        <nav className="space-y-1">
          <a
            href="#"
            className={`flex items-center rounded-xl bg-gradient-to-r from-pink-950/40 to-rose-950/20 text-pink-300 border border-pink-900/40 font-medium transition-all ${
              isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2.5'
            }`}
            title="Health Assistant"
          >
            <span className="text-base">💬</span>
            {!isCollapsed && <span className="text-sm whitespace-nowrap overflow-hidden transition-all duration-300">Health Assistant</span>}
          </a>
        </nav>
      </div>

      {/* Footer Disclaimer/Status */}
      <div className="border-t border-slate-800/80 pt-4 flex items-center justify-center">
        {isCollapsed ? (
          <span className="text-emerald-400 text-xs" title="Connection is private and secure">🔒</span>
        ) : (
          <span className="text-[10px] text-slate-500 text-center tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300">
            🔒 Private & Secure Connection
          </span>
        )}
      </div>
    </div>
  );
}
