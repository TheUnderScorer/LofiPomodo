import {
  ApiProvider,
  ProviderInfo,
} from '../../../../shared/types/integrations/integrations';
import { IpcReceiverCallback } from '../../../shared/ipc/useIpcReceiver';

// Filters Ipc receiver events to make sure that callback is only triggered for event related to given provider
export const filterApiProvider = <T extends ProviderInfo>(
  provider: ApiProvider,
  callback: IpcReceiverCallback<T>
) => (event: unknown, payload: T) => {
  if (payload.provider !== provider) {
    return;
  }

  callback(event, payload);
};
