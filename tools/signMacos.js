const { signAsync } = require('electron-osx-sign');

module.exports = async (appPath) => {
  await signAsync({
    app: appPath,
    identity: 'Przemysław Żydek',
    'gatekeeper-assess': false,
  });
};
