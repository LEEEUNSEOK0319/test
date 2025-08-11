import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Search, Grid, List, Folder, FolderOpen, Star, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import type { ApiKey, FileItem } from '../types';
import { FileSearchModal } from './FileSearchModal';
import { FilePreviewDrawer } from './FilePreviewDrawer';

interface HomeScreenProps {
  onNavigateToChat: () => void;
  onOpenSettings: () => void;
  hasConnectedApiKeys: boolean;
  files: FileItem[];
  onToggleFavorite: (fileId: string) => void;
  onFileSelect: (file: FileItem) => void;
  onDisconnectAllApiKeys: () => void;
  apiKeys: ApiKey[];
}

interface DriveFolder {
  id: string;
  name: string;
  icon: string;
  files: FileItem[];
  isExpanded: boolean;
  subFolders?: DriveFolder[];
}

export function HomeScreen({
  onNavigateToChat,
  onOpenSettings,
  hasConnectedApiKeys,
  files,
  onToggleFavorite,
  onFileSelect,
  onDisconnectAllApiKeys,
  apiKeys,
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites' | 'drive'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);
  const [showApiDropdown, setShowApiDropdown] = useState(false);
  const apiDropdownRef = useRef<HTMLDivElement | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const driveFolders: DriveFolder[] = useMemo(() => ([
    {
      id: 'reports',
      name: '보고서',
      icon: '📊',
      isExpanded: true,
      files: files.filter(f => f.path.includes('/reports/')),
      subFolders: [
        {
          id: 'sales',
          name: '분기별 보고서',
          icon: '📈',
          isExpanded: false,
          files: files.filter(f => f.path.includes('/reports/') && f.name.includes('분기')),
        },
      ],
    },
    {
      id: 'marketing',
      name: '마케팅',
      icon: '🚀',
      isExpanded: false,
      files: files.filter(f => f.path.includes('/marketing/')),
    },
    {
      id: 'hr',
      name: '인사관리',
      icon: '👥',
      isExpanded: false,
      files: files.filter(f => f.path.includes('/hr/')),
    },
  ]), [files]);

  const recentFiles = useMemo(() => {
    const order = ['방금 전', '2시간 전', '5시간 전', '1일 전', '2일 전', '3일 전', '1주 전'];
    return [...files].sort((a, b) => order.indexOf(a.modified) - order.indexOf(b.modified));
  }, [files]);

  const favoriteFiles = useMemo(() => files.filter(f => f.isFavorite), [files]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (apiDropdownRef.current && !apiDropdownRef.current.contains(e.target as Node)) {
        setShowApiDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFolder = (list: DriveFolder[], id: string, parentId?: string): DriveFolder[] =>
    list.map(f => {
      if (f.id === id && !parentId) return { ...f, isExpanded: !f.isExpanded };
      if (parentId && f.id === parentId && f.subFolders) {
        return {
          ...f,
          subFolders: f.subFolders.map(sf => (sf.id === id ? { ...sf, isExpanded: !sf.isExpanded } : sf)),
        };
      }
      return f;
    });

  const [folders, setFolders] = useState<DriveFolder[]>(driveFolders);
  useEffect(() => setFolders(driveFolders), [driveFolders]);

  const currentFiles = activeTab === 'recent' ? recentFiles.slice(0, 8) :
    activeTab === 'favorites' ? favoriteFiles.slice(0, 8) : [];

  return (
    <div className="flex flex-col h-full">
      {/* 상단 바 */}
      <div className="flex items-center gap-2 border-b p-3">
        <Input placeholder="검색어를 입력하세요" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Button onClick={() => setShowFileModal(true)}><Search className="w-4 h-4 mr-2" />검색</Button>
        <Button variant="outline" onClick={onOpenSettings}>설정</Button>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 p-3">
        <Button variant={activeTab === 'recent' ? 'default' : 'outline'} onClick={() => setActiveTab('recent')}>최근</Button>
        <Button variant={activeTab === 'favorites' ? 'default' : 'outline'} onClick={() => setActiveTab('favorites')}>즐겨찾기</Button>
        <Button variant={activeTab === 'drive' ? 'default' : 'outline'} onClick={() => setActiveTab('drive')}>드라이브</Button>

        <div className="ml-auto flex gap-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}><Grid className="w-4 h-4" /></Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab !== 'drive' ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' : 'space-y-2'}>
            {currentFiles.map(f => (
              <Card
                key={f.id}
                className={`p-3 flex items-center gap-3 ${viewMode === 'list' ? 'justify-between' : ''}`}
              >
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setPreviewFile(f); setPreviewOpen(true); onFileSelect(f); }}>
                  <span className="text-2xl">{f.icon ?? '📄'}</span>
                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.type} • {f.size} • {f.modified}</div>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(f.id)} aria-label="즐겨찾기">
                    <Star />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {folders.map(f => (
              <Card key={f.id} className="p-3">
                <button className="flex items-center gap-2" onClick={() => setFolders(prev => toggleFolder(prev, f.id))}>
                  {f.isExpanded ? <ChevronDown /> : <ChevronRight />}
                  <span>{f.icon}</span>
                  <span className="font-medium">{f.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{f.files.length}</span>
                </button>

                {f.isExpanded && (
                  <div className="pl-7 mt-2 space-y-1">
                    {f.subFolders?.map(sf => (
                      <div key={sf.id} className="border-l pl-3">
                        <button className="flex items-center gap-2" onClick={() => setFolders(prev => toggleFolder(prev, sf.id, f.id))}>
                          {sf.isExpanded ? <FolderOpen /> : <Folder />}
                          <span>{sf.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{sf.files.length}</span>
                        </button>
                        {sf.isExpanded && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {sf.files.slice(0, 6).map(file => (
                              <Card key={file.id} className="p-2 flex items-center gap-2">
                                <div className="cursor-pointer flex-1" onClick={() => { setPreviewFile(file); setPreviewOpen(true); onFileSelect(file); }}>
                                  <div className="text-xl">{file.icon ?? '📄'}</div>
                                  <div className="text-sm">{file.name}</div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(file.id)} aria-label="즐겨찾기">
                                  <Star />
                                </Button>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="grid grid-cols-2 gap-2">
                      {f.files
                        .filter(file => !f.subFolders?.some(sf => sf.files.includes(file)))
                        .slice(0, 6)
                        .map(file => (
                          <Card key={file.id} className="p-2 flex items-center gap-2">
                            <div className="cursor-pointer flex-1" onClick={() => { setPreviewFile(file); setPreviewOpen(true); onFileSelect(file); }}>
                              <div className="text-xl">{file.icon ?? '📄'}</div>
                              <div className="text-sm">{file.name}</div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(file.id)} aria-label="즐겨찾기">
                              <Star />
                            </Button>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 하단 바 */}
      <div className="border-t p-3 flex gap-2">
        <Button onClick={onNavigateToChat}><Search className="w-4 h-4 mr-2" />채팅으로 검색</Button>
        <div className="ml-auto relative" ref={apiDropdownRef}>
          <Button variant="outline" onClick={() => setShowApiDropdown(s => !s)}>
            API 키 상태 <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
          {showApiDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-background border rounded-md shadow-lg z-10 p-2">
              <div className="text-sm font-medium mb-2">연결된 API</div>
              {apiKeys.filter(k => k.isConnected).length > 0 ? (
                apiKeys.filter(k => k.isConnected).map(k => (
                  <div key={k.id} className="text-sm py-1">{k.name} • {k.lastUsed}</div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">연결된 키 없음</div>
              )}
              <Button className="mt-2 w-full" variant="destructive" onClick={onDisconnectAllApiKeys}>
                연결 모두 해제
              </Button>
            </div>
          )}
        </div>
      </div>

      <FileSearchModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        files={files}
        onFileSelect={(f) => { setPreviewFile(f); setPreviewOpen(true); onFileSelect(f); }}
        onToggleFavorite={onToggleFavorite}
      />

      <FilePreviewDrawer
        file={previewFile}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}
