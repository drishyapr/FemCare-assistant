import React from 'react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen p-4 border-r border-slate-800">
      <div className="mb-8 flex items-center space-x-2">
        <span className="text-2xl font-bold text-pink-500">🌸</span>
        <span className="text-xl font-bold font-sans tracking-wide">FemCare RAG</span>
      </div>
      <div className="flex-1 space-y-4">
        <div className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Workspace</div>
        <nav className="space-y-1">
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-pink-900/30 text-pink-300 font-medium transition-colors">
            <span>💬</span>
            <span>Health Assistant</span>
          </a>
          {/* Future sections like Cycles, Library can be added here */}
        </nav>
      </div>
      <div className="border-t border-slate-800 pt-4 text-xs text-slate-500 text-center">
        Private & Secure Connection
      </div>
    </div>
  );
}
