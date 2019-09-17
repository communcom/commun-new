import { connect } from 'react-redux';

import { entitySelector, dataSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { getSubscriptions } from 'store/actions/gate';

import Followings from './Followings';

export default connect(
  (state, props) => {
    const profile = entitySelector('profiles', props.accountOwner)(state);
    const isOwner = isOwnerSelector(props.accountOwner)(state);
    const { order, sequenceKey, isLoading, isEnd } = dataSelector(['subscriptions'])(state);

    return {
      profile,
      isOwner,
      items: order,
      sequenceKey,
      isLoading,
      isEnd,
    };
  },
  {
    getSubscriptions,
  }
)(Followings);
