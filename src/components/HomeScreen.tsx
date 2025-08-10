import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  FileText, 
  Search, 
  Settings, 
  MessageSquare,
  User,
  Clock,
  Star,
  Plus,
  Filter,
  Grid,
  List,
  HardDrive,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Upload,
  Unplug,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Sidebar from '../imports/Sidebar-2051-288';
import { FileItem, ApiKey } from '../types';
import { FileSearchModal } from './FileSearchModal';

interface HomeScreenProps {
// ... (rest of the file is the same) ...