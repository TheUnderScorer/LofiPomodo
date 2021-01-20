type TrelloId = string;

export enum TrelloEntity {
  Member = 'Member',
  Card = 'Card',
  Board = 'Board',
  Organization = 'Organization',
}

export interface TrelloBoard {
  id: TrelloId;
  closed: boolean;
  url: string;
  name: string;
}

export interface TrelloMember {
  id: TrelloId;
  avatarUrl: string;
  fullName: string;
  idMemberReferrer: string;
  url: string;
  email: string;
  idBoards: string[];
}

export interface TrelloCard {
  id: TrelloId;
  desc: string;
  closed: boolean;
  due?: string;
  url: string;
  shortUrl: string;
  name: string;
  email: string;
  idList: string;
  idBoard: string;
}

export interface UpdateCardInput
  extends Pick<TrelloCard, 'id'>,
    Omit<Partial<TrelloCard>, 'id'> {}

export interface TrelloList {
  id: TrelloId;
  name: string;
  closed: boolean;
}

export interface TrelloBoardSettings {
  id?: string;
  boardId?: string;
  listIds?: string[];
  doneListId?: string;
}

export interface TrelloSettings {
  boards?: TrelloBoardSettings[];
  userToken?: string;
  member?: TrelloMember;
}

export interface TrelloTaskMeta {
  orgListId: string;
  boardId: string;
}
