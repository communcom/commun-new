import { UPDATE_UI_MODE } from 'store/constants/actionTypes';

export const updateUIMode = payload => ({
  type: UPDATE_UI_MODE,
  payload,
});

// Set store's variables in 'ui.mode' by analyzing useragent header.
// (Uses only for SSR)
export function setUIDataByUserAgent(useragent, isWebView) {
  const ua = (useragent || '').toLowerCase();

  const options = {
    isRetina: /iphone|ipod|ipad|ios|android/.test(ua),
    isWebView,
  };

  if (/ipad/.test(ua)) {
    return updateUIMode({ screenType: 'tablet', ...options });
  }

  if (!/iphone|ios|android/.test(ua) && !isWebView) {
    return updateUIMode({ screenType: 'desktop', isOneColumnMode: false, ...options });
  }

  return updateUIMode(options);
}
