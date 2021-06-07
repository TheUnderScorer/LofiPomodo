import { useIpcQuery } from '../ipc/useIpcQuery';
import { AppSystemOperations } from '../../../shared/types/system';

export const useSupportsDnd = () => {
  const query = useIpcQuery<void, boolean>(AppSystemOperations.SupportsDnd);

  return {
    loading: query.isLoading,
    isSupported: query.data,
  };
};
