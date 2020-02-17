module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          useBuiltIns: 'entry',
          modules: false,
          corejs: 3,
        },
      },
    ],
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-optional-chaining',
    [
      'babel-plugin-styled-components',
      {
        ssr: true,
      },
    ],
  ],
  env: {
    development: {
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            ssr: true,
            displayName: true,
          },
        ],
      ],
    },
  },
};
