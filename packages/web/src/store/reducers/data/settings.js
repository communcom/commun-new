import { mergeDeepRight } from 'ramda';
import u from 'updeep';

import {
  FETCH_SETTINGS_SUCCESS,
  SET_SETTINGS_SUCCESS,
  GET_AIRDROP_SUCCESS,
  AUTH_LOGOUT,
  SET_LOCALE,
} from 'store/constants';

const initialState = {
  user: {
    basic: {
      locale: 'en',
      nsfw: 'warn',
      isShowCommentsInFeed: false,
    },
  },
};

export default function(state = initialState, { type, payload, meta }) {
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
