export type Screen = 'login' | 'signup' | 'onboarding' | 'home' | 'chat' | 'settings';

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  modifiedBy: string;
  path: string;
  icon: string;
  isFavorite: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  files?: FileItem[];
  timestamp: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  created: string;
  lastUsed: string;
  isConnected: boolean;
}

export interface AppState {
  currentScreen: Screen;
  showPreviewDrawer: boolean;
  selectedFile: FileItem | null;
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
}

// Hook 반환 타입들
export interface AuthHookReturn {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  currentScreen: Screen;
  handleLogin: () => void;
  handleSignup: () => void;
  handleOnboardingComplete: () => void;
  handleLogout: () => void;
  navigateToScreen: (screen: Screen) => void;
}

export interface FilesHookReturn {
  files: FileItem[];
  showPreviewDrawer: boolean;
  selectedFile: FileItem | null;
  onFileSelect: (file: FileItem) => void;
  onToggleFavorite: (fileId: string) => void;
  handleClosePreview: () => void;
  totalFiles: number;
  favoriteFiles: FileItem[];
  recentFiles: FileItem[];
  favoriteCount: number;
}

export interface ApiKeysHookReturn {
  apiKeys: ApiKey[];
  hasConnectedApiKeys: boolean;
  connectedKeys: ApiKey[];
  onUpdateApiKeys: (newApiKeys: ApiKey[]) => void;
  onDisconnectAllApiKeys: () => void;
  onDisconnectApiKey: (apiKeyId: string) => void;
  onConnectApiKey: (apiKeyId: string) => void;
}

export interface DarkModeHookReturn {
  isDarkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
}

export interface MobileHookReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// 컴포넌트 Props 타입들
export interface BaseScreenProps {
  onNavigateToChat: () => void;
  onOpenSettings: () => void;
}

export interface FileManagementProps {
  files: FileItem[];
  onToggleFavorite: (fileId: string) => void;
  onFileSelect: (file: FileItem) => void;
}

export interface ApiKeyManagementProps {
  apiKeys: ApiKey[];
  hasConnectedApiKeys: boolean;
  onUpdateApiKeys?: (newApiKeys: ApiKey[]) => void;
  onDisconnectAllApiKeys?: () => void;
  onDisconnectApiKey?: (apiKeyId: string) => void;
  onConnectApiKey?: (apiKeyId: string) => void;
}

export interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

// 모바일 컴포넌트 Props
export interface MobileHomeScreenProps extends BaseScreenProps, FileManagementProps, ApiKeyManagementProps {}

export interface MobileChatInterfaceProps extends FileManagementProps {
  onOpenSettings: () => void;
  onBack: () => void;
  initialMessage?: string;
}

export interface MobileSettingsScreenProps extends SettingsProps, ApiKeyManagementProps {}

export interface MobileNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  hasUnreadMessages?: boolean;
}

// 레거시 호환성을 위한 타입들
export interface HomeScreenProps extends MobileHomeScreenProps {}
export interface ChatInterfaceProps extends MobileChatInterfaceProps {}