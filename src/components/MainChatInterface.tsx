import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Bot, User, Star, Filter } from 'lucide-react';
import type { ChatMessage, FileItem } from '../types';
import { FileSearchModal } from './FileSearchModal';

interface MainChatInterfaceProps {
  onOpenSettings: () => void;
  onFileSelect: (file: FileItem) => void;
  onBack: () => void;
  files: FileItem[];
  onToggleFavorite: (fileId: string) => void;
}

export function MainChatInterface({
  onOpenSettings,
  onFileSelect,
  onBack,
  files,
  onToggleFavorite,
}: MainChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', type: 'bot', content: '안녕하세요! 무엇을 도와드릴까요?', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const searchFiles = (query: string): FileItem[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const score = (f: FileItem) => {
      let s = 0;
      const nm = f.name.toLowerCase(); const ty = f.type.toLowerCase(); const p = f.path.toLowerCase(); const mb = f.modifiedBy.toLowerCase();
      if (nm.includes(q)) s += 10 + (nm.startsWith(q) ? 5 : 0);
      if (p.includes(q)) s += 8;
      if (ty.includes(q)) s += 6;
      if (mb.includes(q)) s += 4;
      if (f.isFavorite) s += 2;
      if (q === '마케팅' || q === 'marketing') if (p.includes('/marketing/') || nm.includes('마케팅')) s += 15;
      return s;
    };
    return files.map(f => ({ f, s: score(f) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).map(x => x.f).slice(0, 5);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const user: ChatMessage = { id: Date.now().toString(), type: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, user]);
    const q = inputValue;
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      const result = searchFiles(q);
      const bot: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content:
          result.length > 0
            ? `"${q}" 관련 ${result.length}개의 파일을 찾았습니다.`
            : `"${q}" 관련 결과가 없습니다. 다른 키워드로 시도해보세요.`,
        files: result,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, bot]);
      setIsTyping(false);
    }, 800);
  };

  const fileStrip = useMemo(
    () => (files.length > 6 ? files.slice(0, 6) : files),
    [files]
  );

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b p-3">
        <div className="font-medium">AI 채팅</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFileModal(true)}><Filter className="w-4 h-4 mr-2" />파일 검색</Button>
          <Button variant="secondary" onClick={onOpenSettings}>설정</Button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-2 ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="shrink-0 mt-1">{m.type === 'user' ? <User /> : <Bot />}</div>
            <div className="max-w-[75%] rounded-lg px-3 py-2 bg-accent">
              <div className="text-sm">{m.content}</div>
              {m.files && m.files.length > 0 && (
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {m.files.map(f => (
                    <div key={f.id} className="p-2 rounded-md bg-background flex items-center justify-between">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onFileSelect(f)}>
                        <span className="text-xl">{f.icon ?? '📄'}</span>
                        <div>
                          <div className="text-sm font-medium">{f.name}</div>
                          <div className="text-xs text-muted-foreground">{f.type} • {f.size} • {f.modified}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(f.id); }}
                      >
                        <Star />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-sm text-muted-foreground">AI가 입력 중...</div>}
        <div ref={endRef} />
      </div>

      {/* 최근 파일 스트립 */}
      <div className="border-t px-3 py-2 flex gap-2 overflow-x-auto">
        {fileStrip.map(f => (
          <button key={f.id} className="px-3 py-2 rounded-md bg-accent whitespace-nowrap" onClick={() => onFileSelect(f)}>
            {f.icon ?? '📄'} <span className="ml-1 text-sm">{f.name}</span>
          </button>
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="border-t p-3 flex gap-2">
        <Textarea
          placeholder="질문을 입력하세요. (Enter = 전송, Shift+Enter = 줄바꿈)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}><Send className="w-4 h-4 mr-2" />전송</Button>
      </div>

      <FileSearchModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        files={files}
        onFileSelect={onFileSelect}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}
