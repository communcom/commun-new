import { SHOW_POINT_INFO } from 'store/constants/actionTypes';

import { COMMUN_SYMBOL } from 'shared/constants';

const initialState = {
  pointInfoSymbol: COMMUN_SYMBOL,
};

export default function(state = initialState, { type, payload }) {
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
