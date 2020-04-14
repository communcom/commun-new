const path = require('path');

module.exports = {
  extends: require.resolve('@commun/presets/eslint'),
  settings: {
    'import/resolver': {
      'babel-module': {
        alias: {
          components: path.resolve(__dirname, 'src/components'),
          containers: path.resolve(__dirname, 'src/containers'),
          libs: path.resolve(__dirname, 'src/libs'),
          pages: path.resolve(__dirname, 'src/pages'),
          store: path.resolve(__dirname, 'src/store'),
          static: path.resolve(__dirname, 'src/static'),
          utils: path.resolve(__dirname, 'src/utils'),
          shared: path.resolve(__dirname, 'src/shared'),
          types: path.resolve(__dirname, 'src/types'),
        },
      },
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'react/prop-types': [
      2,
      { ignore: ['className', 'children', 'forwardRef', 't', 'i18n', 'theme'] },
    ],
    'react/no-danger': 0,
    'no-plusplus': 0,
    'react/sort-comp': 0,
  },
};
