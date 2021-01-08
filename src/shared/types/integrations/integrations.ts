import { Nullable } from '../base';

export enum IntegrationEvents {
  GetAuthState = 'GetAuthState',
  AuthorizeApi = 'AuthorizeApi',
  ApiAuthorized = 'ApiAuthorized',
  ApiAuthorizationFailed = 'ApiAuthorizationFailed',
  ApiAuthorizationStarted = 'ApiAuthorizationStarted',
  GetTrelloBoards = 'GetTrelloBoards',
}

export interface ProviderInfo {
  provider: ApiProvider;
}

export interface AuthState {
  isAuthorizing: boolean;
  token: Nullable<string>;
}

export interface ApiAuthorizedResult extends ProviderInfo {
  token: string;
}

export enum TrelloEvents {
  TokenSet = 'TokenSet',
  AuthStarted = 'AuthStarted',
  AuthEnded = 'AuthEnded',
  AuthFailed = 'AuthFailed',
}

export enum ApiProvider {
  Trello = 'Trello',
}
