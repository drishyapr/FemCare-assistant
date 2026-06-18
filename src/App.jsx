import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Disclaimer from './components/Disclaimer';
import EmergencyAlert from './components/EmergencyAlert';

function App() {
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <ChatWindow />
        
        {/* Persistent Disclaimer */}
        <Disclaimer />
        
        {/* Dev tool/test trigger button */}
        <div className="absolute top-4 right-4 z-40">
          <button
            onClick={() => setShowEmergency(true)}
            className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg border border-red-200 font-medium transition-colors shadow-sm"
          >
            Test Safety Trigger 🚨
          </button>
        </div>
      </div>

      {/* Emergency Modal Dialog */}
      <EmergencyAlert isVisible={showEmergency} onClose={() => setShowEmergency(false)} />
    </div>
  );
}

export default App;
