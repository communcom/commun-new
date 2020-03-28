/* eslint-disable import/first,import/imports-first */
// pages/_app.js
import 'core-js';
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import withRedux from 'next-redux-wrapper';
import { map } from 'ramda';
import { ConfigureFlopFlip } from '@flopflip/react-redux';
import adapter from '@flopflip/memory-adapter';
import styled, { ThemeProvider } from 'styled-components';
import 'isomorphic-unfetch';
import commun from 'commun-client';
import dayjs from 'dayjs';
import ToastsManager from 'toasts-manager';
import NProgress from 'nprogress';
import cookie from 'cookie';

import env from 'shared/env';

if (!commun.isConfigured) {
  commun.configure({
    endpoint: env.WEB_CYBERWAY_HTTP_URL,
  });
}

import 'utils/errorHandling';
import { theme } from '@commun/ui';
import initStore from 'store/store';
import {
  OG_IMAGE,
  OG_DESCRIPTION,
  OG_NAME,
  TWITTER_NAME,
  CREATE_USERNAME_SCREEN_ID,
  UNAUTH_STATE_KEY,
  REGISTRATION_OPENED_FROM_KEY,
  COOKIE_ALL_FEATURES,
  COMMUNITIES_AIRDROP_COUNT,
} from 'shared/constants';
import { ANALYTIC_PROVIDERS_DATA } from 'shared/constants/analytics';
import { setUIDataByUserAgent, updateUIMode, setAbTestingClientId } from 'store/actions/ui';
import { setServerAccountName, setServerRefId } from 'store/actions/gate/auth';
import { getGlobalConfig } from 'store/actions/gate/config';
import { openSignUpModal } from 'store/actions/modals';
import { onboardingSubscribeAfterOauth } from 'store/actions/complex/registration';
import { setScreenId, unauthRestoreState, setLocale } from 'store/actions/local';
import { appWithTranslation } from 'shared/i18n';
import defaultFeatureFlags from 'shared/featureFlags';
import { replaceRouteAndAddQuery } from 'utils/router';
import { KeyBusProvider } from 'utils/keyBus';
import { setRegistrationData, getData } from 'utils/localStore';
import { stepToScreenId } from 'utils/registration';
import { trackEvent } from 'utils/analytics';

import Layout from 'components/common/Layout';
import UIStoreSync from 'components/common/UIStoreSync';
import ModalManager from 'components/modals/ModalManager';
import FeaturesToggle from 'components/common/FeaturesToggle';
import NotifyToast from 'components/common/NotifyToast';
import TapBar from 'components/common/TapBar';
import ArticleEditorSlot from 'components/common/ArticleEditorSlot';
// import OnboardingCheck from 'components/common/OnboardingCheck';
import CookiesPermission from 'components/common/CookiesPermission';
import BuildInfo from 'components/common/BuildInfo';
import ScrollbarStyler from 'components/common/ScrollbarStyler';
import { ScriptsInit } from 'components/head/Scripts';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const ToastsManagerStyled = styled(ToastsManager)`
  left: 15px;
  right: 15px;
`;

function Providers({ store, isAllFeatures, children }) {
  const adapterArgs = {
    clientSideId: '',
    user: { key: '' },
  };

  let flags = defaultFeatureFlags;

  if (isAllFeatures) {
    flags = map(() => true, flags);
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConfigureFlopFlip adapter={adapter} adapterArgs={adapterArgs} defaultFlags={flags}>
          <KeyBusProvider>{children}</KeyBusProvider>
        </ConfigureFlopFlip>
      </ThemeProvider>
    </Provider>
  );
}

Providers.propTypes = {
  store: PropTypes.object.isRequired,
  isAllFeatures: PropTypes.bool.isRequired,
};

@withRedux(initStore, { debug: Boolean(process.env.DEBUG_REDUX) })
@appWithTranslation
export default class CommunApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let userId;
    let isAllFeatures = false;
    let tracing = null;

    if (ctx.req) {
      if (ctx.req.startTracer) {
        tracing = ctx.req.startTracer();
        if (tracing) {
          ctx.store.setTracing(tracing);
        }
      }

      const { headers, cookies, query } = ctx.req;

      const ua = headers['user-agent'];
      const isWebView = Boolean(headers['x-web-view'] || cookies.commun_web_view);

      ctx.store.dispatch(setUIDataByUserAgent(ua, isWebView));
      ctx.store.dispatch(setLocale(ctx.req.i18n.language));

      try {
        await ctx.store.dispatch(getGlobalConfig());
      } catch (error) {
        // eslint-disable-next-line
        console.warn('Global config fetching failed');
      }

      if (isWebView && !cookies.commun_web_view) {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        ctx.res.setHeader(
          'Set-Cookie',
          `commun_web_view=1; path=/; expires=${expires.toGMTString()}`
        );
      }

      userId = cookies.commun_user_id;
      let refId = cookies.commun_invite_id;

      // authorized user
      if (userId) {
        ctx.store.dispatch(setServerAccountName(userId));
      } else {
        // has referral user
        if (query.invite) {
          refId = query.invite;

          const date = new Date();
          date.setMonth(date.getMonth() + 1);

          // set refId to cookie
          ctx.res.setHeader(
            'Set-Cookie',
            `commun_invite_id=${refId}; path=/; expires=${date.toGMTString()}`
          );
        }

        // has refId from cookie
        if (refId) {
          ctx.store.dispatch(setServerRefId(refId));
        }

        isAllFeatures = Boolean(cookies[COOKIE_ALL_FEATURES]);
      }

      ctx.clientId = Number.parseInt(cookies.commun_client_id, 10) || null;

      ctx.store.dispatch(setAbTestingClientId(ctx.clientId));
    }

    const props = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    if (tracing) {
      tracing.startRender();
    }

    return {
      userId,
      isAllFeatures,
      pageProps: {
        ...props,
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

  async componentDidMount() {
    const { store, userId, router } = this.props;

    store.dispatch(
      updateUIMode({
        isHydration: false,
        isRetina: window.devicePixelRatio > 1.3,
      })
    );

    // authorized and has not refId in url
    if (userId && !router.query.invite) {
      replaceRouteAndAddQuery({
        invite: userId,
      });
    }

    const {
      commun_oauth_identity: oauthIdentity,
      commun_oauth_state: oauthState,
      commun_oauth_provider: oauthProvider,
    } = cookie.parse(document.cookie);
    const oauthOpenedFrom = localStorage.getItem(REGISTRATION_OPENED_FROM_KEY);

    if (oauthIdentity || oauthState) {
      if (ANALYTIC_PROVIDERS_DATA[oauthProvider]) {
        trackEvent(`${ANALYTIC_PROVIDERS_DATA[oauthProvider]} auth`);
      }

      const screenId = oauthIdentity ? CREATE_USERNAME_SCREEN_ID : stepToScreenId(oauthState);

      if (oauthIdentity) {
        setRegistrationData({ identity: oauthIdentity });
      }

      if (screenId === CREATE_USERNAME_SCREEN_ID) {
        setRegistrationData({ screenId });
      }

      const unauthState = getData(UNAUTH_STATE_KEY) || {};
      store.dispatch(unauthRestoreState(unauthState));
      store.dispatch(setScreenId(screenId));

      let user = null;

      if (oauthOpenedFrom) {
        const { communities } = unauthState;
        user = await store.dispatch(openSignUpModal({ openedFrom: oauthOpenedFrom }));

        if (communities.length && user) {
          const communityIds = communities.slice(0, COMMUNITIES_AIRDROP_COUNT);
          await store.dispatch(onboardingSubscribeAfterOauth(communityIds, user.userId));
        }

        localStorage.removeItem(REGISTRATION_OPENED_FROM_KEY);
      } else {
        store.dispatch(openSignUpModal());
      }

      localStorage.removeItem(UNAUTH_STATE_KEY);
    }
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps, store, userId, isAllFeatures } = this.props;

    if (!process.browser && env.WEB_DISABLE_SSR) {
      return (
        <>
          <Head>
            <title key="title">Commun</title>
          </Head>
          <div>Loading...</div>
        </>
      );
    }

    return (
      <>
        <Head>
          <title key="title">Commun</title>
          <meta name="description" key="description" content={OG_DESCRIPTION} />
          <meta property="og:type" key="og:type" content="website" />
          <meta property="og:title" key="og:title" content={OG_NAME} />
          <meta property="og:description" key="og:description" content={OG_DESCRIPTION} />
          <meta property="og:image" key="og:image" content={OG_IMAGE} />
          <meta property="og:site_name" key="og:site_name" content={OG_NAME} />
          <meta name="twitter:card" key="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" key="twitter:site" content={`@${TWITTER_NAME}`} />
        </Head>
        <Providers store={store} isAllFeatures={isAllFeatures}>
          <Layout type={Component.layout} pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>

          <ScrollbarStyler />
          <TapBar />
          <UIStoreSync />
          <ArticleEditorSlot />
          <ModalManager passStore={store} />
          <ToastsManagerStyled anchor="right" renderToast={props => <NotifyToast {...props} />} />
          <FeaturesToggle />
          {/* TODO: might be used in future */}
          {/* <OnboardingCheck /> */}
          <CookiesPermission />
          <BuildInfo />
          <ScriptsInit userId={userId} />
        </Providers>
      </>
    );
  }
}
