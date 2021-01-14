import { AppError } from '../../../../../shared/errors/AppError';

export class InvalidTrelloResponse extends AppError {
  constructor(statusCode: number) {
    super(`Trello responded with invalid status code: ${statusCode}`, {
      title: 'Invalid trello response.',
      name: 'InvalidTrelloResponse',
    });
  }
}
