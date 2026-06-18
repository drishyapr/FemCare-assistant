import React from 'react';

export default function ChatWindow() {
  const suggestions = [
    "What are common symptoms of iron deficiency?",
    "Tell me about the follicular phase.",
    "Is irregular menstruation normal?"
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 shadow-sm">
        <div>
          <h2 className="font-semibold text-slate-800 text-lg">Safe Women's Health Portal</h2>
          <p className="text-xs text-emerald-600 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1"></span>
            Grounded in Verified Medical Data
          </p>
        </div>
      </header>

      {/* Workspace / Chat history area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex justify-start">
          <div className="bg-white border border-slate-200 text-slate-700 max-w-xl rounded-2xl p-4 shadow-sm leading-relaxed">
            Welcome to the <strong>FemCare RAG Assistant</strong>. Ask me any women's health question.
          </div>
        </div>
      </div>

      {/* Suggested chips & Input area */}
      <div className="p-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((chip, idx) => (
              <button
                key={idx}
                className="text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 font-medium px-3.5 py-1.5 rounded-full border border-pink-200/60 transition-colors"
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
              className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-slate-700 placeholder-slate-400 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-3 p-2 text-pink-500 hover:text-pink-600 rounded-lg transition-colors"
            >
              🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
