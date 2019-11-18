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
};
