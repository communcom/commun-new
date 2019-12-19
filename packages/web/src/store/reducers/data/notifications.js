import {
  AUTH_LOGOUT,
  MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS,
  FETCH_NOTIFICATIONS_STATUS_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  hasUnseen: false,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_NOTIFICATIONS_STATUS_SUCCESS:
      return {
        ...state,
        hasUnseen: payload.hasUnseen,
      };

    case MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS:
      return {
        ...state,
        hasUnseen: false,
      };

    case AUTH_LOGOUT:
      return initialState;

    default:
      return state;
  }
}
