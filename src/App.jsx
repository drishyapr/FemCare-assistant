import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Disclaimer from './components/Disclaimer';
import EmergencyAlert from './components/EmergencyAlert';
import TrackingTools from './components/TrackingTools';

function App() {
  const [showEmergency, setShowEmergency] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // 'chat' or 'tracker'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* Main Content Dashboard */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeView === 'chat' ? (
          /* Chat Workspace (Center Pane with White Background) */
          <div className="flex-1 flex flex-col min-w-0 bg-white relative">
            <ChatWindow />
            
            {/* Persistent Disclaimer */}
            <Disclaimer />
            
            {/* Dev tool/test trigger button (styled for light header) */}
            <div className="absolute top-3 right-4 z-40">
              <button
                onClick={() => setShowEmergency(true)}
                className="bg-red-50 hover:bg-red-100 text-red-650 text-[11px] px-3 py-1.5 rounded-lg border border-red-200 font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
              >
                Test Safety Trigger 🚨
              </button>
            </div>
          </div>
        ) : (
          /* Wellness Tracker Dashboard Pane (Dark Theme) */
          <TrackingTools />
        )}
      </div>

      {/* Emergency Modal Dialog */}
      <EmergencyAlert isVisible={showEmergency} onClose={() => setShowEmergency(false)} />
    </div>
  );
}

export default App;
