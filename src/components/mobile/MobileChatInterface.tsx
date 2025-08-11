import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, Send, Bot, User, Star } from 'lucide-react';
import type { ChatMessage, FileItem, MobileChatInterfaceProps } from '../../types';

const MobileChatInterface: React.FC<MobileChatInterfaceProps> = ({
  onFileSelect,
  onBack,
  files,
  onToggleFavorite,
  initialMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', type: 'bot', content: '안녕하세요! 😊 무엇을 도와드릴까요?', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (initialMessage && messages.length === 1) {
      handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    const user: ChatMessage = { id: Date.now().toString(), type: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, user]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const bot: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `"${user.content}"에 대해 검색해드릴게요! 관련 문서들을 찾았습니다. 📄`,
        files: files.slice(0, 3),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, bot]);
      setIsLoading(false);
    }, 800);
  }, [inputValue, files]);

  return (
    <div className="pb-16">
      <header className="p-3 flex items-center gap-2 border-b sticky top-0 bg-background">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft /></Button>
        <div className="font-medium">AI 어시스턴트</div>
      </header>

      <div className="p-3 space-y-2">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-2 ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="shrink-0 mt-1">{m.type === 'user' ? <User /> : <Bot />}</div>
            <Card className="px-3 py-2 max-w-[85%]">
              <div className="text-sm">{m.content}</div>
              {m.files && (
                <div className="mt-2 grid gap-2">
                  {m.files.map(f => (
                    <Card key={f.id} className="p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onFileSelect(f)}>
                        <span className="text-xl">{f.icon ?? '📄'}</span>
                        <div>
                          <div className="text-sm font-medium">{f.name}</div>
                          <div className="text-xs text-muted-foreground">{f.type} • {f.size} • {f.modified}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onToggleFavorite(f.id); }}>
                        <Star />
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))}
        {isLoading && <div className="text-xs text-muted-foreground">생각 중...</div>}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-2 flex gap-2">
        <input
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          placeholder="메시지 입력"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <Button onClick={handleSend}><Send className="w-4 h-4 mr-2" />보내기</Button>
      </div>
    </div>
  );
};

export default MobileChatInterface;
