import { connect } from 'react-redux';

import { statusSelector, createFastEqualSelector } from 'store/selectors/common';
import { transferHistorySelector } from 'store/selectors/wallet';
import { getTransfersHistory } from 'store/actions/gate';
import WalletHistory from './WalletHistory';

export default connect(
  createFastEqualSelector(
    [transferHistorySelector, statusSelector('wallet')],
    (transfers, { isTransfersHistoryLoading }) => ({
      isTransfersEmpty: transfers.length === 0,
      isTransfersHistoryLoading,
    })
  ),
  {
    getTransfersHistory,
  }
)(WalletHistory);
