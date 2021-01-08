import {
  ApiAuthorizedResult,
  ApiProvider,
} from '../../../shared/types/integrations/integrations';
import { Nullable } from '../../../shared/types';

export interface ApiService {
  getUserToken(): Promise<Nullable<string>>;
  isAuthorized(): Promise<boolean>;
  getAuthorizationUrl(): Promise<string>;
  handleAuthProtocol(
    url: string
  ): Promise<Pick<ApiAuthorizedResult, 'token'> | undefined>;
  readonly provider: ApiProvider;
}
