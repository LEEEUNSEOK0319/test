import type { FileItem, ApiKey } from '../types';

export const initialFiles: FileItem[] = [
  {
    id: 'f1',
    name: '분기별_마케팅_전략.pdf',
    type: 'pdf',
    size: '2.1MB',
    modified: '2시간 전',
    modifiedBy: '김마케팅',
    path: '/marketing/strategy/Q2/',
    icon: '📄',
    isFavorite: true,
  },
  {
    id: 'f2',
    name: '브랜드_가이드라인.pptx',
    type: 'powerpoint',
    size: '8.4MB',
    modified: '1일 전',
    modifiedBy: '박디자인',
    path: '/brand/guide/',
    icon: '📊',
  },
  {
    id: 'f3',
    name: '매출_리포트.xlsx',
    type: 'excel',
    size: '512KB',
    modified: '3일 전',
    modifiedBy: '최영업',
    path: '/reports/sales/',
    icon: '📈',
  },
  {
    id: 'f4',
    name: '인사_규정.docx',
    type: 'word',
    size: '310KB',
    modified: '1주 전',
    modifiedBy: '이HR',
    path: '/hr/policy/',
    icon: '📃',
  },
];

export const initialApiKeys: ApiKey[] = [
  {
    id: 'k1',
    name: 'Dooray',
    maskedKey: 'doo***************r9Xa',
    created: '2025-08-01',
    lastUsed: '방금 전',
    isConnected: true,
  },
  {
    id: 'k2',
    name: 'Google Drive',
    maskedKey: 'go-***************-le',
    created: '2025-08-05',
    lastUsed: '3일 전',
    isConnected: false,
  },
];
