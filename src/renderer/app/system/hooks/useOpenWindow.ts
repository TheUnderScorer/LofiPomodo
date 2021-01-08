import {
  AppSystemEvents,
  OpenWindowPayload,
  WindowTypes,
} from '../../../../shared/types/system';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { useCallback } from 'react';

export const useOpenWindow = (type: WindowTypes) => {
  const [openWindow, { loading, error }] = useIpcInvoke<
    OpenWindowPayload,
    never
  >(AppSystemEvents.OpenWindow);

  return {
    openWindow: useCallback(async () => {
      await openWindow({ windowType: type });
    }, [type]),
    loading,
    error,
  };
};
