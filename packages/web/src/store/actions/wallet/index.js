import { RESET_TRANSFERS_HISTORY_STATUS, RESET_BALANCE_STATUS } from 'store/constants';

// eslint-disable-next-line
export const resetTransfersHistoryStatus = () => ({
  type: RESET_TRANSFERS_HISTORY_STATUS,
});

export const resetBalanceStatus = () => ({
  type: RESET_BALANCE_STATUS,
});
