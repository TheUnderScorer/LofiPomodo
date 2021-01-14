import { AppError } from '../../../../shared/errors/AppError';

export class EntityNotFound extends AppError {
  constructor(id: string) {
    super(`Entity with id ${id} not found.`, { title: 'Entity not found.' });
  }
}
