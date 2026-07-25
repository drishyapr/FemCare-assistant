import { useState } from 'react';
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
            <ChatWindow onShowEmergency={() => setShowEmergency(true)} />
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
