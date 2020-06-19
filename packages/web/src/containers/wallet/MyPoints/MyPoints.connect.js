import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { getBalance, getUserSubscriptions } from 'store/actions/gate';
import { updateSettings } from 'store/actions/gate/settings';
import { showPointInfo } from 'store/actions/local';
import {
  openModalSelectPoint,
  openModalSelectRecipient,
  openModalSendPoint,
} from 'store/actions/modals';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import {
  dataSelector,
  entityArraySelector,
  modeSelector,
  statusSelector,
} from 'store/selectors/common';
import { isHideEmptyBalancesSelector } from 'store/selectors/settings';
import { userCommunPointSelector, userPointsSelector } from 'store/selectors/wallet';

import MyPoints from './MyPoints';

export default connect(
  createSelector(
    [
      userPointsSelector,
      userCommunPointSelector,
      statusSelector('wallet'),
      state => {
        const { order } = dataSelector('subscriptions')(state);
        return entityArraySelector('users', order)(state);
      },
      currentUnsafeUserIdSelector,
      modeSelector,
      state => state.ui.wallet.pointInfoSymbol,
      isHideEmptyBalancesSelector,
    ],
    (
      points,
      communPoint,
      { isLoading },
      friends,
      loggedUserId,
      mode,
      selectedPoint,
      isHideEmptyBalances
    ) => ({
      isLoading,
      points,
      communPoint,
      friends,
      loggedUserId,
      isMobile: mode.screenType === 'mobile',
      selectedPoint,
      isHideEmptyBalances,
    })
  ),
  {
    getBalance,
    openModalSendPoint,
    openModalSelectPoint,
    openModalSelectRecipient,
    showPointInfo,
    getUserSubscriptions,
    updateSettings,
  }
)(MyPoints);
