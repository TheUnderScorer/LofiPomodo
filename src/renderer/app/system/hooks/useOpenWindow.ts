import {
  AppSystemEvents,
  OpenWindowPayload,
  WindowTypes,
} from '../../../../shared/types/system';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';
import { useCallback } from 'react';

export const useOpenWindow = (type: WindowTypes) => {
  const openWindowMutation = useIpcMutation<OpenWindowPayload, never>(
    AppSystemEvents.OpenWindow
  );

  return {
    openWindow: useCallback(async () => {
      await openWindowMutation.mutateAsync({ windowType: type });
    }, [openWindowMutation, type]),
    loading: openWindowMutation.isLoading,
    error: openWindowMutation.error,
  };
};
