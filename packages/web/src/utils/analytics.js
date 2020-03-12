// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const gevent = (action, params) => {
  if (window.gtag) {
    window.gtag('event', action, params);
  }
};

// https://help.amplitude.com/hc/en-us/articles/115001361248-JavaScript-SDK-Installation
export const aevent = (action, params) => {
  if (window.amplitude) {
    window.amplitude.getInstance().logEvent(action, params);
  }
};

export const trackEvent = (...args) => {
  gevent(args[0]);
  aevent(...args);
};

export const trackUserId = userId => {
  if (window.gtag) {
    window.gtag('set', { user_id: userId });
  }

  if (window.amplitude) {
    window.amplitude.getInstance().setUserId(userId);
  }
};
