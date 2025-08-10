import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  X, 
  Download, 
  ExternalLink, 
  Share2, 
  Star,
  MoreVertical,
  FileText,
  Calendar,
  User,
  Clock,
  Eye,
  Edit,
  Trash2,
  Copy,
  Tag,
  MessageSquare
} from 'lucide-react';
import { FileItem } from '../types';

interface FilePreviewDrawerProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (fileId: string) => void;
}
// ... (rest of the file is the same) ...