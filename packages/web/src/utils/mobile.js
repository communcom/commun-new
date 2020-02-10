/* eslint-disable import/prefer-default-export */
import { ANDROID_STORE_APP_URL, IOS_STORE_APP_URL } from 'shared/constants';

export function getMobileAppUrl() {
  const ua = window.navigator.userAgent;
  const isIos = /\b(?:iphone|ipod|ipad|ios)\b/.test(ua.toLowerCase());
  return isIos ? IOS_STORE_APP_URL : ANDROID_STORE_APP_URL;
}
