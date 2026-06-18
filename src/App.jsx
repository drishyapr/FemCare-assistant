import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Disclaimer from './components/Disclaimer';
import EmergencyAlert from './components/EmergencyAlert';
import TrackingTools from './components/TrackingTools';

function App() {
  const [showEmergency, setShowEmergency] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Multi-Pane Content Dashboard */}
      <div className="flex-1 flex flex-row min-w-0">
        
        {/* Chat Workspace (Center Pane) */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <ChatWindow />
          
          {/* Persistent Disclaimer */}
          <Disclaimer />
          
          {/* Dev tool/test trigger button (aligned inside the Chat area) */}
          <div className="absolute top-3.5 right-4 z-40">
            <button
              onClick={() => setShowEmergency(true)}
              className="bg-red-950/30 hover:bg-red-900/40 text-red-300 text-[11px] px-2.5 py-1.5 rounded-lg border border-red-900/50 font-medium transition-colors shadow-sm cursor-pointer"
            >
              Test Safety Trigger 🚨
            </button>
          </div>
        </div>

        {/* Wellness & Cycle Tracking Panel (Right Pane) */}
        <TrackingTools />
        
      </div>

      {/* Emergency Modal Dialog */}
      <EmergencyAlert isVisible={showEmergency} onClose={() => setShowEmergency(false)} />
    </div>
  );
}

export default App;
