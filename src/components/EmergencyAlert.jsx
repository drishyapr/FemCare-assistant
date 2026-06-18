import React from 'react';

export default function EmergencyAlert({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-red-100 overflow-hidden transform transition-all">
        <div className="bg-red-500 p-6 text-white text-center">
          <span className="text-4xl block mb-2">🚨</span>
          <h3 className="text-xl font-bold tracking-wide">High Priority Safety Alert</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            It looks like you might be describing a high-risk medical emergency or a critical situation that requires immediate attention.
          </p>
          <div className="bg-red-50 text-red-900 border border-red-200 p-4 rounded-xl text-xs space-y-1 font-medium">
            <p>• Please call your local emergency services (911 or 112) immediately.</p>
            <p>• Contact a qualified healthcare professional or visit the nearest emergency room.</p>
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-500 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Close
            </button>
            <a
              href="tel:911"
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-center font-semibold rounded-xl transition-colors text-sm shadow-md shadow-red-200"
            >
              Call Emergency
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
