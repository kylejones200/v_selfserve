/**
 * App composition: auth provider, auth gate, and main layout.
 * No business logic here; hooks own state and behavior.
 */

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useConversations } from './hooks/useConversations';
import { useSkillActions } from './hooks/useSkillActions';
import { LeftNav } from './components/LeftNav';
import { ThreePanels } from './components/ThreePanels';
import { LoginScreen } from './components/LoginScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const auth = useAuth();
  const conversations = useConversations();
  const skillActions = useSkillActions(
    conversations.current,
    conversations.persist,
    auth.getIdToken
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <LeftNav
        conversations={conversations.visibleConversations}
        currentId={conversations.currentId}
        onSelect={conversations.selectConversation}
        onNew={conversations.newConversation}
        searchQuery={conversations.searchQuery}
        onSearchChange={conversations.setSearchQuery}
        userEmail={auth.user?.email ?? null}
        onSignOut={auth.signOut}
      />
      <ThreePanels
        context={conversations.current.context}
        onContextChange={(context) => conversations.persist({ context })}
        dataItems={conversations.current.dataItems}
        onAddData={conversations.addDataItem}
        onRemoveData={conversations.removeDataItem}
        onGetRecommendations={skillActions.getRecommendations}
        skillContent={conversations.current.skillContent}
        onGenerateSkill={skillActions.generateSkillContent}
        dataLoading={skillActions.dataLoading}
        skillLoading={skillActions.skillLoading}
        dataError={skillActions.dataError}
        skillError={skillActions.skillError}
      />
    </div>
  );
}

function AppWithAuth() {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Loading…</p>
      </div>
    );
  }

  if (!auth.user) {
    return <LoginScreen />;
  }

  return <AppContent />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppWithAuth />
      </AuthProvider>
    </ErrorBoundary>
  );
}
