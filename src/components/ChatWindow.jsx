import React from 'react';

export default function ChatWindow() {
  const suggestions = [
    "What are common symptoms of iron deficiency?",
    "Tell me about the follicular phase.",
    "Is irregular menstruation normal?"
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center px-8 shadow-sm">
        <div>
          <h2 className="font-semibold text-slate-200 text-lg tracking-wide">Safe Women's Health Portal</h2>
          <p className="text-xs text-emerald-400 flex items-center font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse"></span>
            Grounded in Verified Medical Data
          </p>
        </div>
      </header>

      {/* Workspace / Chat history area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex justify-start">
          <div className="bg-slate-900 border border-slate-800/80 text-slate-200 max-w-xl rounded-2xl p-4 shadow-lg leading-relaxed text-sm">
            Welcome to the <strong className="text-pink-400">FemCare RAG Assistant</strong>. Ask me any women's health question.
          </div>
        </div>
      </div>

      {/* Suggested chips & Input area */}
      <div className="p-6 bg-slate-900/30 border-t border-slate-850">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((chip, idx) => (
              <button
                key={idx}
                className="text-xs bg-pink-950/20 hover:bg-pink-900/30 text-pink-300 font-medium px-3.5 py-1.5 rounded-full border border-pink-900/40 hover:border-pink-800 transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Form input */}
          <form className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask a private women's health question..."
              className="w-full pl-5 pr-12 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:bg-slate-900 text-slate-100 placeholder-slate-500 transition-all shadow-inner text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 p-2 text-pink-400 hover:text-pink-300 rounded-lg transition-colors cursor-pointer"
            >
              🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
