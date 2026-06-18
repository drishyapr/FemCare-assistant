import React from 'react';

export default function Disclaimer() {
  return (
    <div className="bg-amber-950/20 border-l-4 border-amber-500/80 p-4 text-xs text-amber-200/90 leading-relaxed max-w-4xl mx-auto my-4 rounded-r-xl shadow-md border border-y-amber-950/10 border-r-amber-950/10">
      <div className="flex items-start space-x-2.5">
        <span className="text-sm">⚠️</span>
        <div>
          <strong className="font-semibold block mb-0.5 text-amber-400">Medical Information Disclaimer</strong>
          This application is an educational resource grounded in verified medical literature. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a healthcare provider for medical concerns.
        </div>
      </div>
    </div>
  );
}
