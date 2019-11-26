import {
  RESET_TRANSFERS_HISTORY_STATUS,
  RESET_BALANCE_STATUS,
  SHOW_POINT_INFO,
} from 'store/constants';

// eslint-disable-next-line
export const resetTransfersHistoryStatus = () => ({
  type: RESET_TRANSFERS_HISTORY_STATUS,
});

export const resetBalanceStatus = () => ({
  type: RESET_BALANCE_STATUS,
});

export const showPointInfo = symbol => ({
  type: SHOW_POINT_INFO,
  payload: {
    symbol,
  },
});
