module.exports = () => {
  return {
    webpack: {
      configure: (config) => {
        config.target = 'electron-renderer';
        config.output.publicPath = './';

        return config;
      },
    },
  };
};
