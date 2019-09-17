import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { pathOr } from 'ramda';

import { GlobalStyles } from '@commun/ui';
import { Sprite } from '@commun/icons';

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
          {/* TODO: replace with real description, image and title */}
          <meta name="description" content="Commun App" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Commun" />
          <meta
            property="og:image"
            content="https://i.kym-cdn.com/entries/icons/original/000/002/232/bullet_cat.jpg"
          />
          <meta property="og:description" content="Commun App" />
          <meta property="og:title" content="Commun" />
          <GlobalStyles />
          {this.props.styles}
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
