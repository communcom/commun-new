import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { statusSelector, modeSelector } from 'store/selectors/common';
import {
  openModalConvertPoint,
  openModalSendPoint,
  openModalSelectPoint,
  openModalSelectRecipient,
} from 'store/actions/modals';
import { getBalance } from 'store/actions/gate';

import { userPoints2Selector } from 'store/selectors/wallet';

import MyPoints from './MyPoints';

export default connect(
  createSelector(
    [userPoints2Selector, statusSelector('wallet'), modeSelector],
    (points, { isLoading }, mode) => ({
      isLoading,
      points,
      isMobile: mode.screenType === 'mobile',
    })
  ),
  {
    getBalance,
    openModalConvertPoint,
    openModalSendPoint,
    openModalSelectPoint,
    openModalSelectRecipient,
  }
)(MyPoints);
