import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { getUserSubscriptions } from 'store/actions/gate';
import { openModalSelectRecipient, openModalSendPoint } from 'store/actions/modals';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { dataSelector, entityArraySelector } from 'store/selectors/common';

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
