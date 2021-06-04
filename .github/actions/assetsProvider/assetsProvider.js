const core = require('@actions/core');

const assetsMap = [
  {
    os: 'macos-latest',
    arch: 'x64',
    path: 'out/make/PixelPomodo-x64-darwin.dmg',
    name: 'PixelPomodo-x64-darwin.dmg',
  },
  {
    os: 'ubuntu-latest',
    arch: 'x64',
    path: 'out/make/deb/x64/PixelPomodo-x64-linux.deb',
    name: 'PixelPomodo-x64-linux.deb',
  },
  {
    os: 'windows-latest',
    arch: 'x64',
    path: 'out/make/squirrel.windows/x64/PixelPomodo-x64-win32.exe',
    name: 'PixelPomodo-x64-win32.exe',
  },
  {
    os: 'ubuntu-latest',
    arch: 'arm64',
    path: 'out/make/deb/arm64/PixelPomodo-arm64-linux.deb',
    name: 'PixelPomodo-arm64-linux.deb',
  },
  {
    os: 'windows-latest',
    arch: 'arm64',
    path: 'out/make/squirrel.windows/arm64/PixelPomodo-arm64-win32.exe',
    name: 'PixelPomodo-arm64-win32.exe',
  },
  {
    os: 'macos-arm64',
    arch: 'arm64',
    path: 'out/make/PixelPomodo-arm64-darwin.dmg',
    name: 'PixelPomodo-arm64-darwin.dmg',
  },
];

async function main() {
  const os = core.getInput('os');
  const arch = core.getInput('arch');

  const asset = assetsMap.find(
    (asset) => asset.os === os && asset.arch === arch
  );

  if (asset) {
    core.setOutput('path', asset.path);
    core.setOutput('name', asset.name);
  } else {
    core.debug(`No asset found for os ${os} and arch ${arch}.`);
  }
}

main().catch((err) => {
  core.setFailed(err);
});
