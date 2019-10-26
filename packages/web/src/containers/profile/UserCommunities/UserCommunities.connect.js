import { connect } from 'react-redux';

import { entityArraySelector, statusSelector } from 'store/selectors/common';
import { isOwnerSelector } from 'store/selectors/user';

import UserCommunities from './UserCommunities';

export default connect((state, props) => {
  const isOwner = isOwnerSelector(props.userId)(state);
  const communities = statusSelector('profileCommunities')(state);

  return {
    items: entityArraySelector('communities', communities.order)(state),
    isOwner,
  };
})(UserCommunities);
