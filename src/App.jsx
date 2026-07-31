import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Disclaimer from './components/Disclaimer';
import EmergencyAlert from './components/EmergencyAlert';
import TrackingTools from './components/TrackingTools';
import PhaseLifestyle from './components/PhaseLifestyle';
import MentalHealth from './components/MentalHealth';

function App() {
  const [showEmergency, setShowEmergency] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // 'chat', 'tracker', 'lifestyle', or 'mental'

  const handleCrisisSOS = () => {
    setActiveView('mental');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* Main Content Dashboard */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeView === 'chat' ? (
          /* Chat Workspace (Center Pane with White Background) */
          <div className="flex-1 flex flex-col min-w-0 bg-white relative overflow-hidden">
            <ChatWindow 
              onShowEmergency={() => setShowEmergency(true)} 
              onCrisisSOS={handleCrisisSOS}
            />
          </div>
        ) : activeView === 'tracker' ? (
          /* Wellness Tracker Dashboard Pane (Dark Theme) */
          <TrackingTools onCrisisSOS={handleCrisisSOS} />
        ) : activeView === 'lifestyle' ? (
          /* Phase & Lifestyle synched tips (Dark Theme) */
          <PhaseLifestyle onCrisisSOS={handleCrisisSOS} />
        ) : (
          /* Mental Health & Crisis support workspace (Dark Theme) */
          <MentalHealth />
        )}
      </div>

      {/* Emergency Modal Dialog */}
      <EmergencyAlert isVisible={showEmergency} onClose={() => setShowEmergency(false)} />
    </div>
  );
}

export default App;
