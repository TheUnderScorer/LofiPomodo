import { QueryBuilder } from 'knex';
import { Pagination } from '../../../../shared/types/database';

export const applyPagination = (
  queryBuilder: QueryBuilder,
  pagination: Pagination
) => {
  queryBuilder.limit(pagination.take).offset(pagination.take * pagination.skip);

  return queryBuilder;
};
