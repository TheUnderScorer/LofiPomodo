import { ApiService } from '../types';
import { ApiProvider } from '../../../../shared/types/integrations';

export const getServiceByProvider = (
  services: ApiService[],
  provider: ApiProvider
) => {
  const result = services.find((service) => service.provider === provider);

  if (!result) {
    throw new TypeError(`No service found for provider ${provider}`);
  }

  return result;
};
