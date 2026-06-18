import React from 'react';

export default function Disclaimer() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-xs text-amber-800 leading-relaxed max-w-4xl mx-auto my-4 rounded-r-lg shadow-sm">
      <div className="flex items-start space-x-2">
        <span className="text-base">⚠️</span>
        <div>
          <strong className="font-semibold block mb-0.5">Medical Information Disclaimer</strong>
          This application is an educational information resource powered by retrieved medical literature. It does not provide medical diagnostics, medical advice, or treatment plans. Always consult with a qualified healthcare professional for medical concerns.
        </div>
      </div>
    </div>
  );
}
