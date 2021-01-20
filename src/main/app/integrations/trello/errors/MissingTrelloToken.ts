import { AppError } from '../../../../../shared/errors/AppError';

export class MissingTrelloToken extends AppError {
  constructor() {
    super('Trello token is missing.');
  }
}
