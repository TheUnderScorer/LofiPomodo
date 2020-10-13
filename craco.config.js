module.exports = () => {
  return {
    webpack: {
      configure: webpackConfig => {
        webpackConfig.target = 'electron-renderer';
        webpackConfig.output.publicPath = '';

        return webpackConfig;
      },
    },
  };
};
