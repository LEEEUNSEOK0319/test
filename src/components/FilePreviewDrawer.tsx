import React from 'react';
import { Button } from './ui/button';
import { X, Download, ExternalLink, Star } from 'lucide-react';
import type { FileItem } from '../types';

interface FilePreviewDrawerProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (fileId: string) => void;
}

export function FilePreviewDrawer({ file, isOpen, onClose, onToggleFavorite }: FilePreviewDrawerProps) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-40">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">파일 미리보기</h3>
          <button onClick={onClose} aria-label="닫기">
            <X />
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-4xl">{file.icon ?? '📄'}</div>
          <div className="text-lg font-medium">{file.name}</div>
          <div className="text-sm text-muted-foreground">
            {file.type} • {file.size} • {file.modified}
          </div>
          <div className="text-sm">경로: {file.path}</div>
          <div className="text-sm">작성자: {file.modifiedBy}</div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="secondary" onClick={() => onToggleFavorite(file.id)}>
            <Star className="w-4 h-4 mr-2" />
            {file.isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> 다운로드
          </Button>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" /> 열기
          </Button>
        </div>
      </div>
    </div>
  );
}
