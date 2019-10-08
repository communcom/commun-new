import { FETCH_COMMUNITIES_SUCCESS, AUTH_LOGOUT_SUCCESS } from 'store/constants/actionTypes';

const initialState = {
  items: null,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_COMMUNITIES_SUCCESS:
      if (meta.type === 'user') {
        return {
          items: payload.result.items,
        };
      }
      break;

    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
  }

  return state;
}
