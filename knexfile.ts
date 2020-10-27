// @ts-ignore
const path = require('path');

const config = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, './db/lofipomodo.db3'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, './db/migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, './db/seeds'),
  },
};

module.exports = config;
