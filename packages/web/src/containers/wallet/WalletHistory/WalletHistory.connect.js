/* eslint-disable camelcase */
import { connect } from 'react-redux';

import { UIModeSelector } from 'store/selectors/ui';
import { currentUserIdSelector } from 'store/selectors/auth';
import { dataSelector, statusSelector, createDeepEqualSelector } from 'store/selectors/common';
import { getTransfersHistory } from 'store/actions/gate';
import { calculateAmount } from 'utils/wallet';
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
    (loggedUserId, transfers, screenType, { isTransfersUpdated }) => {
      let mergedTransfers = [];

      if (transfers && (transfers.sent || transfers.received)) {
        const sent = transfers.sent
          ? transfers.sent.map(({ sender, receiver, quantity, trx_id, timestamp }, index) => ({
              // TODO: replace with real id
              id: trx_id || `${sender}to${receiver}#${index}at${new Date().toJSON()}`,
              type: TRANSACTIONS_TYPE.SEND,
              to: receiver,
              value: {
                value: calculateAmount({
                  amount: quantity.amount,
                  decs: quantity.decs,
                }),
                currency: quantity.sym,
              },
              // TODO: replace with real timestamp
              timestamp: timestamp || new Date().toJSON(),
            }))
          : [];

        const received = transfers.received
          ? transfers.received.map(({ sender, receiver, quantity, trx_id, timestamp }, index) => ({
              // TODO: replace with real id
              id: trx_id || `${receiver}from${sender}#${index}at${new Date().toJSON()}`,
              type: TRANSACTIONS_TYPE.RECEIVE,
              from: sender,
              value: {
                value: calculateAmount({
                  amount: quantity.amount,
                  decs: quantity.decs,
                }),
                currency: quantity.sym,
              },
              // TODO: replace with real timestamp
              timestamp: timestamp || new Date().toJSON(),
            }))
          : [];

        mergedTransfers = [...sent, ...received].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }

      return {
        loggedUserId,
        screenType,
        isTransfersUpdated,
        transactions: mergedTransfers,
      };
    }
  ),
  {
    getTransfersHistory,
  }
)(WalletHistory);

// TODO: convert data format, should be replaced with real data in future
//  {
//   id: 231,
//   type: TRANSACTIONS_TYPE.CONVERT,
//   from: {
//     value: 209,
//     currency: 'Overwatch',
//   },
//   to: {
//     value: 120,
//     currency: 'COMMUN',
//   },
//   timestamp: new Date(2019, 1, 4, 11).toJSON(),
// },
