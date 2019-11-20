import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { openModal } from 'redux-modals-manager';

import { statusSelector, modeSelector } from 'store/selectors/common';
import { getBalance } from 'store/actions/gate';

import { userPointsSelector } from 'store/selectors/wallet';

import MyPoints from './MyPoints';

export default connect(
  createSelector(
    [userPointsSelector, statusSelector('wallet'), modeSelector],
    (points, { isLoading }, mode) => ({
      isLoading,
      points,
      screenType: mode.screenType,
    })
  ),
  {
    openModal,
    getBalance,
  }
)(MyPoints);
