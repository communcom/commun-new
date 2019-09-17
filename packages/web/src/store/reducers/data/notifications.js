import {
  FETCH_NOTIFICATIONS_SUCCESS,
  AUTH_LOGOUT,
  MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS,
  MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
  FETCH_NOTIFICATIONS_COUNT_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  freshCount: 0,
  unreadCount: 0,
  totalCount: 0,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_NOTIFICATIONS_COUNT_SUCCESS:
      return {
        ...state,
        freshCount: payload.fresh,
      };

    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        freshCount: payload.result.fresh,
        unreadCount: payload.result.unread,
        totalCount: payload.result.total,
      };

    case AUTH_LOGOUT:
      return initialState;

    case MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS:
      return {
        ...state,
        freshCount: 0,
      };

    case MARK_ALL_NOTIFICATIONS_READ_SUCCESS:
      return {
        ...state,
        unreadCount: 0,
      };

    default:
      return state;
  }
}
