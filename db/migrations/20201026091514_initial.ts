import * as Knex from 'knex';
import { Tables } from '../../src/shared/types/database';
import { baseModelSchema } from '../../src/main/shared/database/migrations/baseModelSchema';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(Tables.Tasks, (table) => {
    baseModelSchema(table, knex);

    table.string('title', 255);
    table.string('description').nullable();
    table.string('source', 15);
    table.string('state', 15);
    table.uuid('sourceId').nullable();
    table.integer('estimatedPomodoroDuration').nullable();
    table.jsonb('pomodoroSpent').nullable();
    table.integer('index').defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTableIfExists(Tables.Tasks);
}
