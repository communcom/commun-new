import { connect } from 'react-redux';

import { getUserSubscriptions, suggestNames } from 'store/actions/gate';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { dataSelector, entityArraySelector } from 'store/selectors/common';

import SelectUser from './SelectRecipient';

export default connect(
  state => {
    const { order, isLoading, isEnd } = dataSelector(['subscriptions'])(state);

    return {
      itemsFriends: entityArraySelector('users', order)(state),
      isLoading,
      isEnd,
      loggedUserId: currentUnsafeUserIdSelector(state),
    };
  },
  {
    getUserSubscriptions,
    suggestNames,
  }
)(SelectUser);
