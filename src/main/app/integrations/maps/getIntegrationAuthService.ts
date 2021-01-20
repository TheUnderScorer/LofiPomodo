import { ApiProvider } from '../../../../shared/types/integrations/integrations';
import { AppContext } from '../../../context';

export const getIntegrationAuthService = (
  provider: ApiProvider,
  context: AppContext
) => {
  switch (provider) {
    case ApiProvider.Trello:
      return context.trelloService;
    default:
      throw new TypeError(`Invalid api provider: ${provider}`);
  }
};
