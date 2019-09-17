import {
  SET_SERVER_ACCOUNT_NAME,
  GATE_AUTHORIZE_SUCCESS,
  GATE_AUTHORIZE_ERROR,
  AUTH_LOGOUT,
} from 'store/constants/actionTypes';

const initialState = {
  userId: null,
  unsafe: false,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SET_SERVER_ACCOUNT_NAME:
      return {
        ...initialState,
        userId: payload.userId,
        unsafe: true,
      };

    case AUTH_LOGOUT:
    case GATE_AUTHORIZE_SUCCESS:
    case GATE_AUTHORIZE_ERROR:
      return initialState;

    default:
      return state;
  }
}
