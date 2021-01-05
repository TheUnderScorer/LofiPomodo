import {
  ApiAuthorizedResult,
  ApiProvider,
} from '../../../shared/types/integrations';
import { Nullable } from '../../../shared/types';

export interface ApiService {
  getUserToken(): Promise<Nullable<string>>;
  getAuthorizationUrl(): Promise<string>;
  handleAuthProtocol(
    url: string
  ): Promise<Pick<ApiAuthorizedResult, 'token'> | undefined>;
  readonly provider: ApiProvider;
}
