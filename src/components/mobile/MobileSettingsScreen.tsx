import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { User, Key, Moon, Sun, LogOut, Shield } from 'lucide-react';
import type { MobileSettingsScreenProps } from '../../types';

const MobileSettingsScreen: React.FC<MobileSettingsScreenProps> = ({
  onBack,
  onLogout,
  apiKeys,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [showApiDetails, setShowApiDetails] = useState(false);
  const connected = apiKeys.filter(k => k.isConnected);

  return (
    <div className="pb-16">
      <header className="p-3 border-b flex items-center justify-between">
        <div className="font-medium">설정</div>
        <Button variant="outline" size="sm" onClick={onBack}>뒤로</Button>
      </header>

      <div className="p-3 space-y-3">
        <Card className="p-3 flex items-center gap-3">
          <User />
          <div className="flex-1">
            <div className="font-medium">김사용자</div>
            <div className="text-xs text-muted-foreground">user@company.com • 마케팅팀</div>
          </div>
          <Button variant="outline" size="sm">편집</Button>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">API 연결</div>
            <Button variant="ghost" size="sm" onClick={() => setShowApiDetails(s => !s)}>
              {showApiDetails ? '숨기기' : '보기'}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">{connected.length}개 API 키 연결됨</div>
          {showApiDetails && (
            <div className="mt-2 space-y-2">
              {apiKeys.map(k => (
                <Card key={k.id} className="p-2">
                  <div className="font-medium">{k.name}</div>
                  <div className="text-xs text-muted-foreground">{k.maskedKey} • {k.lastUsed} • {k.isConnected ? '연결됨' : '비활성'}</div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon /> : <Sun />}
            <div>
              <div className="font-medium">다크 모드</div>
              <div className="text-xs text-muted-foreground">{isDarkMode ? '어두운 테마' : '밝은 테마'}</div>
            </div>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
        </Card>

        <Card className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield />
            <div className="font-medium">보안</div>
          </div>
          <Button variant="outline" size="sm">자세히</Button>
        </Card>

        <Button variant="destructive" className="w-full" onClick={onLogout}><LogOut className="w-4 h-4 mr-2" />로그아웃</Button>
      </div>
    </div>
  );
};

export default MobileSettingsScreen;
