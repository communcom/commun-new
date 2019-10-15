import { connect } from 'react-redux';

import { entitySelector, dataSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { getSubscribers } from 'store/actions/gate';

import Followers from './Followers';

export default connect(
  (state, props) => {
    const profile = entitySelector('profiles', props.accountOwner)(state);
    const isOwner = isOwnerSelector(props.accountOwner)(state);
    const { order, isLoading, isEnd } = dataSelector(['subscribers'])(state);

    return {
      profile,
      isOwner,
      items: order,
      isLoading,
      isEnd,
    };
  },
  {
    getSubscribers,
  }
)(Followers);
