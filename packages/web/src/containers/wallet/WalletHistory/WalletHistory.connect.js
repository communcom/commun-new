import { connect } from 'react-redux';

import { UIModeSelector } from 'store/selectors/ui';
import { currentUserIdSelector } from 'store/selectors/auth';
import { dataSelector, statusSelector, createDeepEqualSelector } from 'store/selectors/common';
import { getTransfersHistory } from 'store/actions/gate';
import { TRANSACTIONS_TYPE } from 'shared/constants';

import WalletHistory from './WalletHistory';

export default connect(
  createDeepEqualSelector(
    [
      currentUserIdSelector,
      dataSelector(['wallet', 'transfers']),
      UIModeSelector('screenType'),
      statusSelector('wallet'),
    ],
    (loggedUserId, transfers, screenType, { isLoading, isTransfersUpdated }) => {
      // TODO refactor after wallet changes
      const transactions = transfers.all.map(
        ({ sender, receiver, quantity, sym, trxId, timestamp }) => ({
          id: trxId,
          type: sender.userId === loggedUserId ? TRANSACTIONS_TYPE.SEND : TRANSACTIONS_TYPE.RECEIVE,
          from: sender.userId,
          to: receiver.userId,
          value: quantity,
          currency: sym,
          timestamp,
        })
      );
      return {
        loggedUserId,
        transactions,
        screenType,
        sequenceKey: transfers.sequenceKey,
        isLoading,
        isTransfersUpdated,
      };
    }
  ),
  {
    getTransfersHistory,
  }
)(WalletHistory);
