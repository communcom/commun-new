module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: { legacyDecorators: true },
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier', 'react-hooks', 'simple-import-sort'],
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/prop-types': [2, { ignore: ['className', 'children', 'forwardedRef'] }],
    'react/forbid-prop-types': [
      'error',
      {
        forbid: ['any', 'array'],
        checkContextTypes: true,
        checkChildContextTypes: true,
      },
    ],
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
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'error',

    'import/prefer-default-export': 'off',

    // sort
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': 'off',
    'sort-imports': 'off',
    'react/sort-comp': 'off',
    // see own rules in packages
  },
  globals: {
    window: true,
    document: true,
    localStorage: true,
    sessionStorage: true,
    FormData: true,
    FileReader: true,
    Blob: true,
    navigator: true,
    Image: true,
  },
};
