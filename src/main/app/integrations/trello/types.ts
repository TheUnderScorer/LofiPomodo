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
}

export interface TrelloMember {
  id: TrelloId;
  avatarUrl: string;
  fullName: string;
  idMemberReferrer: string;
  url: string;
  email: string;
}

export interface TrelloList {
  id: TrelloId;
}
