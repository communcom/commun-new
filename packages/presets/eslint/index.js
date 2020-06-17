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
    'react/prop-types': [2, { ignore: ['className', 'children'] }],
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

    // sort
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': 'off',
    'sort-imports': 'off',
    'react/sort-comp': 'off',
    'simple-import-sort/sort': [
      'error',
      {
        groups: [
          ['^react', '^prop-types', '^[^\\.]', '^\\u0000'], // react, prop-types, non-local imports, bare imports
          ['^@commun'], // internal
          ['^types', '^shared', '^utils', '^client', '^store'], // internal
          ['^containers', '^components', '^\\.'], // internal, local imports
        ],
      },
    ],
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
