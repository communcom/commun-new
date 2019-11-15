import { connect } from 'react-redux';

import { UIModeSelector } from 'store/selectors/ui';
import { currentUserIdSelector } from 'store/selectors/auth';
import { dataSelector, statusSelector, createFastEqualSelector } from 'store/selectors/common';
import { getTransfersHistory } from 'store/actions/gate';

import WalletHistory from './WalletHistory';

export default connect(
  createFastEqualSelector(
    [
      currentUserIdSelector,
      dataSelector(['wallet', 'history']),
      UIModeSelector('screenType'),
      statusSelector('wallet'),
    ],
    (loggedUserId, transfers, screenType, { isLoading, isEnd }) => ({
      loggedUserId,
      transfers,
      screenType,
      isLoading,
      isEnd,
    })
  ),
  {
    getTransfersHistory,
  }
)(WalletHistory);
