import { SET_CLIENT_ID } from 'store/constants';

const INITIAL_STATE = {
  clientId: null,
};

export default function reducerUiAbTesting(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SET_CLIENT_ID:
      return {
        clientId: payload.clientId,
      };
    default:
      return state;
  }
}
