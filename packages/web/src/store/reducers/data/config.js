import { FETCH_GLOBAL_CONFIG_SUCCESS } from 'store/constants/actionTypes';

const initialState = {
  isMaintenance: false,
};

export default function reducerDataConfig(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_GLOBAL_CONFIG_SUCCESS:
      return {
        ...state,
        isMaintenance: payload.isMaintenance || false,
      };

    default:
      return state;
  }
}
