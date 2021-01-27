const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const glob = require('glob');
const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');

const migrations = glob.sync(path.resolve(__dirname, './db/migrations/*.ts'));
const migrationEntries = migrations.reduce((obj, migration) => {
  const name = path.parse(migration).name;

  return {
    ...obj,
    [`db/migrations/${name}`]: migration,
  };
}, {});

const isProduction = process.env.NODE_ENV === 'production';

const devToolConfig = !isProduction
  ? {
      devtool: 'source-map',
    }
  : {};

const optimization = isProduction
  ? {
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
    }
  : {};

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    electron: './src/main/electron.ts',
    preload: './src/main/preload.js',
    ...migrationEntries,
  },
  target: 'electron-main',
  ...devToolConfig,
  externals: [...Object.keys(pkg.dependencies || {})],
  node: {
    __dirname: false,
    __filename: false,
  },
  optimization,
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
    libraryTarget: 'commonjs2',
  },
};
