import { useCallback, useMemo, useState } from 'react';
import type { FileItem } from '../types';
import { initialFiles } from '../data/mockData';

export function useFiles() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const onToggleFavorite = useCallback((fileId: string) => {
    setFiles(prev =>
      prev.map(f => (f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f)),
    );
  }, []);

  const onFileSelect = useCallback((file: FileItem) => {
    setSelectedFile(file);
  }, []);

  const recentFiles = useMemo(() => {
    const order = ['방금 전', '2시간 전', '5시간 전', '1일 전', '2일 전', '3일 전', '1주 전'];
    return [...files].sort(
      (a, b) => order.indexOf(a.modified) - order.indexOf(b.modified),
    );
  }, [files]);

  return { files, recentFiles, selectedFile, setSelectedFile, onToggleFavorite, onFileSelect };
}
