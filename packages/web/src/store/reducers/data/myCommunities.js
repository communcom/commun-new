import { FETCH_COMMUNITIES_SUCCESS, AUTH_LOGOUT_SUCCESS } from 'store/constants/actionTypes';

const initialState = {
  items: null,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_COMMUNITIES_SUCCESS:
      // TODO: Временно запрашиваются все сообщества, а не только те на которые подписан пользователь
      // if (meta.type === 'user') {
      return {
        items: payload.result.items,
      };

    case AUTH_LOGOUT_SUCCESS:
      return initialState;

    default:
  }

  return state;
}
