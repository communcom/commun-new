/* eslint-disable no-param-reassign */
const path = require('path');
const { compose } = require('ramda');
const DotEnv = require('dotenv-webpack');
const withTM = require('next-transpile-modules')(['@commun/ui']);
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

module.exports = compose(
  withBundleAnalyzer,
  withTM
)({
  webpack: config => {
    if (!process.env.IN_DOCKER) {
      config.plugins.push(
        new DotEnv({
          path: path.join(__dirname, '../../.env'),
          systemvars: true,
        })
      );
    }

    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
        entries['main.js'].unshift('./client/polyfills.js');
      }

      return entries;
    };

    config.resolve.alias = {
      ...(config.resolve.alias || {}),

      '@commun/ui': path.resolve('./../ui'),
      // // because of slate editor conflict
      'styled-components': path.resolve('./../../node_modules/styled-components'),
    };

    return config;
  },
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../.analyze/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../../.analyze/client.html',
    },
  },
});
