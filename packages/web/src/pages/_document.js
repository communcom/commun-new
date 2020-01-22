/* eslint-disable react/no-danger,jsx-a11y/iframe-has-title */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { pathOr } from 'ramda';

import { GlobalStyles } from '@commun/ui';
import { Sprite } from '@commun/icons';
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
      <html lang={lang}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />

          <meta name="theme-color" content="#6a80f5" />

          <GlobalStyles />
          {this.props.styles}

          <Scripts />
        </Head>
        <body>
          <Sprite />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
