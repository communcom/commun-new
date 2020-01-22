/* eslint-disable import/prefer-default-export */

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const gevent = (action, params = {}) => {
  if (window.gtag) {
    window.gtag('event', action, params);
  }
};
