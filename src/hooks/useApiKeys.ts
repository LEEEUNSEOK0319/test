import { useState, useCallback, useMemo } from 'react';
import type { ApiKey } from '../types';
import { initialApiKeys } from '../data/mockData';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);

  const hasConnectedApiKeys = useMemo(
    () => apiKeys.some(k => k.isConnected),
    [apiKeys],
  );

  const connectedKeys = useMemo(
    () => apiKeys.filter(k => k.isConnected),
    [apiKeys],
  );

  const onUpdateApiKeys = useCallback((newApiKeys: ApiKey[]) => {
    setApiKeys(newApiKeys);
  }, []);

  const onDisconnectAllApiKeys = useCallback(() => {
    setApiKeys(prev =>
      prev.map(k => ({
        ...k,
        isConnected: false,
        lastUsed: k.isConnected ? '방금 연결 해제됨' : k.lastUsed,
      })),
    );
  }, []);

  const onDisconnectApiKey = useCallback((apiKeyId: string) => {
    setApiKeys(prev =>
      prev.map(k =>
        k.id === apiKeyId ? { ...k, isConnected: false, lastUsed: '방금 연결 해제됨' } : k,
      ),
    );
  }, []);

  const onConnectApiKey = useCallback((apiKeyId: string) => {
    setApiKeys(prev =>
      prev.map(k =>
        k.id === apiKeyId ? { ...k, isConnected: true, lastUsed: '방금 전' } : k,
      ),
    );
  }, []);

  return {
    apiKeys,
    hasConnectedApiKeys,
    connectedKeys,
    onUpdateApiKeys,
    onDisconnectAllApiKeys,
    onDisconnectApiKey,
    onConnectApiKey,
  };
}
