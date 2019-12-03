/* eslint-disable import/first,import/imports-first */
// pages/_app.js
import React from 'react';
import { Provider } from 'react-redux';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import withRedux from 'next-redux-wrapper';
import { ConfigureFlopFlip } from '@flopflip/react-redux';
import adapter from '@flopflip/memory-adapter';
import styled, { ThemeProvider } from 'styled-components';
import 'isomorphic-unfetch';
import commun from 'commun-client';
import dayjs from 'dayjs';
import ToastsManager from 'toasts-manager';
import NProgress from 'nprogress';

commun.configure({
  endpoint: process.env.WEB_CYBERWAY_HTTP_URL,
});

import initStore from 'store/store';
import { setUIDataByUserAgent, updateUIMode } from 'store/actions/ui';
import { setServerAccountName, setServerRefId } from 'store/actions/gate/auth';
import { appWithTranslation } from 'shared/i18n';
import featureFlags from 'shared/featureFlags';
import { MainContainer, theme } from '@commun/ui';
import Header from 'components/common/Header';
import SideBar from 'components/common/SideBar';
import UIStoreSync from 'components/common/UIStoreSync';
import ModalManager from 'components/modals/ModalManager';
import ScrollFix from 'components/common/ScrollFix';
import FeaturesToggle from 'components/common/FeaturesToggle';
import NotifyToast from 'components/common/NotifyToast';
import TapBar from 'components/common/TapBar';
import ArticleEditorSlot from 'components/common/ArticleEditorSlot';
import OnboardingCheck from 'components/common/OnboardingCheck';

const ScrollFixStyled = styled(ScrollFix)`
  display: flex;

  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

const MainContainerStyled = styled(MainContainer)`
  flex-direction: row;
`;

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

@withRedux(initStore, { debug: Boolean(process.env.DEBUG_REDUX) })
@appWithTranslation
export default class CommunApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let userId;

    if (ctx.req) {
      const ua = ctx.req.headers['user-agent'];

      ctx.store.dispatch(setUIDataByUserAgent(ua));

      userId = ctx.req.cookies['commun.userId'];
      let refId = ctx.req.cookies['commun.refId'];

      // authed user
      if (userId) {
        ctx.store.dispatch(setServerAccountName(userId));
      } else {
        // has referral user
        if (ctx.req.query.ref) {
          refId = ctx.req.query.ref;

          const date = new Date();
          date.setMonth(date.getMonth() + 1);

          // set refId to cookie
          ctx.res.setHeader(
            'Set-Cookie',
            `commun.refId=${refId}; path=/; expires=${date.toGMTString()}`
          );
        }

        // has refId from cookie
        if (refId) {
          ctx.store.dispatch(setServerRefId(refId));
        }
      }
    }

    return {
      userId,
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
      },
    };
  }

  componentWillMount() {
    dayjs.locale(this.props.initialLanguage);

    if (process.browser && navigator.serviceWorker) {
      setTimeout(async () => {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(reg => reg.unregister()));
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(err);
        }
      }, 3000);
    }
  }

  componentDidMount() {
    const { store, userId, router } = this.props;

    store.dispatch(
      updateUIMode({
        isHydration: false,
        isRetina: window.devicePixelRatio > 1.3,
      })
    );

    // authorized and has not refId in url
    if (userId && !router.query.ref) {
      router.replace(`${router.asPath.replace(/\?.*$/, '')}${userId ? `?ref=${userId}` : ''}`);
    }
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps, store } = this.props;

    const adapterArgs = {
      clientSideId: '',
      user: { key: '' },
    };

    if (!process.browser && process.env.WEB_DISABLE_SSR) {
      return (
        <>
          <Head>
            <title>Commun</title>
          </Head>
          <div>Loading...</div>
        </>
      );
    }

    return (
      <>
        <Head>
          <title>Commun</title>
        </Head>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <ConfigureFlopFlip
              adapter={adapter}
              adapterArgs={adapterArgs}
              defaultFlags={featureFlags}
            >
              <>
                <Header communityId={pageProps.communityId} />
                <ScrollFixStyled>
                  <MainContainerStyled>
                    <SideBar />
                    <Component {...pageProps} />
                  </MainContainerStyled>
                </ScrollFixStyled>
                <TapBar />
                <UIStoreSync />
                <ArticleEditorSlot />
                <ModalManager passStore={store} />
                <ToastsManager renderToast={props => <NotifyToast {...props} />} />
                <FeaturesToggle />
                <OnboardingCheck />
              </>
            </ConfigureFlopFlip>
          </ThemeProvider>
        </Provider>
      </>
    );
  }
}
