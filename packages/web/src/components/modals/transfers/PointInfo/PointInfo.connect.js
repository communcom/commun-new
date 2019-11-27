import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { openModalSendPoint, openModalSelectRecipient } from 'store/actions/modals';

import { dataSelector, entityArraySelector } from 'store/selectors/common';
import { getUserSubscriptions } from 'store/actions/gate';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import PointInfo from './PointInfo';

export default connect(
  createSelector(
    [
      state => {
        const { order } = dataSelector('subscriptions')(state);
        return entityArraySelector('users', order)(state);
      },
      currentUnsafeUserIdSelector,
    ],
    (friends, loggedUserId) => ({
      friends,
      loggedUserId,
    })
  ),
  {
    openModalSendPoint,
    openModalSelectRecipient,
    getUserSubscriptions,
  }
)(PointInfo);
