import { mergeDeepRight } from 'ramda';
import u from 'updeep';

import {
  AUTH_LOGOUT,
  FETCH_SETTINGS_SUCCESS,
  GET_AIRDROP_SUCCESS,
  SET_LOCALE,
  SET_SETTINGS_SUCCESS,
} from 'store/constants';

const initialState = {
  user: {
    basic: {
      // Look defaults in selectors
      // locale: 'en',
      // currency: 'USD',
      // nsfw: 'warn',
      // theme: 'light',
      // isShowCommentsInFeed: true,
      // isHideEmptyBalances: false,
    },
  },
};

export default function (state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_SETTINGS_SUCCESS:
      return mergeDeepRight(state, payload);

    case SET_SETTINGS_SUCCESS:
      return mergeDeepRight(state, { user: meta.options });

    case SET_LOCALE:
      return u.updateIn(['user', 'basic', 'locale'], payload, state);

    case GET_AIRDROP_SUCCESS:
      return u.updateIn(
        ['system', 'airdrop', 'claimed'],
        claimed => (claimed || []).concat(meta.communityId),
        state
      );

    case AUTH_LOGOUT:
      return initialState;

    default:
      return state;
  }
}
