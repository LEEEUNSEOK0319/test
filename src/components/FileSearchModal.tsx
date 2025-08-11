import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Search, Filter, Calendar as CalendarIcon, FileText } from 'lucide-react';
import type { FileItem } from '../types';

interface FileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: FileItem) => void;
  files: FileItem[];
  onToggleFavorite: (fileId: string) => void;
}

const recentQueries = ['2023년 발표자료', '홍길동 계약서', '송무 관련 PDF', '회의록 요약본', '신제품 기획서'];

export function FileSearchModal({
  isOpen,
  onClose,
  onFileSelect,
  files,
  onToggleFavorite,
}: FileSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileType, setFileType] = useState('all');
  const [owner, setOwner] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const getFileIcon = (icon: string | undefined, type: string) => {
    if (icon && icon !== type) return <span className="mr-2">{icon}</span>;
    return <FileText className="w-4 h-4 mr-2" />;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    setTimeout(() => {
      let filtered = files.filter(
        f =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.modifiedBy.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      if (fileType !== 'all') filtered = filtered.filter(f => f.type.toLowerCase() === fileType);

      if (owner !== 'all') filtered = filtered.filter(f => f.modifiedBy === owner);

      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const uniqueAuthors = Array.from(new Set(files.map(f => f.modifiedBy)));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>파일 검색</DialogTitle>
          <DialogDescription>파일명, 타입, 작성자를 기준으로 검색하고 필터를 적용할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="예) 마케팅 보고서"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onKeyPress}
          />
          <Button variant="outline" onClick={() => setShowFilters(s => !s)}>
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            검색
          </Button>
        </div>

        {showFilters && (
          <Card className="p-3 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-sm mb-1">파일 형식</div>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger><SelectValue placeholder="모든 형식" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 형식</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="powerpoint">PowerPoint</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-sm mb-1">작성자</div>
                <Select value={owner} onValueChange={setOwner}>
                  <SelectTrigger><SelectValue placeholder="모든 사용자" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 사용자</SelectItem>
                    {uniqueAuthors.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-sm mb-1">수정 날짜</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateRange.from ? '선택됨' : '날짜 선택'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">최근 검색어</div>
          <div className="flex gap-2 flex-wrap">
            {recentQueries.map((q, idx) => (
              <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => { setSearchQuery(q); handleSearch(); }}>
                {q}
              </Badge>
            ))}
          </div>
        </div>

        <ScrollArea className="h-64 mt-2">
          {isSearching ? (
            <div className="text-center text-sm text-muted-foreground py-8">검색 중...</div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm">{searchResults.length}개의 결과</div>
              {searchResults.map(f => (
                <Card
                  key={f.id}
                  className="p-3 flex items-center gap-3 hover:bg-accent cursor-pointer"
                  onClick={() => onFileSelect(f)}
                >
                  {getFileIcon(f.icon, f.type)}
                  <div className="flex-1">
                    <div className="font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.type} • {f.size} • {f.modified} • {f.modifiedBy}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(f.id); }}
                    aria-label={f.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                  >
                    ★
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-8">검색 결과가 없습니다.</div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
