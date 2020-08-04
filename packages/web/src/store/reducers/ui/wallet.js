import { COMMUN_SYMBOL } from 'shared/constants';
import { SHOW_POINT_INFO } from 'store/constants/actionTypes';

const initialState = {
  pointInfoSymbol: COMMUN_SYMBOL,
};

export default function reducerUiWallet(state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_POINT_INFO:
      return {
        ...state,
        pointInfoSymbol: payload.symbol,
      };
    default:
      return state;
  }
}
