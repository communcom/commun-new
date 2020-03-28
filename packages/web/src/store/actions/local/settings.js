/* eslint-disable import/prefer-default-export */
import { SET_LOCALE } from 'store/constants';

export const setLocale = locale => ({
  type: SET_LOCALE,
  payload: locale,
});
