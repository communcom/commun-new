import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { dataSelector, createDeepEqualSelector, statusSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { getBalance } from 'store/actions/gate';
import { calculateAmount } from 'utils/wallet';

import MyPoints from './MyPoints';

export default connect(
  createDeepEqualSelector(
    [
      state => dataSelector('wallet')(state).balances,
      currentUserIdSelector,
      statusSelector('wallet'),
    ],
    (balances, loggedUserId, { isBalanceUpdated }) => {
      let points;

      if (balances) {
        points = balances.map(balance => ({
          name: balance.sym,
          // TODO: replace by real community id
          communityId: 'gls',
          count: Number(calculateAmount({ amount: balance.amount, decs: balance.decs })),
        }));
      }

      return {
        isBalanceUpdated,
        points,
        loggedUserId,
      };
    }
  ),
  {
    openModal,
    getBalance,
  }
)(MyPoints);
