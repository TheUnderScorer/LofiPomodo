import { sendEventToAllWindows } from '../../../shared/windows/sendEventToAllWindows';
import { ApiAuthService } from './ApiAuthService';

export const forwardIntegrationEventsToWindows = (
  apiAuthService: ApiAuthService
) => {
  apiAuthService.events.onAny((eventName, payload) => {
    sendEventToAllWindows(eventName, payload);
  });
};
