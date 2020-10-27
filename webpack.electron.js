const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const glob = require('glob');

const migrations = glob.sync(path.resolve(__dirname, './db/migrations/*.ts'));
const migrationEntries = migrations.reduce((obj, migration) => {
  const name = path.parse(migration).name;

  return {
    [`db/migrations/${name}`]: migration,
  };
}, {});

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    electron: './src/main/electron.ts',
    preload: './src/main/preload.js',
    ...migrationEntries,
  },
  target: 'electron-main',
  devtool: 'source-map',
  externals: [nodeExternals()],
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.electron.json',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({ configFile: './tsconfig.electron.json' }),
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
};
