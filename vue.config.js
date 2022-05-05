const path = require('path');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const plugins = [];
if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new SentryWebpackPlugin({
      release: process.env.VUE_APP_COMMIT_HASH,
      url: 'https://sentry.aliftech.uz',
      authToken: process.env.VUE_APP_SENTRY_AUTH_TOKEN,
      org: 'alifuz_sentry',
      project: 'frontend-team-admin',
      include: './dist',
      ignore: ['node_modules', 'vue.config.js', 'cicd'],
    })
  );
}

module.exports = {
  configureWebpack: {
    output: {
      filename:
        process.env.production === 'production' ? 'js/[name].[chunkhash].bundle.js' : 'js/[name].[hash].bundle.js',
      chunkFilename: process.env.production === 'production' ? 'js/[name].[chunkhash].js' : 'js/[name].[hash].js',
    },
    resolve: {
      symlinks: false,
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src'),
        '~~': path.resolve(__dirname, '.'),
        '@@': path.resolve(__dirname, '.'),
        vue: path.resolve(`./node_modules/vue`),
      },
    },
    plugins,
  },
  productionSourceMap: true,
};
