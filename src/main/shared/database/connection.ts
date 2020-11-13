import Knex from 'knex';
import * as path from 'path';
import { app } from 'electron';
import fs from 'fs';

export const getDbPath = () =>
  path.join(app.getPath('userData'), 'lofipomodo.db3');

export const setupConnection = async () => {
  const dbPath = getDbPath();

  fs.accessSync(app.getPath('userData'), fs.constants.W_OK);

  console.log(`Creating DB at ${dbPath}`);

  return Knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, 'db/migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'db/seeds'),
    },
  });
};
