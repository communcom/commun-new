import Router from 'next/router';

if (process.browser) {
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
