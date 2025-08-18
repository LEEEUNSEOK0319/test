import React, { useState, useEffect } from 'react';

import { useFiles } from '../features/files/useFiles';
import { useApiKeys } from '../features/settings/useApiKeys';
import { useMobile } from '../hooks/useMobile';
import type { FileItem } from '../types';

import { LoginScreen } from '../features/auth/LoginScreen';
import { SignupScreen } from '../features/auth/SignupScreen';
import { OnboardingScreen } from '../features/home/OnboardingScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { MainChatInterface } from '../features/chat/MainChatInterface';
import { SettingsScreen } from '../features/settings/SettingsScreen';

import { FilePreviewDrawer } from '../features/files/FilePreviewDrawer';

// 모바일 컴포넌트
import MobileHomeScreen from '../components/mobile/MobileHomeScreen';
import MobileChatInterface from '../components/mobile/MobileChatInterface';
import MobileSettingsScreen from '../components/mobile/MobileSettingsScreen';
import MobileBottomNav from '../components/mobile/MobileBottomNav';

type Screen = 'login' | 'signup' | 'onboarding' | 'home' | 'chat' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // isDarkMode가 true이면 'dark' 클래스를 추가하고, false이면 제거합니다.
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]); // isDarkMode 상태가 변경될 때마다 이 함수가 실행됩니다.

  const {
    files,
    showPreviewDrawer,
    selectedFile,
    onFileSelect,
    onToggleFavorite,
    handleClosePreview,
  } = useFiles();

  const {
    apiKeys,
    hasConnectedApiKeys,
    // connectedKeys, // 이 컴포넌트에서 직접 사용하지 않으므로 제거 가능
    onUpdateApiKeys,
    onDisconnectAllApiKeys,
    onDisconnectApiKey,
    onConnectApiKey,
  } = useApiKeys();

  const { isMobile } = useMobile();
  const go = (s: Screen) => setScreen(s);

  // ===== 데스크톱 =====
  if (!isMobile) {
    if (screen === 'login')
      return (
        <LoginScreen
          onLogin={() => go('onboarding')}
          onSignupClick={() => go('signup')}
        />
      );

    if (screen === 'signup')
      return (
        <SignupScreen
          onSignup={() => go('onboarding')}
          onBackToLogin={() => go('login')}
        />
      );

    if (screen === 'onboarding')
      return <OnboardingScreen onComplete={() => go('home')} />;

    if (screen === 'home')
      return (
        <>
          <HomeScreen
            onNavigateToChat={() => go('chat')}
            onOpenSettings={() => go('settings')}
            hasConnectedApiKeys={hasConnectedApiKeys}
            files={files}
            onToggleFavorite={onToggleFavorite}
            onFileSelect={(f: FileItem) => onFileSelect(f)}
            onDisconnectAllApiKeys={onDisconnectAllApiKeys}
            apiKeys={apiKeys}
          />
          {selectedFile && (
            <FilePreviewDrawer
              isOpen={showPreviewDrawer}
              file={selectedFile}
              onClose={handleClosePreview}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </>
      );

    if (screen === 'chat')
      return (
        <>
          <MainChatInterface
            onOpenSettings={() => go('settings')}
            onFileSelect={(f) => onFileSelect(f)}
            onBack={() => go('home')}
            files={files}
            onToggleFavorite={onToggleFavorite}
            // --- 👇 이 부분이 수정되었습니다 ---
            apiKeys={apiKeys}
          />
          {selectedFile && (
            <FilePreviewDrawer
              isOpen={showPreviewDrawer}
              file={selectedFile}
              onClose={handleClosePreview}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </>
      );

    if (screen === 'settings')
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

    return null;
  }

  // ===== 모바일 =====
  if (screen === 'login')
    return (
      <LoginScreen
        onLogin={() => go('onboarding')}
        onSignupClick={() => go('signup')}
      />
    );

  if (screen === 'signup')
    return (
      <SignupScreen
        onSignup={() => go('onboarding')}
        onBackToLogin={() => go('login')}
      />
    );

  if (screen === 'onboarding')
    return <OnboardingScreen onComplete={() => go('home')} />;

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
            onFileSelect={(f) => onFileSelect(f)}
            apiKeys={apiKeys}
          />
          <MobileBottomNav currentScreen="home" onNavigate={(s) => go(s as Screen)} />
          {selectedFile && (
            <FilePreviewDrawer
              isOpen={showPreviewDrawer}
              file={selectedFile}
              onClose={handleClosePreview}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </>
      )}

      {screen === 'chat' && (
        <>
          <MobileChatInterface
            onFileSelect={(f) => onFileSelect(f)}
            onBack={() => go('home')}
            files={files}
            onToggleFavorite={onToggleFavorite}
            onOpenSettings={() => go('settings')}
            // --- 👇 모바일 컴포넌트에도 동일하게 추가합니다 ---
            apiKeys={apiKeys}
          />
          <MobileBottomNav currentScreen="chat" onNavigate={(s) => go(s as Screen)} />
          {selectedFile && (
            <FilePreviewDrawer
              isOpen={showPreviewDrawer}
              file={selectedFile}
              onClose={handleClosePreview}
              onToggleFavorite={onToggleFavorite}
            />
          )}
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
          <MobileBottomNav currentScreen="settings" onNavigate={(s) => go(s as Screen)} />
        </>
      )}
    </div>
  );
}