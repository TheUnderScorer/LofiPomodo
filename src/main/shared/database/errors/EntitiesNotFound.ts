import { AppError } from '../../../../shared/errors/AppError';

export class EntitiesNotFound extends AppError {
  constructor(ids: string[]) {
    super(`Entities with following ids were not found: ${ids.join(', ')}`, {
      title: 'Entities not found',
    });
  }
}
