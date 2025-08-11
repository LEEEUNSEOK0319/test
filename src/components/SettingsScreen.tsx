import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { User, Palette, Shield, HelpCircle, Moon, Sun, Key, LogOut } from 'lucide-react';
import type { ApiKey } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  apiKeys: ApiKey[];
  onUpdateApiKeys: (keys: ApiKey[]) => void;
  onDisconnectApiKey: (id: string) => void;
  onConnectApiKey: (id: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export function SettingsScreen({
  onBack,
  onLogout,
  apiKeys,
  onUpdateApiKeys,
  onDisconnectApiKey,
  onConnectApiKey,
  isDarkMode,
  onToggleDarkMode,
}: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'about'>('profile');
  const [profile, setProfile] = useState({ name: '김사용자', email: 'user@company.com', phone: '010-1234-5678', dept: '마케팅', position: '과장' });
  const tabs = [
    { id: 'profile' as const, label: '프로필', icon: <User className="w-4 h-4" /> },
    { id: 'preferences' as const, label: '환경설정', icon: <Palette className="w-4 h-4" /> },
    { id: 'security' as const, label: '보안', icon: <Shield className="w-4 h-4" /> },
    { id: 'about' as const, label: '정보', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-[80vh] grid grid-cols-12 gap-4">
      <Card className="col-span-3 p-3">
        <div className="text-sm font-medium mb-2">설정</div>
        <div className="space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left ${activeTab === t.id ? 'bg-accent' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <Button variant="ghost" className="mt-6 text-red-600" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" /> 로그아웃
        </Button>
      </Card>

      <Card className="col-span-9 p-4 space-y-4">
        {activeTab === 'profile' && (
          <div className="space-y-3">
            <div className="text-lg font-semibold">프로필</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>이름</Label>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <Label>이메일</Label>
                <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div>
                <Label>부서</Label>
                <Input value={profile.dept} onChange={(e) => setProfile({ ...profile, dept: e.target.value })} />
              </div>
              <div>
                <Label>직책</Label>
                <Input value={profile.position} onChange={(e) => setProfile({ ...profile, position: e.target.value })} />
              </div>
            </div>
            <Button className="mt-2">저장</Button>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-3">
            <div className="text-lg font-semibold">환경설정</div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-center gap-2">
                {isDarkMode ? <Moon /> : <Sun />}
                <div>
                  <div className="font-medium">다크 모드</div>
                  <div className="text-sm text-muted-foreground">{isDarkMode ? '어두운 테마 사용 중' : '밝은 테마 사용 중'}</div>
                </div>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            <div className="text-lg font-semibold">API 키 관리</div>
            <div className="space-y-2">
              {apiKeys.map(k => (
                <div key={k.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center gap-3">
                    <Key />
                    <div>
                      <div className="font-medium">{k.name}</div>
                      <div className="text-xs text-muted-foreground">{k.maskedKey} • {k.lastUsed}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {k.isConnected ? (
                      <Button variant="outline" onClick={() => onDisconnectApiKey(k.id)}>연결 해제</Button>
                    ) : (
                      <Button onClick={() => onConnectApiKey(k.id)}>연결</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <div className="text-lg font-semibold">정보</div>
            <div className="text-sm text-muted-foreground">Smart Search v1.0.0</div>
          </div>
        )}
      </Card>
    </div>
  );
}
