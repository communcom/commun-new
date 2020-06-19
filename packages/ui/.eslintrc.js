const path = require('path');

module.exports = {
  extends: require.resolve('@commun/presets/eslint'),
  settings: {
    'import/resolver': {
      'babel-module': {
        alias: {
          animations: path.resolve(__dirname, 'src/animations'),
          components: path.resolve(__dirname, 'src/components'),
          libs: path.resolve(__dirname, 'src/libs'),
          constants: path.resolve(__dirname, 'src/constants'),
          utils: path.resolve(__dirname, 'src/utils'),
          styledguide: path.resolve(__dirname, 'src/styleguide'),
          styles: path.resolve(__dirname, 'src/styles'),
          themes: path.resolve(__dirname, 'src/themes'),
        },
      },
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    // sort
    'simple-import-sort/sort': [
      'error',
      {
        groups: [
          ['^react', '^prop-types', '^[^\\.]', '^\\u0000'], // react, prop-types, non-local imports, bare imports
          ['^@commun'], // internal
          ['^constants', '^utils', '^themes', '^styles', '^animations'], // internal
          ['^components', '^\\.'], // internal, local imports
        ],
      },
    ],
  },
};
