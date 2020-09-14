/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import pathOr from 'ramda/src/pathOr';
import { ServerStyleSheet } from 'styled-components';

import { GlobalStyles } from '@commun/ui';

import env from 'shared/env';

import Scripts from 'components/head';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [...initialProps.styles, ...sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const lang = pathOr(
      'en',
      ['__NEXT_DATA__', 'props', 'initialProps', 'initialLanguage'],
      this.props
    );

    return (
      <Html lang={lang}>
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />

          <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="true" />
          <meta name="theme-color" content="#6a80f5" />

          <GlobalStyles />
          {this.props.styles}

          <script dangerouslySetInnerHTML={{ __html: `window.__env=${JSON.stringify(env)};` }} />
          <Scripts />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
