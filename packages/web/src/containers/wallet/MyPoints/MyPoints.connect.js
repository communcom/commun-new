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
  openModalPointInfo,
} from 'store/actions/modals';
import { showPointInfo } from 'store/actions/wallet';
import { getBalance, getUserSubscriptions } from 'store/actions/gate';

import { userPoints2Selector } from 'store/selectors/wallet';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import MyPoints from './MyPoints';

export default connect(
  createSelector(
    [
      userPoints2Selector,
      statusSelector('wallet'),
      state => {
        const { order } = dataSelector('subscriptions')(state);
        return entityArraySelector('users', order)(state);
      },
      currentUnsafeUserIdSelector,
      modeSelector,
    ],
    (points, { isLoading }, friends, loggedUserId, mode) => ({
      isLoading,
      points,
      friends,
      loggedUserId,
      isMobile: mode.screenType === 'mobile',
      isDesktop: mode.screenType === 'desktop',
    })
  ),
  {
    getBalance,
    openModalSendPoint,
    openModalSelectPoint,
    openModalSelectRecipient,
    openModalPointInfo,
    showPointInfo,
    getUserSubscriptions,
  }
)(MyPoints);
