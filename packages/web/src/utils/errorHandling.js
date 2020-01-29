import Router from 'next/router';
import { displayError } from 'utils/toastsMessages';

if (process.browser) {
  const LAST_RELOAD_KEY = 'system.lastReloadTry';
  const RELOAD_TIME_LIMIT = 60 * 1000;

  let lastRouteUrl = null;

  Router.events.on('routeChangeStart', url => {
    lastRouteUrl = url;
  });

  window.addEventListener('unhandledrejection', e => {
    const { reason } = e;

    if (
      lastRouteUrl &&
      reason &&
      reason.code === 'PAGE_LOAD_ERROR' &&
      reason.message.startsWith('Error loading script')
    ) {
      const dateString = window.localStorage.getItem(LAST_RELOAD_KEY);

      // If we already have tried to reload page in RELOAD_TIME_LIMIT then just show error
      if (dateString && new Date(dateString) > Date.now() - RELOAD_TIME_LIMIT) {
        displayError(reason.message);
        return;
      }

      window.localStorage.setItem(LAST_RELOAD_KEY, new Date().toJSON());
      window.location.assign(lastRouteUrl);
    }
  });
}

// eslint-disable-next-line import/prefer-default-export
export function processErrorWhileGetInitialProps(err, res, namespacesRequired) {
  if (err.code === 404) {
    if (res) {
      res.statusCode = 404;
    }

    return {
      error: {
        code: err.code,
        message: err.message,
      },
      dontCallTabsInitialProps: true,
      namespacesRequired,
    };
  }

  // eslint-disable-next-line no-console
  console.error('Data loading failed:', err);

  throw err;
}
