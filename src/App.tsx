import React, { Suspense, useMemo } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

// 공통 컴포넌트들 (미리 로드)
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { FilePreviewDrawer } from './components/FilePreviewDrawer';

// 데스크탑 컴포넌트들 (지연 로딩)
const HomeScreen = React.lazy(() => import('./components/HomeScreen').then(m => ({ default: m.HomeScreen })));
const MainChatInterface = React.lazy(() => import('./components/MainChatInterface').then(m => ({ default: m.MainChatInterface })));
const SettingsScreen = React.lazy(() => import('./components/SettingsScreen').then(m => ({ default: m.SettingsScreen })));

// 모바일 컴포넌트들 (default export로 변경됨)
const MobileHomeScreen = React.lazy(() => import('./components/mobile/MobileHomeScreen'));
const MobileChatInterface = React.lazy(() => import('./components/mobile/MobileChatInterface'));
const MobileSettingsScreen = React.lazy(() => import('./components/mobile/MobileSettingsScreen'));
const MobileBottomNav = React.lazy(() => import('./components/mobile/MobileBottomNav'));

// 훅들
import { useAuth } from './hooks/useAuth';
import { useDarkMode } from './hooks/useDarkMode';
import { useFiles } from './hooks/useFiles';
import { useApiKeys } from './hooks/useApiKeys';
import { useMobile } from './hooks/useMobile';
import { Screen } from './types';

// 로딩 컴포넌트 개선
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground animate-pulse">로딩 중...</p>
    </div>
  </div>
);

// 메인 앱 컴포넌트
function AppContent() {
  // 커스텀 훅들로 상태 관리
  const auth = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isMobile } = useMobile();
  const files = useFiles();
  const apiKeys = useApiKeys();

  // 모바일 네비게이션 핸들러
  const handleMobileNavigate = React.useCallback((screen: Screen) => {
    auth.navigateToScreen(screen);
  }, [auth]);

  // 현재 화면에 따른 컴포넌트 렌더링 로직
  const renderCurrentScreen = useMemo(() => {
    const { isAuthenticated, hasCompletedOnboarding, currentScreen } = auth;

    // 인증되지 않은 사용자 화면
    if (!isAuthenticated) {
      switch (currentScreen) {
        case 'login':
          return (
            <LoginScreen 
              onLogin={auth.handleLogin}
              onSignupClick={() => auth.navigateToScreen('signup')}
            />
          );
        case 'signup':
          return (
            <SignupScreen 
              onSignup={auth.handleSignup}
              onBackToLogin={() => auth.navigateToScreen('login')}
            />
          );
        default:
          return null;
      }
    }

    // 온보딩 화면
    if (!hasCompletedOnboarding) {
      return <OnboardingScreen onComplete={auth.handleOnboardingComplete} />;
    }

    // 공통 props 생성
    const commonProps = {
      home: {
        onNavigateToChat: () => auth.navigateToScreen('chat'),
        onOpenSettings: () => auth.navigateToScreen('settings'),
        hasConnectedApiKeys: apiKeys.hasConnectedApiKeys,
        files: files.files,
        onToggleFavorite: files.onToggleFavorite,
        onFileSelect: files.onFileSelect,
        onDisconnectAllApiKeys: apiKeys.onDisconnectAllApiKeys,
        apiKeys: apiKeys.apiKeys
      },
      chat: {
        onOpenSettings: () => auth.navigateToScreen('settings'),
        onFileSelect: files.onFileSelect,
        onBack: () => auth.navigateToScreen('home'),
        files: files.files,
        onToggleFavorite: files.onToggleFavorite
      },
      settings: {
        onBack: () => auth.navigateToScreen('home'),
        onLogout: auth.handleLogout,
        apiKeys: apiKeys.apiKeys,
        onUpdateApiKeys: apiKeys.onUpdateApiKeys,
        onDisconnectApiKey: apiKeys.onDisconnectApiKey,
        onConnectApiKey: apiKeys.onConnectApiKey,
        isDarkMode,
        onToggleDarkMode: toggleDarkMode
      }
    };

    // 모바일 버전
    if (isMobile) {
      return (
        <div className="relative">
          <Suspense fallback={<LoadingSpinner />}>
            {currentScreen === 'home' && <MobileHomeScreen {...commonProps.home} />}
            {currentScreen === 'chat' && <MobileChatInterface {...commonProps.chat} />}
            {currentScreen === 'settings' && <MobileSettingsScreen {...commonProps.settings} />}
            
            {/* 하단 네비게이션 - 채팅 화면에서는 숨김 */}
            {currentScreen !== 'chat' && (
              <MobileBottomNav
                currentScreen={currentScreen}
                onNavigate={handleMobileNavigate}
                hasUnreadMessages={false}
              />
            )}
          </Suspense>
        </div>
      );
    }

    // 데스크탑 버전
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {currentScreen === 'home' && <HomeScreen {...commonProps.home} />}
        {currentScreen === 'chat' && <MainChatInterface {...commonProps.chat} />}
        {currentScreen === 'settings' && <SettingsScreen {...commonProps.settings} />}
      </Suspense>
    );
  }, [auth, files, apiKeys, isDarkMode, toggleDarkMode, isMobile, handleMobileNavigate]);

  return (
    <div className={`min-h-screen bg-background relative ${isMobile ? 'overflow-hidden' : 'overflow-auto'}`}>
      <div className="relative z-10 min-h-screen">
        {renderCurrentScreen}

        {/* 파일 미리보기 드로어 - 모바일/데스크탑 공통 */}
        {files.showPreviewDrawer && files.selectedFile && (
          <FilePreviewDrawer 
            file={files.selectedFile}
            isOpen={files.showPreviewDrawer}
            onClose={files.handleClosePreview}
            onToggleFavorite={files.onToggleFavorite}
          />
        )}
      </div>
    </div>
  );
}

// 메인 App 컴포넌트 (에러 경계 포함)
export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}