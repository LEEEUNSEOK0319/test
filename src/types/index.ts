export type Screen = 'login' | 'signup' | 'onboarding' | 'home' | 'chat' | 'settings';

export interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'excel' | 'powerpoint' | string;
  size: string;               // e.g., "2.4MB"
  modified: string;           // e.g., "2시간 전" or ISO date
  modifiedBy: string;         // e.g., "홍길동"
  path: string;               // e.g., "/marketing/strategy/..."
  icon?: string;              // emoji fallback
  isFavorite?: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  maskedKey: string;
  created: string;   // yyyy-mm-dd
  lastUsed: string;  // "방금 전" 등
  isConnected: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  files?: FileItem[];
}

export interface MobileHomeScreenProps {
  onNavigateToChat: () => void;
  onOpenSettings: () => void;
  hasConnectedApiKeys: boolean;
  files: FileItem[];
  onToggleFavorite: (fileId: string) => void;
  onFileSelect: (file: FileItem) => void;
  apiKeys: ApiKey[];
}

export interface MobileChatInterfaceProps {
  onFileSelect: (file: FileItem) => void;
  onBack: () => void;
  files: FileItem[];
  onToggleFavorite: (fileId: string) => void;
  initialMessage?: string;
}

export interface MobileSettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  apiKeys: ApiKey[];
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export interface MobileNavProps {
  currentScreen: 'home' | 'chat' | 'settings';
  onNavigate: (screen: 'home' | 'chat' | 'settings') => void;
  hasUnreadMessages?: boolean;
}
