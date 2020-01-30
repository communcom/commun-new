module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: { legacyDecorators: true },
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier', 'react-hooks'],
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/prop-types': [2, { ignore: ['className', 'children'] }],
    'react/forbid-prop-types': [
      'error',
      {
        forbid: ['any', 'array'],
        checkContextTypes: true,
        checkChildContextTypes: true,
      },
    ],
    'import/imports-first': ['error', 'absolute-first'],
    'import/newline-after-import': 'error',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'no-console': 'error',
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'react/sort-comp': 'off',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'error',
  },
  globals: {
    window: true,
    document: true,
    localStorage: true,
    FormData: true,
    FileReader: true,
    Blob: true,
    navigator: true,
    Image: true,
  },
};
