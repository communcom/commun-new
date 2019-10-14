import { connect } from 'react-redux';

import { entitySelector, dataSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { getUserCommunities } from 'store/actions/gate';

import Followings from './Followings';

export default connect(
  (state, props) => {
    const profile = entitySelector('profiles', props.accountOwner)(state);
    const isOwner = isOwnerSelector(props.accountOwner)(state);
    const { order, sequenceKey, isLoading, isEnd } = dataSelector(['userCommunities'])(state);

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
    getUserCommunities,
  }
)(Followings);
