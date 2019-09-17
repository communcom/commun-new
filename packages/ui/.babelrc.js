module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
      },
    ],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-class-properties',
    [
      'babel-plugin-styled-components',
      {
        ssr: true,
        displayName: false,
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
