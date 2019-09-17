/* eslint-disable no-param-reassign */
const path = require('path');
const { compose } = require('ramda');
const DotEnv = require('dotenv-webpack');
const withTM = require('next-transpile-modules');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

module.exports = compose(
  withBundleAnalyzer,
  withTM
)({
  transpileModules: ['@commun/ui'],
  webpack: config => {
    config.plugins.push(
      // Read the .env file
      new DotEnv({
        path: path.join(__dirname, '../../.env'),
        systemvars: !process.env.IN_DOCKER,
      })
    );

    config.resolve.alias = {
      ...(config.resolve.alias || {}),

      '@commun/ui': path.resolve('./../ui'),
      // // because of slate editor(rich-html-editor) conflict
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
