import React from 'react';
import { Home, MessageCircle, Settings } from 'lucide-react';
import type { MobileNavProps } from '../../types';

const NAV = [
  { id: 'home' as const, label: '홈', icon: Home },
  { id: 'chat' as const, label: '채팅', icon: MessageCircle },
  { id: 'settings' as const, label: '설정', icon: Settings },
];

const MobileBottomNav: React.FC<MobileNavProps> = ({ currentScreen, onNavigate, hasUnreadMessages = false }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t grid grid-cols-3">
      {NAV.map(item => {
        const Icon = item.icon;
        const active = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center h-14 ${active ? 'text-primary' : 'text-muted-foreground'}`}
            aria-current={active ? 'page' : undefined}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {hasUnreadMessages && item.id === 'chat' && (
                <span className="absolute -top-1 -right-1 inline-block w-2 h-2 rounded-full bg-red-500" />
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
