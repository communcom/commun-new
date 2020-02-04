import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  statusSelector,
  modeSelector,
  dataSelector,
  entityArraySelector,
} from 'store/selectors/common';
import {
  openModalSendPoint,
  openModalSelectPoint,
  openModalSelectRecipient,
} from 'store/actions/modals';
import { showPointInfo } from 'store/actions/local';
import { getBalance, getUserSubscriptions } from 'store/actions/gate';

import { userPoints2Selector, userCommunPointSelector } from 'store/selectors/wallet';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import MyPoints from './MyPoints';

export default connect(
  createSelector(
    [
      userPoints2Selector,
      userCommunPointSelector,
      statusSelector('wallet'),
      state => {
        const { order } = dataSelector('subscriptions')(state);
        return entityArraySelector('users', order)(state);
      },
      currentUnsafeUserIdSelector,
      modeSelector,
      state => state.ui.wallet.pointInfoSymbol,
    ],
    (points, communPoint, { isLoading }, friends, loggedUserId, mode, selectedPoint) => ({
      isLoading,
      points,
      communPoint,
      friends,
      loggedUserId,
      isMobile: mode.screenType === 'mobile',
      selectedPoint,
    })
  ),
  {
    getBalance,
    openModalSendPoint,
    openModalSelectPoint,
    openModalSelectRecipient,
    showPointInfo,
    getUserSubscriptions,
  }
)(MyPoints);
