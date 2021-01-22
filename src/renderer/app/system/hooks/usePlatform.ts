import { AppSystemOperations } from '../../../../shared/types/system';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';

interface Is {
  windows: boolean;
  development: boolean;
  macos: boolean;
  linux: boolean;
}

export const usePlatform = () => {
  const getPlatformQuery = useIpcQuery<void, NodeJS.Platform>(
    AppSystemOperations.GetPlatform
  );
  const getIsQuery = useIpcQuery<void, Is>(AppSystemOperations.GetIs);

  return {
    platform: getPlatformQuery.data,
    is: getIsQuery.data,
  };
};
