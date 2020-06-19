import { connect } from 'react-redux';

import { TRANSACTION_HISTORY_TYPE } from 'shared/constants';
import { getTransfersHistory } from 'store/actions/gate';
import { openModalHistoryFilter } from 'store/actions/modals';
import { statusSelector, uiSelector } from 'store/selectors/common';
import { pointHistorySelector, transferHistorySelector } from 'store/selectors/wallet';

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
