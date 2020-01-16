import { mergeDeepRight } from 'ramda';
import { FETCH_SETTINGS_SUCCESS, SET_SETTINGS_SUCCESS } from 'store/constants';

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
      return mergeDeepRight(state, meta);
    default:
      return state;
  }
}
