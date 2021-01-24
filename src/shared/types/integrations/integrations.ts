import { Nullable } from '../base';

export enum IntegrationOperations {
  GetAuthState = 'GetAuthState',
  AuthorizeApi = 'AuthorizeApi',
  UnauthorizeApi = 'UnauthorizeApi',
  GetTrelloBoards = 'GetTrelloBoards',
  GetTrelloBoardLists = 'GetTrelloBoardLists',
  SaveTrelloBoards = 'SaveTrelloBoards',
}

export enum IntegrationSubscriptionTopics {
  ApiAuthorized = 'ApiAuthorized',
  ApiUnauthorized = 'ApiUnauthorized',
  ApiAuthorizationFailed = 'ApiAuthorizationFailed',
  ApiAuthorizationStarted = 'ApiAuthorizationStarted',
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

export interface GetTrelloBoardListsArgs {
  boardId: string;
}
