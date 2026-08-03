import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import EmergencyAlert from './components/EmergencyAlert';
import TrackingTools from './components/TrackingTools';
import PhaseLifestyle from './components/PhaseLifestyle';
import MentalHealth from './components/MentalHealth';
import TopHeader from './components/TopHeader';
import PrivateVaultModal from './components/PrivateVaultModal';

function App() {
  const [showEmergency, setShowEmergency] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // 'chat', 'tracker', 'lifestyle', or 'mental'
  
  // Security lock status states
  const [isLocked, setIsLocked] = useState(true);
  const [isChangingPin, setIsChangingPin] = useState(false);

  const handleCrisisSOS = () => {
    setActiveView('mental');
  };

  const handleChangePin = () => {
    setIsChangingPin(true);
    setIsLocked(true);
  };

  const handleCancelChangePin = () => {
    setIsChangingPin(false);
    setIsLocked(false);
  };

  const handleResetVault = () => {
    localStorage.removeItem('femcare_vault_pin');
    localStorage.removeItem('femcare_chat_messages');
    localStorage.removeItem('femcare_cycle_logs');
    localStorage.removeItem('femcare_last_period_date');
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased relative">
      {/* Main App Layout Container (blurred & disabled when locked) */}
      <div className={`flex w-full h-full transition-all duration-500 ${
        isLocked ? 'blur-2xl pointer-events-none select-none opacity-10' : ''
      }`}>
        {/* Sidebar Navigation */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeView={activeView}
          onChangeView={setActiveView}
        />

        {/* Main Content Dashboard */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header / Navigation actions */}
          <TopHeader
            activeView={activeView}
            onLock={() => setIsLocked(true)}
            onChangePin={handleChangePin}
            onResetVault={handleResetVault}
          />

          {/* View Container */}
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
        </div>
      </div>

      {/* Emergency Modal Dialog */}
      <EmergencyAlert isVisible={showEmergency} onClose={() => setShowEmergency(false)} />

      {/* Private Vault Passcode Screen Overlay */}
      {isLocked && (
        <PrivateVaultModal
          isLocked={isLocked}
          onUnlock={() => {
            setIsLocked(false);
            setIsChangingPin(false);
          }}
          isChangingPin={isChangingPin}
          onCancelChangePin={handleCancelChangePin}
        />
      )}
    </div>
  );
}

export default App;
