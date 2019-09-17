import {
  TRANSFER_TOKEN,
  TRANSFER_TOKEN_SUCCESS,
  TRANSFER_TOKEN_ERROR,
  FETCH_USER_BALANCE,
  FETCH_USER_BALANCE_SUCCESS,
  FETCH_USER_BALANCE_ERROR,
  FETCH_TRANSFERS_HISTORY,
  FETCH_TRANSFERS_HISTORY_SUCCESS,
  FETCH_TRANSFERS_HISTORY_ERROR,
  RESET_TRANSFERS_HISTORY_STATUS,
  RESET_BALANCE_STATUS,
} from 'store/constants/actionTypes';

const initialState = {
  isLoading: false,
  isTransferLoading: false,
  isConvertLoading: false,
  isTransfersUpdated: false,
  isBalanceUpdated: false,
};

export default function(state = initialState, { type }) {
  switch (type) {
    case FETCH_USER_BALANCE:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_USER_BALANCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isBalanceUpdated: true,
      };

    case FETCH_USER_BALANCE_ERROR:
      return {
        ...state,
        isLoading: false,
        isBalanceUpdated: true,
      };

    case FETCH_TRANSFERS_HISTORY:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_TRANSFERS_HISTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isTransfersUpdated: true,
      };

    case FETCH_TRANSFERS_HISTORY_ERROR:
      return {
        ...state,
        isLoading: false,
        isTransfersUpdated: true,
      };

    case RESET_TRANSFERS_HISTORY_STATUS:
      return {
        ...state,
        isTransfersUpdated: false,
      };

    case RESET_BALANCE_STATUS:
      return {
        ...state,
        isBalanceUpdated: false,
      };

    case TRANSFER_TOKEN:
      return {
        ...state,
        isTransferLoading: true,
      };

    case TRANSFER_TOKEN_SUCCESS:
      return {
        ...state,
        isTransferLoading: false,
      };

    case TRANSFER_TOKEN_ERROR:
      return {
        ...state,
        isTransferLoading: false,
      };

    default:
      return state;
  }
}
