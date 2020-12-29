import { AppContext } from '../../../context';
import { sendEventToAllWindows } from '../../../shared/windows/sendEventToAllWindows';

export const forwardIntegrationEventsToWindows = (context: AppContext) => {
  context.apiAuthService.events.onAny((eventName, payload) => {
    sendEventToAllWindows(eventName, payload);
  });
};
