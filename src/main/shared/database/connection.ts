import Knex from 'knex';
import * as path from 'path';
import { app } from 'electron';

export const getDbPath = () =>
  path.resolve(app.getAppPath(), './db/lofipomodo.db3');

export const setupConnection = async () => {
  const dbPath = getDbPath();

  return Knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, './db/migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, './db/seeds'),
    },
  });
};
