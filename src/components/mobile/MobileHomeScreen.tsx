import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { MessageCircle, Settings, Zap, ArrowRight, Sparkles } from 'lucide-react';
import type { MobileHomeScreenProps } from '../../types';

const QUESTIONS = [
  '마케팅 전략 문서 요약해줘',
  '지난 분기 매출 보고서 핵심 지표',
  '브랜드 가이드 컬러 팔레트',
  '휴가 규정 알려줘',
] as const;

const MobileHomeScreen: React.FC<MobileHomeScreenProps> = ({
  onNavigateToChat,
  onOpenSettings,
  hasConnectedApiKeys,
  files,
  onToggleFavorite,
  onFileSelect,
  apiKeys = [],
}) => {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요! ☀️';
    if (hour < 18) return '안녕하세요! 👋';
    return '좋은 저녁이에요! 🌙';
  });

  const stats = useMemo(
    () => ({ totalFiles: files?.length || 0, connectedApiKeys: apiKeys.filter(k => k.isConnected).length }),
    [files, apiKeys],
  );

  const onPick = useCallback((q: string) => {
    onNavigateToChat();
  }, [onNavigateToChat]);

  return (
    <div className="pb-16">
      <header className="p-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{greeting}</div>
          <div className="text-lg font-semibold">Smart Search</div>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenSettings}><Settings className="w-4 h-4 mr-1" />설정</Button>
      </header>

      {!hasConnectedApiKeys && (
        <Card className="mx-3 p-3 mb-3">
          <div className="flex items-center gap-2">
            <Zap />
            <div>
              <div className="font-medium">API 키를 연결해보세요</div>
              <div className="text-xs text-muted-foreground">더 정확하고 빠른 파일 검색을 위해 Dooray API 키가 필요해요</div>
            </div>
          </div>
          <Button className="mt-2 w-full">지금 연결하기</Button>
        </Card>
      )}

      <Card className="mx-3 p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle />
          <div className="font-medium">AI 어시스턴트</div>
        </div>
        <div className="text-sm text-muted-foreground mb-3">파일 내용에 대해 궁금한 점이 있으신가요? 언제든 질문하세요!</div>
        <Button className="w-full" onClick={onNavigateToChat}><Sparkles className="w-4 h-4 mr-2" />대화 시작하기</Button>
      </Card>

      <div className="grid grid-cols-2 gap-3 mx-3">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold">{stats.totalFiles}</div>
          <div className="text-xs text-muted-foreground">검색 가능한 파일</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold">{stats.connectedApiKeys}</div>
          <div className="text-xs text-muted-foreground">API 연결</div>
        </Card>
      </div>

      <div className="mt-4 mx-3">
        <div className="text-sm font-medium mb-2">추천 질문</div>
        <div className="grid grid-cols-1 gap-2">
          {QUESTIONS.map((q, i) => (
            <Button key={i} variant="outline" className="justify-between" onClick={() => onPick(q)}>
              {q}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileHomeScreen;
