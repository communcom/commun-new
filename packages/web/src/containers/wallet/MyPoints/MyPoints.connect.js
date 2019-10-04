import { connect } from 'react-redux';
import { openModal } from 'redux-modals-manager';

import { dataSelector, createDeepEqualSelector, statusSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { getBalance } from 'store/actions/gate';

import MyPoints from './MyPoints';

// TODO refactor
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
          name: balance.symbol,
          communityId: balance.symbol,
          count: balance.balance,
          logo: balance.logo || '',
          decs: balance.decs,
          issuer: balance.issuer,
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
