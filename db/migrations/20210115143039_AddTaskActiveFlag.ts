import * as Knex from 'knex';
import { Tables } from '../../src/shared/types/database';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(Tables.Tasks, (table) => {
    table.boolean('active').defaultTo(false);
    table.jsonb('providerMeta');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(Tables.Tasks, (table) => {
    table.dropColumns('active', 'providerMeta');
  });
}
