import { ApiProvider } from '../../../../shared/types/integrations/integrations';
import { ApiAuthStateEvents, ApiAuthStateService } from './ApiAuthStateService';
import { dialog } from 'electron';

const timeoutDialogProps = {
  [ApiProvider.Trello]: {
    type: 'warning',
    message: 'Trello authorization failed, please try again.',
  },
};

export const setupAuthTimeoutDialog = (
  apiAuthStateService: ApiAuthStateService
) => {
  apiAuthStateService.events.on(
    ApiAuthStateEvents.AuthTimeout,
    async ({ provider }) => {
      await dialog.showMessageBox({
        ...timeoutDialogProps[provider],
        type: 'warning',
      });
    }
  );
};
