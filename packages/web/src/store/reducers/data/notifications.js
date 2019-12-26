import {
  AUTH_LOGOUT,
  FETCH_NOTIFICATIONS_STATUS_SUCCESS,
  MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  unseenCount: 0,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_NOTIFICATIONS_STATUS_SUCCESS:
      return {
        ...state,
        unseenCount: payload.unseenCount,
      };

    case MARK_ALL_NOTIFICATIONS_READ_SUCCESS:
      return {
        ...state,
        unseenCount: 0,
      };

    case AUTH_LOGOUT:
      return initialState;

    default:
      return state;
  }
}
