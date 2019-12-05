/* eslint-disable react/no-danger,jsx-a11y/iframe-has-title */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { pathOr } from 'ramda';

import { GlobalStyles } from '@commun/ui';
import { Sprite } from '@commun/icons';
import { OG_DESCRIPTION, OG_NAME, TWITTER_NAME } from 'shared/constants';

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

          <meta property="og:type" content="website" />
          <meta name="description" content={OG_DESCRIPTION} />

          <meta property="og:title" content={OG_NAME} />
          <meta property="og:description" content={OG_DESCRIPTION} />
          <meta property="og:url" content="http://commun.com" />
          <meta name="twitter:card" content="summary_large_image" />

          <meta property="og:site_name" content={OG_NAME} />
          <meta name="twitter:image:alt" content={OG_NAME} />

          <meta name="twitter:site" content={`@${TWITTER_NAME}`} />

          <GlobalStyles />
          {this.props.styles}

          <script async defer src="https://platform.twitter.com/widgets.js" />
          <script async defer src="https://platform.instagram.com/en_US/embeds.js" />

          {process.env.NODE_ENV === 'production' ? (
            <>
              <script async src="https://www.googletagmanager.com/gtag/js?id=UA-151575597-1" />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'UA-151575597-1');
                  `,
                }}
              />

              <script async src="https://www.googletagmanager.com/gtag/js?id=G-0SLBQ9EP1H" />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-0SLBQ9EP1H');
                  `,
                }}
              />

              <script
                dangerouslySetInnerHTML={{
                  __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PRBKH7M');
                  `,
                }}
              />
            </>
          ) : null}
        </Head>
        <body>
          {process.env.NODE_ENV === 'production' ? (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
                <iframe
                  src="https://www.googletagmanager.com/ns.html?id=GTM-PRBKH7M"
                  height="0"
                  width="0"
                  style="display:none;visibility:hidden;"
                />
              `,
              }}
            />
          ) : null}

          <Sprite />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
