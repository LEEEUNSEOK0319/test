import React, { useState } from 'react';
import { useFiles } from './hooks/useFiles';
import { useApiKeys } from './hooks/useApiKeys';
import { useMobile } from './hooks/useMobile';
import type { FileItem, Screen } from './types';

import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HomeScreen } from './components/HomeScreen';
import { MainChatInterface } from './components/MainChatInterface';
import { SettingsScreen } from './components/SettingsScreen';

import MobileHomeScreen from './components/mobile/MobileHomeScreen';
import MobileChatInterface from './components/mobile/MobileChatInterface';
import MobileSettingsScreen from './components/mobile/MobileSettingsScreen';
import MobileBottomNav from './components/mobile/MobileBottomNav';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { files, onToggleFavorite, onFileSelect, selectedFile, setSelectedFile } = useFiles();
  const {
    apiKeys, hasConnectedApiKeys, connectedKeys,
    onUpdateApiKeys, onDisconnectAllApiKeys, onDisconnectApiKey, onConnectApiKey
  } = useApiKeys();
  const { isMobile } = useMobile();

  const go = (s: Screen) => setScreen(s);

  // Desktop (간단한 내비게이션)
  if (!isMobile) {
    if (screen === 'login') return <LoginScreen onLogin={() => go('onboarding')} onSignupClick={() => go('signup')} />;
    if (screen === 'signup') return <SignupScreen onSignup={() => go('onboarding')} onBackToLogin={() => go('login')} />;
    if (screen === 'onboarding') return <OnboardingScreen onComplete={() => go('home')} />;
    if (screen === 'home') {
      return (
        <div className={isDarkMode ? 'dark' : ''}>
          <HomeScreen
            onNavigateToChat={() => go('chat')}
            onOpenSettings={() => go('settings')}
            hasConnectedApiKeys={hasConnectedApiKeys}
            files={files}
            onToggleFavorite={onToggleFavorite}
            onFileSelect={(f: FileItem) => setSelectedFile(f)}
            onDisconnectAllApiKeys={onDisconnectAllApiKeys}
            apiKeys={apiKeys}
          />
        </div>
      );
    }
    if (screen === 'chat') {
      return (
        <MainChatInterface
          onOpenSettings={() => go('settings')}
          onFileSelect={(f) => setSelectedFile(f)}
          onBack={() => go('home')}
          files={files}
          onToggleFavorite={onToggleFavorite}
        />
      );
    }
    if (screen === 'settings') {
      return (
        <SettingsScreen
          onBack={() => go('home')}
          onLogout={() => go('login')}
          apiKeys={apiKeys}
          onUpdateApiKeys={onUpdateApiKeys}
          onDisconnectApiKey={onDisconnectApiKey}
          onConnectApiKey={onConnectApiKey}
          isDarkMode={isDarkMode}
          onToggleDarkMode={setIsDarkMode}
        />
      );
    }
    return null;
  }

  // Mobile
  if (screen === 'login') return <LoginScreen onLogin={() => go('onboarding')} onSignupClick={() => go('signup')} />;
  if (screen === 'signup') return <SignupScreen onSignup={() => go('onboarding')} onBackToLogin={() => go('login')} />;
  if (screen === 'onboarding') return <OnboardingScreen onComplete={() => go('home')} />;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {screen === 'home' && (
        <>
          <MobileHomeScreen
            onNavigateToChat={() => go('chat')}
            onOpenSettings={() => go('settings')}
            hasConnectedApiKeys={hasConnectedApiKeys}
            files={files}
            onToggleFavorite={onToggleFavorite}
            onFileSelect={(f) => setSelectedFile(f)}
            apiKeys={apiKeys}
          />
          <MobileBottomNav currentScreen="home" onNavigate={(s) => go(s as any)} />
        </>
      )}

      {screen === 'chat' && (
        <>
          <MobileChatInterface
            onFileSelect={(f) => setSelectedFile(f)}
            onBack={() => go('home')}
            files={files}
            onToggleFavorite={onToggleFavorite}
          />
          <MobileBottomNav currentScreen="chat" onNavigate={(s) => go(s as any)} />
        </>
      )}

      {screen === 'settings' && (
        <>
          <MobileSettingsScreen
            onBack={() => go('home')}
            onLogout={() => go('login')}
            apiKeys={apiKeys}
            isDarkMode={isDarkMode}
            onToggleDarkMode={setIsDarkMode}
          />
          <MobileBottomNav currentScreen="settings" onNavigate={(s) => go(s as any)} />
        </>
      )}
    </div>
  );
}
