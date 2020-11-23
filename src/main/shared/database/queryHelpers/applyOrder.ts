import { QueryBuilder } from 'knex';
import { Order } from '../../../../shared/types/database';

export const applyOrder = (queryBuilder: QueryBuilder, order: Order<any>) => {
  Object.entries(order).forEach(([column, direction]) => {
    if (typeof direction === 'object') {
      return applyOrder(queryBuilder, direction);
    }

    queryBuilder.orderBy(column, direction!);
  });

  return queryBuilder;
};
