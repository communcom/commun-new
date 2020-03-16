import { mergeDeepRight } from 'ramda';
import u from 'updeep';

import { FETCH_SETTINGS_SUCCESS, SET_SETTINGS_SUCCESS, GET_AIRDROP_SUCCESS } from 'store/constants';

const initialState = {
  basic: {
    locale: '',
    nsfw: 'warn',
  },
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_SETTINGS_SUCCESS:
      return mergeDeepRight(state, payload);
    case SET_SETTINGS_SUCCESS:
      return mergeDeepRight(state, meta.options);
    case GET_AIRDROP_SUCCESS:
      return u.updateIn(
        ['system', 'airdrop', 'claimed'],
        claimed => (claimed || []).concat(meta.communityId),
        state
      );
    default:
      return state;
  }
}
