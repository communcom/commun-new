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
import dayjs from 'dayjs';
import ToastsManager from 'toasts-manager';
import NProgress from 'nprogress';

import initStore from 'store/store';
import { setScreenTypeByUserAgent, updateUIMode } from 'store/actions/ui';
import { setServerAccountName } from 'store/actions/gate/auth';
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
    if (ctx.req) {
      const action = setScreenTypeByUserAgent(ctx.req.headers['user-agent']);

      if (action) {
        ctx.store.dispatch(action);
      }

      const userId = ctx.req.cookies['commun.userId'];

      if (userId) {
        ctx.store.dispatch(setServerAccountName(userId));
      }
    }

    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
      },
    };
  }

  state = {
    isMenuOpen: false,
  };

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
    const { store } = this.props;

    store.dispatch(
      updateUIMode({
        isSSR: false,
      })
    );
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  changeMenuStateHandler = () => {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen,
    }));
  };

  render() {
    const { Component, pageProps, store } = this.props;
    const { isMenuOpen } = this.state;

    const adapterArgs = {
      clientSideId: '',
      user: { key: '' },
    };

    if (!process.browser && process.env.DISABLE_SSR) {
      return <div>Loading...</div>;
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
                <Header
                  communityId={pageProps.communityId}
                  changeMenuStateHandler={this.changeMenuStateHandler}
                />
                <ScrollFixStyled>
                  <MainContainerStyled>
                    <SideBar
                      isOpen={isMenuOpen}
                      changeMenuStateHandler={this.changeMenuStateHandler}
                    />
                    <Component {...pageProps} />
                  </MainContainerStyled>
                </ScrollFixStyled>
                <UIStoreSync />
                <ModalManager passStore={store} />
                <ToastsManager renderToast={props => <NotifyToast {...props} />} />
                <FeaturesToggle />
              </>
            </ConfigureFlopFlip>
          </ThemeProvider>
        </Provider>
      </>
    );
  }
}
