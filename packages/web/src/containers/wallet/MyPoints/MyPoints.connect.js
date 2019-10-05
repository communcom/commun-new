import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { statusSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';
import { getBalance } from 'store/actions/gate';

import { userPointsSelector } from 'store/selectors/wallet';

import MyPoints from './MyPoints';

export default connect(
  createSelector(
    [currentUserIdSelector, userPointsSelector, statusSelector(['wallet', 'isBalanceUpdated'])],
    (loggedUserId, userPoints, isBalanceUpdated) => ({
      isBalanceUpdated,
      points: userPoints,
      loggedUserId,
    })
  ),
  {
    openModal,
    getBalance,
  }
)(MyPoints);
