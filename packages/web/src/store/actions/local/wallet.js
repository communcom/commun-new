import { openModalPointInfo } from 'store/actions/modals';
import {
  RESET_BALANCE_STATUS,
  RESET_TRANSFERS_HISTORY_STATUS,
  SHOW_POINT_INFO,
} from 'store/constants';
import { modeSelector } from 'store/selectors/common';

export const resetTransfersHistoryStatus = () => ({
  type: RESET_TRANSFERS_HISTORY_STATUS,
});

export const resetBalanceStatus = () => ({
  type: RESET_BALANCE_STATUS,
});

export const showPointInfo = symbol => (dispatch, getState) => {
  dispatch({
    type: SHOW_POINT_INFO,
    payload: {
      symbol,
    },
  });

  const mode = modeSelector(getState());

  if (mode.screenType !== 'desktop') {
    dispatch(openModalPointInfo());
  }
};
