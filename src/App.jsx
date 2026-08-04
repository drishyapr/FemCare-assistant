import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import EmergencyAlert from './components/EmergencyAlert';
import TrackingTools from './components/TrackingTools';
import PhaseLifestyle from './components/PhaseLifestyle';
import MentalHealth from './components/MentalHealth';
import TopHeader from './components/TopHeader';
import PrivateVaultModal from './components/PrivateVaultModal';
import OnboardingModal from './components/OnboardingModal';

function App() {
  const [showEmergency, setShowEmergency] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // 'chat', 'tracker', 'lifestyle', or 'mental'
  
  // Security lock status states
  const [isLocked, setIsLocked] = useState(true);
  const [isChangingPin, setIsChangingPin] = useState(false);

  // Profile states
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('femcare_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing user profile from localStorage", e);
      }
    }
    return null;
  });
  const [showProfileEditor, setShowProfileEditor] = useState(false);

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
    localStorage.removeItem('femcare_user_profile');
    window.location.reload();
  };

  const handleOnboardingComplete = (profile) => {
    localStorage.setItem('femcare_user_profile', JSON.stringify(profile));
    localStorage.setItem('femcare_last_period_date', profile.lastPeriodDate);
    setUserProfile(profile);
    // Trigger storage event so cycle guide and trackers sync up immediately
    window.dispatchEvent(new Event('storage'));
  };

  const showOnboarding = !isLocked && !userProfile;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-sage-bg font-sans text-charcoal antialiased relative">
      {/* Main App Layout Container (blurred & disabled when locked or onboarding) */}
      <div className={`flex w-full h-full transition-all duration-500 ${
        (isLocked || showOnboarding) ? 'blur-2xl pointer-events-none select-none opacity-10' : ''
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
            onEditProfile={() => setShowProfileEditor(true)}
            userName={userProfile?.name}
          />

          {/* View Container */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {activeView === 'chat' ? (
              /* Chat Workspace (Bento Card Style) */
              <div className="flex-1 p-8 bg-sage-bg overflow-hidden flex flex-col min-w-0">
                <div className="flex-1 bg-sage-card border border-sage-border rounded-3xl shadow-sm overflow-hidden flex flex-col min-w-0">
                  <ChatWindow 
                    onShowEmergency={() => setShowEmergency(true)} 
                    onCrisisSOS={handleCrisisSOS}
                  />
                </div>
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

      {/* Onboarding Wizard Overlay (Mandatory on setup) */}
      {showOnboarding && (
        <OnboardingModal
          isEditing={false}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Profile Editor Modal Overlay */}
      {showProfileEditor && (
        <OnboardingModal
          isEditing={true}
          profileData={userProfile}
          onComplete={(updatedProfile) => {
            localStorage.setItem('femcare_user_profile', JSON.stringify(updatedProfile));
            localStorage.setItem('femcare_last_period_date', updatedProfile.lastPeriodDate);
            setUserProfile(updatedProfile);
            setShowProfileEditor(false);
            window.dispatchEvent(new Event('storage'));
          }}
          onCancel={() => setShowProfileEditor(false)}
        />
      )}
    </div>
  );
}

export default App;
