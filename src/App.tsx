// src/App.tsx
import React, { useState } from 'react';

import { useFiles } from './hooks/useFiles';
import { useApiKeys } from './hooks/useApiKeys';
import { useMobile } from './hooks/useMobile';
import type { FileItem } from './types';

import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HomeScreen } from './components/HomeScreen';
import { MainChatInterface } from './components/MainChatInterface';
import { SettingsScreen } from './components/SettingsScreen';

// FilePreviewDrawer가 named export라면 다음 줄 유지
import { FilePreviewDrawer } from './components/FilePreviewDrawer';

// 모바일 컴포넌트가 실제로 있는 경우에만 import
import MobileHomeScreen from './components/mobile/MobileHomeScreen';
import MobileChatInterface from './components/mobile/MobileChatInterface';
import MobileSettingsScreen from './components/mobile/MobileSettingsScreen';
import MobileBottomNav from './components/mobile/MobileBottomNav';

type Screen = 'login' | 'signup' | 'onboarding' | 'home' | 'chat' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');

  // ⚠️ 모바일 SettingsScreen이 아직 컨텍스트로 이관되지 않았다면 임시 유지
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    connectedKeys, // 필요 시 사용
    onUpdateApiKeys,
    onDisconnectAllApiKeys,
    onDisconnectApiKey,
    onConnectApiKey,
  } = useApiKeys();

  const { isMobile } = useMobile();
  const go = (s: Screen) => setScreen(s);

  // ===================== 데스크톱 =====================
  if (!isMobile) {
    switch (screen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={() => go('onboarding')}
            onSignupClick={() => go('signup')}
          />
        );

      case 'signup':
        return (
          <SignupScreen
            onSignup={() => go('onboarding')}
            onBackToLogin={() => go('login')}
          />
        );

      case 'onboarding':
        return <OnboardingScreen onComplete={() => go('home')} />;

      case 'home':
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

      case 'chat':
        return (
          <>
            <MainChatInterface
              onOpenSettings={() => go('settings')}
              onFileSelect={(f) => onFileSelect(f)}
              onBack={() => go('home')}
              files={files}
              onToggleFavorite={onToggleFavorite}
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

      case 'settings':
        return (
          <SettingsScreen
            onBack={() => go('home')}
            onLogout={() => go('login')}
            apiKeys={apiKeys}
            onUpdateApiKeys={onUpdateApiKeys}
            onDisconnectApiKey={onDisconnectApiKey}
            onConnectApiKey={onConnectApiKey}
          />
        );

      default:
        return null;
    }
  }

  // ===================== 모바일 =====================
  switch (screen) {
    case 'login':
      return (
        <LoginScreen
          onLogin={() => go('onboarding')}
          onSignupClick={() => go('signup')}
        />
      );

    case 'signup':
      return (
        <SignupScreen
          onSignup={() => go('onboarding')}
          onBackToLogin={() => go('login')}
        />
      );

    case 'onboarding':
      return <OnboardingScreen onComplete={() => go('home')} />;

    case 'home':
      return (
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
      );

    case 'chat':
      return (
        <>
          <MobileChatInterface
            onFileSelect={(f) => onFileSelect(f)}
            onBack={() => go('home')}
            files={files}
            onToggleFavorite={onToggleFavorite}
            onOpenSettings={() => go('settings')}
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
      );

    case 'settings':
      return (
        <>
          <MobileSettingsScreen
            onBack={() => go('home')}
            onLogout={() => go('login')}
            apiKeys={apiKeys}
            hasConnectedApiKeys={hasConnectedApiKeys}     // ✅ 누락된 필수 prop
            onUpdateApiKeys={onUpdateApiKeys}             // (선택) 있으니 넘겨두면 좋아요
            onDisconnectApiKey={onDisconnectApiKey}       // (선택)
            onConnectApiKey={onConnectApiKey}             // (선택)
            isDarkMode={isDarkMode}                       // 모바일은 아직 프롭 방식 유지 중
            onToggleDarkMode={setIsDarkMode}
          />
          <MobileBottomNav currentScreen="settings" onNavigate={(s) => go(s as Screen)} />
        </>
      );

    default:
      return null;
  }
}
