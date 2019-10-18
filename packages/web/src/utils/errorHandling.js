/* eslint-disable import/prefer-default-export */

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
