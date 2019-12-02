import { UPDATE_UI_MODE } from 'store/constants/actionTypes';

export const updateUIMode = payload => ({
  type: UPDATE_UI_MODE,
  payload,
});

// Set store's variables in 'ui.mode' by analyzing useragent header.
// (Uses only for SSR)
export function setUIDataByUserAgent(useragent) {
  const ua = useragent.toLowerCase();

  const isRetina = /iphone|ipod|ipad|ios|android/.test(ua);

  if (/ipad/.test(ua)) {
    return updateUIMode({ screenType: 'tablet', isRetina });
  }

  if (!/iphone|ios|android/.test(ua)) {
    return updateUIMode({ screenType: 'desktop', isOneColumnMode: false, isRetina });
  }

  return updateUIMode({ isRetina });
}
