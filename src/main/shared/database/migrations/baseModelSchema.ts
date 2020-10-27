import * as Knex from 'knex';

export const baseModelSchema = (
  table: Knex.CreateTableBuilder,
  knex: Knex<any, unknown[]>
) => {
  table.uuid('id');
  table.timestamp('createdAt').defaultTo(knex.fn.now());
  table.timestamp('updatedAt').defaultTo(knex.fn.now());
};
