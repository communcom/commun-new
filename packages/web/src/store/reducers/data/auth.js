import {
  AUTH_LOGIN,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  SET_SERVER_ACCOUNT_NAME,
  SET_SERVER_REFERRAL_ID,
} from 'store/constants/actionTypes';

const initialState = {
  isAutoLogging: false,
  currentUser: null,
  refId: null,
  error: null,
};

export default function reducerDataAuth(state = initialState, { type, payload, meta, error }) {
  switch (type) {
    case AUTH_LOGIN: {
      if (meta && meta.isAutoLogging) {
        return {
          ...state,
          isAutoLogging: true,
        };
      }
      return state;
    }
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        isAutoLogging: false,
        currentUser: {
          userId: payload.userId,
          username: payload.username,
          permission: payload.permission,
        },
      };
    case AUTH_LOGIN_ERROR:
      return {
        ...state,
        isAutoLogging: false,
        error,
      };

    case AUTH_LOGOUT_SUCCESS:
      return {
        ...state,
        isAutoLogging: false,
        currentUser: null,
      };

    case SET_SERVER_ACCOUNT_NAME:
      return {
        ...state,
        isAutoLogging: true,
      };

    case SET_SERVER_REFERRAL_ID:
      return {
        ...state,
        refId: payload.refId,
      };
    default:
      return state;
  }
}
