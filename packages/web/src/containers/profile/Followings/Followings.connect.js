import { connect } from 'react-redux';

import { getUserSubscriptions } from 'store/actions/gate';
import { dataSelector, entityArraySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import Followings from './Followings';

export default connect(
  (state, props) => {
    const isOwner = isOwnerSelector(props.userId)(state);
    const { order, isLoading, isEnd } = dataSelector(['subscriptions'])(state);

    return {
      isOwner,
      items: entityArraySelector('users', order)(state),
      isLoading,
      isEnd,
    };
  },
  {
    getUserSubscriptions,
  }
)(Followings);
