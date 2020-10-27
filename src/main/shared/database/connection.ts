import Knex from 'knex';
import * as path from 'path';

export const setupConnection = async () => {
  return Knex({
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '../db/lofipomodo.db3'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, '../db/migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, '../db/seeds'),
    },
  });
};
