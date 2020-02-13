import parse from 'url-parse';

import { Router } from 'shared/routes';
import { toQueryString } from 'utils/userAgent';

// eslint-disable-next-line import/prefer-default-export
export function replaceRouteAndAddQuery(query) {
  const currentUrl = parse(Router.asPath, true);
  const updatedQuery = { ...currentUrl.query, ...query };
  const updatedUrl = `${currentUrl.pathname}?${toQueryString(updatedQuery)}${currentUrl.hash}`;

  if (Router.asPath !== updatedUrl) {
    Router.replaceRoute(updatedUrl, {
      shallow: true,
    });
  }
}

let callbacks = [];

export function subscribePopState(callback) {
  callbacks.push(callback);
}

export function unsubscribePopState(callback) {
  callbacks = callbacks.filter(c => c !== callback);
}

if (process.browser) {
  Router.ready(() => {
    Router.beforePopState(params => {
      for (const callback of callbacks) {
        if (!callback(params)) {
          return false;
        }
      }

      return true;
    });
  });
}
