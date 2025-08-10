import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Send, 
  Paperclip, 
  Search, 
  Settings, 
  ArrowLeft,
  FileText,
  Download,
  ExternalLink,
  Bot,
  User,
  Sparkles,
  Clock,
  Star,
  Filter,
  MoreVertical
} from 'lucide-react';
import { FileItem, ChatMessage } from '../types';
import { FileSearchModal } from './FileSearchModal';
import Sidebar from '../imports/Sidebar-2051-288';

interface MainChatInterfaceProps {
// ... (rest of the file is the same) ...