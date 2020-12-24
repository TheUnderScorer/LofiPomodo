const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

const ignorePatterns = [
  /.idea/,
  /.vscode/,
  /docker/,
  /docs/,
  /e2e/,
  /public/,
  /readmeAssets/,
  /scripts/,
  /^.*\\.(ts)$/g,
  /.dockerignore/,
  /.eslintcache/,
  /.gitignore/,
  /.prettierrc/,
  /craco.config.js/,
  /docker-compose.yml/,
  /jest.config.e2e.js/,
  /pm2-e2e.json/,
  /README.md/,
  /webpack.electron.json/,
  /^.*node_modules\/(react|eslint|babel).*$/g,
];

const startWithPatterns = [
  '/node_modules/electron/',
  '/node_modules/electron-prebuilt/',
  '/node_modules/react',
  '/node_modules/jest',
  '/node_modules/@jest',
  '/node_modules/post-css',
  '/node_modules/postcss',
  '/node_modules/sass',
  '/node_modules/webpack',
  '/node_modules/babel',
  '/node_modules/@babel',
  '/node_modules/eslint',
  '/node_modules/workbox',
  '/node_modules/@chakra',
  '/node_modules/@craco',
  '/node_modules/@rollup',
  '/node_modules/@semantic-release',
  '/node_modules/@testing',
  '/node_modules/@typescript',
  '/node_modules/typescript',
  '/node_modules/.bin',
];

const endWithPatterns = ['.ts', '.tsx'];

const parseArtifact = (artifact, platform, arch) => {
  const dirname = path.dirname(artifact);
  const extension = path.extname(artifact);

  const newFileName = `${pkg.productName}-${arch}-${platform}${extension}`.replace(
    / /g,
    ''
  );

  const newPath = path.join(dirname, newFileName);

  fs.renameSync(artifact, newPath);

  console.log(`Created artifact ${newPath}`);

  return newFileName;
};

module.exports = {
  hooks: {
    postMake: (forgeConfig, results) => {
      return results.map((result) => {
        return {
          ...result,
          artifacts: result.artifacts.map((artifact) =>
            parseArtifact(artifact, result.platform, result.arch)
          ),
        };
      });
    },
  },
  packagerConfig: {
    ignore: (path) => {
      return (
        ignorePatterns.some((regex) => regex.test(path)) ||
        startWithPatterns.some((start) => path.startsWith(start)) ||
        endWithPatterns.some((end) => path.endsWith(end))
      );
    },
    executableName: pkg.productName,
    asar: true,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'pixel_pomodo',
      },
    },
    {
      name: '@electron-forge/maker-dmg',
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
  ],
};
