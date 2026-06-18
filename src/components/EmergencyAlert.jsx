import React from 'react';

export default function EmergencyAlert({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-800 overflow-hidden transform transition-all">
        {/* Red Header Banner */}
        <div className="bg-gradient-to-r from-red-650 to-rose-600 p-6 text-white text-center border-b border-slate-800">
          <span className="text-4xl block mb-2 animate-bounce">🚨</span>
          <h3 className="text-xl font-bold tracking-wide">High Priority Safety Alert</h3>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-slate-300 leading-relaxed text-sm">
            It looks like you might be describing a high-risk medical emergency or a critical situation that requires immediate attention.
          </p>
          <div className="bg-red-950/20 text-red-300 border border-red-900/40 p-4 rounded-xl text-xs space-y-1.5 font-medium leading-relaxed">
            <p>• Please call your local emergency services (911 or 112) immediately.</p>
            <p>• Contact a qualified healthcare professional or visit the nearest emergency room.</p>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-800 text-slate-400 hover:text-slate-300 font-semibold rounded-xl hover:bg-slate-850 transition-colors text-sm cursor-pointer"
            >
              Close
            </button>
            <a
              href="tel:911"
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-center font-semibold rounded-xl transition-all text-sm shadow-lg shadow-red-950/50 cursor-pointer active:scale-95"
            >
              Call Emergency
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
