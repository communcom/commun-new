import { connect } from 'react-redux';

import { dataSelector, entityArraySelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';
import { getUserCommunities } from 'store/actions/gate';

import Followings from './Followings';

export default connect(
  (state, props) => {
    const isOwner = isOwnerSelector(props.userId)(state);
    const { order, isLoading, isEnd } = dataSelector(['userCommunities'])(state);

    return {
      isOwner,
      items: entityArraySelector('users', order)(state),
      isLoading,
      isEnd,
    };
  },
  {
    getUserCommunities,
  }
)(Followings);
