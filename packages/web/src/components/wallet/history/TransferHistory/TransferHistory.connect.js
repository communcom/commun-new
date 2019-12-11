import { connect } from 'react-redux';

import { getTransfersHistory } from 'store/actions/gate';
import { openModalHistoryFilter } from 'store/actions/modals';

import { uiSelector, statusSelector } from 'store/selectors/common';
import { transferHistorySelector, pointHistorySelector } from 'store/selectors/wallet';

import { TRANSACTION_HISTORY_TYPE } from 'shared/constants';

import TransferHistory from './TransferHistory';

export default connect(
  (state, props) => {
    const isPointHistory = props.historyType === TRANSACTION_HISTORY_TYPE.POINT;
    const transfers = isPointHistory ? pointHistorySelector(state) : transferHistorySelector(state);

    const { isTransfersHistoryLoading, isPointHistoryLoading, isEnd } = statusSelector('wallet')(
      state
    );
    const pointSymbol = uiSelector(['wallet', 'pointInfoSymbol'])(state);

    return {
      isPointHistory,
      transfers,
      pointSymbol,
      isTransfersHistoryLoading,
      isPointHistoryLoading,
      isEnd,
    };
  },
  {
    getTransfersHistory,
    openModalHistoryFilter,
  }
)(TransferHistory);
