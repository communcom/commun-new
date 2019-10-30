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
    (loggedUserId, transfers, screenType, { isLoading, isEnd, isTransfersUpdated }) => {
      const transactions = transfers.map(item => {
        // TODO remove after wallet changes
        const data = {};
        if (item.receiver.userId === 'comn.point') {
          data.type = 'convert';
          data.receivedAmount = '100.000';
          data.symbol = 'POINT';
        } else {
          data.type = 'transfer';
          data.direction = item.sender.userId === loggedUserId ? 'send' : 'receive';
        }
        return {
          ...item,
          data,
        };
      });
      return {
        loggedUserId,
        transactions,
        screenType,
        isLoading,
        isEnd,
        isTransfersUpdated,
      };
    }
  ),
  {
    getTransfersHistory,
  }
)(WalletHistory);
